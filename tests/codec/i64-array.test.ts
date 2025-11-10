//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.test.ts"

test("bare.readI64Array", () => {
    let bc = fromBytes(1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.deepEqual(bare.readI64Array(bc), BigInt64Array.of(BigInt(-1)))
    assert.throws(
        () => bare.readI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(2, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.throws(
        () => bare.readI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI64Array", () => {
    const bc = fromBytes()
    bare.writeI64Array(bc, BigInt64Array.of(BigInt(-1)))
    assert.deepEqual(
        toBytes(bc),
        [/* length */ 1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    )
})

test("bare.readI64FixedArray", () => {
    let bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.deepEqual(
        bare.readI64FixedArray(bc, 1),
        BigInt64Array.of(BigInt(-1)),
    )
    assert.throws(
        () => bare.readI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    assert.throws(
        () => bare.readI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI64FixedArray", () => {
    const bc = fromBytes()
    bare.writeI64FixedArray(bc, BigInt64Array.of(BigInt(-1)))
    assert.deepEqual(
        toBytes(bc),
        [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    )
})
