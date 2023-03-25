#!/bin/sh

. scripts/build.sh

# unit tests
env NODE_ENV=development oletus tests/*/*.test.js

# lint
rome ci src tests

# type check
tsc --build tests
