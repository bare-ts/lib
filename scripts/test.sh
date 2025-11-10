#!/bin/sh
set -eu

. scripts/build.sh

# unit tests
env NODE_ENV=development node --test

# lint
biome ci .

# type check
tsc --build tests
