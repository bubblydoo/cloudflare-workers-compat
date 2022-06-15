import { workerDeno_build } from "../../deno-worker-compat";

globalThis.Deno = globalThis.Deno || {};

Object.defineProperty(globalThis.Deno, 'build', { get: function() { return workerDeno_build; } });
