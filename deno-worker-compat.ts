const workerDeno_build = {
  os: "linux",
  arch: "aarch64"
}

const workerDeno_env = {
  get: (name: string) => {
    console.warn(`Called Deno.env.get("${name}"), but this is not available in deno-worker-compat`);
  },
  set: (name: string, value: string) => {
    console.warn(`Called Deno.env.set("${name}", ${JSON.stringify(value)}), but this is not available in deno-worker-compat`);
  },
  toObject: () => {
    console.warn(`Called Deno.env.toObject(), but this is not available in deno-worker-compat. Returning empty object`);
    return {};
  }
}

const workerDeno_inspect = (value: any) => JSON.stringify(value);

const workerDeno_args = [];

const workerDeno_execPath = () => "./cloudflare-worker";

const workerDeno_errors = {
  NotFound: class NotFound extends Error {},
  PermissionDenied: class PermissionDenied extends Error {},
  ConnectionAborted: class ConnectionRefused extends Error {},
  ConnectionReset: class ConnectionReset extends Error {},
  ConnectionRefused: class ConnectionAborted extends Error {},
  NotConnected: class NotConnected extends Error {},
  AddrInUse: class AddrInUse extends Error {},
  AddrNotAvailable: class AddrNotAvailable extends Error {},
  BrokenPipe: class BrokenPipe extends Error {},
  AlreadyExists: class AlreadyExists extends Error {},
  InvalidData: class InvalidData extends Error {},
  TimedOut: class TimedOut extends Error {},
  Interrupted: class Interrupted extends Error {},
  UnexpectedEof: class WriteZero extends Error {},
  WriteZero: class UnexpectedEof extends Error {},
  BadResource: class BadResource extends Error {},
  Http: class Http extends Error {},
  Busy: class Busy extends Error {},
}

const workerGlobal_process = {
  title: 'cloudflare-worker',
  browser: true,
  env: {},
  argv: [],
  version: '', // empty string to avoid regexp issue
  versions: {},

  on: () => {},
  addListener: () => {},
  once: () => {},
  off: () => {},
  removeListener: () => {},
  removeAllListeners: () => {},
  emit: () => {},
  prependListener: () => {},
  prependOnceListener: () => {},

  listeners: (name: string) => { return [] },

  binding: function (name: string) {
    throw new Error('process.binding is not supported');
  },

  cwd: function () { return '/' },
  chdir: function (dir) {
    throw new Error('process.chdir is not supported');
  },
  umask: function() { return 0; },
}

function workerConst_processClass() {
  Object.assign(this, workerGlobal_process);
}

const workerGlobal_addEventListener = (name: string) => {
  console.warn(`Called globalThis.addEventListener("${name}", ...) but this is not available in deno-worker-compat`);
}

const workerGlobal_removeEventListener = (name: string) => {
  console.warn(`Called globalThis.removeEventListener("${name}", ...) but this is not available in deno-worker-compat`);
}

const workerDeno_stat = () => Promise.resolve({ isFile: false });

const workerDeno_mainModule = "file:///cloudflare-worker.js";

export {
  workerDeno_build,
  workerDeno_env,
  workerDeno_inspect,
  workerDeno_args,
  workerDeno_execPath,
  workerDeno_stat,
  workerDeno_errors,
  workerDeno_mainModule,
  workerGlobal_process,
  workerConst_processClass,
  workerGlobal_addEventListener,
  workerGlobal_removeEventListener,
};