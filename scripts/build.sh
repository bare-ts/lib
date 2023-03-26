#!/bin/sh
set -eu

# build ESM
esbuild src/*.ts src/*/*.ts --platform=neutral --outdir=dist --log-level=warning

# build .d.ts
tsc --build src

# build CommonJS (fallback)
esbuild src/index.ts --bundle --platform=node > dist/index.cjs

cp -f dist/index.d.ts dist/index.d.cts
