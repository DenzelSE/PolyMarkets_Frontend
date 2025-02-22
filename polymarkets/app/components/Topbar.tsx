"use client"
import { useState } from 'react'
import { CreateMarketButton } from "./CreateMarketModal"
import { SignInButton } from "./SignInButton"
import { Menu, X, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const Topbar = ({createMarket} : {createMarket: (question:string, expiresAt: number) => Promise<void>}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <nav className="border-b border-gray-800 bg-[#1a2027]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/carousel/universel.png" alt="UMarkets Logo" width={32} height={32} className="rounded-full" />
              <span className="text-xl font-bold">UniMarkets</span>
            </Link>
          </div>

          {/* Search for Desktop */}
          <div className="hidden md:block relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search markets"
              className="w-full bg-gray-800 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1"
            />
          </div>

          {/* Mobile Search Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="text-white" />
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <CreateMarketButton createMarket={createMarket}/>
            <SignInButton />
          </div>
        </div>

        {/* Mobile Search (Expandable) */}
        {isSearchOpen && (
          <div className="md:hidden mt-2">
            <input
              type="text"
              placeholder="Search markets"
              className="w-full bg-gray-800 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1"
            />
          </div>
        )}

        {/* Mobile Menu (Expandable) */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <CreateMarketButton createMarket={createMarket}/>
              <SignInButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}