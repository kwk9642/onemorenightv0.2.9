import path from "node:path";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => {
  const edition = process.env.VITE_EDITION === "full" ? "full" : process.env.VITE_EDITION === "demo" ? "demo" : "web";
  return {
  root: path.resolve("itch"),
  base: "./",
  publicDir: path.resolve("itch-public"),
  define: {
    __OMN_EDITION__: JSON.stringify(edition),
  },
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
};
});
