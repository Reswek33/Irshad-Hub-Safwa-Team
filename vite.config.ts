import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  optimizeDeps: {
    include: [
      "@supabase/supabase-js", // ← this is the main one
      // optional but often helpful too:
      "@supabase/auth-helpers-react", // if you're using auth helpers
      "@supabase/ssr", // if you're using the new ssr package
    ],
    force: true,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
