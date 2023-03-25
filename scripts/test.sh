#!/bin/sh

. scripts/build.sh

# unit tests
oletus tests/*/*.test.js

# lint
rome ci src tests

# type check
tsc --build tests
