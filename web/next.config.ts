import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";

// Pyodide est servi par le site lui-même (public/pyodide/<version>/, voir scripts/copier-pyodide.mjs) :
// aucun domaine extérieur n'est autorisé dans la politique de contenu.
const versionPyodide: string = JSON.parse(
  readFileSync("node_modules/pyodide/package.json", "utf8"),
).version;

const politiqueContenu = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "connect-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  serverExternalPackages: ["pyodide"],
  env: { VERSION_PYODIDE: versionPyodide },
  async headers() {
    return [
      {
        source: "/:chemin*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          ...(production
            ? [
                { key: "Content-Security-Policy", value: politiqueContenu },
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains",
                },
              ]
            : []),
        ],
      },
      {
        // Le dossier porte le numéro de version : son contenu ne change jamais.
        source: "/pyodide/:chemin*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
