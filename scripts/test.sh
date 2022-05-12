#!/bin/sh
set -eu

sh scripts/build.sh "$@"

# type check
npx tsc --build tests

# unit tests
oletus tests/*/*.test.js

# style check
npx prettier --loglevel 'warn' --check src/ tests/ *.md *.json
