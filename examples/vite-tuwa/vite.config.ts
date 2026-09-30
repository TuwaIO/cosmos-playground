import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The wallet SDKs make the main chunk larger than the default limit of 500 kB
  build: { chunkSizeWarningLimit: 1500 },
});
