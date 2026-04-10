import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 15000, // SSR pages can be slow on first hit (Supabase round-trip)
    hookTimeout: 15000,
    include: ["tests/**/*.test.ts"],
  },
});
