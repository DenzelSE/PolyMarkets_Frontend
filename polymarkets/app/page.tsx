'use client'

import { useState } from 'react'
import { MarketCard } from '@/components/market-card'
import { CategoryScroll } from '@/components/category-scroll'
import { marketData } from '@/lib/market-data'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredMarkets = marketData.filter(market => 
    selectedCategory === 'All' || market.category === selectedCategory
  )

  return (
    <main className="container mx-auto px-4 py-6">
      <CategoryScroll
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </main>
  )
}

