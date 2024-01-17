import resolve from "resolve";
import { createRequire } from "module";
import { fileURLToPath } from "url";

export interface BundlerConfigGenerateOptions {
  nodeBuiltinModules?: boolean | NodeBuiltinModuleNameAliasable[];
  nodeGlobals?: boolean | ("process" | "process-class" | "buffer-class")[];
  denoObject?: {
    attributes: boolean;
    global: boolean | "empty-object";
  };
  denoGlobals?: boolean | ("add-event-listener" | "remove-event-listener")[];
  workerIncompatibles?: boolean | ("eval" | "function-constructor")[];
  browserGlobals?: boolean | "navigator"[];
  onIncompatible?: "ignore" | "warn" | "throw";
  externalNodeBuiltinModules?: NodeBuiltinModuleName[];
  prefixExternalNodeBuiltinModules?: boolean;
  workersNodejsCompat?: boolean;
}

interface BundlerConfig {
  aliases: Record<string, string>;
  inject: string[];
  define: Record<string, string>;
  replaces: Record<string, string>;
  externals: string[];
  aliasWithPrefix: Record<string, string[]>;
}

const __filename = fileURLToPath(import.meta.url);

const nodeBuiltinModulesAllAliasesRelative = {
  assert: "assert",
  buffer: "buffer",
  console: "console-browserify",
  // constants: "constants-browserify",
  crypto: "crypto-browserify",
  events: "cloudflare-workers-compat/node-builtin-modules/events",
  fs: "cloudflare-workers-compat/node-builtin-modules/fs",
  // http: "stream-http",
  // https: "stream-http",
  // net: "net-browserify",
  os: "os-browserify/browser",
  path: "path-browserify",
  process: "cloudflare-workers-compat/node-builtin-modules/process",
  querystring: "qs",
  stream: "stream-browserify",
  // _stream_duplex: "readable-stream/duplex",
  // _stream_passthrough: "readable-stream/passthrough",
  // _stream_readable: "readable-stream/readable",
  // _stream_transform: "readable-stream/transform",
  // _stream_writable: "readable-stream/writable",
  string_decoder:
    "cloudflare-workers-compat/node-builtin-modules/string_decoder",
  // sys: "util",
  timers: "cloudflare-workers-compat/node-builtin-modules/timers",
  tty: "cloudflare-workers-compat/node-builtin-modules/tty",
  url: "url-shim",
  util: "cloudflare-workers-compat/node-builtin-modules/util",
  // vm: "vm-browserify",
  // zlib: "browserify-zlib"
};

const workersNodejsCompatBuiltinModules = [
  "assert",
  "async_hooks",
  "buffer",
  "crypto",
  "diagnostics_channel",
  "events",
  "path",
  "process",
  "stream",
  "stream/promises",
  "stream/web",
  "stream/consumers",
  "string_decoder",
  "util",
] as const;

type NodeBuiltinModuleNameAliasable =
  keyof typeof nodeBuiltinModulesAllAliasesRelative;
type NodeBuiltinModuleNameWithWorkersNodejsCompat =
  (typeof workersNodejsCompatBuiltinModules)[number];
type NodeBuiltinModuleName =
  | NodeBuiltinModuleNameAliasable
  | NodeBuiltinModuleNameWithWorkersNodejsCompat;

export const resolveAliases = (aliases, resolve) =>
  Object.fromEntries(Object.entries(aliases).map(([k, v]) => [k, resolve(v)]));

const require = createRequire(import.meta.url);
const currentFileRequire = createRequire(__filename);

export const nodeBuiltinModulesAliases = (
  moduleNames: NodeBuiltinModuleNameAliasable[],
  externals?: NodeBuiltinModuleName[]
) => {
  let aliasesRelative = Object.fromEntries(
    Object.entries(nodeBuiltinModulesAllAliasesRelative).filter(([k]) =>
      (moduleNames as string[]).includes(k)
    )
  );
  if (externals) {
    aliasesRelative = Object.fromEntries(
      Object.entries(aliasesRelative).filter(
        ([k]) => !(externals as string[]).includes(k)
      )
    );
  }
  const aliasesUnprefixed = resolveAliases(aliasesRelative, (spec) => {
    if (spec.startsWith("cloudflare-workers-compat")) {
      return require.resolve(spec);
    } else {
      return resolve.sync(spec, {
        basedir: __filename,
        includeCoreModules: false,
      });
    }
  });
  const aliases = Object.fromEntries(
    Object.entries(aliasesUnprefixed)
      .map(([k, v]) => [
        [k, v], // e.g. buffer
        [`node:${k}`, v], // e.g. node:buffer
      ])
      .flat()
  );
  return aliases;
};

const resolvePartial = async (p: string) => {
  let inject: string;

  try {
    inject = currentFileRequire.resolve(`./lib/${p}/inject.js`);
  } catch (e) {}

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

const generateBundlerConfig = async (options: BundlerConfigGenerateOptions) => {
  const config: BundlerConfig = {
    aliases: {},
    inject: [],
    define: {
      CF_WORKER_COMPAT_ON_INCOMPATIBLE: `"${
        options.onIncompatible || "ignore"
      }"`,
    },
    replaces: {},
    externals: [],
    aliasWithPrefix: {},
  };

  let externalNodejsModules = options.externalNodeBuiltinModules || [];
  let prefixExternalNodeBuiltinModules= options.prefixExternalNodeBuiltinModules || false;

  if (options.workersNodejsCompat) {
    externalNodejsModules = [
      ...externalNodejsModules,
      // from https://developers.cloudflare.com/workers/runtime-apis/nodejs/
      "assert",
      "async_hooks",
      "buffer",
      "crypto",
      "diagnostics_channel",
      "events",
      "path",
      "process",
      "stream",
      "stream/promises",
      "stream/consumers",
      "string_decoder",
      "util",
    ];
    prefixExternalNodeBuiltinModules = true;
  }

  config.externals = externalNodejsModules.map((x) => `node:${x}`);
  if (prefixExternalNodeBuiltinModules) {
    config.aliasWithPrefix["node"] = externalNodejsModules;
  }

  if (options.nodeBuiltinModules) {
    const moduleNames =
      options.nodeBuiltinModules === true
        ? (Object.keys(
            nodeBuiltinModulesAllAliasesRelative
          ) as NodeBuiltinModuleNameAliasable[])
        : options.nodeBuiltinModules;
    config.aliases = nodeBuiltinModulesAliases(
      moduleNames,
      externalNodejsModules
    );
  }

  if (options.nodeGlobals) {
    const def = ["global", "process-class", "process", "buffer-class"];
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

  if (options.browserGlobals) {
    const def = ["navigator"];
    const browserGlobals = options.browserGlobals;
    for (const browserGlobal of def.filter(
      (x) => browserGlobals === true || browserGlobals.includes(x as any)
    )) {
      await applyPartial(`browser-globals/${browserGlobal}`, config);
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

export default generateBundlerConfig;
