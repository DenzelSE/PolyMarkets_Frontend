import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThirdwebProvider } from 'thirdweb/react'

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
      <ThirdwebProvider>
        <body className={`${inter.className} bg-[#1a2027] text-white min-h-screen`}>
          {/* <Topbar /> */}
          {children}
        </body>
      </ThirdwebProvider>
    </html>
  )
}




