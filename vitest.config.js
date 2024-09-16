import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@shared': new URL('./src/shared', import.meta.url).pathname,
    }
  }
})