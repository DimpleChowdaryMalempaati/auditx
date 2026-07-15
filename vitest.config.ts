import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    globals: true,

    include: ["packages/**/src/tests/**/*.test.ts"],

    exclude: ["**/*.int.test.ts", "**/node_modules/**", "**/dist/**"],

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
    },
  },
});
