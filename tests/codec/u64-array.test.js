//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readU64Array", () => {
    let bc = fromBytes(/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(bare.readU64Array(bc), BigUint64Array.of(BigInt(0x31)))
    assert.throws(
        () => bare.readU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => bare.readU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU64Array", () => {
    const bc = fromBytes()
    bare.writeU64Array(bc, BigUint64Array.of(BigInt(0x31)))
    assert.deepEqual(toBytes(bc), [/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0])
})

test("bare.readU64FixedArray", () => {
    let bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.deepEqual(
        bare.readU64FixedArray(bc, 1),
        BigUint64Array.of(BigInt(0x31)),
    )
    assert.throws(
        () => bare.readU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    assert.throws(
        () => bare.readU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU64FixedArray", () => {
    const bc = fromBytes()
    bare.writeU64FixedArray(bc, BigUint64Array.of(BigInt(0x31)))
    assert.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0, 0, 0, 0])
})
