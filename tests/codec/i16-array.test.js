import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readI16Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0xff, 0xff)
    t.deepEqual(bare.readI16Array(bc), Int16Array.of(0x31, -1))
    t.throws(
        () => bare.readI16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0xff, 0xff)
    t.throws(
        () => bare.readI16Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI16Array", (t) => {
    const bc = fromBytes()
    bare.writeI16Array(bc, Int16Array.of(0x31, -1))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0, 0xff, 0xff])
})

test("bare.readI16FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0xff, 0xff)
    t.deepEqual(bare.readI16FixedArray(bc, 2), Int16Array.of(0x31, -1))
    t.throws(
        () => bare.readI16FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0xff, 0xff)
    t.throws(
        () => bare.readI16FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI16FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeI16FixedArray(bc, Int16Array.of(0x31, -1))
    t.deepEqual(toBytes(bc), [0x31, 0, 0xff, 0xff])
})
