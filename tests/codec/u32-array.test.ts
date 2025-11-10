//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.test.ts"

test("bare.readU32Array", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.deepEqual(bare.readU32Array(bc), Uint32Array.of(0x31, 0x42))
    assert.throws(
        () => bare.readU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.throws(
        () => bare.readU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU32Array", () => {
    const bc = fromBytes()
    bare.writeU32Array(bc, Uint32Array.of(0x31, 0x42))
    assert.deepEqual(
        toBytes(bc),
        [/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0],
    )
})

test("bare.readU32FixedArray", () => {
    let bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.deepEqual(bare.readU32FixedArray(bc, 2), Uint32Array.of(0x31, 0x42))
    assert.throws(
        () => bare.readU32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.throws(
        () => bare.readU32FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU32FixedArray", () => {
    const bc = fromBytes()
    bare.writeU32FixedArray(bc, Uint32Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0x42, 0, 0, 0])
})
