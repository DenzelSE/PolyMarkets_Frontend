import { marketData } from "@/lib/market-data";
import { Market } from "@/lib/types";
import React, { createContext, useState, ReactNode, useCallback } from 'react';

export enum BuyType {
  YES, 
  NO
}

// Define the context interface
interface AppContextType {
  markets: Market[];
  useGetMarkets: () => void;
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  useBuy: (buyType: BuyType) => Promise<void>;
}

// Create the context with a default value that matches the actual implementation
export const PolyAppContext = createContext<AppContextType>({
  markets: marketData,
  useGetMarkets: () => {},
  setMarkets: () => {},
  useBuy: async (buyType: BuyType) => {
    try {
      console.log(`Buying with type: ${BuyType[buyType]}`);
    } catch (error) {
      console.error('Error in buy operation:', error);
    }
  }
});

// Create the context provider component
export const PolyAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<Market[]>(marketData);

  const useGetMarkets = useCallback(() => {
    setMarkets(marketData);
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
      useGetMarkets, 
      setMarkets, 
      useBuy 
    }}>
      {children}
    </PolyAppContext.Provider>
  );
};
