import { marketData } from "@/lib/market-data";
import { Market } from "@/lib/types";
import React, { createContext, useState, ReactNode } from 'react';



// Define the context interface
interface AppContextType {
  markets: Market[];
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
}

// Create the context with a default value
export const PolyAppContext = createContext<AppContextType>({
  markets: [],
  setMarkets: () => {}
});

// Create the context provider component
export const PolyAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<Market[]>(marketData);

  return (
    <PolyAppContext.Provider value={{ markets, setMarkets }}>
      {children}
    </PolyAppContext.Provider>
  );
};
