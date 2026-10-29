import { cn } from '@tuwaio/nova-core';

/**
 * The line art of a product on a muted tile, drawn in the text colour of the theme (the SVG is a CSS mask), so it
 * follows light and dark without a second file.
 */
export function ProductArt({ art, className }: { art: string; className?: string }) {
  return (
    <span aria-hidden className={cn('flex items-center justify-center bg-[var(--tuwa-bg-muted)]', className)}>
      <span
        className="block h-[78%] w-[78%] bg-[var(--tuwa-text-primary)]"
        style={{
          maskImage: `url(${art})`,
          WebkitMaskImage: `url(${art})`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
        }}
      />
    </span>
  );
}
