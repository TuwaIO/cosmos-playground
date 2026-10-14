'use client';

import { ReactNode } from 'react';

import { SatelliteConnectProviders } from '@/providers/SatelliteConnectProviders';

export function Providers({ children }: { children: ReactNode }) {
  return <SatelliteConnectProviders>{children}</SatelliteConnectProviders>;
}
