"use client"

import { SignInButton } from "./SignInButton"

export const Topbar = () => {
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
                className="w-full bg-gray-800 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
