#!/bin/sh

# build .d.ts
npx tsc --build src

# build CommonJS
npx esbuild src/index.ts src/util/assert.ts \
    --bundle \
    --platform='node' --main-fields='module' \
    --format='cjs' \
    --outdir='dist' \
    --out-extension:.js=.cjs \
    --log-level='warning'

# build ESM
npx esbuild src/**/*.ts src/*.ts \
    --bundle \
    --external:'*.js' \
    --platform='node' --main-fields='module' \
    --format='esm' \
    --outdir='dist' \
    --sourcemap \
    --log-level='warning'