//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readU32Array,
    readU32FixedArray,
    writeU32Array,
    writeU32FixedArray,
} from "./u32-array.ts"

test("readU32Array", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.deepEqual(readU32Array(bc), Uint32Array.of(0x31, 0x42))
    assert.throws(
        () => readU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.throws(
        () => readU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU32Array", () => {
    const bc = fromBytes()
    writeU32Array(bc, Uint32Array.of(0x31, 0x42))
    assert.deepEqual(
        toBytes(bc),
        [/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0],
    )
})

test("readU32FixedArray", () => {
    let bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.deepEqual(readU32FixedArray(bc, 2), Uint32Array.of(0x31, 0x42))
    assert.throws(
        () => readU32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    assert.throws(
        () => readU32FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU32FixedArray", () => {
    const bc = fromBytes()
    writeU32FixedArray(bc, Uint32Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0x42, 0, 0, 0])
})
