import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // The Codama-generated program clients read `process.env['NODE_ENV']`, which Vite does not replace in the browser
  define: { 'process.env': JSON.stringify({ NODE_ENV: mode === 'production' ? 'production' : 'development' }) },
  // The wallet SDKs make the main chunk larger than the default limit of 500 kB
  build: { chunkSizeWarningLimit: 1500 },
}));
