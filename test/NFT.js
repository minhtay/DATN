const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", () => {
  it("Get listing price", async () => {
    const NFTMarket = await ethers.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();

    const listing = await NFTContract.getListingPrice();
    console.log(listing);
    // const recipe = await listing.wait(0);
    // console.log(recipe);
  });
  it("Create NFT", async () => {
    const tokenURI = "https://tokrn";
    const NFTMarket = await ethers.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();
    const listing = await NFTContract.getListingPrice();
    const listingPrice = listing.toString();
    // const amount = ethers.utils.parseUnits("0.0025", "ethers");
    const create = await NFTContract.createToken(tokenURI, 2000, {
      value: listingPrice,
    });
    await create.wait();
    console.log(create);
  });
  it("Get NFT", async () => {
    const NFTMarket = await ethers.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();
    const nfts = await NFTContract.fetchItemListed();
    console.log(nfts);
  });
});
