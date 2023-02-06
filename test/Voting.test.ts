import { loadFixture, ethers, expect, time } from "./setup";
import type { Voting } from "../typechain-types";

describe("Voting", function() {
    async function deploy() {
        const [ owner, user ] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("Voting");
        const voting: Voting = await Factory.deploy(owner.address, user.address);
        await voting.deployed();

        return { owner, user }
    }

    it('We can add a voting', async function() {
        const { owner, user } = await loadFixture(deploy);

        
    }); 
});