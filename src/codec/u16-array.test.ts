//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readU16Array,
    readU16FixedArray,
    writeU16Array,
    writeU16FixedArray,
} from "./u16-array.ts"

test("readU16Array", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0x42, 0)
    assert.deepEqual(readU16Array(bc), Uint16Array.of(0x31, 0x42))
    assert.throws(
        () => readU16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0x42, 0)
    assert.throws(
        () => readU16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU16Array", () => {
    const bc = fromBytes()
    writeU16Array(bc, Uint16Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0, 0x42, 0])
})

test("readU16FixedArray", () => {
    let bc = fromBytes(0x31, 0, 0x42, 0)
    assert.deepEqual(readU16FixedArray(bc, 2), Uint16Array.of(0x31, 0x42))
    assert.throws(
        () => readU16FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0x42, 0)
    assert.throws(
        () => readU16FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU16FixedArray", () => {
    const bc = fromBytes()
    writeU16FixedArray(bc, Uint16Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [0x31, 0, 0x42, 0])
})
