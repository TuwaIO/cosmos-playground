// @ts-expect-error - missing types
import tailwindcss from '@tailwindcss/vite';
// @ts-expect-error - missing types
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  optimizeDeps: {
    include: [
      '@tuwaio/nova-core',
      '@tuwaio/nova-transactions',
      '@tuwaio/nova-connect',
      '@tuwaio/nova-connect/components',
      '@tuwaio/nova-connect/hooks',
      '@tuwaio/nova-connect/satellite',
      '@tuwaio/nova-connect/i18n',
      '@tuwaio/nova-connect/evm',
      '@tuwaio/nova-connect/solana',
    ],
  },

  build: {
    outDir: 'dist',
    assetsDir: '',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/viem') || id.includes('node_modules/@tuwaio')) {
            return 'core-web3';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? [];
          const extension = info[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extension ?? '')) {
            return `images/[name].[ext]`;
          }

          if (extension === 'css') {
            return 'styles.css';
          }

          return '[name].[ext]';
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },

  server: {
    host: true,
    port: 5173,
  },

  preview: {
    host: true,
    port: 4173,
  },
});
