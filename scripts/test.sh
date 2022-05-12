#!/bin/sh
set -eu

sh scripts/build.sh "$@"

# unit tests
npx oletus tests/*/*.test.js

# lint
npx rome ci src tests

# type check
npx tsc --build tests
