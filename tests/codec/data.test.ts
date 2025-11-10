//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.test.ts"

test("bare.readData", () => {
    let bc = fromBytes(/* length */ 2, 42, 21)
    assert.deepEqual(bare.readData(bc), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(/* length */ 3, 42, 21)
    assert.throws(
        () => bare.readData(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes",
    )
})

test("bare.writeData", () => {
    const bc = fromBytes()
    bare.writeData(bc, Uint8Array.of(42, 21).buffer)
    assert.deepEqual(toBytes(bc), [/* length */ 2, 42, 21])
})

test("bare.readFixedData", () => {
    let bc = fromBytes(42, 21)
    assert.deepEqual(bare.readFixedData(bc, 2), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(0x42)
    assert.throws(
        () => bare.readFixedData(bc, 2),
        { name: "BareError", issue: "missing bytes", offset: 0 },
        "missing bytes",
    )
})

test("bare.writeFixedData", () => {
    const bc = fromBytes()
    bare.writeFixedData(bc, Uint8Array.of(42, 21).buffer)
    assert.deepEqual(toBytes(bc), [42, 21])
})
