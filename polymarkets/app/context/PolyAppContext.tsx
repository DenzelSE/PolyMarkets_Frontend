import { marketData } from "@/lib/market-data";
import { Market } from "@/lib/types";
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { defineChain, getContract, readContract } from "thirdweb";
import { contractConfig } from "../config/contractConfig";
import { thirdwebClient } from "../config/client";
import Web3 from "web3";
import { useReadContract } from "thirdweb/react";

export enum BuyType {
  YES, 
  NO
}

// Define the context interface
interface AppContextType {
  markets: Market[];
  // useGetMarkets: () => void;
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  useBuy: (buyType: BuyType) => Promise<void>;
  useReadMarkets: () => Promise<Market[]>,
}


const {address, chainId} = contractConfig

const chain = defineChain(chainId);

const polyMarketContract = getContract({
  client: thirdwebClient,
  chain: chain,
  address: address
})



// const uZARContract = getContract({
//   client: client,
//   chain: defineChain(1135),
//   address: "0xE29E8434FF23c4ab128AEA088eE4f434129F1Bf1"
// });

// const LotteryPotCard = () => {
//   const {lotteryBalance, setLotteryBalance} = useContext(LotteryAppContext)


//   const GetLotteryPot = async () => {
//     const data = await readContract({
//       contract: uZARContract,
//       method:
//         "function balanceOf(address account) view returns (uint256)",
//       params: ['0x694E778589b0BCA0edD6933892a3c63B95A1518c'],
//     });
    
//     setLotteryBalance(Number(data)/ 1e18)
//   }

//   useEffect(() => {
//     GetLotteryPot()
//   }, []);


const useReadMarkets = async (): Promise<Market[]> => {
  const count = await readContract({
    contract: polyMarketContract,
    method: "function getMarketCount() view returns (uint256)",
    params: []
  })

  const _markets: Market[] = [] 

  for (var _count = 0; _count < count; _count++) {
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
      yesPercentage: yesPercentage,
      noPercentage: noPercentage,
      expiresAt: new Date(parseInt(`${_market[3]}`) * 1000).toLocaleString(),
      resolved: _market[4],
      outcome: _market[5],
      category: "/test.png",
      volume: 0,
      views: 0 
    });
  }

  return _markets;
}

// Create the context with a default value that matches the actual implementation
export const PolyAppContext = createContext<AppContextType>({
  markets: marketData,

  // useGetMarkets: () => {},

  setMarkets: () => {},

  useBuy: async (buyType: BuyType) => {
    try {
      console.log(`Buying with type: ${BuyType[buyType]}`);
    } catch (error) {
      console.error('Error in buy operation:', error);
    }
  },


  useReadMarkets: useReadMarkets
});

// Create the context provider component
export const PolyAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<Market[]>(marketData);

  const useGetMarkets = useCallback(() => {
    // setMarkets(setMarkets(marketData));
  }, []);

  const useBuy = useCallback(async (buyType: BuyType) => {
    try {
      console.log(`Buying with type: ${BuyType[buyType]}`);
      // Add your actual buying logic here
      // For example, you might want to:
      // - Make an API call
      // - Update market state
      // - Handle different buy types
    } catch (error) {
      console.error('Error in buy operation:', error);
      // Add error handling as needed
    }
  }, []);

  return (
    <PolyAppContext.Provider value={{ 
      markets, 
      // useGetMarkets, 
      setMarkets, 
      useBuy, 
      useReadMarkets: useReadMarkets,
    }}>
      {children}
    </PolyAppContext.Provider>
  );
};
