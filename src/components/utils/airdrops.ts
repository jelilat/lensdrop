import { Alchemy, Network, AssetTransfersCategory, AssetTransfersResponse, AssetTransfersResult } from "alchemy-sdk";
import Moralis  from 'moralis';
import { EvmChain, GetDateToBlockResponseAdapter } from '@moralisweb3/evm-utils';
import { LensHubProxy } from "@abis/LensHubProxy";
import { LensdropAbi } from "@abis/Airdrop";
import ethers from "ethers";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};
const alchemy = new Alchemy(config);
const chain = EvmChain.POLYGON;

export const getAirdrops = async (address: string): Promise<AssetTransfersResponse> => {
    const res = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        toAddress: "0xA84b97DF8eE0aF62777dAC4EDC488694f5000184",
        excludeZeroValue: false,
        category: ["external" as AssetTransfersCategory],
      });
 
      return res;
}

export const totalMaticAirdrops = async (transfers: AssetTransfersResult[]): Promise<number> => {
    let totalValue = 0;
    for (let i = 0; i < transfers.length; i++) {
        const transfer = transfers[i];
        if (transfer.asset === "MATIC") {
            totalValue += transfer?.value!;
        }
    }

    return totalValue;
}

export const get7daysBlockNumber = async (): Promise<number> => {
    let today = Math.floor(Date.now() / 1000)
    let sevenDaysAgo = today - 604800;
    let date = new Date(sevenDaysAgo * 1000);

    const response = await Moralis.EvmApi.block.getDateToBlock({
        date,
        chain,
    });

    const blockNumber = response?.result?.block;
    return blockNumber;
}

export const newFollows = async(profileId: string, blockNumber: number): Promise<AssetTransfersResult[]> => {
    const followNFT = await Moralis.EvmApi.utils.runContractFunction({
        abi: LensHubProxy,
        functionName: "getFollowNFT",
        address: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
        chain,
        params: {
            profileId,
        }
       });
    const transfers = await alchemy.core.getAssetTransfers({
        fromBlock: "0x" +blockNumber.toString(16),
        contractAddresses: [followNFT?.result],
        category: ["erc721" as AssetTransfersCategory],
    })
    console.log("follow", transfers);
    return transfers?.transfers!;
}

export const getSponsoredPosts = async(address: string): Promise<number> => {
    const sponsoredPosts = await Moralis.EvmApi.utils.runContractFunction({
        abi: LensdropAbi,
        functionName: "getUserEscrows",
        address: "0xA84b97DF8eE0aF62777dAC4EDC488694f5000184",
        chain,
        params: {
            user: address
        }
    });
    return sponsoredPosts?.result?.length!;
}

export const erc721Transactions = async (transfers: AssetTransfersResult[]): Promise<number> => {
    for (let i = 0; i < transfers.length; i++) {
        let transaction = await alchemy.core.getTransactionReceipt(
            transfers[i]?.hash!,
        )
        let a = await alchemy.core.getLogs({
            address: "0xA84b97DF8eE0aF62777dAC4EDC488694f5000184"
        })
        console.log("transaction", transaction);
    }

    return 0;
}