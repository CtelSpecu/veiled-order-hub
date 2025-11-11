// Deployment script for VeiledOrder contract

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployed = await deploy("VeiledOrder", {
    from: deployer,
    log: true,
    // Avoid redeploy if same bytecode already deployed (prevents duplicate nonces)
    skipIfAlreadyDeployed: true,
  });

  console.log(`VeiledOrder contract: `, deployed.address);
};
export default func;
func.id = "deploy_veiledOrder"; // id required to prevent reexecution
func.tags = ["VeiledOrder"];

