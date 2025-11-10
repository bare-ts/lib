//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import { readData, readFixedData, writeData, writeFixedData } from "./data.ts"

test("readData", () => {
    let bc = fromBytes(/* length */ 2, 42, 21)
    assert.deepEqual(readData(bc), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(/* length */ 3, 42, 21)
    assert.throws(
        () => readData(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes",
    )
})

test("writeData", () => {
    const bc = fromBytes()
    writeData(bc, Uint8Array.of(42, 21).buffer)
    assert.deepEqual(toBytes(bc), [/* length */ 2, 42, 21])
})

test("readFixedData", () => {
    let bc = fromBytes(42, 21)
    assert.deepEqual(readFixedData(bc, 2), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(0x42)
    assert.throws(
        () => readFixedData(bc, 2),
        { name: "BareError", issue: "missing bytes", offset: 0 },
        "missing bytes",
    )
})

test("writeFixedData", () => {
    const bc = fromBytes()
    writeFixedData(bc, Uint8Array.of(42, 21).buffer)
    assert.deepEqual(toBytes(bc), [42, 21])
})
