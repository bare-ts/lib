//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readI8Array,
    readI8FixedArray,
    writeI8Array,
    writeI8FixedArray,
} from "./i8-array.ts"

test("readI8Array", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    assert.deepEqual(readI8Array(bc), Int8Array.of(0x31, 0x42))
    assert.throws(
        () => readI8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    assert.throws(
        () => readI8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeI8Array", () => {
    const bc = fromBytes()
    writeI8Array(bc, Int8Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("readI8FixedArray", () => {
    let bc = fromBytes(0x31, 0x42)
    assert.deepEqual(readI8FixedArray(bc, 2), Int8Array.of(0x31, 0x42))
    assert.throws(
        () => readI8FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0x42)
    assert.throws(
        () => readI8FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeI8FixedArray", () => {
    const bc = fromBytes()
    writeI8FixedArray(bc, Int8Array.of(0x31, 0x42))
    assert.deepEqual(toBytes(bc), [0x31, 0x42])
})
