import { Market } from "@/lib/types";
import React, { createContext, useState, ReactNode } from 'react';
import { defineChain, getContract, prepareContractCall, readContract, sendTransaction, toWei } from "thirdweb";
import { contractConfig } from "../config/contractConfig";
import { thirdwebClient } from "../config/client";
import Web3 from "web3";
import { useActiveAccount } from "thirdweb/react";
import { Account } from "thirdweb/wallets";

export enum BuyType {
  YES,
  NO
}

// Define the context interface
interface AppContextType {
  markets: Market[];
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  readMarkets: () => Promise<Market[]>,
  createMarket: (question:string, expiresAt: number, account: Account) => Promise<void>
  placeBet: ({marketId, vote, amount, account} : {marketId: bigint, vote: boolean, amount : bigint, account: any}) => Promise<void>
  claimWinnings: ({marketId}: {marketId: bigint}) => Promise<void>
  getMarket: ({marketId}: {marketId: number}) => Promise<Market>
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


const useCreateMarket = async (quesion: string, expiresAt: number, account: Account): Promise<void> => {
  console.log("date", BigInt(expiresAt))
  console.log("question", quesion)



  if (account) {
    const transaction = prepareContractCall({
      contract: polyMarketContract,
      method: "function createMarket(string memory, uint256)",
      params: [quesion, BigInt(expiresAt)]
    })
  
  
  
    const tx = await sendTransaction({transaction, account})

    console.log("create market txHash : ", tx);
  }
  
}

const getMarket = async ({marketId}: {marketId: number}) : Promise<Market> => {
  const _market = await readContract({
    contract: polyMarketContract,
    method: "function getMarket(uint256) view returns (string, uint256, uint256, uint256, bool,bool)",
    params: [BigInt(marketId)]
  });


  const total = parseFloat(Web3.utils.fromWei(_market[1], 'ether') ) + parseFloat(Web3.utils.fromWei(_market[2], 'ether'));

    const noPercentage = (parseFloat(Web3.utils.fromWei(_market[2], 'ether')) / total) * 100;
    const yesPercentage = (parseFloat(Web3.utils.fromWei(_market[1], 'ether')) / total) * 100;


    console.log("Updated Volume",parseFloat(Web3.utils.fromWei(_market[1], 'ether')) + parseFloat(Web3.utils.fromWei(_market[2], 'ether')))
    console.log("Volume",_market[1] + _market[2])



    return {
      id: `${marketId}`,
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
    }
}

const useReadMarkets = async (): Promise<Market[]> => {
  const count = await readContract({
    contract: polyMarketContract,
    method: "function getMarketCount() view returns (uint256)",
    params: []
  })

  const _markets: Market[] = [] 

  for (let marketId = 0; marketId < count; marketId++) {
    const market = await getMarket({marketId})

    _markets.push(market)
  }

  return _markets;
}


const placeBet = async ({marketId, vote, amount, account} : {marketId: bigint, vote: boolean, amount : bigint, account: any}) => {

  const allowance = await getAllowance({account})

  console.log("allowance : ", allowance)

  const approveAllowance = async () => {
    if (allowance < amount) {
      //   // approve uZAR
        const transaction =  prepareContractCall({
          contract: uZarContract,
          method: "function approve(address,uint256)",
          params: [polyMarketContract.address, amount],
        });
    
        await sendTransaction({
          transaction,
          account,
        });
      }
  }

   await approveAllowance().then( async () => {

    const allowance = await getAllowance({account})
    
    console.log("updated allowance : ", allowance)


    const transaction = prepareContractCall({
      contract: polyMarketContract,
      method: "function placeBet(uint256, bool, uint256) public",
      params: [marketId, vote, amount]
    })
  
    await sendTransaction({
      transaction,
      account
    })
   }
  )
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

  getMarket: getMarket
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
      getMarket: getMarket
      // getAllowance: getAllowance
    }}>
      {children}
    </PolyAppContext.Provider>
  );
};
