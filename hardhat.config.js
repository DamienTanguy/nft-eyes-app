require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
  	artifacts: './src/artifacts'
  },
  networks: {
  	goerli: {
  		url: "**** INFURA LINK *****",
  		accounts:["**** PRIVATE KEY ACCOUNT ****"]
  	}
  }
};
