'use client';

import { ConnectButton } from '@tuwaio/nova-connect/components';
import { ShoppingBagIcon } from '@tuwaio/nova-icons/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import { useShop } from '@/components/shell/ShopProvider';
import { ThemeToggle } from '@/components/shell/ThemeToggle';
import { StoreMark } from '@/components/shop/art';
import { appConfig } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { cartItemCount, cartStore, itemsLabel } from '@/lib/cartStore';

const SECTIONS = [
  { href: '/', label: 'Shop', match: (path: string) => path === '/' || path.startsWith('/products') },
  { href: '/club', label: 'Club', match: (path: string) => path.startsWith('/club') },
  { href: '/orders', label: 'Orders', match: (path: string) => path.startsWith('/orders') },
] as const;

/** The header: the shop's mark, its three sections, the cart, the wallet button of Nova Connect and the theme. */
export function Header() {
  const pathname = usePathname();
  const { setCartOpen } = useShop();
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const count = cartItemCount(cart);

  return (
    <header className="shop-header">
      <div className="shop-head">
        <Link href="/" className="shop-brand" aria-label={`${appConfig.appName}, home`}>
          <StoreMark aria-hidden />
          <span className="shop-brand-name">{appConfig.appName}</span>
        </Link>
        <nav aria-label="Main" className="shop-nav">
          {SECTIONS.map(({ href, label, match }) => (
            <Link key={href} href={href} className="shop-tab" aria-current={match(pathname) ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="shop-actions">
          <button
            type="button"
            className="shop-cart"
            aria-label={`Cart, ${itemsLabel(count)}`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBagIcon className="shop-icon" aria-hidden />
            <span className="shop-hide-phone">Cart</span>
            <span className="shop-count">{count}</span>
          </button>
          <ConnectButton transactionPool={transactionPool} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
