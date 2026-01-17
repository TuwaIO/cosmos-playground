import { cn } from '@tuwaio/nova-core';

import { SHARED_STYLES } from '../../styles/customization/shared_styles';

export const ExtraBalancesSection = () => {
  const balances = [{ symbol: 'USDC', amount: '1,234.56', icon: '○' }];

  return (
    <div className="flex flex-col gap-1 w-full">
      {balances.map((balance) => (
        <div
          key={balance.symbol}
          className={cn(
            'flex items-center justify-center gap-2',
            SHARED_STYLES.fontMono,
            SHARED_STYLES.textSecondary,
            'text-sm',
          )}
        >
          <span>{balance.icon}</span>
          <span>{balance.amount}</span>
          <span>{balance.symbol}</span>
        </div>
      ))}
    </div>
  );
};
