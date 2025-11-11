import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { VeiledOrder } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("VeiledOrderSepolia", function () {
  let signers: Signers;
  let veiledOrderContract: VeiledOrder;
  let veiledOrderContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const VeiledOrderDeployment = await deployments.get("VeiledOrder");
      veiledOrderContractAddress = VeiledOrderDeployment.address;
      veiledOrderContract = await ethers.getContractAt("VeiledOrder", VeiledOrderDeployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("should submit a buy order on Sepolia", async function () {
    steps = 8;

    this.timeout(4 * 40000);

    progress("Encrypting amount and price...");
    const clearAmount = 2500;
    const clearPrice = 3250000;
    const encryptedOrderInput = await fhevm
      .createEncryptedInput(veiledOrderContractAddress, signers.alice.address)
      .add32(clearAmount)
      .add32(clearPrice)
      .encrypt();

    progress(
      `Submitting buy order: VeiledOrder=${veiledOrderContractAddress} amount=${ethers.hexlify(encryptedOrderInput.handles[0])} price=${ethers.hexlify(encryptedOrderInput.handles[1])} signer=${signers.alice.address}...`
    );
    const tx = await veiledOrderContract
      .connect(signers.alice)
      .submitOrder(
        encryptedOrderInput.handles[0],
        encryptedOrderInput.handles[1],
        true, // isBuy
        encryptedOrderInput.inputProof
      );
    await tx.wait();

    progress("Getting order count...");
    const orderCount = await veiledOrderContract.getOrderCount();
    expect(orderCount).to.be.gt(0);

    progress("Getting user order indices...");
    const orderIndices = await veiledOrderContract.connect(signers.alice).getMyOrderIndices();
    expect(orderIndices.length).to.be.gt(0);

    const orderIndex = orderIndices[orderIndices.length - 1];
    progress(`Getting order ${orderIndex}...`);
    const order = await veiledOrderContract.getOrder(orderIndex);
    expect(order.isBuy).to.eq(true);
    expect(order.owner).to.eq(signers.alice.address);

    progress(`Decrypting order amount...`);
    const decryptedAmount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      order.amount,
      veiledOrderContractAddress,
      signers.alice,
    );
    progress(`Decrypted amount: ${decryptedAmount}`);
    expect(decryptedAmount).to.eq(clearAmount);

    progress(`Decrypting order price...`);
    const decryptedPrice = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      order.price,
      veiledOrderContractAddress,
      signers.alice,
    );
    progress(`Decrypted price: ${decryptedPrice}`);
    expect(decryptedPrice).to.eq(clearPrice);
  });
});

