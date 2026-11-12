'use client';

import { createViemClient } from '@tuwaio/evm-sdk/orbit';
import { useSatelliteConnectStore } from '@tuwaio/sdk/nova-connect/satellite';
import { cn } from '@tuwaio/sdk/nova-core/utils';
import { ArrowTopRightOnSquareIcon, PlusIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { TxActionButton } from '@tuwaio/sdk/nova-transactions';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { TransactionStatus, TransactionTracker, useTxFinished } from '@tuwaio/sdk/pulsar';
import { useEffect, useState } from 'react';
import { Client } from 'viem';
import { readContract } from 'viem/actions';
import { sepolia } from 'viem/chains';

import { CounterAbi } from '@/abis/CounterAbi';
import { actionClassName, chipClassName, labelClassName, secondaryActionClassName } from '@/components/classNames';
import { Panel, PoweredBy } from '@/components/Panel';
import { appEVMChains } from '@/configs/appConfig';
import { COUNTER_ADDRESS } from '@/constants';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { txActions, TxType } from '@/transactions';

export const TransactionsBlockWrapper = () => {
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const subscribeTxFinished = usePulsarStore((state) => state.subscribeTxFinished);

  const [currentCount, setCurrentCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const { address } = activeConnection ?? {};

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
    // eslint-disable-next-line
    fetchCurrentCount();
  }, []);

  // Refreshes the counter after every successful increment, also one restored after a page reload, which has lost the
  // callbacks of executeTxAction
  useTxFinished({
    subscribeTxFinished,
    onFinished: (tx) => {
      if (tx.adapter === OrbitAdapter.EVM && tx.type === TxType.increment && tx.status === TransactionStatus.Success) {
        // Gives the RPC node time to serve the new state
        setTimeout(() => fetchCurrentCount(), 2000);
      }
    },
  });

  const handleIncrement = async () => {
    if (currentCount === null) return;

    await executeTxAction({
      actionFunction: txActions.incrementEvm,
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
          value: currentCount + 1,
          contractAddress: COUNTER_ADDRESS,
        },
        withTrackedModal: true,
        requiredConfirmations: 3,
      },
    });
  };

  const handleIncrementPimlico = async () => {
    if (currentCount === null) return;

    await executeTxAction({
      actionFunction: txActions.incrementPimlico,
      params: {
        type: TxType.increment,
        adapter: OrbitAdapter.EVM,
        tracker: TransactionTracker.ERC4337,
        desiredChainID: sepolia.id,
        pimlicoApiKey: process.env.NEXT_PUBLIC_PIMLICO_API_KEY,
        title: [
          'Incrementing (ERC-4337)',
          'Incremented (ERC-4337)',
          'Error when increment (ERC-4337)',
          'Increment tx replaced',
        ],
        description: [
          `Value after incrementing ${currentCount + 1}`,
          `Success. Current value is ${currentCount + 1}`,
          `Value after incrementing ${currentCount + 1}`,
          `Value after incrementing ${currentCount + 1}`,
        ],
        withTrackedModal: true,
      },
    });
  };

  const contractUrl = `https://sepolia.etherscan.io/address/${COUNTER_ADDRESS}`;

  return (
    <Panel
      name="EVM demo"
      aside={<span className={chipClassName}>Sepolia</span>}
      footer={<PoweredBy />}
      className="max-w-md"
    >
      <div className="border-b border-[var(--tuwa-border-primary)] p-5">
        <h1 className="font-mono text-xl leading-tight font-bold text-[var(--tuwa-text-primary)]">
          Smart contract interaction
        </h1>
        <p className="mt-1.5 text-sm leading-6 text-[var(--tuwa-text-secondary)]">
          Test transaction tracking with a simple counter contract.
        </p>
      </div>

      <dl className="grid grid-cols-2 border-b border-[var(--tuwa-border-primary)]">
        <div className="border-r border-[var(--tuwa-border-primary)] px-5 py-4">
          <dt className={cn(labelClassName, 'text-[var(--tuwa-text-secondary)]')}>Counter contract</dt>
          <dd className="mt-2">
            <a
              href={contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-[var(--tuwa-text-primary)] underline underline-offset-4 hover:no-underline"
            >
              {COUNTER_ADDRESS.slice(0, 6)}...{COUNTER_ADDRESS.slice(-4)}
              <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          </dd>
        </div>
        <div className="px-5 py-4">
          <dt className={cn(labelClassName, 'text-[var(--tuwa-text-secondary)]')}>Current value</dt>
          <dd className="mt-1 font-mono text-2xl leading-8 font-bold text-[var(--tuwa-text-primary)] tabular-nums">
            {isLoadingCount ? (
              <span className="text-[var(--tuwa-text-secondary)]">...</span>
            ) : currentCount !== null ? (
              currentCount
            ) : (
              <span className="text-sm text-[var(--tuwa-error-text)]">Error</span>
            )}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 p-5">
        <TxActionButton
          action={handleIncrement}
          transactionsPool={transactionsPool}
          getLastTxKey={getLastTxKey}
          className={actionClassName}
          disabled={currentCount === null}
          walletAddress={address}
        >
          <span className="inline-flex items-center gap-2">
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Increment counter
          </span>
        </TxActionButton>

        <TxActionButton
          action={handleIncrementPimlico}
          transactionsPool={transactionsPool}
          getLastTxKey={getLastTxKey}
          className={actionClassName}
          classNames={{ idle: secondaryActionClassName }}
          disabled={currentCount === null}
          walletAddress={address}
        >
          <span className="inline-flex items-center gap-2">
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Increment with Pimlico (ERC-4337)
          </span>
        </TxActionButton>

        <p className="text-xs leading-5 text-[var(--tuwa-text-secondary)]">
          Each button adds 1 to the counter and tracks the transaction.
        </p>
      </div>
    </Panel>
  );
};
