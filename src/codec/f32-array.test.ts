//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readF32Array,
    readF32FixedArray,
    writeF32Array,
    writeF32FixedArray,
} from "./f32-array.ts"

test("readF32Array", () => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0)
    assert.deepEqual(readF32Array(bc), Float32Array.of(0))
    assert.throws(
        () => readF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0)
    assert.throws(
        () => readF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeF32Array", () => {
    let bc = fromBytes()
    writeF32Array(bc, Float32Array.of(0))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0])

    bc = fromBytes()
    writeF32Array(bc, Float32Array.of(Number.NaN))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0xc0, 0x7f])
})

test("readF32FixedArray", () => {
    let bc = fromBytes(0, 0, 0, 0)
    assert.deepEqual(readF32FixedArray(bc, 1), Float32Array.of(0))
    assert.throws(
        () => readF32FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0, 0, 0, 0)
    assert.throws(
        () => readF32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeF32FixedArray", () => {
    let bc = fromBytes()
    writeF32FixedArray(bc, Float32Array.of(0))
    assert.deepEqual(toBytes(bc), [0, 0, 0, 0])

    bc = fromBytes()
    writeF32FixedArray(bc, Float32Array.of(Number.NaN))
    assert.deepEqual(toBytes(bc), [0, 0, 0xc0, 0x7f])
})
