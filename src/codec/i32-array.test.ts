//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readI32Array,
    readI32FixedArray,
    writeI32Array,
    writeI32FixedArray,
} from "./i32-array.ts"

test("readI32Array", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    assert.deepEqual(readI32Array(bc), Int32Array.of(0x31, -1))
    assert.throws(
        () => readI32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    assert.throws(
        () => readI32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeI32Array", () => {
    const bc = fromBytes()
    writeI32Array(bc, Int32Array.of(0x31, -1))
    assert.deepEqual(
        toBytes(bc),
        [/* length */ 2, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff],
    )
})

test("readI32FixedArray", () => {
    let bc = fromBytes(0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    assert.deepEqual(readI32FixedArray(bc, 2), Int32Array.of(0x31, -1))
    assert.throws(
        () => readI32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    assert.throws(
        () => readI32FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeI32FixedArray", () => {
    const bc = fromBytes()
    writeI32FixedArray(bc, Int32Array.of(0x31, -1))
    assert.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff])
})
