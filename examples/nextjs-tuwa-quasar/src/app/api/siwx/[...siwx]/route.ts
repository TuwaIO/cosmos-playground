import { createSiwxApiHandler } from '@tuwaio/sdk/siwx/server-next';

const handler = createSiwxApiHandler({
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { GET, POST, DELETE } = handler;
