#!/bin/sh
set -eu

# https://node.green/#ES2020
# https://kangax.github.io/compat-table/es2016plus
TARGET=es2020

# build .d.ts
tsc --build src

# build CommonJS (fallback)
esbuild src/index.ts --bundle --target=$TARGET --platform=node > dist/index.cjs

cp -f dist/index.d.ts dist/index.d.cts
