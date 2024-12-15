import { Market } from "@/lib/types";
import React, { createContext, useState, ReactNode } from 'react';
import { defineChain, getContract, prepareContractCall, readContract, sendTransaction, toWei } from "thirdweb";
import { contractConfig } from "../config/contractConfig";
import { thirdwebClient } from "../config/client";
import Web3 from "web3";

export enum BuyType {
  YES, 
  NO
}

// Define the context interface
interface AppContextType {
  markets: Market[];
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  readMarkets: () => Promise<Market[]>,
  createMarket: (question:string, expiresAt: number) => Promise<void>
  placeBet: ({marketId, vote, amount, account} : {marketId: bigint, vote: boolean, amount : bigint, account: any}) => Promise<void>
  claimWinnings: ({marketId}: {marketId: bigint}) => Promise<void>
  // getAllowance: ({account}: {account: any}) => Promise<bigint>
}


const {marketContractAddress, uZarContractAddress, chainId} = contractConfig

const chain = defineChain(chainId);

const polyMarketContract = getContract({
  client: thirdwebClient,
  chain: chain,
  address: marketContractAddress
})


const uZarContract = getContract({
  client: thirdwebClient,
  chain: chain,
  address: uZarContractAddress
})


const getAllowance = async ({account} : {account: any}): Promise<bigint> => {
  const allowance = await readContract({
    contract: uZarContract,
    method: "function allowance(address owner, address spender) view returns (uint256)",
    params: [account.address, polyMarketContract.address],
  });

 

  return allowance;
}


const useCreateMarket = async (quesion: string, expiresAt: number): Promise<void> => {
  await readContract({
    contract: polyMarketContract,
    method: "function createMarket(string, uint256) returns (string, uint256, uint256, uint256, bool,bool)",
    params: [quesion, BigInt(expiresAt)]
  })
}

const useReadMarkets = async (): Promise<Market[]> => {
  const count = await readContract({
    contract: polyMarketContract,
    method: "function getMarketCount() view returns (uint256)",
    params: []
  })

  const _markets: Market[] = [] 

  for (let _count = 0; _count < count; _count++) {
    const _market = await readContract({
      contract: polyMarketContract,
      method: "function getMarket(uint256) view returns (string, uint256, uint256, uint256, bool,bool)",
      params: [BigInt(_count)]
    });


    const total = parseFloat(Web3.utils.fromWei(_market[1], 'ether') ) + parseFloat(Web3.utils.fromWei(_market[2], 'ether'));

    const noPercentage = (parseFloat(Web3.utils.fromWei(_market[2], 'ether')) / total) * 100;
    const yesPercentage = (parseFloat(Web3.utils.fromWei(_market[1], 'ether')) / total) * 100;


    _markets.push({
      id: `${_count}`,
      question: _market[0],
      icon: "",
      yesPercentage: (yesPercentage) ? parseFloat(yesPercentage.toFixed(2)) : 0,
      noPercentage: (noPercentage) ? parseFloat(noPercentage.toFixed(2)) : 0,
      expiresAt: new Date(parseInt(`${_market[3]}`) * 1000).toLocaleString(),
      resolved: _market[4],
      outcome: _market[5],
      category: "/test.png",
      volume: parseFloat(Web3.utils.fromWei(_market[1], 'ether')) + parseFloat(Web3.utils.fromWei(_market[2], 'ether')),
      views: 0 
    });
  }

  return _markets;
}


const placeBet = async ({marketId, vote, amount, account} : {marketId: bigint, vote: boolean, amount : bigint, account: any}) => {

  const allowance = await getAllowance({account})

  console.log("allowance : ", allowance)

  if (allowance < amount) {
  //   // approve uZAR
    const transaction =  prepareContractCall({
      contract: uZarContract,
      method: "function approve(address,uint256)",
      params: [polyMarketContract.address, toWei(`${amount}`)],
    });


    const { transactionHash } = await sendTransaction({
      transaction,
      account,
    });

    
  }

  await readContract({
    contract: polyMarketContract,
    method: "function placeBet(uint256, bool, uint256) public",
    params: [marketId, vote, amount]
  })
}

const claimWinnings = async ({marketId}: {marketId: bigint}) => {
  await readContract({
    contract: polyMarketContract,
    method: "function claimWinnings(uint256) public",
    params: [marketId]
  })
}


// Create the context with a default value that matches the actual implementation
export const PolyAppContext = createContext<AppContextType>({
  markets: [],

  // useGetMarkets: () => {},

  setMarkets: () => {},

  readMarkets: useReadMarkets,

  createMarket: useCreateMarket,

  claimWinnings: claimWinnings,

  placeBet: placeBet,
  // getAllowance: getAllowance
});

// Create the context provider component
export const PolyAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<Market[]>([]);


  return (
    <PolyAppContext.Provider value={{ 
      markets,
      setMarkets, 
      readMarkets: useReadMarkets,
      createMarket: useCreateMarket,
      placeBet: placeBet,
      claimWinnings: claimWinnings,
      // getAllowance: getAllowance
    }}>
      {children}
    </PolyAppContext.Provider>
  );
};
