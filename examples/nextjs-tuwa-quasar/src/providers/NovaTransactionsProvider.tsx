import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';
import { NovaTransactionsProvider as NTP } from '@tuwaio/nova-transactions/providers';
import { getAdapterFromConnectorType } from '@tuwaio/orbit-core';
import { TxInMemoryPagination } from '@tuwaio/pulsar-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';

import { usePulsarInMemoryStore, usePulsarStore } from '@/hooks/pulsarStoreHook';

export function NovaTransactionsProvider({ pagination }: { pagination: TxInMemoryPagination }) {
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const transactionsPool = usePulsarInMemoryStore((state) => state.transactionsPool);

  useInitializeTransactionsPool({ initializeTransactionsPool });

  return (
    <NTP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      executeTxAction={executeTxAction}
      connectedWalletAddress={activeConnection?.isConnected ? activeConnection.address : undefined}
      connectedAdapterType={getAdapterFromConnectorType(activeConnection?.connectorType ?? 'evm:')}
      adapter={getAdapter()}
      pagination={pagination}
    />
  );
}
