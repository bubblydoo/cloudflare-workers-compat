# Cloudflare Workers Node Compat

This module is highly experimental, and incomplete.

The goal is to provide shim modules for every builtin Node module, so that you can use existing Node code in Cloudflare Workers.

It compiles Deno's node compatibility layer to modules that are Cloudflare Workers-compatible, or uses other browser-compatible modules.

To use it, use esbuild:

```ts
// build.mjs

import alias from "esbuild-plugin-alias";
import { suggestedAliases } from "cloudflare-workers-node-compat/aliases";

await build({
  ...,
  plugins: [alias(suggestedAliases)]
});
```

Shims are included for:

- `assert` (through `assert`)
- `buffer` (through `buffer`)
- `console` (through `console-browserify`)
- `crypto` (through `crypto-browserify`)
- `events` (through `events`)
- `fs` (empty object)
- `os` (through `os-browserify/browser`)
- `path` (through `path-browserify`)
- `process` (through `https://deno.land/std/node/process.ts`)
- `querystring` (through `qs`)
- `stream` (through `stream-browserify`)
- `string_decoder` (through `https://deno.land/std/node/string_decoder.ts`)
- `timers` (empty object)
- `tty` (through `https://deno.land/std/node/tty.ts`)
- `url` (through `url-shim`)
- `util` (through `https://deno.land/std/node/util.ts`)