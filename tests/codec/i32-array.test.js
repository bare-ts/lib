import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeI32Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.decodeI32Array(bc), Int32Array.of(0x31, -1))
    t.throws(
        () => bare.decodeI32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.decodeI32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeI32Array", (t) => {
    const bc = fromBytes()
    bare.encodeI32Array(bc, Int32Array.of(0x31, -1))
    t.deepEqual(
        toBytes(bc),
        [/* length */ 2, 0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff]
    )
})

test("bare.decodeI32FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.decodeI32FixedArray(bc, 2), Int32Array.of(0x31, -1))
    t.throws(
        () => bare.decodeI32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.decodeI32FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeI32FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeI32FixedArray(bc, Int32Array.of(0x31, -1), 2)
    t.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0xff, 0xff, 0xff, 0xff])
    t.throws(
        () => bare.encodeI32FixedArray(bc, Int32Array.of(0x31, -1), 1),
        { name: "AssertionError" },
        "unmatched length"
    )
})
