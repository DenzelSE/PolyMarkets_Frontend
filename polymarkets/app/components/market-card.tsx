import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Market } from '@/lib/types'

export function MarketCard({ market }: { market: Market }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-[#1e262f] border-gray-800 hover:bg-[#232a34] transition-colors">
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {market.icon && (
                <img src={market.icon} alt="" className="w-8 h-8 rounded-full" />
              )}
              <h3 className="font-medium text-sm">{market.question}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Yes</span>
                <span className="text-sm font-medium text-green-400">{market.yesPercentage}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${market.yesPercentage}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">No</span>
                <span className="text-sm font-medium text-red-400">{market.noPercentage}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${market.noPercentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <span>${market.volume.toLocaleString()} Vol</span>
              {/* <span>•</span>
              <span>{market.views} Views</span> */}
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20">
                Buy Yes
              </button>
              <button className="px-3 py-1 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20">
                Buy No
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

