const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Beanmachine", function () {
    async function deploy() {
        const [owner, user1, user2] = await ethers.getSigners();
    
        const Beanmachine = await ethers.getContractFactory("Beanmachine");
        const myBeanmachine = await Beanmachine.deploy();
    
        return { myBeanmachine, owner, user1, user2 };
    }

    it("Deploy with the right owner", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
  
        expect(await myVoting.owner()).to.equal(owner.address);
    });

    
})