export interface Market {
    id: string
    question: string
    icon?: string
    volume: number
    views: number
    yesPercentage: number
    noPercentage: number
    category: string
    expiresAt: string
    resolved: boolean
    outcome: boolean
  }
  
  export type Category = 'All' | 'New' | 'Sports' | 'Politics' | 'Crypto' | 'Entertainment'
  
  