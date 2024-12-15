'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories } from '@/lib/categories'
// import { categories } from '/lib/categories'

interface CategoryScrollProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryScroll({ selectedCategory, onSelectCategory }: CategoryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 z-10 p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto scrollbar-hide px-8"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 z-10 p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

