import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.yourwebsite.com", // update me!
prefetch: true,
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes("/admin"),
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],
 vite: {
    plugins: [tailwindcss()],
  },
 redirects: {
    '/residential': '/residential/epoxy-residential-floors/',
  },
});
