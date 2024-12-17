'use client'
import { useContext, useEffect, useState } from 'react'
import { MarketCard } from './components/market-card'
import { CategoryScroll } from './components/category-scroll'
import { PolyAppContext } from './context/PolyAppContext'
import { Market } from '@/lib/types'
import { Topbar } from './components/Topbar'
import { useActiveAccount } from 'thirdweb/react'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [markets, setMarkets] = useState<Market[]>([])
  const {readMarkets, createMarket} = useContext(PolyAppContext);
  const account = useActiveAccount()


  const _createMarket = async (question: string, expiresAt: number) => {
    try {
      if (account) {
        const market = await createMarket(question, expiresAt, account!);
        console.log(market);
        const _markets = await readMarkets();
        setMarkets(_markets);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  }   

  useEffect(() => {

      readMarkets().then((_markets: Market[]) => {
        setMarkets(_markets);
      });

      console.log(markets)

  }, [readMarkets, setMarkets]); // Add fetchMarkets to dependency array

  const filteredMarkets = markets.filter(market =>
    selectedCategory === 'All' || market.category === selectedCategory
  )


  return (
    <main className="">
      
      <Topbar createMarket={_createMarket} />

      <div className='container mx-auto py-6 px-4'>
        <CategoryScroll
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </div>

    </main>
  )
}
