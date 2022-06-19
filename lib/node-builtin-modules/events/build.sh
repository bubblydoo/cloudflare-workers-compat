#!/bin/bash
cd "$(dirname "$0")"
mkdir -p build
deno bundle mod.ts > build/mod.mjs
node build.mjs