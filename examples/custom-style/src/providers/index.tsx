import { ReactNode } from 'react';

import { SatelliteConnectProviders } from './SatelliteConnectProviders';

export function Providers({ children }: { children: ReactNode }) {
  return <SatelliteConnectProviders>{children}</SatelliteConnectProviders>;
}
