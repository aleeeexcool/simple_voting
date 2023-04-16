const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Voting", function () {
    async function deploy() {
        const [owner, user, candidate] = await ethers.getSigners();
    
        const Voting = await ethers.getContractFactory("Voting");
        const myVoting = await Voting.deploy(5, 10);
    
        return { myVoting, owner, user, candidate };
    }

    it("deploys with the right owner", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
  
        expect(await myVoting.owner()).to.equal(owner.address);
    });

    it("should revert with the right error if called from user", async function () {
        const { myVoting, user } = await loadFixture(deploy);
        let candidates = new Array();

        await expect(myVoting.connect(user).addVoting(candidates, 100)).to.be.revertedWith(
          "Sorry, but you are not an owner!"
        );
    });

    it("should revert with the right error if owner add new voting with too many candidates", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
        let candidates = new Array();
        for (i = 1; i < 10; i++) candidates.push(owner.address);

        await expect(myVoting.connect(owner).addVoting(candidates, 100)).to.be.revertedWith(
          "The number of candidates must comply with the voting rules!"
        );
    });

    it("allows an owner can create a new voting and the counter is increased", async function () {
        const { myVoting, owner, user } = await loadFixture(deploy);
        const counter_before = await myVoting.counter();
        let candidates = new Array();
        for (i = 1; i < 3; i++) candidates.push(owner.address);

        await myVoting.connect(owner).addVoting(candidates, 100);
        const counter_after = await myVoting.counter();
        expect(counter_after-counter_before).to.equal(1);
        const new_candidate = await myVoting.checkCandidate(counter_before, user.address);
        expect(new_candidate).to.equal(false);
    });

    it("allows an owner can change voting's period", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
        
        await myVoting.connect(owner).editVotingPeriod(0, 200);
        const _votingInfo = await myVoting.getVotingInfo(0);
        expect(_votingInfo[4]).to.equal(200);
    });

    it("allows an owner can create another voting", async function () {
        const { myVoting, owner, user } = await loadFixture(deploy);
        const counter_before = await myVoting.counter();
        let candidates = new Array();
        for (i = 1; i < 4; i++) candidates.push(owner.address);

        await myVoting.connect(owner).addVoting(candidates, 300);
        const new_candidate = await myVoting.checkCandidate(counter_before, user.address);
        expect(new_candidate).to.equal(false);
    });

    it("allows an owner can add candidate to voting", async function () {
        const { myVoting, owner, user } = await loadFixture(deploy);

        await myVoting.connect(owner).addCandidate(0, user.address);
        const new_candidate = await myVoting.checkCandidate(0, user.address);
        expect(new_candidate).to.equal(true);
    });

    it("allows an owner can delete candidate from voting", async function () {
        const { myVoting, owner, user } = await loadFixture(deploy);

        await myVoting.connect(owner).deleteCandidate(0, user.address);
        const new_candidate = await myVoting.checkCandidate(0, user.address);
        expect(new_candidate).to.equal(false);
    });

    it("should revert if anyone wants delete candidate from voting", async function () {
        const { myVoting, user } = await loadFixture(deploy);

        await expect(myVoting.connect(user).deleteCandidate(0, user.address)).to.be.revertedWith(
            "Sorry, but you are not an owner!");
    });

    it("shows that the voting has started!", async function () {
        const { myVoting, owner } = await loadFixture(deploy);

        await myVoting.connect(owner).startVoting(0);
        
        const _votingInfo = await myVoting.getVotingInfo(0);
        expect(_votingInfo[0]).to.equal(true);
    });

    it("allows user try to wirhdraw the prize!", async function (){
        const { myVoting, user } = await loadFixture(deploy);

        await expect(myVoting.connect(user).withdrawPrize(0)).to.be.revertedWith(
            "You are not a winner!");
    });

    it("does not allow to vote after the voting ended", async function () {
        const { myVoting, user, candidate } = await loadFixture(deploy);
        const amount = new ethers.BigNumber.from(10).pow(18).mul(1);

        await expect(
            myVoting.connect(user).takePartInVoting(0, candidate.address, { value: amount })
        ).to.be.revertedWith("Voting has ended!");
    });

    it("allows owner change MaxCandidates for futher votings", async function () {
        const { myVoting, owner } = await loadFixture(deploy);

        await myVoting.connect(owner).setMaxCandidates(1500);
        let max_candidates = await myVoting.maxCandidates();
        expect(max_candidates).to.equal(1500);
    });
});
