import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';

import { SUPPORTED_TOKENS } from '../../configs/tokenConfig';
import { ExtraBalance } from './ExtraBalance';

export const ExtraBalancesSection = () => {
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);

  if (!activeConnection) {
    return null;
  }

  if (!Object.keys(SUPPORTED_TOKENS).includes(activeConnection.chainId.toString())) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 w-full">
      {SUPPORTED_TOKENS[+activeConnection.chainId].map((token) => (
        <ExtraBalance key={token.address} token={token} />
      ))}
    </div>
  );
};
