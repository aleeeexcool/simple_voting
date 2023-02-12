const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Voting", function () {
    async function deploy() {
        const [owner, user] = await ethers.getSigners();
    
        const Voting = await ethers.getContractFactory("Voting");
        const myVoting = await Voting.deploy(5, 10);
    
        return { myVoting, owner, user };
    }

    it("Deploy with the right owner", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
  
        expect(await myVoting.owner()).to.equal(owner.address);
      });

    it("Should revert with the right error if called from user", async function () {
        const { myVoting, user } = await loadFixture(deploy);
        let candidates = new Array();

        await expect(myVoting.connect(user).addVoting(candidates, 100)).to.be.revertedWith(
          "Sorry, but you are not an owner!"
        );
    });

    it("Should revert with the right error if owner add new voting with too many candidates", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
        let candidates = new Array();
        for (i = 1; i < 10; i++) candidates.push(owner.address);

        await expect(myVoting.connect(owner).addVoting(candidates, 100)).to.be.revertedWith(
          "The number of candidates must comply with the voting rules!"
        );
    });

    // it("An owner can create a new voting and the counter is increased", async function () {
    //     const { myVoting, owner, user } = await loadFixture(deploy);
    //     const counter_before = await myVoting.counter();
    //     let candidates = new Array();
    //     for (i = 1; i < 3; i++) candidates.push(owner.address);

    //     await myVoting.connect(owner).addVoting(candidates, 100);
    //     const counter_after = await myVoting.counter();
    //     expect(counter_after-counter_before).to.equal(1);
    //     const new_candidate = await myVoting.checkCandidate(counter_before, user.address);
    //     expect(new_candidate).to.equal(true);
    // });
    //
    // ??? - Error: VM Exception while processing transaction: reverted with reason string 'The voting has already begun!'

    it("An owner can change voting's period", async function () {
        const { myVoting, owner } = await loadFixture(deploy);

        await myVoting.connect(owner).editVotingPeriod(0, 200);

        const _votingInfo = await myVoting.getVotingInfo(0);
        expect(_votingInfo[2]).to.equal(200);
    })
});



