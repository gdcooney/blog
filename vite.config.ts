import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Re-create __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

