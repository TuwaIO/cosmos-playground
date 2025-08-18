import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export const COUNTER_ADDRESS = '0xAe7f46914De82028eCB7E2bF97Feb3D3dDCc2BAB';

export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];
