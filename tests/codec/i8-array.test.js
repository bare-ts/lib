//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readI8Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    t.deepEqual(bare.readI8Array(bc), Int8Array.of(0x31, 0x42))
    t.throws(
        () => bare.readI8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    t.throws(
        () => bare.readI8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI8Array", (t) => {
    const bc = fromBytes()
    bare.writeI8Array(bc, Int8Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("bare.readI8FixedArray", (t) => {
    let bc = fromBytes(0x31, 0x42)
    t.deepEqual(bare.readI8FixedArray(bc, 2), Int8Array.of(0x31, 0x42))
    t.throws(
        () => bare.readI8FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0x42)
    t.throws(
        () => bare.readI8FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI8FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeI8FixedArray(bc, Int8Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [0x31, 0x42])
})
