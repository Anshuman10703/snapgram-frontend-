// ~/snapgram-amplify-project/frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// REMOVED: import tsconfigPaths from 'vite-tsconfig-paths';

import path from 'path'; // ADD THIS IMPORT

export default defineConfig({
  plugins: [
    react(),
  ],
  // ADD THIS RESOLVE BLOCK FOR MANUAL ALIASES
  resolve: {
    alias: {
      // This maps '@/' to your 'src/' directory
      '@': path.resolve(__dirname, './src'),
      // If you have specific aliases like '@/components' or '@/lib'
      // you might need to add them here explicitly if they don't resolve via '@/':
      // '@/components': path.resolve(__dirname, './src/components'),
      // '@/lib': path.resolve(__dirname, './src/lib'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'node:path', 'node:fs', 'node:url', 'node:util', 'node:os', 'node:net', 'node:dns',
        'node:buffer', 'node:crypto', 'node:child_process', 'node:http', 'node:https',
        'node:zlib', 'node:assert', 'node:events', 'node:perf_hooks', 'node:module',
        'node:readline', 'node:process', 'node:worker_threads', 'node:querystring', 'node:v8',
        'node:tty', 'node:stream'
      ],
    },
    target: 'esnext',
  },
  esbuild: {
    target: 'esnext'
  },
  optimizeDeps: {
    include: [
      'react-router-dom',
      '@aws-sdk/client-cognito-identity-provider',
      '@aws-sdk/client-cognito-identity',
      '@aws-sdk/client-s3',
      '@aws-sdk/lib-storage',
      '@aws-sdk/credential-provider-cognito-identity',
      '@aws-sdk/s3-request-presigner',
      'jwt-decode',
      'uuid',
      'axios',
      'tailwindcss', 'postcss', 'autoprefixer', 'tailwindcss-animate', 'clsx', 'tailwind-merge'
    ],
  },
});