import { createStatelessDemoSiwxHandler } from '@tuwaio/sdk/siwx/server-next';

import { DEMO_SIGNING_SECRET } from '@/lib/authConfig';

const handler = createStatelessDemoSiwxHandler({
  signingSecret: DEMO_SIGNING_SECRET,
  policy: {
    requireExpirationTime: false,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 1800, // 30 minutes
  },
  cookieOptions: {
    name: 'siwx-demo-session',
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { GET, POST, DELETE } = handler;
