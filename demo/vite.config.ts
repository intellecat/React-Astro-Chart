import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@astrologer/react-chart': resolve(__dirname, '../src/index.ts')
    }
  }
});