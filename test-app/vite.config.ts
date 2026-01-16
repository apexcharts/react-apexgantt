import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - uses repo name from environment or defaults to "/"
  base: process.env.GITHUB_ACTIONS ? "/react-apexgantt/" : "/",
  resolve: {
    alias: {
      // link to the local package source - points to parent's src folder
      "react-apexgantt": path.resolve(__dirname, "../src/index.ts"),
    },
  },
});
