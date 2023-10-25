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
            const { gif } = await loadFixture(deployGifFixture);

            for (let i = 0; i < 32; i++) {
                await gif.setPixelColor(i, i, 0, 255, 255, 255);
            }

            for (let i = 0; i < 32; i++) {
                await gif.setPixelColor(i, i, 1, 250, 250, 250);
            }

            for (let i = 0; i < 32; i++) {
                [r, g, b] = await gif.getPixelColor(i, i, 0);
                expect(r).to.equal(255);
                expect(g).to.equal(255);
                expect(b).to.equal(255);
            }

            // check others that never been modify to be 0,0,0 in Layer 0
            [r, g, b] = await gif.getPixelColor(1, 0, 0);
            expect(r).to.equal(0);
            expect(g).to.equal(0);
            expect(b).to.equal(0);

            for (let i = 0; i < 32; i++) {
                [r, g, b] = await gif.getPixelColor(i, i, 1);
                expect(r).to.equal(250);
                expect(g).to.equal(250);
                expect(b).to.equal(250);
            }

            // check others that never been modify to be 0,0,0 in Layer 1
            [r, g, b] = await gif.getPixelColor(1, 0, 1);
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
