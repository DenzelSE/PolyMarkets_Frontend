'use client'
import { useContext, useEffect, useState } from 'react'
import { MarketCard } from './components/market-card'
import { CategoryScroll } from './components/category-scroll'
import { PolyAppContext } from './context/PolyAppContext'
import { Market } from '@/lib/types'
import { Topbar } from './components/Topbar'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [markets, setMarkets] = useState<Market[]>([])
  const {useReadMarkets, useCreateMarket} = useContext(PolyAppContext);


  const createMarket = async (question: string, expiresAt: number) => {
    useCreateMarket(question, expiresAt).then((market) => {
      console.log(market);

      useReadMarkets().then((_markets) => {
        setMarkets(_markets);
      })


    }).catch((error) => {
        alert(error.message)
    });
  }

  useEffect(() => {

      useReadMarkets().then((_markets) => {
        setMarkets(_markets);
      });

      console.log(markets)

  }, [useReadMarkets]); // Add fetchMarkets to dependency array

  const filteredMarkets = markets.filter(market =>
    selectedCategory === 'All' || market.category === selectedCategory
  )


  return (
    <main className="">
      
      <Topbar createMarket={createMarket} />

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
