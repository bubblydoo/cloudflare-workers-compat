import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";
import bundlerConfig from "../../../build/bundler-config.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = await bundlerConfig({
  denoObject: {
    attributes: true,
    global: "empty-object"
  },
  denoGlobals: true
});

await build({
  bundle: true,
  format: "esm",
  target: "esnext",
  conditions: ["worker", "browser"],
  entryPoints: [path.join(__dirname, "build", "mod.mjs")],
  outfile: path.join(__dirname, "dist", "mod-cf.mjs"),
  outExtension: { ".js": ".mjs" },
  inject: config.inject,
  define: config.define
});
