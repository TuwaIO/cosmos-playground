import { BalanceDisplay } from '@tuwaio/nova-connect/components';

import { TokenConfig } from '../../configs/tokenConfig';
import { useGetExtraBalance } from '../../hooks/useGetExtraBalance';
import { balance_display_customization } from '../../styles/customization/balance_display';

export function ExtraBalance({ token }: { token: TokenConfig }) {
  const { balance, refetch, isLoading } = useGetExtraBalance(token);
  return (
    <BalanceDisplay
      balance={balance}
      onRefetch={refetch}
      isLoading={isLoading}
      customization={balance_display_customization}
    />
  );
}
