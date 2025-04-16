import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";
//import vercel from "@astrojs/vercel/serverless";
import viteConfig from './vite.config';
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { SITE } from "./src/config.js";

// https://astro.build/config
export default defineConfig({
  adapter: vercel({}), // ✅ Required for Vercel serverless deployment
  site: SITE.website,
  server: {
    host: true, // Bind to 0.0.0.0 so it’s accessible across your network
  },
  integrations: [
    sitemap({
      filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: viteConfig,
  image: {
    experimentalLayout: "responsive",
  },
  experimental: {
    svg: true,
    responsiveImages: true,
    preserveScriptOrder: true,
  },
});

