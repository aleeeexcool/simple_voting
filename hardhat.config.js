require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");

module.exports = {
  solidity: { 
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  },
};
