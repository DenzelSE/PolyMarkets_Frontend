"use client"

import { CreateMarketButton } from "./CreateMarketModal"
import { SignInButton } from "./SignInButton"

export const Topbar = ({createMarket} : {createMarket: (question:string, expiresAt: number) => Promise<void>}) => {
  return (
    <nav className="border-b border-gray-800 bg-[#1a2027]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Polymarket</h1>
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search markets"
                className="w-full bg-gray-800 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <CreateMarketButton createMarket={createMarket}/>
            <SignInButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
