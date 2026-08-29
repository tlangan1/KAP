import fs from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync(resolve("cert/10.11.10.70-key.pem")),
      cert: fs.readFileSync(resolve("cert/10.11.10.70.pem")),
    },
  },
});
