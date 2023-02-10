import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import type { Voting } from "../typechain-types";
const provider = ethers.provider;

describe("Voting", function() {
    async function dep() {
        const [ owner, user ] = await ethers.getSigners();

        const Votingcontract = await ethers.getContractFactory("Voting");
        const myVoting: Voting = await Votingcontract.deploy(owner.address, user.address);
        await myVoting.deployed();

        return { myVoting, owner, user }
    }

    it('Contract should be successfully deployed by owner', async function() { 
        const { myVoting, owner } = await loadFixture(dep);

        expect(await myVoting.owner()).to.eq(owner.address);
    }); 

    // it('Owner can add a new voting', async function() { 
    //     const { myVoting, owner, user } = await loadFixture(dep);
    //     const counter_before = await myVoting.counter();
    //     let candidates = new Array(5);
    //     let period = 1000;

    //     await myVoting.connect(owner).addVoting(candidates, period);
    //     const counter_after = await myVoting.counter();
    //     expect(counter_after-counter_before).to.equal(1); ????@de - we have a problem
    //     const is_candidate5 = await myVoting.checkCandidate(counter_before, user.address);
    //     expect(is_candidate5).to.equal(true);
    // }); 

    // it('Owner try to create voting with too many candidates', async function() { 
    //     const { myVoting, owner } = await loadFixture(dep);

    //     let candidates = new Array();
    //     for (let i = 1; i < 100; i++) candidates.push(accounts[i].address);
    //     let someCandidates = new Array(200);
    //     await expect(
    //         myVoting.connect(owner).addVoting(someCandidates, candidates)
    //     ).to.be.revertedWith("Too many candidates!");
    // }); 
});
