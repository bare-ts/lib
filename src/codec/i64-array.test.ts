//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readI64Array,
    readI64FixedArray,
    writeI64Array,
    writeI64FixedArray,
} from "./i64-array.ts"

test("readI64Array", () => {
    let bc = fromBytes(1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.deepEqual(readI64Array(bc), BigInt64Array.of(BigInt(-1)))
    assert.throws(
        () => readI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(2, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.throws(
        () => readI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeI64Array", () => {
    const bc = fromBytes()
    writeI64Array(bc, BigInt64Array.of(BigInt(-1)))
    assert.deepEqual(
        toBytes(bc),
        [/* length */ 1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    )
})

test("readI64FixedArray", () => {
    let bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.deepEqual(readI64FixedArray(bc, 1), BigInt64Array.of(BigInt(-1)))
    assert.throws(
        () => readI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.throws(
        () => readI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeI64FixedArray", () => {
    const bc = fromBytes()
    writeI64FixedArray(bc, BigInt64Array.of(BigInt(-1)))
    assert.deepEqual(
        toBytes(bc),
        [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    )
})
