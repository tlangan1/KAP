The app currently enables LAN access with `host: true`, but Vite’s dev server is HTTP in `vite.config.ts:6`.

**For quick local HTTPS**, install Vite’s certificate plugin:

```bash
npm install -D @vitejs/plugin-basic-ssl
```

vite.config.js was as follows:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
});
```

<!-- I skipped this implementation because I want the certificate -->
<!-- to be trusted. -->
<!-- Update `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true,
  },
});
```

Start it normally:

```bash
npm run dev
```

Then open the HTTPS URL Vite reports, usually `https://localhost:5173`. The generated certificate is self-signed, so the browser will show a warning.
 -->

For a trusted local certificate, use `mkcert` and configure Vite directly:

<!-- Since I already had mkcert installed I used the code below. -->

<!-- ```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
mkdir -p certs
mv localhost*.pem certs/ -->

````

```bash
mkdir -p cert
cd cert
mkcert 10.11.10.70
```

```ts
import fs from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync(resolve("cert/localhost-key.pem")),
      cert: fs.readFileSync(resolve("cert/localhost.pem")),
    },
  },
});
```

Add `cert/` to `.gitignore`.

<!-- I did not do anything below this line -->

For production, `npm run build` creates static files and does not provide TLS. Serve the build through an HTTPS reverse proxy such as Nginx, or configure the existing Express server for HTTPS. The REST client already defaults to `https://localhost:3000` and supports `VITE_API_BASE_URL` in `restRepository.ts:15`, so set that variable to your HTTPS API URL when needed:

```env
VITE_DATA_BACKEND=rest
VITE_API_BASE_URL=https://your-api-host:3000
```
````
