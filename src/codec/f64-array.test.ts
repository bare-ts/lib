//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readF64Array,
    readF64FixedArray,
    writeF64Array,
    writeF64FixedArray,
} from "./f64-array.ts"

test("readF64Array", () => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(readF64Array(bc), Float64Array.of(0))
    assert.throws(
        () => readF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => readF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeF64Array", () => {
    let bc = fromBytes()
    writeF64Array(bc, Float64Array.of(0))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0])

    bc = fromBytes()
    writeF64Array(bc, Float64Array.of(Number.NaN))
    assert.deepEqual(
        toBytes(bc),
        [/* length */ 1, 0, 0, 0, 0, 0, 0, 0xf8, 0x7f],
    )
})

test("readF64FixedArray", () => {
    let bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(readF64FixedArray(bc, 1), Float64Array.of(0))
    assert.throws(
        () => readF64FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => readF64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeF64FixedArray", () => {
    let bc = fromBytes()
    writeF64FixedArray(bc, Float64Array.of(0))
    assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0, 0])

    bc = fromBytes()
    writeF64FixedArray(bc, Float64Array.of(Number.NaN))
    assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0xf8, 0x7f])
})
