/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from "path";
import { defineConfig as defineVitestConfig } from "vitest/config";
import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

const viteConfig = defineViteConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    globals: true,
  },
});

// ✅ single, latest export
export default mergeConfig(viteConfig, vitestConfig);