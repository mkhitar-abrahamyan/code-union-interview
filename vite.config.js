import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  /** Port 3000 is an old standard for me */
  server: {
    port: 3000,
  },
  /** It's simple to use aliases, me prefer to user ~ or @ */
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [tailwindcss(), react()],
});
