import { ReactNode } from 'react';

import { SatelliteConnectProviders } from './SatelliteConnectProviders';
import { StoreProvider } from './StoreProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SatelliteConnectProviders>
      <StoreProvider>{children}</StoreProvider>
    </SatelliteConnectProviders>
  );
}
