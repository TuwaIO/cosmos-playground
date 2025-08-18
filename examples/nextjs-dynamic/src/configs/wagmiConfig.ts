import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';

// Your dApps chains
export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

export const config = createConfig({
  chains: appChains,
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
});
