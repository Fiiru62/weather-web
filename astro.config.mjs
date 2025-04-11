// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    vite: {
      plugins: [tailwindcss()],
    },
    /* desactiva la toolbar que viene por defecto en astro */
    devToolbar: {
        enabled: false
      }
  });