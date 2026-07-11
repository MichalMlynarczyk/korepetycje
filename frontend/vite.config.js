import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['45.93.139.211', 'nastomatma.pl', 'www.nastomatma.pl'],
    proxy: {
      '/api': 'http://backend:8000',
      '/accounts': 'http://backend:8000',
      '/admin': 'http://backend:8000',
      '/media': 'http://backend:8000',
      '/static': 'http://backend:8000',
    },
  },
});
