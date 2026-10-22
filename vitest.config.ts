import { defineConfig } from 'vitest/config'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
const here = dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'aero-vue': resolve(here, 'src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolve(here, 'tests/setup.ts')],
  },
})
