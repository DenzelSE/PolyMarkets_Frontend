import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Market } from '@/lib/types'
import { BuyType, PolyAppContext } from '../context/PolyAppContext'
import { MarketVotingTrendChart } from './VotingTrendChart'

interface MarketDetailModalProps {
  market: Market
  isOpen: boolean
  onClose: () => void
}

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({ 
  market, 
  isOpen, 
  onClose 
}) => {
  const { useBuy } = React.useContext(PolyAppContext)
  
  // Variants for modal and backdrop animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 20,
      transition: { 
        duration: 0.2 
      }
    }
  }

  // Detailed market stats
  const marketStats = [
    { 
      icon: <TrendingUp className="text-green-400" />, 
      label: 'Yes Volume', 
      value: `${market.yesPercentage}%` 
    },
    { 
      icon: <TrendingDown className="text-red-400" />, 
      label: 'No Volume', 
      value: `${market.noPercentage}%` 
    },
    { 
      icon: <DollarSign className="text-blue-400" />, 
      label: 'Total Volume', 
      value: `$${market.volume}` 
    }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div 
            className="w-full max-w-md bg-[#1e262f] rounded-xl shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-[#1e262f] border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center space-x-3">
                  {market.icon && (
                    <img 
                      src={market.icon} 
                      alt="" 
                      className="w-10 h-10 rounded-full" 
                    />
                  )}
                  <CardTitle className="text-lg">{market.question}</CardTitle>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Market Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {marketStats.map((stat, index) => (
                    <div 
                      key={index} 
                      className="bg-[#232a34] rounded-lg p-4 text-center"
                    >
                      <div className="flex justify-center mb-2">
                        {stat.icon}
                      </div>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="font-bold text-sm">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Trend Chart */}
                <MarketVotingTrendChart />

                {/* Buy Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => useBuy(BuyType.YES)}
                    className="flex-1 py-3 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors"
                  >
                    Buy Yes
                  </button>
                  <button
                    onClick={() => useBuy(BuyType.NO)}
                    className="flex-1 py-3 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                  >
                    Buy No
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


export function MarketCard({ market }: { market: Market }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {useBuy} = useContext(PolyAppContext)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="cursor-pointer"
      >
        <Card className="bg-[#1e262f] border-gray-800 hover:bg-[#232a34] transition-colors">
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {market.icon && (
                  <img src={market.icon} alt="" className="w-8 h-8 rounded-full" />
                )}
                <h3
                  onClick={() => setIsModalOpen(true)}
                  className="font-bold text-md hover:underline">{market.question}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Yes</span>
                  <span className="text-sm font-medium text-green-400">{market.yesPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-green-400/50"
                    style={{ width: `${market.yesPercentage}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">No</span>
                  <span className="text-sm font-medium text-red-400">{market.noPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-red-400/50 "
                    style={{ width: `${market.noPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            {/* <div className="flex items-center justify-between text-xs text-gray-400"> */}
              <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <span>${market.volume} Vol</span>
                {/* <span>•</span>
                <span>{market.views} Views</span> */}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                onClick={async () => {
                  useBuy(BuyType.YES)
                }}
                className="px-3 py-1 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20">
                  Buy Yes
                </button>
                <button 
                onClick={async () => {
                  useBuy(BuyType.NO)
                }}
                className="px-3 py-1 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20">
                  Buy No
                </button>
              </div>
            {/* </div> */}
            </div>
          </div>
        </Card>
      </motion.div>

      <MarketDetailModal 
        market={market} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}


// import { motion } from 'framer-motion'
// import { Card } from '@/components/ui/card'
// import { Market } from '@/lib/types'
// import { useContext } from 'react'
// import { BuyType, PolyAppContext } from '../context/PolyAppContext'

// export function MarketCard({ market }: { market: Market }) {

//   const {useBuy} = useContext(PolyAppContext)

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Card className="bg-[#1e262f] border-gray-800 hover:bg-[#232a34] transition-colors">
//         <div className="p-4">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               {market.icon && (
//                 <img src={market.icon} alt="" className="w-8 h-8 rounded-full" />
//               )}
//               <h3 className="font-bold text-md">{market.question}</h3>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 gap-4 mb-4">
//             <div className="space-y-1">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-400">Yes</span>
//                 <span className="text-sm font-medium text-green-400">{market.yesPercentage}%</span>
//               </div>
//               <div className="h-2 bg-gray-800  overflow-hidden">
//                 <div 
//                   className="h-full bg-green-400/50"
//                   style={{ width: `${market.yesPercentage}%` }}
//                 />
//               </div>
//             </div>
//             <div className="space-y-1">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-400">No</span>
//                 <span className="text-sm font-medium text-red-400">{market.noPercentage}%</span>
//               </div>
//               <div className="h-2 bg-gray-800  overflow-hidden">
//                 <div 
//                   className="h-full bg-red-400/50 "
//                   style={{ width: `${market.noPercentage}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center justify-between text-xs text-gray-400">
//             <div className="flex items-center space-x-2">
//               <span>${market.volume} Vol</span>
//               {/* <span>•</span>
//               <span>{market.views} Views</span> */}
//             </div>
//             <div className="flex items-center space-x-2">
//               <button 
//               onClick={async () => {
//                 useBuy(BuyType.YES)
//               }}
//               className="px-3 py-1 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20">
//                 Buy Yes
//               </button>
//               <button 
//               onClick={async () => {
//                 useBuy(BuyType.NO)
//               }}
//               className="px-3 py-1 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20">
//                 Buy No
//               </button>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </motion.div>
//   )
// }

