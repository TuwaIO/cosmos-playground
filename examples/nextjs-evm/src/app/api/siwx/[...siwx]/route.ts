import { createSiwxApiHandler } from '@tuwaio/sdk/siwx/server-next';

const handler = createSiwxApiHandler();

export const { GET, POST, DELETE } = handler;
