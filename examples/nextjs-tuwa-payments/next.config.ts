process.env.NEXT_TELEMETRY_DISABLED = '1';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // No Next.js badge over the page in `next dev`: the shop is also filmed
  devIndicators: false,
};

export default nextConfig;
