// Accountable Capital Styled Transactions Block (just for testing)

'use client';

import { TxActionButton } from '@tuwaio/nova-transactions';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createViemClient } from '@tuwaio/orbit-evm';
import { useEffect, useState } from 'react';
import { Client } from 'viem';
import { readContract } from 'viem/actions';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';

import { CounterAbi } from '../../abis/CounterAbi';
import { appEVMChains } from '../../configs/appConfig';
import { COUNTER_ADDRESS } from '../../constants';
import { usePulsarStore } from '../../hooks/pulsarStoreHook';
import { txActions, TxType } from '../../transactions';

export const TransactionsBlockWrapper = () => {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);

  const [currentCount, setCurrentCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const { address } = useAccount();

  const fetchCurrentCount = async () => {
    try {
      setIsLoadingCount(true);
      const count = Number(
        await readContract(createViemClient(sepolia.id, appEVMChains) as Client, {
          abi: CounterAbi,
          address: COUNTER_ADDRESS,
          functionName: 'getCurrentNumber',
        }),
      );
      setCurrentCount(count);
    } catch (error) {
      console.error('Error fetching current count:', error);
      setCurrentCount(null);
    } finally {
      setIsLoadingCount(false);
    }
  };

  useEffect(() => {
    fetchCurrentCount();
  }, []);

  const handleIncrement = async () => {
    if (currentCount === null) return;

    await executeTxAction({
      actionFunction: txActions.incrementEvm,
      onSuccess: (tx) => {
        if (tx.type === TxType.increment) {
          console.log(`Increment tx succeed, ${tx.payload.value}`);
        }
      },
      params: {
        type: TxType.increment,
        adapter: OrbitAdapter.EVM,
        desiredChainID: sepolia.id,
        title: ['Incrementing', 'Incremented', 'Error when increment', 'Increment tx replaced'],
        description: [
          `Value after incrementing ${currentCount + 1}`,
          `Success. Current value is ${currentCount + 1}`,
          'Something went wrong when increment.',
          'Transaction replaced. Please take a look details in your wallet.',
        ],
        payload: {
          value: currentCount,
          contractAddress: COUNTER_ADDRESS,
        },
        withTrackedModal: true,
      },
    });

    setTimeout(() => {
      fetchCurrentCount();
    }, 2000);
  };

  const openEtherscan = () => {
    window.open(`https://sepolia.etherscan.io/address/${COUNTER_ADDRESS}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4 relative">
      <div className="m-auto w-full max-w-md h-auto min-h-[680px] bg-[var(--accountable-background-2)] rounded-[4px] border border-[var(--accountable-border)] overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="bg-[var(--accountable-accent)] p-6 flex-shrink-0">
          <div className="flex-1 pr-4">
            <h1 className="text-2xl font-medium text-[var(--accountable-accent-dark)] mb-1 leading-tight font-[DM_Mono]">
              EVM Demo
            </h1>
            <p className="text-[var(--accountable-accent-dark)] opacity-70 text-sm leading-tight font-[DM_Mono]">
              Transaction Tracking Example
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 space-y-8">
          <div className="text-center h-16 flex flex-col justify-center">
            <h2 className="text-xl font-medium text-[var(--accountable-foreground)] mb-2 leading-tight font-[DM_Mono]">
              Smart Contract Interaction
            </h2>
            <p className="text-[var(--accountable-tertiary)] text-sm leading-tight font-[DM_Mono]">
              Test transaction tracking with a simple counter contract
            </p>
          </div>

          {/* Separator */}
          <div className="border-t border-[var(--accountable-border)]"></div>

          {/* Action Section */}
          <div className="space-y-6 flex-1">
            <div className="bg-[var(--accountable-background)] rounded-[4px] p-4 border border-[var(--accountable-border)] min-h-[100px] flex flex-col justify-center">
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--accountable-accent-dark)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--accountable-accent)] font-medium text-lg font-[DM_Mono]">#</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-[var(--accountable-foreground)] leading-tight font-[DM_Mono]">
                      Counter Contract
                    </h3>
                    <p className="text-xs text-[var(--accountable-tertiary)] leading-tight font-[DM_Mono]">
                      Sepolia Testnet
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-[var(--accountable-secondary)] leading-tight font-[DM_Mono]">
                    Contract
                  </div>
                  <button
                    onClick={openEtherscan}
                    className="text-xs font-[DM_Mono] text-[var(--accountable-accent)] hover:opacity-70 leading-tight cursor-pointer transition-opacity duration-200 underline hover:no-underline"
                  >
                    {COUNTER_ADDRESS.slice(0, 6)}...{COUNTER_ADDRESS.slice(-4)}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2 border-t border-[var(--accountable-border)]">
                <div className="text-center">
                  <div className="text-xs text-[var(--accountable-tertiary)] mb-1 font-[DM_Mono]">Current Value</div>
                  <div className="text-2xl font-medium text-[var(--accountable-accent)] font-[DM_Mono]">
                    {isLoadingCount ? (
                      <div className="animate-pulse">...</div>
                    ) : currentCount !== null ? (
                      currentCount
                    ) : (
                      <span className="text-[var(--accountable-destructive)] text-sm">Error</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-14">
                <TxActionButton
                  action={handleIncrement}
                  transactionsPool={transactionsPool}
                  getLastTxKey={getLastTxKey}
                  className="from-[var(--accountable-accent)] to-[var(--accountable-accent)] w-full h-full bg-[var(--accountable-accent)] hover:opacity-90 text-[var(--accountable-accent-dark)] font-medium rounded-[4px] transition-all duration-200 ease-in-out flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none font-[DM_Mono]"
                  disabled={currentCount === null}
                  walletAddress={address}
                >
                  <span className="text-xl leading-none contents text-[var(--accountable-accent-dark)]">+</span>
                  <span className="leading-none">Increment Counter</span>
                </TxActionButton>
              </div>

              <div className="h-8 flex items-center justify-center">
                <p className="text-center text-xs text-[var(--accountable-tertiary)] leading-tight font-[DM_Mono]">
                  This will increment the counter by 1 and track the transaction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[var(--accountable-background)] px-4 py-4 border-t border-[var(--accountable-border)] flex-shrink-0 h-16 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs text-[var(--accountable-tertiary)] font-[DM_Mono] flex-wrap gap-1 items-center justify-center">
            <span className="leading-none">Powered by</span>
            <a
              href="https://github.com/TuwaIO"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <span className="font-medium text-[var(--accountable-accent)] leading-none">TUWA</span>
            </a>
            <span className="leading-none">•</span>
            <span className="leading-none">Web3 Transaction Tracking</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
