// copied from https://github.com/igoradamenko/esbuild-plugin-alias
import { Plugin } from "esbuild";

/** Replaces imports with other modules */
const aliasWithPrefixPlugin = (aliases: Record<string, string[]>) => {
  const modules = Object.values(aliases).flat();
  const re = new RegExp(`^(${modules.map(x => escapeRegExp(x)).join('|')})$`);

  const plugin: Plugin = {
    name: 'cloudflare-workers-compat-alias-nodejs-compat',
    setup({ onResolve, onLoad }) {
      // can't just alias, then require("util") will become a dynamic require,
      // we therefore "redirect" the module through a re-exporting module

      onResolve({ filter: re }, args => ({
        path: args.path,
        namespace: 'node-external',
      }));

      onLoad({ filter: /.*/, namespace: 'node-external' }, args => ({
        contents: `export * from "node:${args.path}"; export { default } from "node:${args.path}"; // alias-with-prefix plugin`,
        loader: 'js'
      }));
    },
  };

  return plugin;
};

function escapeRegExp(string: string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default aliasWithPrefixPlugin;
