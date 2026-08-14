import { createStatelessDemoSiwxHandler } from '@tuwaio/sdk/siwx/server-next';

const handler = createStatelessDemoSiwxHandler({
  signingSecret: process.env.SIWX_DEMO_SIGNING_SECRET || 'cosmos-playground-demo-secret-key-32-chars-minimum!!!',
  policy: {
    requireExpirationTime: false,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 1800,
  },
  cookieOptions: {
    name: 'siwx-demo-session',
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { GET, POST, DELETE } = handler;
