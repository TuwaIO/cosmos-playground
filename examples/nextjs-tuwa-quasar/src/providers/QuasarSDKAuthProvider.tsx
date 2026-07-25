import { QuasarActiveConnection, QuasarAuthBridge as QuasarSDKAuthBridge } from '@tuwaio/quasar-sdk/react';
import { SatelliteStoreContext, useSatelliteConnectStore } from '@tuwaio/sdk/nova-connect/satellite';
import { useContext, useEffect } from 'react';

import { wagmiConfig } from '@/configs/appConfig';
import { useAuthStore } from '@/hooks/useAuthStore';

/**
 * Quasar Platform Authentication Bridge.
 *
 * This component acts as a thin wrapper around the SDK's internal QuasarAuthBridge.
 * it connects the TUWA ecosystem (Satellite, Nova Connect) with the Quasar Mini-Session flow.
 *
 * It is now powered by the official SDK React entry point to ensure consistency
 * and reduce local boilerplate while maintaining strict type safety.
 */
export function QuasarAuthBridge() {
  const activeConnection = useSatelliteConnectStore((s) => s.activeConnection);
  const store = useContext(SatelliteStoreContext);
  const session = useAuthStore((s) => s.miniSession);
  const setSession = useAuthStore((s) => s.setMiniSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  // Clear Quasar Mini-Session when wallet disconnects
  useEffect(() => {
    if (!activeConnection?.isConnected) {
      clearSession();
    }
  }, [activeConnection?.isConnected, clearSession]);

  if (!activeConnection || !store) return null;

  return (
    <QuasarSDKAuthBridge
      activeConnection={activeConnection as QuasarActiveConnection}
      store={store}
      wagmiConfig={wagmiConfig}
      session={session}
      setSession={setSession}
    />
  );
}
