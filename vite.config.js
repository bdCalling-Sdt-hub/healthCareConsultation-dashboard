import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "172.31.14.250",
    // host: "10.0.70.111",
    port: 3003,
  },
});
