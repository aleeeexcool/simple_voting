const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Voting", function () {
    async function deploy() {
        const [owner, user] = await ethers.getSigners();
    
        const Voting = await ethers.getContractFactory("Voting");
        const myVoting = await Voting.deploy(2, 1);
    
        return { myVoting, owner, user };
    }

    it("Should set the right owner", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
  
        expect(await myVoting.owner()).to.equal(owner.address);
      });
});



