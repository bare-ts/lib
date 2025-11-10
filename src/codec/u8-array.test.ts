//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { ByteCursor } from "../core/byte-cursor.ts"
import { Config } from "../core/config.ts"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readU8Array,
    readU8FixedArray,
    writeU8Array,
    writeU8FixedArray,
} from "./u8-array.ts"

test("readU8Array", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    assert.deepEqual(readU8Array(bc), Uint8Array.of(0x31, 0x42))
    assert.throws(
        () => readU8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    assert.throws(
        () => readU8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU8Array", () => {
    const bc = fromBytes()
    writeU8Array(bc, Uint8Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("readU8FixedArray", () => {
    let bc = fromBytes(0x31, 0x42)
    assert.deepEqual(readU8FixedArray(bc, 2), Uint8Array.of(0x31, 0x42))
    assert.throws(
        () => readU8FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0x42)
    assert.throws(
        () => readU8FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU8FixedArray", () => {
    let bc = fromBytes()
    writeU8FixedArray(bc, Uint8Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [0x31, 0x42])

    const bytes = Uint8Array.of(42, 0)
    bc = new ByteCursor(bytes.subarray(1), Config({}))
    writeU8FixedArray(bc, Uint8Array.of(24))
    assert.deepEqual(Array.from(bytes), [42, 24])
})
