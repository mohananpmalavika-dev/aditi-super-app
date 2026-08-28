import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false, // Automatically fallback to next available port if taken
    open: false
  }
});
