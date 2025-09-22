import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.spec.ts", "**/*.spec.tsx"],
    alias: { "@": path.resolve(__dirname, "./src") },
    restoreMocks: true,
    mockReset: true,
    clearMocks: true,
  },
})
