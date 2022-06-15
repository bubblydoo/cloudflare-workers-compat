const define = {
  "Deno.build": "workerDeno_build",
  "Deno.env": "workerDeno_env",
  "Deno.inspect": "workerDeno_inspect",
  "Deno.args": "workerDeno_args",
  "Deno.execPath": "workerDeno_execPath",
  "Deno.stat": "workerDeno_stat",
  "Process": "workerConst_processClass",
  "globalThis.addEventListener": "workerGlobal_addEventListener",
  "globalThis.removeEventListener": "workerGlobal_removeEventListener"
}

export default define;