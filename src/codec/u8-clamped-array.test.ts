//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readU8ClampedArray,
    readU8ClampedFixedArray,
    writeU8ClampedArray,
    writeU8ClampedFixedArray,
} from "./u8-clamped-array.ts"

test("readU8ClampedArray", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    assert.deepEqual(readU8ClampedArray(bc), Uint8ClampedArray.of(0x31, 0x42))
    assert.throws(
        () => readU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    assert.throws(
        () => readU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU8ClampedArray", () => {
    const bc = fromBytes()
    writeU8ClampedArray(bc, Uint8ClampedArray.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("readU8FixedArray", () => {
    let bc = fromBytes(0x31, 0x42)
    assert.deepEqual(
        readU8ClampedFixedArray(bc, 2),
        Uint8ClampedArray.of(0x31, 0x42),
    )
    assert.throws(
        () => readU8ClampedFixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0x42)
    assert.throws(
        () => readU8ClampedFixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU8FixedArray", () => {
    const bc = fromBytes()
    writeU8ClampedFixedArray(bc, Uint8ClampedArray.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [0x31, 0x42])
})
