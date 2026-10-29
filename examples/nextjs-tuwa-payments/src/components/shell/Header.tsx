'use client';

import { BoltIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { ConnectButton } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useSyncExternalStore } from 'react';

import { useShop } from '@/components/shell/ShopProvider';
import { StoreMark } from '@/components/shell/StoreMark';
import { ThemeToggle } from '@/components/shell/ThemeToggle';
import { buttonClass } from '@/components/ui/Button';
import { CountBadge } from '@/components/ui/CountBadge';
import { Segmented } from '@/components/ui/Segmented';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { cartStore } from '@/lib/cartStore';

type Section = 'shop' | 'orders' | 'events';

function sectionOf(pathname: string): Section {
  if (pathname.startsWith('/orders')) return 'orders';
  if (pathname.startsWith('/events')) return 'events';
  return 'shop';
}

/** Shop · Orders · Events, as a segmented control of links. */
function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const { book } = useShop();
  return (
    <nav aria-label="Main" className={className}>
      <Segmented
        label="Sections"
        value={sectionOf(pathname)}
        className="w-full"
        options={[
          { value: 'shop', label: 'Shop', href: '/' },
          { value: 'orders', label: 'Orders', href: '/orders' },
          { value: 'events', label: 'Events', href: '/events', count: book.webhooks.length },
        ]}
      />
    </nav>
  );
}

/** A header button with a label from `sm` up, a 40 px icon on phones, and a count in its corner. */
function HeaderButton({
  label,
  icon,
  count,
  onClick,
  className,
}: {
  label: string;
  icon: ReactNode;
  count: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}, ${count} ${count === 1 ? 'item' : 'items'}`}
      className={buttonClass('secondary', 'md', cn('w-10 px-0 lg:w-auto lg:px-3.5', className))}
    >
      <span className="[&>svg]:h-5 [&>svg]:w-5" aria-hidden>
        {icon}
      </span>
      <span className="hidden lg:inline" aria-hidden>
        {label}
      </span>
      {count > 0 && (
        <CountBadge
          count={count}
          tone="solid"
          className="absolute -top-1.5 -right-1.5 lg:static lg:top-auto lg:right-auto"
        />
      )}
    </button>
  );
}

/**
 * The header: the store mark, the sections (centred from 1024 px, in a second row below), the live events (a drawer
 * below 1280 px, where the rail is not shown), the cart, the wallet (Nova Connect) and the theme.
 */
export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const { book, mode, setCartOpen, setEventsOpen } = useShop();
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-2 px-4 sm:gap-3 sm:px-6 xl:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-[var(--tuwa-text-primary)]">
          <StoreMark className="h-8 w-8" />
          <span className="hidden font-mono text-[15px] font-black tracking-tight min-[480px]:inline">
            Cosmos Store
          </span>
        </Link>
        {mode.merchant && <StatusBadge label="Merchant mode" tone="pending" className="hidden xl:inline-flex" />}

        <Navigation className="hidden flex-1 justify-center lg:flex [&>div]:w-auto" />

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <HeaderButton
            label="Events"
            icon={<BoltIcon />}
            count={book.webhooks.length}
            onClick={() => setEventsOpen(true)}
            className="xl:hidden"
          />
          <HeaderButton label="Cart" icon={<ShoppingBagIcon />} count={cartCount} onClick={() => setCartOpen(true)} />
          <ConnectButton transactionPool={transactionPool} />
          <ThemeToggle />
        </div>
      </div>
      <div className="border-t border-[var(--tuwa-border-secondary)] px-4 py-2 sm:px-6 lg:hidden">
        <Navigation />
      </div>
    </header>
  );
}
