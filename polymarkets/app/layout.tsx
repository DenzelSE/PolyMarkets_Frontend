import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Polymarket Clone',
  description: 'A clone of the Polymarket prediction markets interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#1a2027] text-white min-h-screen`}>
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
                <button className="px-4 py-1.5 text-sm rounded-md bg-gray-800 hover:bg-gray-700">
                  Log In
                </button>
                <button className="px-4 py-1.5 text-sm rounded-md bg-blue-500 hover:bg-blue-600">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

