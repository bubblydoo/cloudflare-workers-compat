#!/bin/bash
mkdir -p build
deno bundle mod.ts > build/mod.mjs
node build.mjs