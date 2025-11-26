import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // link to the local package source
      "react-apexgantt": path.resolve(__dirname, "../src"),
    },
  },
});
