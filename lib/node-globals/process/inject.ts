import { warnOrThrowIncompatible } from "../../../warn-or-throw-incompatible.js";

export const workerGlobal_process = {
  title: "cloudflare-worker",
  browser: true,
  env: {},
  argv: [],
  version: "", // empty string to avoid regexp issue
  versions: {},
  on: (...args: any[]) => warnOrThrowIncompatible('process.on', args),
  addListener: (...args: any[]) => warnOrThrowIncompatible('process.addListener', args),
  once: (...args: any[]) => warnOrThrowIncompatible('process.once', args),
  off: (...args: any[]) => warnOrThrowIncompatible('process.off', args),
  removeListener:  (...args: any[]) => warnOrThrowIncompatible('process.removeListener', args),
  removeAllListeners: (...args: any[]) => warnOrThrowIncompatible('process.removeAllListeners', args),
  emit: (...args: any[]) => warnOrThrowIncompatible('process.emit', args),
  prependListener: (...args: any[]) => warnOrThrowIncompatible('process.prependListener', args),
  prependOnceListener:  (...args: any[]) => warnOrThrowIncompatible('process.prependOnceListener', args),
  eventNames: () => {
    warnOrThrowIncompatible('process.prependOnceListener');
    return [];
  },
  listeners: (...args: any[]) => {
    warnOrThrowIncompatible('process.listeners', args);
    return [];
  },
  binding: (...args: any[]) => warnOrThrowIncompatible('process.binding', args),
  cwd: () => {
    warnOrThrowIncompatible('process.cwd');
    return "/";
  },
  chdir: (...args: any[]) => warnOrThrowIncompatible('process.chdir', args),
  umask: () => {
    warnOrThrowIncompatible('process.umask');
    return 0;
  },
  nextTick: () => warnOrThrowIncompatible('process.nextTick')
};
