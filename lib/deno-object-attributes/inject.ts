import { warnOrThrowIncompatible } from "../../warn-or-throw-incompatible.js";

const workerDeno_build = {
  os: "linux",
  arch: "aarch64",
};

const workerDeno_env = {
  get: (name: string) => warnOrThrowIncompatible("Deno.env.get", [name]),
  set: (name: string, value: string) =>
    warnOrThrowIncompatible("Deno.env.set", [name, value]),
  toObject: () => {
    warnOrThrowIncompatible("Deno.env.toObject")
    return {};
  },
};

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
};

const workerDeno_stat = (...args: any[]) => {
  warnOrThrowIncompatible("Deno.stat", args);
  return Promise.resolve({ isFile: false });
}

const workerDeno_mainModule = "file:///cloudflare-worker.js";

// from deno/std/node/events
const workerDeno_core = {
  setNextTickCallback: undefined,
  evalContext(_code: string, _filename: string) {
    warnOrThrowIncompatible("Deno.core.evalContext", [_code, _filename])
    throw new Error(
      "Called Deno.core.evalContext(...) but this is not available"
    );
  },
  encode(chunk: string) {
    return new TextEncoder().encode(chunk);
  },
};

const workerDeno_pid = 1;

const workerDeno_cwd = () => {
  warnOrThrowIncompatible("Deno.cwd");
  return "/cloudflare-worker";
}

const workerDeno_chdir = (...args: any[]) =>
  warnOrThrowIncompatible("Deno.chdir", args);

const workerDeno_chown = async (...args: any[]) =>
  warnOrThrowIncompatible("Deno.chown", args);

const workerDeno_chmod = async (...args: any[]) =>
  warnOrThrowIncompatible("Deno.chmod", args);

const workerDeno_isatty = (...args: any[]) => {
  warnOrThrowIncompatible("Deno.isatty", args);
  return false;
}

const workerDeno_version = {
  deno: "0.144.0-cloudflare-worker",
};

const workerDeno_memoryUsage = () => {
  warnOrThrowIncompatible("Deno.memoryUsage");
  return {
    external: 0,
    heapTotal: 0,
    heapUsed: 0,
    rss: 0,
  };
};

const workerDeno_stdin = null;
const workerDeno_stdout = null;
const workerDeno_stderr = null;

export {
  workerDeno_build,
  workerDeno_env,
  workerDeno_inspect,
  workerDeno_args,
  workerDeno_execPath,
  workerDeno_stat,
  workerDeno_errors,
  workerDeno_mainModule,
  workerDeno_core,
  workerDeno_pid,
  workerDeno_cwd,
  workerDeno_chdir,
  workerDeno_version,
  workerDeno_isatty,
  workerDeno_memoryUsage,
  workerDeno_chown,
  workerDeno_chmod,
  workerDeno_stdin,
  workerDeno_stdout,
  workerDeno_stderr,
};
