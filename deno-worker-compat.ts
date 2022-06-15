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

const workerDeno_stat = () => ({ isFile: false });

export {
  workerDeno_build,
  workerDeno_env,
  workerDeno_inspect,
  workerDeno_args,
  workerDeno_execPath,
  workerDeno_stat,
  workerGlobal_process,
  workerConst_processClass,
  workerGlobal_addEventListener,
  workerGlobal_removeEventListener,
};