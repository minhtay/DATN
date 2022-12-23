import { ethers, Signer } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { create } from "ipfs-http-client";
import Wenb3Modal from "web3modal";
import { NFTMarketPlaceAddress, NFTMarketPlaceABI } from "./constant";
import { pinataApi } from "../pinata/pinataApi";

const client = create("https://ipfs.infura.io:5001/api/v0");

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketPlaceAddress,
    NFTMarketPlaceABI,
    signerOrProvider
  );

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Wenb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};
export const NFTContext = createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const checkIsConnected = async () => {
    setIsLoading(true);
    if (!window.ethereum) return console.log("Please insall Metamask");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const connectWallet = async () => {
    setIsLoading(true);
    if (!window.ethereum) return console.log("Please insall Metamask");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  window.ethereum.on("accountsChanged", function (accounts) {
    setIsLoading(true);
    setCurrentAccount(accounts[0]);
    setIsLoading(false);
  });

  const uploadToIFPS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io:5001/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  const createNFT = async (formInput, fileUrl) => {
    const { name, description, price } = formInput;
    if ((!name || !description || !price, !fileUrl))
      return console.log("Please enter all field");
    const data = JSON.stringify({ name, description, iamge: fileUrl });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io:5001/ipfs/${added.path}`;

      await createSale(url, price);
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling) => {
    try {
      const price = new ethers.utils.parseUnits(formInputPrice);
      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.reSellToken(url, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFTs = async () => {
    try {
      // const provider = new ethers.providers.JsonRpcProvider();
      const contract = await connectingWithSmartContract();
      const data = await contract.fetchMarketItem();
      console.log("data", data);
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const res = await axios.get(tokenURI);
            console.log(res);
            const { image, title, description } = res.data;
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              title,
              description,
            };
          }
        )
      );
      console.log(items);
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyNFTOrListedNFTs = async (type) => {
    try {
      const contract = await connectingWithSmartContract();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemListed()
          : await contract.fetchMyNFT();
      console.log(data);
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);

            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ethers"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ethers");
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIsConnected();
  }, [currentAccount]);

  return (
    <NFTContext.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        uploadToIFPS,
        createNFT,
        fetchNFTs,
        fetchMyNFTOrListedNFTs,
        buyNFT,
        connectingWithSmartContract,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export default NFTContext;
