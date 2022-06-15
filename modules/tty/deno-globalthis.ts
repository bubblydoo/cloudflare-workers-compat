import { workerDeno_args } from "../../deno-worker-compat";

globalThis.Deno = globalThis.Deno || {};

Object.defineProperty(globalThis.Deno, 'args', { get: function() { return workerDeno_args; } });
