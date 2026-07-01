import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Canonical production URL — powers <link rel="canonical">, Open Graph
  // URLs and the generated sitemap.
  site: "https://hackers-handbook-vol-1.netlify.app",
  integrations: [
    // Preact powers the interactive islands (theme toggle, table of
    // contents, mobile sidebar toggle).
    preact(),
    // Generate sitemap-index.xml + sitemap-0.xml at build time.
    sitemap(),
  ],
  build: {
    // Emit clean `/en/introduction/` style URLs.
    format: "directory",
  },
});
