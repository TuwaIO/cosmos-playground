import { createStatelessDemoSiwxHandler } from '@tuwaio/sdk/siwx/server-next';

import { appConfig, appEVMChains } from '@/configs/appConfig';
import { DEMO_SIGNING_SECRET } from '@/lib/authConfig';

const parsedAppUrl = new URL(appConfig.appUrl);

const handler = createStatelessDemoSiwxHandler({
  signingSecret: DEMO_SIGNING_SECRET,
  policy: {
    expectedDomain: [parsedAppUrl.host, parsedAppUrl.hostname, 'localhost:3000', 'demo.tuwa.io'],
    expectedUri: [appConfig.appUrl, 'http://localhost:3000', 'https://demo.tuwa.io'],
    allowedChainIds: appEVMChains.flatMap((c) => [String(c.id), `eip155:${c.id}`]),
    requireExpirationTime: false,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 1800, // 30 minutes
    clockSkewSeconds: 60,
  },
  cookieOptions: {
    name: 'siwx-demo-session',
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { GET, POST, DELETE } = handler;
