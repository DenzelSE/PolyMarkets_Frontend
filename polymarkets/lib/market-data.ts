import { Market, Category } from './types'

export const categories: Category[] = ['All', 'New', 'Sports', 'Politics', 'Crypto', 'Entertainment']

export const marketData: Market[] = [
  {
    id: '1',
    question: 'Will R.Kelly get released in 2025?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 1500000,
    views: 12860,
    yesPercentage: 65,
    noPercentage: 35,
    category: 'Crypto'
  },
  {
    id: '2',
    question: 'Will Orlando Private win the league?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 2000000,
    views: 15320,
    yesPercentage: 48,
    noPercentage: 52,
    category: 'Sports'
  },
  {
    id: '3',
    question: 'Will Ramaphosa get impeached 2025?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 5000000,
    views: 25640,
    yesPercentage: 89,
    noPercentage: 11,
    category: 'Politics'
  },
  {
    id: '4',
    question: 'Will Ethereum reach $5000 in 2024?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 800000,
    views: 8420,
    yesPercentage: 72,
    noPercentage: 28,
    category: 'Crypto'
  },
  {
    id: '5',
    question: 'Will Generations The Legacy get another season',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 300000,
    views: 5280,
    yesPercentage: 35,
    noPercentage: 65,
    category: 'Entertainment'
  }
]

