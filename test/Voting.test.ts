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

    //     await expect(myVoting.connect(owner).addVoting(user.address, 1000)).to.be.revertedWith("Sorry, but you are not an owner!");
    // }); 

    it('Onwer can edit a voting period', async function() { 
        const { myVoting, owner } = await loadFixture(dep);

        const old_period = 1000;
        const id_of_voting = 1;
        await myVoting.editVotingPeriod(id_of_voting, old_period);
        
        const new_period = 2000;
        await myVoting.connect(owner).editVotingPeriod(id_of_voting, new_period);
        expect(old_period).to.eq(new_period); 
        // загуглить как тут можно изменить аргумент + обойти require
    }); 
});
