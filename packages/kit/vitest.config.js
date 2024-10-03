import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest-setup.js"],
    coverage: {
      provider: "v8", // or 'istanbul'
      include: ["src"],
    },
  },
});
