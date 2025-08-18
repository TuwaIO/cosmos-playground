import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
    minify: 'terser',
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
