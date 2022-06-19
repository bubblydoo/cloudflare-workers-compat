import resolve from "resolve";
import { createRequire } from "module";
import { fileURLToPath } from "url";

export interface BundlerConfigGenerateOptions {
  nodeBuiltinModules?: boolean | NodeBuiltinModuleName[];
  nodeGlobals?: boolean | ("process" | "process-class")[];
  denoObject?: {
    attributes: boolean;
    global: boolean | "empty-object";
  };
  denoGlobals?: boolean | ("add-event-listener" | "remove-event-listener")[];
  workerIncompatibles?: boolean | ("eval" | "function-constructor")[];
  onIncompatible?: "ignore" | "warn" | "throw";
}

interface BundlerConfig {
  aliases: Record<string, string>;
  inject: string[];
  define: Record<string, string>;
  replaces: Record<string, string>;
}

const __filename = fileURLToPath(import.meta.url);

const nodeBuiltinModulesAllAliasesRelative = {
  assert: "assert",
  buffer: "buffer",
  console: "console-browserify",
  // constants: "constants-browserify",
  crypto: "crypto-browserify",
  events: "cloudflare-workers-node-compat/events",
  fs: "cloudflare-workers-node-compat/fs",
  // http: "stream-http",
  // https: "stream-http",
  // net: "net-browserify",
  os: "os-browserify/browser",
  path: "path-browserify",
  process: "cloudflare-workers-node-compat/process",
  querystring: "qs",
  stream: "stream-browserify",
  // _stream_duplex: "readable-stream/duplex",
  // _stream_passthrough: "readable-stream/passthrough",
  // _stream_readable: "readable-stream/readable",
  // _stream_transform: "readable-stream/transform",
  // _stream_writable: "readable-stream/writable",
  string_decoder: "cloudflare-workers-node-compat/string_decoder",
  // sys: "util",
  timers: "cloudflare-workers-node-compat/timers",
  tty: "cloudflare-workers-node-compat/tty",
  url: "url-shim",
  util: "cloudflare-workers-node-compat/util",
  // vm: "vm-browserify",
  // zlib: "browserify-zlib"
};

type NodeBuiltinModuleName = keyof typeof nodeBuiltinModulesAllAliasesRelative;

export const resolveAliases = (aliases, resolve) =>
  Object.fromEntries(Object.entries(aliases).map(([k, v]) => [k, resolve(v)]));

const require = createRequire(import.meta.url);
const currentFileRequire = createRequire(__filename);

export const nodeBuiltinModulesAliases = (
  moduleNames?: NodeBuiltinModuleName[]
) => {
  let aliasesRelative: Record<string, string> =
    nodeBuiltinModulesAllAliasesRelative;
  if (moduleNames) {
    aliasesRelative = Object.fromEntries(
      Object.entries(aliasesRelative).filter(([k]) =>
        (moduleNames as string[]).includes(k)
      )
    );
  }
  const aliases = resolveAliases(aliasesRelative, (spec) => {
    if (spec.startsWith("cloudflare-workers-node-compat")) {
      return require.resolve(spec);
    } else {
      return resolve.sync(spec, {
        basedir: __filename,
        includeCoreModules: false,
      });
    }
  });
  return aliases;
};

const resolvePartial = async (p: string) => {
  let inject: string;

  try {
    inject = currentFileRequire.resolve(`./lib/${p}/inject.js`);
  } catch (e) {
    console.log();
  }

  console.log(inject);

  return {
    define: await import(`./lib/${p}/define.js`)
      .then((m) => m.default)
      .catch(() => ({})),
    replaces: await import(`./lib/${p}/replaces.js`)
      .then((m) => m.default)
      .catch(() => ({})),
    inject,
  };
};

const applyPartial = async (p: string, config: BundlerConfig) => {
  const partial = await resolvePartial(p);
  Object.assign(config.define, partial.define);
  Object.assign(config.replaces, partial.replaces);
  if (partial.inject) config.inject.push(partial.inject);
};

const bundlerConfig = async (options: BundlerConfigGenerateOptions) => {
  const config = {
    aliases: {},
    inject: [],
    define: {
      CF_WORKER_COMPAT_ON_INCOMPATIBLE: `"${options.onIncompatible}"`,
    },
    replaces: {},
  };

  if (options.nodeBuiltinModules) {
    config.aliases =
      options.nodeBuiltinModules === true
        ? nodeBuiltinModulesAliases()
        : nodeBuiltinModulesAliases(options.nodeBuiltinModules);
  }

  if (options.nodeGlobals) {
    const def = ["global", "process-class", "process"];
    const nodeGlobals = options.nodeGlobals;
    for (const nodeGlobal of def.filter(
      (x) => nodeGlobals === true || nodeGlobals.includes(x as any)
    )) {
      await applyPartial(`node-globals/${nodeGlobal}`, config);
    }
  }

  if (options.denoObject?.attributes) {
    await applyPartial(`deno-object-attributes`, config);
  }

  if (options.denoObject?.global === "empty-object") {
    config.define["Deno"] = "{}";
  } else if (options.denoObject?.global === true) {
    await applyPartial(`deno-object`, config);
  }

  if (options.denoGlobals) {
    const def = ["add-event-listener", "remove-event-listener"];
    const denoGlobals = options.denoGlobals;
    for (const denoGlobal of def.filter(
      (x) => denoGlobals === true || denoGlobals.includes(x as any)
    )) {
      await applyPartial(`deno-globals/${denoGlobal}`, config);
    }
  }

  if (options.workerIncompatibles) {
    const def = ["eval", "function-constructor"];

    const incompatibles = options.workerIncompatibles;

    for (const replace of def.filter(
      (x) => incompatibles === true || incompatibles.includes(x as any)
    )) {
      await applyPartial(`worker-incompatibles/${replace}`, config);
    }
  }

  return config;
};

export default bundlerConfig;
