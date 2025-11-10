//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readU16Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0x42, 0)
    t.deepEqual(bare.readU16Array(bc), Uint16Array.of(0x31, 0x42))
    t.throws(
        () => bare.readU16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0x42, 0)
    t.throws(
        () => bare.readU16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU16Array", (t) => {
    const bc = fromBytes()
    bare.writeU16Array(bc, Uint16Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0, 0x42, 0])
})

test("bare.readU16FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0x42, 0)
    t.deepEqual(bare.readU16FixedArray(bc, 2), Uint16Array.of(0x31, 0x42))
    t.throws(
        () => bare.readU16FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0x42, 0)
    t.throws(
        () => bare.readU16FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU16FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeU16FixedArray(bc, Uint16Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [0x31, 0, 0x42, 0])
})
