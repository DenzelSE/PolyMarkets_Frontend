import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Market } from "@/lib/types";
import { PolyAppContext } from "../context/PolyAppContext";
import { MarketVotingTrendChart } from "./VotingTrendChart";
import Image from "next/image";
import { useActiveAccount, useConnectModal } from "thirdweb/react";
import { thirdwebClient } from "../config/client";
import { defineChain, toWei } from "thirdweb";
import { contractConfig } from "../config/contractConfig";
import { Account } from "thirdweb/wallets";
import { Skeleton } from "@/components/ui/skeleton";
import EnterAmountModal from "./enterAmountModal";

const { chainId, rpc } = contractConfig;

const chain = defineChain({ id: chainId, rpc });

interface MarketDetailModalProps {
  market: Market;
  isOpen: boolean;
  onClose: () => void;
}

interface MarketDetailModalProps {
  market: Market;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onPlaceBet: (vote: boolean) => void;
}

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({
  market,
  isOpen,
  onClose,
  isLoading = false,
  onPlaceBet,
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const marketStats = [
    {
      icon: <TrendingUp className="text-green-400" />,
      label: "Yes Volume",
      value: `${market.yesPercentage}%`,
    },
    {
      icon: <TrendingDown className="text-red-400" />,
      label: "No Volume",
      value: `${market.noPercentage}%`,
    },
    {
      icon: <DollarSign className="text-blue-400" />,
      label: "Total Volume",
      value: `Uzar ${market.volume}`,
    },
  ];

  if (!isOpen) return null;

  const LoadingContent = () => (
    <Card className="bg-[#1e262f] border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-[#232a34] rounded-lg p-4 text-center"
            >
              <Skeleton className="w-6 h-6 mx-auto mb-2" />
              <Skeleton className="h-3 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="flex space-x-4">
            <Skeleton className="h-12 flex-1 rounded" />
            <Skeleton className="h-12 flex-1 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            className="w-full max-w-md"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <LoadingContent />
            ) : (
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

                  <MarketVotingTrendChart />

                  {market.resolved ||
                  Date.parse(market.expiresAt) < Date.now() ? (
                    <ClaimButton marketId={BigInt(market.id)} />
                  ) : (
                    <VoteButton
                      marketId={BigInt(market.id)}
                      // amount={AMOUNT}
                      // isLoading={isLoading}
                      onPlaceBet={onPlaceBet}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const VoteButton = ({
  onPlaceBet,
}: {
  marketId: bigint;
  onPlaceBet: (vote: boolean) => void;
}) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => {
          onPlaceBet(false);
        }}
        className="flex-1 py-3 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20"
      >
        {false ? "Loading..." : "Buy Yes"}
      </button>
      <button
        onClick={() => {
          onPlaceBet(false);
        }}
        className="flex-1 py-3 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20"
      >
        {false ? "Loading..." : "Buy No"}
      </button>
    </div>
  );
};

const ClaimButton = ({ marketId }: { marketId: bigint }) => {
  const { claimWinnings } = useContext(PolyAppContext);
  const { connect } = useConnectModal();

  const account = useActiveAccount();

  return (
    <div className="flex justify-end">
      <button
        onClick={async () => {
          if (account) {
            console.log("connected", account);
            await claimWinnings({ marketId, account });
          } else {
            try {
              const wallet = await connect({
                client: thirdwebClient,
                accountAbstraction: {
                  chain,
                  sponsorGas: true,
                },
              });
              console.log("connected to : ", wallet);
              if (account) {
                await claimWinnings({ marketId, account });
              }
            } catch (error) {
              console.log(error);
            }
          }
        }}
        className="block text-white bg-[#1F2937] hover:bg-[#1f2937ad] font-medium rounded-lg text-sm px-5 py-3 text-center"
        type="button"
      >
        Claim
      </button>
    </div>
  );
};

const IsResolved = ({
  isResolved,
  expiresAt,
}: {
  isResolved: boolean;
  expiresAt: string;
}) => {
  console.log(
    "Is Expires : ",
    parseInt(expiresAt) < Math.floor(Date.now() / 1000)
  );

  console.log("expiresAt : ", Math.floor(Date.parse(expiresAt) / 1000));
  console.log("date now : ", Math.floor(Date.now() / 1000));

  return isResolved || Date.parse(expiresAt) < Date.now() ? (
    <div className="px-3 py-1 rounded bg-red-400/10 text-red-400 hover:bg-red-400/20 w-min text-xs">
      Resolved
    </div>
  ) : (
    <div className="px-3 py-1 rounded bg-green-400/10 text-green-400 hover:bg-green-400/20 w-min text-xs">
      Open
    </div>
  );
};

// market card
export function MarketCard({
  market,
}: // isLoading = false,
{
  market: Market;
  isLoading?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { placeBet, getMarket } = React.useContext(PolyAppContext);
  const [currentMarket, setCurrentMarket] = useState<Market>(market);
  const [isLoadingVote, setIsLoadingVote] = useState<boolean>(false);
  const [isAmountModalOpen, setIsAmountModalOpen] = useState<boolean>(false);
  const [vote, setVoting] = useState<boolean>(true);
  const { connect } = useConnectModal();
  const [account, setAccount] = useState<Account | undefined>(
    useActiveAccount()
  );

  const closeEnterAmountModal = (): void => {
    setIsAmountModalOpen(false);
  };

  const openEnterAmountModal = ({ vote }: { vote: boolean }) => {
    setVoting(vote);
    setIsAmountModalOpen(true);
  };

  const _placeBet = async ({
    marketId,
    vote,
    amount,
  }: {
    marketId: bigint;
    vote: boolean;
    amount: bigint;
  }) => {
    if (!account) {
      try {
        const wallet = await connect({
          client: thirdwebClient,
          accountAbstraction: {
            chain,
            sponsorGas: true,
          },
        });
        console.log("connected to : ", wallet);
        setAccount(wallet.getAccount());
      } catch (error) {
        console.log(error);
      }
    }

    if (account) {
      await placeBet({ marketId, vote, amount, account });
      const _market = await getMarket({ marketId: parseInt(market.id) });
      setCurrentMarket(_market);
    }
  };

  const LoadingCard = () => (
    <Card className="bg-[#1e262f] border-gray-800 h-[300px] w-full max-w-md">
      <div className="flex justify-end pt-4 pr-4">
        <Skeleton className="w-16 h-6 rounded" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-7 w-16 rounded" />
            <Skeleton className="h-7 w-16 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoadingVote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <LoadingCard />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="cursor-pointer"
      >
        <Card
          className="bg-[#1e262f] border-gray-800 hover:bg-[#232a34] transition-colors h-[300px] w-full max-w-md flex flex-col"
        >
          <div className="flex justify-end pt-4 pr-4">
            <IsResolved
              isResolved={currentMarket.resolved}
              expiresAt={market.expiresAt}
            />
          </div>
          <div className="p-4 flex-grow flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {currentMarket.icon && (
                  <Image
                    height={8}
                    width={8}
                    src={currentMarket.icon}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <h3
                  onClick={() => setIsModalOpen(true)}
                  className="font-bold text-md hover:underline line-clamp-2"
                >
                  {currentMarket.question}
                </h3>
              </div>
            </div>
  
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Yes</span>
                  <span className="text-sm font-medium text-green-400">
                    {currentMarket.yesPercentage}%
                  </span>
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
                  <span className="text-sm font-medium text-red-400">
                    {currentMarket.noPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-red-400/50"
                    style={{ width: `${currentMarket.noPercentage}%` }}
                  />
                </div>
              </div>
            </div>
  
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300">
                  Vol • {currentMarket.volume} Uzar
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={async () => {
                    openEnterAmountModal({ vote: true });
                  }}
                  disabled={isLoadingVote}
                  className={`px-3 py-1 rounded ${
                    isLoadingVote
                      ? "bg-gray-400/10 text-gray-400 cursor-not-allowed"
                      : "bg-green-400/10 text-green-400 hover:bg-green-400/20"
                  }`}
                >
                  {isLoadingVote ? "Loading..." : "Buy Yes"}
                </button>
                <button
                  onClick={async () => {
                    openEnterAmountModal({ vote: false });
                  }}
                  disabled={isLoadingVote}
                  className={`px-3 py-1 rounded ${
                    isLoadingVote
                      ? "bg-gray-400/10 text-gray-400 cursor-not-allowed"
                      : "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                  }`}
                >
                  {isLoadingVote ? "Loading..." : "Buy No"}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
  
      <EnterAmountModal
        isOpen={isAmountModalOpen}
        title="Enter Amount"
        description="Please enter the amount you wish to proceed with."
        onConfirm={async ({ amount }: { amount: string }) => {
          setIsLoadingVote(true);
          _placeBet({
            marketId: BigInt(currentMarket.id),
            vote,
            amount: toWei(amount),
          })
            .then(() => {
              console.log("successfully placed bet");
            })
            .catch((error) => {
              console.log("failed to place bet : ", error);
            })
            .finally(() => {
              setIsLoadingVote(false);
            });
        }}
        toggle={closeEnterAmountModal}
        cancelButtonText="Cancel"
        confirmButtonText="Place Bet"
      />
  
      <MarketDetailModal
        market={currentMarket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isLoadingVote}
        onPlaceBet={(vote: boolean) => {
          openEnterAmountModal({ vote });
        }}
      />
    </>
  );
  
}
