import { BuildOptions } from "esbuild";
import bundlerConfig, { BundlerConfigGenerateOptions } from "../../bundler-config.js";
import aliasPlugin from "./alias-plugin.js";
import outputReplacesPlugin from "./post-replaces-plugin.js";

export { aliasPlugin, outputReplacesPlugin };

export const createEsbuildConfig = async (options: BundlerConfigGenerateOptions) => {
  const compatConfig = await bundlerConfig(options);
  const config: BuildOptions = {
    inject: compatConfig.inject,
    define: compatConfig.define,
    plugins: [
      aliasPlugin(compatConfig.aliases),
      outputReplacesPlugin(compatConfig.replaces),
    ]
  }
  return config;
}
