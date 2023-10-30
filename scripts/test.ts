import { ethers } from "hardhat";

// The idea is the read a txt / json and generate the call contract
// to build a animated image
async function main() {
    const [ownerAddress, other] = await ethers.getSigners();

    const address = "0x4226E81E6f94890465052FB750671C3cE52302a7";
    const gif = await ethers.getContractAt("AnimatedGif", address, ownerAddress);

    console.log(gif);

    const interval = await gif.getMatrixForLayer(3);
    console.log("interval", interval);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
