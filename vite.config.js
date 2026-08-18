import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// GitHub Pages project sites live under /<repo>/. Cloudflare / custom domains stay at /.
const base = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");

// ponytail: CSS `url('/fonts/…')` is domain-root, so it 404s under /website-preview/. Drop when Pages is a custom domain at /.
function prefixPublicFontUrls() {
    if (base === "/") {
        return null;
    }
    const prefix = base.slice(0, -1);
    return {
        name: "prefix-public-font-urls",
        transform(code, id) {
            if (!id.split("?")[0].endsWith(".css")) {
                return null;
            }
            return code
                .replaceAll("url('/fonts/", `url('${prefix}/fonts/`)
                .replaceAll('url("/fonts/', `url("${prefix}/fonts/`);
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    base,
    plugins: [react(), tailwindcss(), prefixPublicFontUrls()],
    resolve: {
        alias: {
            "@": path.resolve(rootDir, "src"),
        },
    },
    // strictPort: fail loudly instead of silently drifting to the next free port.
    // The dev origin has to match the API's CORS allowlist and the OAuth redirect
    // URI, so an unexpected port is a broken claim flow rather than a minor detail.
    // 3000 is deliberately avoided — that is where the local API runs.
    server: {
        port: 5173,
        strictPort: true,
        host: true
    },
    preview: {
        port: 4173,
        strictPort: true,
    },
    build: {
        outDir: "dist",
        sourcemap: false,
    },
});
