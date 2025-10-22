/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

// eslint-disable-next-line no-restricted-exports
export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-redux", "@reduxjs/toolkit", "dayjs", "uuid"],
  },
  test: {
    environment: "node",
    globals: true,
    coverage: {
      include: ["src/**/redux/**", "src/**/utils/**", "src/**/repositories/**"],
      reporter: ["text", "json", "html"],
    },
  },
}))
