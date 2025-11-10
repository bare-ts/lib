//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readU8ClampedArray", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    t.deepEqual(bare.readU8ClampedArray(bc), Uint8ClampedArray.of(0x31, 0x42))
    t.throws(
        () => bare.readU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    t.throws(
        () => bare.readU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU8ClampedArray", (t) => {
    const bc = fromBytes()
    bare.writeU8ClampedArray(bc, Uint8ClampedArray.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("bare.readU8FixedArray", (t) => {
    let bc = fromBytes(0x31, 0x42)
    t.deepEqual(
        bare.readU8ClampedFixedArray(bc, 2),
        Uint8ClampedArray.of(0x31, 0x42),
    )
    t.throws(
        () => bare.readU8ClampedFixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0x42)
    t.throws(
        () => bare.readU8ClampedFixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU8FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeU8ClampedFixedArray(bc, Uint8ClampedArray.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [0x31, 0x42])
})
