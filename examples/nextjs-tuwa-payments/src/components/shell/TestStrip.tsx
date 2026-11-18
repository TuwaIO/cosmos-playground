/**
 * The strip under the header: that the payments are test payments and on which networks, and that merchant mode is on.
 * The label of merchant mode shows at every width (it shortens on a phone): the mode acts with the secret key.
 */
export function TestStrip({
  testMode,
  networks,
  merchant,
}: {
  /** Whether the shop issues test invoices (a test secret key). */
  testMode: boolean;
  /** The names of the networks of the shop's payment methods. */
  networks: string[];
  merchant: boolean;
}) {
  if (!testMode && !merchant) return null;
  const list =
    networks.length > 1 ? `${networks.slice(0, -1).join(', ')} and ${networks[networks.length - 1]}` : networks[0];
  return (
    <div className="shop-strip">
      <div className="shop-strip-in">
        {testMode && (
          <>
            <span className="shop-chip is-warn is-dot">Test networks only</span>
            <span>{list ? `Payments run on ${list}. No real money moves.` : 'No real money moves.'}</span>
          </>
        )}
        {merchant && (
          <span className="shop-chip is-ink" style={{ marginLeft: 'auto' }}>
            Merchant<span className="shop-hide-phone">&nbsp;mode</span>
          </span>
        )}
      </div>
    </div>
  );
}
