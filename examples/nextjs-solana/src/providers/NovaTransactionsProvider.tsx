import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';
import { NovaTransactionsProvider as NTP } from '@tuwaio/nova-transactions/providers';
import { getAdapterFromConnectorType } from '@tuwaio/orbit-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';

export function NovaTransactionsProvider() {
  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);

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
    />
  );
}
