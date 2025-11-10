//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readI16Array", () => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0xff, 0xff)
    assert.deepEqual(bare.readI16Array(bc), Int16Array.of(0x31, -1))
    assert.throws(
        () => bare.readI16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0xff, 0xff)
    assert.throws(
        () => bare.readI16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI16Array", () => {
    const bc = fromBytes()
    bare.writeI16Array(bc, Int16Array.of(0x31, -1))
    assert.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0, 0xff, 0xff])
})

test("bare.readI16FixedArray", () => {
    let bc = fromBytes(0x31, 0, 0xff, 0xff)
    assert.deepEqual(bare.readI16FixedArray(bc, 2), Int16Array.of(0x31, -1))
    assert.throws(
        () => bare.readI16FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0xff, 0xff)
    assert.throws(
        () => bare.readI16FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI16FixedArray", () => {
    const bc = fromBytes()
    bare.writeI16FixedArray(bc, Int16Array.of(0x31, -1))
    assert.deepEqual(toBytes(bc), [0x31, 0, 0xff, 0xff])
})
