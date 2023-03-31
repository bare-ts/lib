#!/bin/sh
set -eu

. scripts/build.sh

# unit tests
env NODE_ENV=development oletus tests/*/*.test.js

# lint
rome ci .

# type check
tsc --build tests
