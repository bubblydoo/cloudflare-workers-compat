import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await build({
  bundle: true,
  format: "esm",
  target: "esnext",
  conditions: ["worker", "browser"],
  entryPoints: [path.join(__dirname, "timers.ts")],
  outfile: path.join(__dirname, "dist", "mod-cf.mjs"),
  outExtension: { ".js": ".mjs" },
});
