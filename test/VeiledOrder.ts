// VeiledOrder Contract Test Suite
// Tests encrypted order submission and retrieval

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { VeiledOrder, VeiledOrder__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("VeiledOrder")) as VeiledOrder__factory;
  const veiledOrderContract = (await factory.deploy()) as VeiledOrder;
  const veiledOrderContractAddress = await veiledOrderContract.getAddress();

  return { veiledOrderContract, veiledOrderContractAddress };
}

describe("VeiledOrder", function () {
  let signers: Signers;
  let veiledOrderContract: VeiledOrder;
  let veiledOrderContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ veiledOrderContract, veiledOrderContractAddress } = await deployFixture());
  });

  it("should have zero orders after deployment", async function () {
    const orderCount = await veiledOrderContract.getOrderCount();
    expect(orderCount).to.eq(0);
  });

  it("should submit a buy order with encrypted amount and price", async function () {
    // Scale values by 1000 to support decimals (e.g., 2.5 ETH = 2500)
    const clearAmount = 2500; // 2.5 ETH
    const clearPrice = 3250000; // 3250.00 USD

    // Encrypt amount and price within a single input to reuse the same proof
    const encryptedOrderInput = await fhevm
      .createEncryptedInput(veiledOrderContractAddress, signers.alice.address)
      .add32(clearAmount)
      .add32(clearPrice)
      .encrypt();
    expect(encryptedOrderInput.handles.length).to.eq(2);

    const tx = await veiledOrderContract
      .connect(signers.alice)
      .submitOrder(
        encryptedOrderInput.handles[0],
        encryptedOrderInput.handles[1],
        true, // isBuy
        encryptedOrderInput.inputProof
      );
    const receipt = await tx.wait();
    expect(receipt?.status).to.eq(1);

    // Verify order count
    const orderCount = await veiledOrderContract.getOrderCount();
    expect(orderCount).to.eq(1);

    // Verify user order count
    const userOrderCount = await veiledOrderContract.getUserOrderCount(signers.alice.address);
    expect(userOrderCount).to.eq(1);

    // Get order indices
    const orderIndices = await veiledOrderContract.connect(signers.alice).getMyOrderIndices();
    expect(orderIndices.length).to.eq(1);
    expect(orderIndices[0]).to.eq(0);

    // Get order details
    const order = await veiledOrderContract.getOrder(0);
    expect(order.isBuy).to.eq(true);
    expect(order.owner).to.eq(signers.alice.address);

    // Decrypt and verify values
    const decryptedAmount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      order.amount,
      veiledOrderContractAddress,
      signers.alice,
    );
    expect(decryptedAmount).to.eq(clearAmount);

    const decryptedPrice = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      order.price,
      veiledOrderContractAddress,
      signers.alice,
    );
    expect(decryptedPrice).to.eq(clearPrice);
  });

  it("should submit a sell order with encrypted amount and price", async function () {
    const clearAmount = 1800; // 1.8 ETH
    const clearPrice = 3255500; // 3255.50 USD

    const encryptedOrderInput = await fhevm
      .createEncryptedInput(veiledOrderContractAddress, signers.bob.address)
      .add32(clearAmount)
      .add32(clearPrice)
      .encrypt();
    expect(encryptedOrderInput.handles.length).to.eq(2);

    const tx = await veiledOrderContract
      .connect(signers.bob)
      .submitOrder(
        encryptedOrderInput.handles[0],
        encryptedOrderInput.handles[1],
        false, // isBuy = false (sell order)
        encryptedOrderInput.inputProof
      );
    const receipt = await tx.wait();
    expect(receipt?.status).to.eq(1);

    const orderCount = await veiledOrderContract.getOrderCount();
    expect(orderCount).to.eq(1);

    const order = await veiledOrderContract.getOrder(0);
    expect(order.isBuy).to.eq(false);
    expect(order.owner).to.eq(signers.bob.address);
  });

  it("should allow multiple orders from the same user", async function () {
    // First order
    const encryptedOrderInput1 = await fhevm
      .createEncryptedInput(veiledOrderContractAddress, signers.alice.address)
      .add32(1000)
      .add32(3000000)
      .encrypt();
    expect(encryptedOrderInput1.handles.length).to.eq(2);

    const receipt1 = await veiledOrderContract
      .connect(signers.alice)
      .submitOrder(
        encryptedOrderInput1.handles[0],
        encryptedOrderInput1.handles[1],
        true,
        encryptedOrderInput1.inputProof
      );
    expect((await receipt1.wait())?.status).to.eq(1);

    // Second order
    const encryptedOrderInput2 = await fhevm
      .createEncryptedInput(veiledOrderContractAddress, signers.alice.address)
      .add32(2000)
      .add32(3100000)
      .encrypt();
    expect(encryptedOrderInput2.handles.length).to.eq(2);

    const receipt2 = await veiledOrderContract
      .connect(signers.alice)
      .submitOrder(
        encryptedOrderInput2.handles[0],
        encryptedOrderInput2.handles[1],
        false,
        encryptedOrderInput2.inputProof
      );
    expect((await receipt2.wait())?.status).to.eq(1);

    const userOrderCount = await veiledOrderContract.getUserOrderCount(signers.alice.address);
    expect(userOrderCount).to.eq(2);

    const orderIndices = await veiledOrderContract.connect(signers.alice).getMyOrderIndices();
    expect(orderIndices.length).to.eq(2);
    expect(orderIndices[0]).to.eq(0);
    expect(orderIndices[1]).to.eq(1);
  });

  it("should revert when getting non-existent order", async function () {
    await expect(veiledOrderContract.getOrder(999)).to.be.revertedWith("Order does not exist");
  });
});

