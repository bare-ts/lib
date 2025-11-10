//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readU32Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.deepEqual(bare.readU32Array(bc), Uint32Array.of(0x31, 0x42))
    t.throws(
        () => bare.readU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.throws(
        () => bare.readU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU32Array", (t) => {
    const bc = fromBytes()
    bare.writeU32Array(bc, Uint32Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0])
})

test("bare.readU32FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.deepEqual(bare.readU32FixedArray(bc, 2), Uint32Array.of(0x31, 0x42))
    t.throws(
        () => bare.readU32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.throws(
        () => bare.readU32FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU32FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeU32FixedArray(bc, Uint32Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0x42, 0, 0, 0])
})
