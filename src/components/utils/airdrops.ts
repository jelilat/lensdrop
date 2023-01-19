import { Alchemy, Network, AssetTransfersCategory, AssetTransfersResponse, AssetTransfersResult } from "alchemy-sdk";
import Moralis  from 'moralis';
import { EvmChain, RunContractFunctionResponseAdapter } from '@moralisweb3/evm-utils';
import { LensHubProxy } from "@abis/LensHubProxy";
import { LensdropAbi } from "@abis/Airdrop";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import InputDataDecoder from 'ethereum-input-data-decoder';
import { erc20ABI, erc721ABI } from 'wagmi'

const web3 = new Web3(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
const decoder = new InputDataDecoder(LensdropAbi);
const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};
const alchemy = new Alchemy(config);
const chain = EvmChain.POLYGON;

export const startMoralis = async () => {
    await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      }).then(() => {
        console.log("Moralis started");
      })
      .catch((error) => {
        console.log("Moralis failed to start");
      });
}

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

export const getRecipients = async (txHash: string): Promise<[number, string, string]> => {
    const transaction = await alchemy.core.getTransaction(txHash);
    const data = transaction?.data;
    const decoded = decoder.decodeData(data!);
    // get index of recipients
    const recipientsIndex = decoded.names.findIndex((name) => name == "recipients");
    const noOfRecipients = decoded.inputs[recipientsIndex]?.length;
    const tokenType = await getTokenType(decoded!);
    return [noOfRecipients, tokenType[0], tokenType[1]];
}

const getTokenType = async (decoded: any): Promise<string[]> => {
    switch(decoded.method!) {
        case "batchSendNativeToken":
            return ["MATIC", "NATIVE"];
        case "batchSendERC20":
            let erc20contract = new web3.eth.Contract(erc20ABI as unknown as AbiItem[], "0x"+decoded.inputs[2]);
            let erc20name = await erc20contract.methods.name().call();
            return [erc20name, "ERC20"];
        case "batchSendERC721":
            const erc721contract = new web3.eth.Contract(erc721ABI as unknown as AbiItem[], "0x"+decoded.inputs[0]);
            const erc721name = await erc721contract.methods.name().call();
            return [erc721name, "NFT"];
        case "batchSendERC1155":
            return ["ERC1155", "NFT"];
        default:
            return [];
    }
}

export const totalMaticAirdrops = async (transfers: AssetTransfersResult[]): Promise<number> => {
    let totalValue = 0;
    for (let i = 0; i < transfers.length; i++) {
        const transfer = transfers[i];
        if (transfer?.asset! === "MATIC") {
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

export const newFollows = async(blockNumber: number, followNFT: string): Promise<AssetTransfersResult[]> => {
    const transfers = await alchemy.core.getAssetTransfers({
        fromBlock: "0x" +blockNumber.toString(16),
        contractAddresses: [followNFT],
        category: ["erc721" as AssetTransfersCategory],
    });
    let newFollows = transfers?.transfers;
    // remove duplicates
    newFollows = newFollows?.filter((v, i, a) => a.findIndex(t => (t.to === v.to && confirmFollow(t.hash, followNFT))) === i);
    return newFollows;
}

const confirmFollow = async(hash: string, followNFT: string): Promise<boolean> => {
    const transaction = await web3.eth.getTransaction(hash);
    return transaction?.to == followNFT;
}

export const getDateByBlockNum = async (blockNum: string): Promise<string> => {
    const time = (await web3.eth.getBlock(parseInt(blockNum))).timestamp as number;
    const date = new Date(time * 1000);
    return dayOfWeek(date);
}

export const dayOfWeek = (date: Date): string => {
    let day = date.getUTCDay();
    switch (day) {
        case 1:
            return "Mon";
        case 2:
            return "Tue";
        case 3:
            return "Wed";
        case 4:
            return "Thur";
        case 5:
            return "Fri";
        case 6:
            return "Sat";
        default:
            return "Sun";
    }
}

export const getSponsoredPosts = async(address: string): Promise<RunContractFunctionResponseAdapter> => {
    const sponsoredPosts = await Moralis.EvmApi.utils.runContractFunction({
        abi: LensdropAbi,
        functionName: "getUserEscrows",
        address: "0xA84b97DF8eE0aF62777dAC4EDC488694f5000184",
        chain,
        params: {
            user: address
        }
    });
    return sponsoredPosts;
}

export const getEarnings = async(address: string): Promise<number> => {
    const res = await alchemy.core.getAssetTransfers({
        fromAddress: "0xA84b97DF8eE0aF62777dAC4EDC488694f5000184",
        toAddress: address,
        excludeZeroValue: true,
        category: ["external" as AssetTransfersCategory],
    });
    const transfers = res.transfers;
    let totalValue = 0;
    for (let i = 0; i < transfers.length; i++) {
        const transfer = transfers[i];
        if (transfer.asset === "MATIC") {
            totalValue += transfer?.value!;
        }
    }
    return totalValue;
}