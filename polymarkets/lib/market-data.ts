import { Market, Category } from './types'

export const categories: Category[] = ['All', 'New', 'Sports', 'Politics', 'Crypto', 'Entertainment']

export const marketData: Market[] = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 by the end of 2024?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 1500000,
    views: 12860,
    yesPercentage: 65,
    noPercentage: 35,
    category: 'Crypto'
  },
  {
    id: '2',
    question: 'Will the Super Bowl winner be from the AFC?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 2000000,
    views: 15320,
    yesPercentage: 48,
    noPercentage: 52,
    category: 'Sports'
  },
  {
    id: '3',
    question: 'Will Trump win the Republican nomination?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 5000000,
    views: 25640,
    yesPercentage: 89,
    noPercentage: 11,
    category: 'Politics'
  },
  {
    id: '4',
    question: 'Will Ethereum merge to PoS in Q1 2024?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 800000,
    views: 8420,
    yesPercentage: 72,
    noPercentage: 28,
    category: 'Crypto'
  },
  {
    id: '5',
    question: 'Will Barbie win Best Picture at the Oscars?',
    icon: '/placeholder.svg?height=32&width=32',
    volume: 300000,
    views: 5280,
    yesPercentage: 35,
    noPercentage: 65,
    category: 'Entertainment'
  }
]

