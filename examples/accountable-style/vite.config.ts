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

  // resolve: {
  //   alias: {
  //     '@tuwaio/nova-core/dist': path.resolve(__dirname, '../../packages/nova-core/dist'),
  //     '@tuwaio/nova-transactions/dist': path.resolve(__dirname, '../../packages/nova-transactions/dist'),
  //     '@tuwaio/nova-connect/dist': path.resolve(__dirname, '../../packages/nova-connect/dist'),
  //
  //     // nova-core
  //     '@tuwaio/nova-core': path.resolve(__dirname, '../../packages/nova-core/src'),
  //
  //     // nova-transactions
  //     '@tuwaio/nova-transactions/providers': path.resolve(__dirname, '../../packages/nova-transactions/src/providers'),
  //     '@tuwaio/nova-transactions': path.resolve(__dirname, '../../packages/nova-transactions/src'),
  //
  //     // nova-connect
  //     '@tuwaio/nova-connect/components': path.resolve(__dirname, '../../packages/nova-connect/src/components'),
  //     '@tuwaio/nova-connect/hooks': path.resolve(__dirname, '../../packages/nova-connect/src/hooks'),
  //     '@tuwaio/nova-connect/satellite': path.resolve(__dirname, '../../packages/nova-connect/src/satellite'),
  //     '@tuwaio/nova-connect/i18n': path.resolve(__dirname, '../../packages/nova-connect/src/i18n'),
  //     '@tuwaio/nova-connect/evm': path.resolve(__dirname, '../../packages/nova-connect/src/evm'),
  //     '@tuwaio/nova-connect/solana': path.resolve(__dirname, '../../packages/nova-connect/src/solana'),
  //     '@tuwaio/nova-connect': path.resolve(__dirname, '../../packages/nova-connect/src'),
  //   },
  // },

  build: {
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: '[name].js',
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
    chunkSizeWarningLimit: 1000,
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
