import { BuildOptions } from "esbuild";
import bundlerConfig, { BundlerConfigGenerateOptions } from "../../bundler-config.js";
import aliasPlugin from "./alias-plugin.js";
import outputReplacesPlugin from "./post-replaces-plugin.js";
import aliasWithPrefixPlugin from "./alias-with-prefix-plugin.js";

export { aliasPlugin, outputReplacesPlugin, aliasWithPrefixPlugin };

export const createEsbuildConfig = async (options: BundlerConfigGenerateOptions) => {
  const compatConfig = await bundlerConfig(options);
  const config: BuildOptions = {
    inject: compatConfig.inject,
    define: compatConfig.define,
    external: compatConfig.externals,
    plugins: [
      aliasPlugin(compatConfig.aliases),
      outputReplacesPlugin(compatConfig.replaces),
      aliasWithPrefixPlugin(compatConfig.aliasWithPrefix),
    ]
  }
  return config;
}
