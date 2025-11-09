#!/bin/sh
set -eu

. scripts/build.sh

# unit tests
env NODE_ENV=development oletus tests/*/*.test.js

# lint
biome ci .

# type check
tsc --build tests
