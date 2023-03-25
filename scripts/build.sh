#!/bin/sh
set -eu

# build ESM
esbuild src/*/*.ts src/*.ts \
    --bundle \
    --platform='node' --main-fields='module' \
    --format='esm' \
    --target='es2019' \
    --outdir='dist' \
    --sourcemap \
    --log-level='warning'

# build .d.ts
tsc --build src

# build CommonJS
esbuild src/index.ts \
    --bundle \
    --platform='browser' --main-fields='module' \
    --format='cjs' \
    --target='es2019' \
    --outdir='dist' \
    --out-extension:.js=.cjs \
    --log-level='warning'
