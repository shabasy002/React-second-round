import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text', 'json', 'html'],
    //   include: ['src/**/*.{ts,tsx}'],
    //   exclude: [
    //     'src/**/*.test.{ts,tsx}',
    //     'src/main.tsx',
    //     'src/vite-env.d.ts',
    //     'src/index.css',
    //     'src/App.css',
    //   ],
    // },
  }
} as UserConfig)
