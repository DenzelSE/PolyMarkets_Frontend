export interface Market {
    id: string
    question: string
    icon?: string
    volume: number
    views: number
    yesPercentage: number
    noPercentage: number
    category: string
  }
  
  export type Category = 'All' | 'New' | 'Sports' | 'Politics' | 'Crypto' | 'Entertainment'
  
  