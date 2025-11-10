//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readU64Array,
    readU64FixedArray,
    writeU64Array,
    writeU64FixedArray,
} from "./u64-array.ts"

test("readU64Array", () => {
    let bc = fromBytes(/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(readU64Array(bc), BigUint64Array.of(BigInt(0x31)))
    assert.throws(
        () => readU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => readU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU64Array", () => {
    const bc = fromBytes()
    writeU64Array(bc, BigUint64Array.of(BigInt(0x31)))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0])
})

test("readU64FixedArray", () => {
    let bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(readU64FixedArray(bc, 1), BigUint64Array.of(BigInt(0x31)))
    assert.throws(
        () => readU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => readU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeU64FixedArray", () => {
    const bc = fromBytes()
    writeU64FixedArray(bc, BigUint64Array.of(BigInt(0x31)))
    assert.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0, 0, 0, 0])
})
