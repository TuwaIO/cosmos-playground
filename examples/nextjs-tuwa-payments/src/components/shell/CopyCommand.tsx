'use client';

import { useState } from 'react';

/** A command of the terminal with a button that copies it. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // The clipboard is blocked: the command stays on the page to select by hand
    }
  };

  return (
    <div className="shop-command">
      <span className="shop-mono" style={{ display: 'flex', alignItems: 'center', paddingLeft: 14 }} aria-hidden>
        $
      </span>
      <code>{command}</code>
      <button
        type="button"
        className="shop-btn is-2 is-sm"
        style={{ minHeight: 44, borderWidth: '0 0 0 1px' }}
        onClick={() => void copy()}
      >
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
