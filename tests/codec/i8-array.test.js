import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeI8Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    t.deepEqual(bare.decodeI8Array(bc), Int8Array.of(0x31, 0x42))
    t.throws(
        () => bare.decodeI8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    t.throws(
        () => bare.decodeI8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeI8Array", (t) => {
    const bc = fromBytes()
    bare.encodeI8Array(bc, Int8Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("bare.decodeI8FixedArray", (t) => {
    let bc = fromBytes(0x31, 0x42)
    t.deepEqual(bare.decodeI8FixedArray(bc, 2), Int8Array.of(0x31, 0x42))
    t.throws(
        () => bare.decodeI8FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x31, 0x42)
    t.throws(
        () => bare.decodeI8FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeI8FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeI8FixedArray(bc, Int8Array.of(0x31, 0x42), 2)
    t.deepEqual(toBytes(bc), [0x31, 0x42])
    t.throws(
        () => bare.encodeI8FixedArray(bc, Int8Array.of(0x31, 0x42), 1),
        { name: "AssertionError" },
        "unmatched length"
    )
})
