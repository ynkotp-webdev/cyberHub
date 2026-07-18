import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ynkotp-webdev.github.io",
  base: "/cyberHub/",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
 