import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bundle.manifests.ts",
      formats: ["es"],
      fileName: "cf-cache-clearer",
    },
    outDir: "../wwwroot/App_Plugins/CFCacheClearer",
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
    },
  },
});
