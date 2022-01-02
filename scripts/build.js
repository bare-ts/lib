#!/usr/bin/node

import esbuild from "esbuild"
import process from "node:process"

// CJS index
esbuild
    .build({
        bundle: true,
        entryPoints: ["src/index.ts"],
        format: "cjs",
        logLevel: "warning",
        mainFields: ["module"],
        outfile: "dist/index.cjs",
        platform: "node",
        sourcemap: true,
    })
    .catch(() => process.exit(1))

// ESM index
esbuild
    .build({
        bundle: true,
        entryPoints: ["src/index.ts", "src/util/assert.ts"],
        format: "esm",
        logLevel: "warning",
        mainFields: ["module"],
        outdir: "dist",
        platform: "node",
        sourcemap: true,
    })
    .catch(() => process.exit(1))

