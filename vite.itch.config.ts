import path from "node:path";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: path.resolve("itch"),
  base: "./",
  publicDir: path.resolve("itch-public"),
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    tsconfigPaths: true,
    alias: { "@": path.resolve("src") },
  },
  build: {
    outDir: path.resolve("dist-itch"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
});
