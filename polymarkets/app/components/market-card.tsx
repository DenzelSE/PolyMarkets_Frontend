import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Market } from '@/lib/types'
import { PolyAppContext } from '../context/PolyAppContext'
import { MarketVotingTrendChart } from './VotingTrendChart'
import Image from 'next/image'
import { useActiveAccount, useConnectModal } from 'thirdweb/react'
import { thirdwebClient } from '../config/client'
import { defineChain, toWei } from 'thirdweb'
import { contractConfig } from '../config/contractConfig'
import { Account } from 'thirdweb/wallets'
import { Skeleton } from "@/components/ui/skeleton"
import EnterAmountModal from './enterAmountModal'

const {chainId, rpc} = contractConfig

const chain  = defineChain({id: chainId, rpc})

const AMOUNT: bigint = BigInt(10)

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
      value: `Uzar ${market.volume}` 
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
                    <Image
                      src={market.icon} 
                      alt="" 
                      height={10}
                      width={10}
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

                {(market.resolved) ? <ClaimButton marketId={BigInt(market.id)} /> : <VoteButton marketId={BigInt(market.id)} amount={AMOUNT} />}
              
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const VoteButton = ({marketId, amount} : {marketId: bigint, amount: bigint}) => {
  const { placeBet } = React.useContext(PolyAppContext)

  const { connect } = useConnectModal();

  const account = useActiveAccount()

  const _placeBet = async ({marketId, vote, amount}: {marketId: bigint, vote: boolean, amount: bigint}) => {
    if (account) {
      console.log("connected", account)
      await placeBet({marketId, vote, amount, account})
    }  else {
      try {
        const wallet = await connect({ client: thirdwebClient, accountAbstraction: {
          chain,
          sponsorGas: true,
        }});
        console.log("connected to : ", wallet)
        if (account) {
          await placeBet({marketId, vote, amount, account})
        }
      } catch(error) {
        console.log(error)
      }
    }
  } 

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => _placeBet({marketId, vote: true, amount})}
        className="flex-1 py-3 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors"
      >
        Buy Yes
      </button>
      <button
        onClick={() => _placeBet({marketId, vote: false, amount})}
        className="flex-1 py-3 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
      >
        Buy No
      </button>
    </div>
  )
}

// const SignInModal = () => {

//   return (
//     useConnectModal()
//   )
// }

const ClaimButton = ({marketId}: {marketId: bigint}) => {

  const { claimWinnings } = useContext(PolyAppContext);
  
  return (
    <div className='flex justify-end'>
      <button 
        onClick={async () => {
          claimWinnings({marketId})
        }}
        className="block text-white bg-[#1F2937] hover:bg-[#1f2937ad] font-medium rounded-lg text-sm px-5 py-3 text-center" 
        type="button">
        Claim
      </button>
    </div>
  )
}

export function MarketCard({ market, isLoading = false }: { market: Market, isLoading?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { placeBet, getMarket } = React.useContext(PolyAppContext)
  const [currentMarket, setCurrentMarket] = useState<Market>(market)

  const [isLoadingVote, setIsLoadingVote] = useState<boolean>(false);
  const [isAmountModalOpen, setIsAmountModalOpen] = useState<boolean>(false);
  const [vote, setVoting] = useState<boolean>(true);

  const { connect } = useConnectModal();

  const [account, setAccount] = useState<Account| undefined>(useActiveAccount())

  const closeEnterAmountModal = () : void => {
    setIsAmountModalOpen(false);
  }

  
  const openEnterAmountModal = ({vote}: {vote: boolean}) => {
    setVoting(vote)
    setIsAmountModalOpen(true);
  }

  const _placeBet = async ({marketId, vote, amount}: {marketId: bigint, vote: boolean, amount: bigint}) => {
    
    if (!account){
      try {
        const wallet  = await connect({ client: thirdwebClient, accountAbstraction: {
          chain,
          sponsorGas: true,
        }});
        console.log("connected to : ", wallet)

        setAccount(wallet.getAccount());

      } catch(error) {
        console.log(error)
      }
    }

    if (account) {
      await placeBet({marketId, vote, amount, account})
      const _market = await getMarket({marketId: parseInt(market.id)})
      setCurrentMarket(_market)
    }
  }

  
  
  if (isLoading) {
    return (
      <Card className="bg-[#1e262f] border-gray-800">
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/4" />
            <div className="space-x-2">
              <Skeleton className="h-8 w-20 inline-block" />
              <Skeleton className="h-8 w-20 inline-block" />
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="cursor-pointer"
      >
        <Card className="bg-[#1e262f] border-gray-800 hover:bg-[#232a34] transition-colors">
          <div className='flex justify-end pt-4 pr-4'>
            <IsResolved isResolved={currentMarket.resolved} />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {currentMarket.icon && (
                  <Image height={8} width={8} src={currentMarket.icon} alt="" className="w-8 h-8 rounded-full" />
                )}
                <h3
                  onClick={() => setIsModalOpen(true)}
                  className="font-bold text-md hover:underline">{currentMarket.question}
                </h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Yes</span>
                  <span className="text-sm font-medium text-green-400">{currentMarket.yesPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-green-400/50"
                    style={{ width: `${currentMarket.yesPercentage}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">No</span>
                  <span className="text-sm font-medium text-red-400">{currentMarket.noPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-red-400/50 "
                    style={{ width: `${currentMarket.noPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <span className='font-semibold text-slate-300'>Vol • {currentMarket.volume} Uzar</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                onClick={async () => {
                  openEnterAmountModal({vote: true})
                }}
                disabled={isLoadingVote}
                className={`px-3 py-1 rounded ${
                  isLoadingVote 
                    ? 'bg-gray-400/10 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                }`}>
                  {isLoadingVote ? 'Loading...' : 'Buy Yes'}
                </button>
                <button 
                onClick={async () => {
                  openEnterAmountModal({vote: false})
                }}
                disabled={isLoadingVote}
                className={`px-3 py-1 rounded ${
                  isLoadingVote 
                    ? 'bg-gray-400/10 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                }`}>
                  {isLoadingVote ? 'Loading...' : 'Buy No'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <EnterAmountModal 
      isOpen={isAmountModalOpen}
      title = "Enter Amount"
      description = "Please enter the amount you wish to proceed with."
      onConfirm={
        async ({amount}: {amount: string}) => {
        setIsLoadingVote(true);
          _placeBet({marketId: BigInt(currentMarket.id),vote, amount:toWei(amount)}).then(() => {
            console.log("successfully placed bet")
          }).catch((error) => {
            console.log("failed to place bet : ", error)
          }).finally(() => {
            setIsLoadingVote(false);
          })
        }
      } toggle={closeEnterAmountModal} cancelButtonText='Cancel' confirmButtonText='Place Bet'/>

      <MarketDetailModal 
        market={currentMarket} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}

const IsResolved = ({isResolved} : {isResolved: boolean}) => {
  return (
    (isResolved) ? 
      <div
        className="px-3 py-1 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20 w-min text-xs">
        Resolved
      </div>
      
      :

      <div
        className="px-3 py-1 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20 w-min text-xs">
        Open
      </div>
    )
}

