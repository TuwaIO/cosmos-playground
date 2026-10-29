/** The mark of the shop: a planet and its orbit, monochrome, in the current text colour. */
export function StoreMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="none">
      <rect x="0.5" y="0.5" width="31" height="31" rx="4" fill="currentColor" />
      <circle cx="16" cy="16" r="6" fill="var(--tuwa-bg-primary)" />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="4.5"
        transform="rotate(-24 16 16)"
        stroke="var(--tuwa-bg-primary)"
        strokeWidth="1.75"
      />
    </svg>
  );
}
