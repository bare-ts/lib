//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readF64Array", () => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(bare.readF64Array(bc), Float64Array.of(0))
    assert.throws(
        () => bare.readF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => bare.readF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeF64Array", () => {
    let bc = fromBytes()
    bare.writeF64Array(bc, Float64Array.of(0))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0])

    bc = fromBytes()
    bare.writeF64Array(bc, Float64Array.of(Number.NaN))
    assert.deepEqual(
        toBytes(bc),
        [/* length */ 1, 0, 0, 0, 0, 0, 0, 0xf8, 0x7f],
    )
})

test("bare.readF64FixedArray", () => {
    let bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(bare.readF64FixedArray(bc, 1), Float64Array.of(0))
    assert.throws(
        () => bare.readF64FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => bare.readF64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeF64FixedArray", () => {
    let bc = fromBytes()
    bare.writeF64FixedArray(bc, Float64Array.of(0))
    assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0, 0])

    bc = fromBytes()
    bare.writeF64FixedArray(bc, Float64Array.of(Number.NaN))
    assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0xf8, 0x7f])
})
