//imports

//async main

//call main

const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //if contract doesnt exist we deploy a minimal version of it for our local testing

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    //get most recent deployment
    const ethUsdAggregator = await get("MockV3Aggregator"); //contract name
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, //put price feed address
    log: true, //gives transaction , address when deploying
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }

  log("----------------------------------------------");
};

//parameterised instead of hardcoded
module.exports.tags = ["all", "fundme"];

//hardhat deploy runs through all deploy scripts and adds them to the node
// function deployFunc(hre) {
//     console.log("HI!")
// }

// module.exports.default = deployFunc

//hardhat runtime environment
// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments } = hre
//or hre.getNamedAccounts()  hre.deployments  ...

// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

//use mocks for development chains, actual address for testnet
