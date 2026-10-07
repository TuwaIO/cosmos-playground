import { toCaip2ChainId } from '@tuwaio/sdk/orbit';
import { createStatelessDemoSiwxHandler } from '@tuwaio/sdk/siwx/server-next';

import { appConfig, appEVMChains } from '@/configs/appConfig';
import { DEMO_SIGNING_SECRET } from '@/lib/authConfig';

const appUrl = new URL(appConfig.appUrl);

// Serves /api/siwx/nonce, /verify, /session and /logout. The session is a signed token in an HttpOnly cookie
// (stateless demo profile, see the README for its limits).
export const { GET, POST, DELETE } = createStatelessDemoSiwxHandler({
  signingSecret: DEMO_SIGNING_SECRET,
  policy: {
    expectedDomain: appUrl.host,
    expectedUri: appUrl.origin,
    // CAIP-2 chain IDs (`eip155:1`), the form of the chain ID in every SIWX message
    allowedChainIds: appEVMChains.flatMap((chain) => toCaip2ChainId(chain.id) ?? []),
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 1800, // 30 minutes
    clockSkewSeconds: 60,
  },
  // HTTPS-only cookie in production; `next dev` serves http://localhost
  cookieOptions: { secure: process.env.NODE_ENV === 'production' },
});
