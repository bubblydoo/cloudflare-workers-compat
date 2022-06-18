import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";
import define from "../../esbuild-define.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  await build({
    bundle: true,
    // sourcemap: true,
    format: "esm",
    target: "esnext",
    // external: ["__STATIC_CONTENT_MANIFEST", "*.wasm"],
    conditions: ["worker", "browser"],
    entryPoints: [path.join(__dirname, "build", "mod.mjs")],
    outfile: path.join(__dirname, "build", "mod-cf.mjs"),
    outExtension: { ".js": ".mjs" },
    inject: [
      "../../deno-worker-compat.ts"
    ],
    define
  });
} catch (e) {
  console.error(e);
  process.exitCode = 1;
}
