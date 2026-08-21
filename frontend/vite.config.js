import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Tailwind v4 plugin, no separate postcss config needed

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
