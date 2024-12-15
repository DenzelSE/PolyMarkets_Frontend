import { Market } from "@/lib/types";
import React, { createContext, useState, ReactNode } from 'react';
import { defineChain, getContract, readContract } from "thirdweb";
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
  // useGetMarkets: () => void;
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  readMarkets: () => Promise<Market[]>,
  createMarket: (question:string, expiresAt: number) => Promise<void>
  placeBet: ({marketId, vote, amount} : {marketId: bigint, vote: boolean, amount : bigint}) => Promise<void>
  claimWinnings: ({marketId}: {marketId: bigint}) => Promise<void>
}


const {address, chainId} = contractConfig

const chain = defineChain(chainId);

const polyMarketContract = getContract({
  client: thirdwebClient,
  chain: chain,
  address: address
})


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


const placeBet = async ({marketId, vote, amount} : {marketId: bigint, vote: boolean, amount : bigint}) => {
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

  placeBet: placeBet
});

// Create the context provider component
export const PolyAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<Market[]>([]);


  return (
    <PolyAppContext.Provider value={{ 
      markets,
      // useGetMarkets, 
      setMarkets, 
      readMarkets: useReadMarkets,
      createMarket: useCreateMarket,
      placeBet: placeBet,
      claimWinnings: claimWinnings
    }}>
      {children}
    </PolyAppContext.Provider>
  );
};
