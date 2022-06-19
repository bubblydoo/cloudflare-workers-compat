// copied from https://github.com/igoradamenko/esbuild-plugin-alias
import { Plugin } from "esbuild";

/** Replaces imports with other modules */
const aliasPlugin = (options: Record<string, string>) => {
  const aliases = Object.keys(options);
  const re = new RegExp(`^(${aliases.map(x => escapeRegExp(x)).join('|')})$`);

  const plugin: Plugin = {
    name: 'cloudflare-workers-compat-alias',
    setup({ onResolve }) {
      // we do not register 'file' namespace here, because the root file won't be processed
      // https://github.com/evanw/esbuild/issues/791
      onResolve({ filter: re }, args => ({
        path: options[args.path],
      }));
    },
  };

  return plugin;
};

function escapeRegExp(string: string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default aliasPlugin;
