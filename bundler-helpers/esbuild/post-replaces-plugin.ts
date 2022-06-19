import type { Plugin } from "esbuild";
import fs from "fs/promises";

/** Replaces strings in output files */
const outputReplacesPlugin = (replaces: Record<string, string>) => {
  const plugin: Plugin = {
    name: 'cloudflare-workers-compat-post-replaces',
    setup: ({ onEnd }) => {
      onEnd(async ({ metafile }) => {
        if (!metafile) throw new Error("Need `metafile: true` to use the cloudflare-workers-compat-replaces plugin")

        for (const outputFile of Object.keys(metafile.outputs)) {
          let code = await fs.readFile(outputFile, 'utf8');

          for (const replace of Object.entries(replaces)) {
            code = code.replaceAll(replace[0], replace[1]);
          }

          await fs.writeFile(outputFile, code, 'utf8');
        }
      })
    }
  }

  return plugin;
}

export default outputReplacesPlugin;
