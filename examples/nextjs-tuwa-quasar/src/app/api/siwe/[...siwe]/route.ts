// Import the ready-made server instance from the new package
import { createSiweApiHandler } from '@tuwaio/sdk/satellite/siwe/server';

const siweApiHandler = createSiweApiHandler();

// Export the handlers for App Router
export const { GET, POST, DELETE } = siweApiHandler;
