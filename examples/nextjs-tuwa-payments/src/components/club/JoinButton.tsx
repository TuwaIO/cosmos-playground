'use client';

import { ArrowRightIcon } from '@tuwaio/nova-icons/24/outline';

import { joinClub } from '@/app/actions';
import { useShop } from '@/components/shell/ShopProvider';

/** Joins Cosmos Club: issues the one invoice of the membership on the server and opens its checkout. */
export function JoinButton() {
  const { sellable, busy, purchase } = useShop();
  return (
    <button
      type="button"
      className="shop-btn"
      disabled={!sellable || busy !== null}
      onClick={() => void purchase('club', joinClub)}
    >
      {busy === 'club' ? 'Issuing the invoice…' : 'Join the Club'}
      <ArrowRightIcon className="shop-icon" aria-hidden />
    </button>
  );
}
