import { ethers } from "hardhat";

async function main() {
    const [ownerAddress] = await ethers.getSigners();

    const gif = await ethers.deployContract("AnimatedGif", ownerAddress);

    await gif.waitForDeployment();
    console.log(`owner: ${ownerAddress.address} | deployed to ${gif.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
