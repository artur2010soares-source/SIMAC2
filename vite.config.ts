import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base '/' works for local dev, Vercel and most hosts.
// For GitHub Pages under a repo subpath, change base to '/<repo-name>/'.
export default defineConfig({
  plugins: [react()],
  base: './',
});
