import { defineConfig } from "astro/config";
import path from "path";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

// https://astro.build/config
export default defineConfig({
  // 1. Enable SSR: Required for live Supabase data fetching
  output: "server",
  
  // 2. Vercel Adapter: Configured for 2026 serverless standards
  adapter: vercel({
    webAnalytics: { enabled: true }
  }), 

  site: "https://blog.proveitsme.io",
  
  server: {
    host: true, // Accessible across your network
  },

  integrations: [],

  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },

  vite: {
    // 3. Tailwind 4 Integration: Using the Vite plugin to avoid peer-dep conflicts
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },

  image: {
    experimentalLayout: "responsive",
  },

  experimental: {
    svg: true,
    responsiveImages: true,
    preserveScriptOrder: true,
  },
});
