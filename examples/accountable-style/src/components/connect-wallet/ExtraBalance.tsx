import { BalanceDisplay } from '@tuwaio/nova-connect/components';

import { TokenConfig } from '../../configs/tokenConfig';
import { useGetExtraBalance } from '../../hooks/useGetExtraBalance';

export function ExtraBalance({ token }: { token: TokenConfig }) {
  const { balance, refetch, isLoading } = useGetExtraBalance(token);
  return <BalanceDisplay balance={balance} onRefetch={refetch} isLoading={isLoading} />;
}
