'use client'
import { useContext, useEffect, useState } from 'react'
import { MarketCard } from './components/market-card'
import { CategoryScroll } from './components/category-scroll'
import { PolyAppContext } from './context/PolyAppContext'
import { Market } from '@/lib/types'
import { Topbar } from './components/Topbar'
import { AppSidebar } from './components/AppSidebar'
import { AppCarousel } from './components/AppCarousel'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [markets, setMarkets] = useState<Market[]>([])
  const {readMarkets, createMarket} = useContext(PolyAppContext);


  const _createMarket = async (question: string, expiresAt: number) => {
    try {
      const market = await createMarket(question, expiresAt);
      console.log(market);
      const _markets = await readMarkets();
      setMarkets(_markets);
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
    <main className="mx-auto">
      
      <Topbar createMarket={_createMarket} />
      <div className='container mx-auto
      '>
      <AppCarousel/>
      </div>

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
