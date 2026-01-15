'use client';

import AccountableLogo from '../assets/accountable_logo.svg';
import AccountableLogoMobile from '../assets/accountable_logo_mobile.svg';
import { ConnectButton } from './customization/ConnectButton';

export function Header() {
  return (
    <header className="px-4 py-3 flex items-center justify-between gap-4 bg-[var(--accountable-background)] border-b border-[var(--accountable-border)]">
      <a
        href="https://yield.accountable.capital/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0"
      >
        {/* Desktop logo */}
        <img
          src={AccountableLogo}
          alt="Accountable"
          className="hidden md:block h-8 w-auto"
        />
        {/* Mobile logo */}
        <img
          src={AccountableLogoMobile}
          alt="Accountable"
          className="block md:hidden h-8 w-8"
        />
      </a>

      <ConnectButton />
    </header>
  );
}
