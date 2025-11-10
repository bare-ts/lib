//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.test.ts"

test("bare.readU8ClampedArray", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    assert.deepEqual(
        bare.readU8ClampedArray(bc),
        Uint8ClampedArray.of(0x31, 0x42),
    )
    assert.throws(
        () => bare.readU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    assert.throws(
        () => bare.readU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU8ClampedArray", () => {
    const bc = fromBytes()
    bare.writeU8ClampedArray(bc, Uint8ClampedArray.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("bare.readU8FixedArray", () => {
    let bc = fromBytes(0x31, 0x42)
    assert.deepEqual(
        bare.readU8ClampedFixedArray(bc, 2),
        Uint8ClampedArray.of(0x31, 0x42),
    )
    assert.throws(
        () => bare.readU8ClampedFixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0x42)
    assert.throws(
        () => bare.readU8ClampedFixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU8FixedArray", () => {
    const bc = fromBytes()
    bare.writeU8ClampedFixedArray(bc, Uint8ClampedArray.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [0x31, 0x42])
})
