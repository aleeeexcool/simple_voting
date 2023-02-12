const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const myVoting = await Voting.deploy();

  await myVoting.deployed();

  console.log(
    `Success!`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
