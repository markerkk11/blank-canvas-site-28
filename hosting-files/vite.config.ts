import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  let taggerPlugin: any = null;

  if (mode === "development") {
    try {
      // Only load in Lovable/dev environments; skip locally if unavailable
      const mod = await import("lovable-tagger");
      taggerPlugin = mod.componentTagger();
    } catch {
      taggerPlugin = null; // Not installed locally - continue without it
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), taggerPlugin].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: ["@supabase/supabase-js"],
    },
    build: {
      rollupOptions: {
        // Ensure Supabase is bundled (not externalized)
        external: [],
      },
    },
  };
});
