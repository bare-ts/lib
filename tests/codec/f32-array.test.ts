//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.test.ts"

test("bare.readF32Array", () => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0)
    assert.deepEqual(bare.readF32Array(bc), Float32Array.of(0))
    assert.throws(
        () => bare.readF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0)
    assert.throws(
        () => bare.readF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeF32Array", () => {
    let bc = fromBytes()
    bare.writeF32Array(bc, Float32Array.of(0))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0])

    bc = fromBytes()
    bare.writeF32Array(bc, Float32Array.of(Number.NaN))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0xc0, 0x7f])
})

test("bare.readF32FixedArray", () => {
    let bc = fromBytes(0, 0, 0, 0)
    assert.deepEqual(bare.readF32FixedArray(bc, 1), Float32Array.of(0))
    assert.throws(
        () => bare.readF32FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0, 0, 0, 0)
    assert.throws(
        () => bare.readF32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeF32FixedArray", () => {
    let bc = fromBytes()
    bare.writeF32FixedArray(bc, Float32Array.of(0))
    assert.deepEqual(toBytes(bc), [0, 0, 0, 0])

    bc = fromBytes()
    bare.writeF32FixedArray(bc, Float32Array.of(Number.NaN))
    assert.deepEqual(toBytes(bc), [0, 0, 0xc0, 0x7f])
})
