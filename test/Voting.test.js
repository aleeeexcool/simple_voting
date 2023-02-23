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

    it("An owner can create a new voting and the counter is increased", async function () {
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

    it("An owner can change voting's period", async function () {
        const { myVoting, owner } = await loadFixture(deploy);
        
        await myVoting.connect(owner).editVotingPeriod(0, 200);
        const _votingInfo = await myVoting.getVotingInfo(0);
        expect(_votingInfo[4]).to.equal(200);
    });

    it("An owner can create another voting", async function () {
        const { myVoting, owner, user } = await loadFixture(deploy);
        const counter_before = await myVoting.counter();
        let candidates = new Array();
        for (i = 1; i < 4; i++) candidates.push(owner.address);

        await myVoting.connect(owner).addVoting(candidates, 300);
        const new_candidate = await myVoting.checkCandidate(counter_before, user.address);
        expect(new_candidate).to.equal(false);
    });

    it("An owner can add candidate to voting", async function () {
        const { myVoting, owner, user } = await loadFixture(deploy);

        await myVoting.connect(owner).addCandidate(0, user.address);
        const new_candidate = await myVoting.checkCandidate(0, user.address);
        expect(new_candidate).to.equal(true);
    });

    it("An owner can delete candidate from voting", async function () {
        const { myVoting, owner, user } = await loadFixture(deploy);

        await myVoting.connect(owner).deleteCandidate(0, user.address);
        const new_candidate = await myVoting.checkCandidate(0, user.address);
        expect(new_candidate).to.equal(false);
    });

    it("Only owner can delete candidate from voting", async function () {
        const { myVoting, user } = await loadFixture(deploy);

        await expect(myVoting.connect(user).deleteCandidate(0, user.address)).to.be.revertedWith(
            "Sorry, but you are not an owner!");
    });

    it("Voting has started!", async function () {
        const { myVoting, owner } = await loadFixture(deploy);

        await myVoting.connect(owner).startVoting(0);
        
        const _votingInfo = await myVoting.getVotingInfo(0);
        expect(_votingInfo[0]).to.equal(true);
    });

    it("User try to wirhdraw the prize!", async function (){
        const { myVoting, user } = await loadFixture(deploy);

        await expect(myVoting.connect(user).withdrawPrize(0)).to.be.revertedWith(
            "You are not a winner!");
    });

    it("Nobody can't vote after finish", async function () {
        const { myVoting, user, candidate } = await loadFixture(deploy);
        const amount = new ethers.BigNumber.from(10).pow(18).mul(1);

        await expect(
            myVoting.connect(user).takePartInVoting(0, candidate.address, { value: amount })
        ).to.be.revertedWith("Voting has ended!");
    });

    it("Owner can change MaxCandidates for futher votings", async function () {
        const { myVoting, owner } = await loadFixture(deploy);

        await myVoting.connect(owner).setMaxCandidates(1500);
        let max_candidates = await myVoting.maxCandidates();
        expect(max_candidates).to.equal(1500);
    });
});


// const { expect } = require("chai");

// describe("Voting contract", function () {
//   let voting;
//   let owner;
//   let candidate1;
//   let candidate2;
//   let candidate3;
//   const maxCandidates = 3;
//   const commission = 5; // 5% commission

//   beforeEach(async function () {
//     [owner, candidate1, candidate2, candidate3] = await ethers.getSigners();
//     const Voting = await ethers.getContractFactory("Voting");
//     voting = await Voting.deploy(maxCandidates, commission);
//     await voting.deployed();
//   });

//   it("should initialize contract variables", async function () {
//     expect(await voting.owner()).to.equal(owner.address);
//     expect(await voting.counter()).to.equal(0);
//     expect(await voting.minCandidates()).to.equal(2);
//     expect(await voting.maxCandidates()).to.equal(maxCandidates);
//     expect(await voting.Comission()).to.equal(commission);
//   });

//   it("should create a new voting with valid number of candidates", async function () {
//     const candidates = [candidate1.address, candidate2.address];
//     await expect(voting.addVoting(candidates, 7))
//       .to.emit(voting, "votingDraftCreated")
//       .withArgs(0);

//     expect(await voting.checkCandidate(0, candidate1.address)).to.be.true;
//     expect(await voting.checkCandidate(0, candidate2.address)).to.be.true;
//     expect(await voting.checkCandidate(0, candidate3.address)).to.be.false;
//   });

//   it("should not create a new voting with invalid number of candidates", async function () {
//     const candidates = [candidate1.address];
//     await expect(voting.addVoting(candidates, 7)).to.be.revertedWith(
//       "The number of candidates must comply with the voting rules!"
//     );
//   });

//   it("should add and delete candidate successfully", async function () {
//     const candidates = [candidate1.address, candidate2.address];
//     await voting.addVoting(candidates, 7);

//     await expect(voting.addCandidate(0, candidate3.address))
//       .to.emit(voting, "candidateInfo")
//       .withArgs(0, candidate3.address, true);

//     await expect(voting.deleteCandidate(0, candidate3.address))
//       .to.emit(voting, "candidateInfo")
//       .withArgs(0, candidate3.address, false);

//     expect(await voting.checkCandidate(0, candidate3.address)).to.be.false;
//   });

//   it("should start and end a voting successfully", async function () {
//     const candidates = [candidate1.address, candidate2.address];
//     await voting.addVoting(candidates, 7);

//     await expect(voting.startVoting(0))
//       .to.emit(voting, "votingStarted")
//       .withArgs(0, await ethers.provider.getBlockNumber());

//     const duration = 7;
//     await ethers.provider.send("evm_increaseTime", [duration]);
//     await ethers.provider.send("evm_mine", []);

//     expect(await voting.takePartInVoting(0, candidate1.address, { value: 10 }))
//       .to.emit(voting, "CandidateVoted")
//       .withArgs(0, candidate1.address, 10);
//   });

//   it("should withdraw prize successfully", async function () {
//     const candidates = [candidate1.address, candidate2.address];
//     await voting.addVoting(candidates, 7);

//     await expect(voting.startVoting(0))
//       .to.emit(voting, "votingStarted")
//       .withArgs(0, await ethers)
// })
// })
