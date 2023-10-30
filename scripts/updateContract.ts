import { ethers } from "hardhat";

// The idea is the read a txt / json and generate the call contract
// to build a animated image
async function main() {
    const [ownerAddress] = await ethers.getSigners();

    // send the colors to the contract calling setPixelColors
    //const address = "0x13FB0eafB42243998933E24b27fD7e4af2D9e107";
    const address = "0x4226E81E6f94890465052FB750671C3cE52302a7";
    const gif = await ethers.getContractAt("AnimatedGif", address, ownerAddress);

    // load the colors from a txt / json
    //get the data from txt/sunset.txt
    const fs = require("fs");
    const data = fs.readFileSync("./scripts/txt/sunset.txt", "utf8");
    const lines = data.split("\n");
    let posY = 0;
    let layer = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const rgb = line.split("|");
        const r = [];
        const g = [];
        const b = [];
        const x = [];
        const y = [];

        posY++;

        for (let num = 2; num < rgb.length; num++) {
            // each one has the string "FFBB4C2A"
            // Spare it in 2 and convert to int
            if (layer != rgb[0] - 1) posY = 0;

            if (num - 2 < 32 && posY < 32) {
                layer = rgb[0] - 1;

                x.push(num - 2);
                y.push(posY);

                r.push(parseInt(rgb[num].substring(2, 4), 16));
                g.push(parseInt(rgb[num].substring(4, 6), 16));
                b.push(parseInt(rgb[num].substring(6, 8), 16));
            }
        }

        if (layer == 6) await gif.setPixelColors(layer - 1, x, y, r, g, b);
        console.log(layer);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
