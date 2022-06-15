import resolve from 'resolve';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const suggestedAliasesRelative = {
  assert: "assert",
  buffer: "buffer",
  console: "console-browserify",
  // constants: "constants-browserify",
  crypto: "crypto-browserify",
  events: "events",
  fs: "cloudflare-workers-node-compat/fs",
  // http: "stream-http",
  // https: "https-browserify",
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

export const resolveAliases = (aliases, resolve) => Object.fromEntries(
  Object.entries(aliases).map(([k, v]) => [k, resolve(v)])
);

const require = createRequire(import.meta.url);

export const suggestedAliases = resolveAliases(suggestedAliasesRelative, (spec) => {
  if (spec.startsWith('cloudflare-workers-node-compat')) {
    return require.resolve(spec);
  } else {
    return resolve.sync(spec, { basedir: __filename, includeCoreModules: false });
  }
});