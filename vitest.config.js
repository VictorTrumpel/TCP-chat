import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@shared': new URL('./src/shared', import.meta.url).pathname,
      '@server/Connection': new URL('./src/server/Connection', import.meta.url).pathname,
      '@server/UserConnectionMapper': new URL('./src/server/UserConnectionMapper', import.meta.url).pathname,
      "@client/ui": new URL('./src/client/ui', import.meta.url).pathname
    }
  }
})