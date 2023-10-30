import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AnimatedGIF", function () {
    async function deployGifFixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        const Gif = await ethers.getContractFactory("AnimatedGif", owner);
        const gif = await Gif.deploy();

        return { gif, owner, otherAccount };
    }

    describe("Modify values", function () {
        let r, g, b;

        it("CheckValuesInOnelayer", async function () {
            const { gif } = await loadFixture(deployGifFixture);

            for (let i = 0; i < 32; i++) {
                await gif.setPixelColor(i, i, 0, 255, 255, 255);
            }

            for (let i = 0; i < 32; i++) {
                // check all the modify pixels
                [r, g, b] = await gif.getPixelColor(i, i, 0);
                expect(r).to.equal(255);
                expect(g).to.equal(255);
                expect(b).to.equal(255);
            }

            // check others that never been modify to be 0,0,0
            [r, g, b] = await gif.getPixelColor(1, 0, 0);
            expect(r).to.equal(0);
            expect(g).to.equal(0);
            expect(b).to.equal(0);
        });

        it("CheckValuesInDifflayer", async function () {
            const { gif, owner } = await loadFixture(deployGifFixture);

            // load the colors from a txt / json
            //get the data from txt/sunset.txt
            const fs = require("fs");
            const data = fs.readFileSync("./test/txt/sunsetTest.txt", "utf8");
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
                await gif.setPixelColors(layer, x, y, r, g, b);
            }
        });

        it("Upload one complete layer", async function () {
            const { gif } = await loadFixture(deployGifFixture);

            for (let i = 0; i < 32; i++) {
                await gif.setPixelColor(i, i, 0, 255, 255, 255);
            }

            for (let i = 0; i < 32; i++) {
                // check all the modify pixels
                [r, g, b] = await gif.getPixelColor(i, i, 0);
                expect(r).to.equal(255);
                expect(g).to.equal(255);
                expect(b).to.equal(255);
            }

            // check others that never been modify to be 0,0,0
            [r, g, b] = await gif.getPixelColor(1, 0, 0);
            expect(r).to.equal(0);
            expect(g).to.equal(0);
            expect(b).to.equal(0);
        });
    });
    describe("Owner", function () {
        it("Should not be able to set pixel color if not owner", async function () {
            const { gif, otherAccount } = await loadFixture(deployGifFixture);

            await expect(gif.connect(otherAccount).setPixelColor(0, 0, 0, 255, 255, 255)).to.be.revertedWithCustomError(
                gif,
                "ErrorOnlyOwner"
            );
        });
        it("Should  be able to set pixel color if owner", async function () {
            const { gif, owner } = await loadFixture(deployGifFixture);

            await expect(gif.connect(owner).setPixelColor(0, 0, 0, 255, 255, 255)).to.be.ok;
        });
    });
});
