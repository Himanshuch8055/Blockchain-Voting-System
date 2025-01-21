const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log("Starting deployment...");

    // Get the contract factory
    const BlockchainVoting = await hre.ethers.getContractFactory("BlockchainVoting");
    console.log("Contract factory created");

    // Deploy the contract
    const contract = await BlockchainVoting.deploy();
    console.log("Contract deployment initiated");

    // Wait for deployment to finish
    await contract.deployed();
    console.log(`Contract deployed to: ${contract.address}`);

    // Update the contract address in the frontend
    const contractAddressPath = path.join(__dirname, '..', 'src', 'contractAddress.js');
    const contractAddressContent = `export const CONTRACT_ADDRESS = "${contract.address}";\n`;
    
    fs.writeFileSync(contractAddressPath, contractAddressContent);
    console.log(`Contract address written to: ${contractAddressPath}`);

    // Write deployment details to a file
    const deploymentDetails = {
      contract: "BlockchainVoting",
      address: contract.address,
      network: hre.network.name,
      timestamp: new Date().toISOString(),
      chainId: (await hre.ethers.provider.getNetwork()).chainId
    };

    const deploymentPath = path.join(__dirname, '..', 'deployment.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentDetails, null, 2));
    console.log(`Deployment details written to: ${deploymentPath}`);

    console.log("\nDeployment completed successfully!");
    console.log("-------------------");
    console.log("Contract:", "BlockchainVoting");
    console.log("Address:", contract.address);
    console.log("Network:", hre.network.name);
    console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
    console.log("-------------------");

  } catch (error) {
    console.error("Deployment failed:");
    console.error(error);
    process.exitCode = 1;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
