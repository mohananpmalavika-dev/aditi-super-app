import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    fileParallelism: false
  },
  server: {
    port: 5173,
    strictPort: false, // Automatically fallback to next available port if taken
    open: false
  }
});
