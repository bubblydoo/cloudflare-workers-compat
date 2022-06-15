import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  await build({
    bundle: true,
    format: "esm",
    target: "esnext",
    conditions: ["worker", "browser"],
    entryPoints: [path.join(__dirname, "deno-worker-compat.ts")],
    outfile: path.join(__dirname, "build", "deno-worker-compat.mjs"),
    outExtension: { ".js": ".mjs" },
  });
} catch (e) {
  console.error(e);
  process.exitCode = 1;
}
