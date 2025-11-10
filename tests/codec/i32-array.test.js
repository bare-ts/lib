//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readI32Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.readI32Array(bc), Int32Array.of(0x31, -1))
    t.throws(
        () => bare.readI32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.readI32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI32Array", (t) => {
    const bc = fromBytes()
    bare.writeI32Array(bc, Int32Array.of(0x31, -1))
    t.deepEqual(
        toBytes(bc),
        [/* length */ 2, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff],
    )
})

test("bare.readI32FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.readI32FixedArray(bc, 2), Int32Array.of(0x31, -1))
    t.throws(
        () => bare.readI32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.readI32FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI32FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeI32FixedArray(bc, Int32Array.of(0x31, -1))
    t.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff])
})
