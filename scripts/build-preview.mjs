// Gera dist-preview/: index.html + app.js + app.css + brand/ (pré-visualização estática).
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "dist-preview");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

await build({
  entryPoints: [resolve(root, "preview/main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outfile: resolve(out, "app.js"),
  alias: { "@": resolve(root, "src") },
  define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_ASSET_BASE": '""', "process.env.NEXT_PUBLIC_ROUTING": '"hash"' },
  legalComments: "none",
});

execSync(`npx @tailwindcss/cli -i src/app/globals.css -o dist-preview/app.css --minify`, { cwd: root, stdio: "inherit" });
cpSync(resolve(root, "public/brand"), resolve(out, "brand"), { recursive: true });

const template = readFileSync(resolve(root, "preview/index.html"), "utf8");
writeFileSync(resolve(out, "index.html"), template);
console.log("preview ok →", out);
