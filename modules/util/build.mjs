import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";
import define from "../../esbuild-define.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  await build({
    bundle: true,
    format: "esm",
    target: "esnext",
    conditions: ["worker", "browser"],
    entryPoints: [path.join(__dirname, "build", "mod.mjs")],
    outfile: path.join(__dirname, "build", "mod-cf.mjs"),
    outExtension: { ".js": ".mjs" },
    inject: [
      "../../deno-worker-compat.ts"
    ],
    define: {
      ...define,
      "Deno": "{}"
    }
  });
} catch (e) {
  console.error(e);
  process.exitCode = 1;
}
