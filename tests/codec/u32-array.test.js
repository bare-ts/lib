import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeU32Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.deepEqual(bare.decodeU32Array(bc), Uint32Array.of(0x31, 0x42))
    t.throws(
        () => bare.decodeU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 3, 0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.throws(
        () => bare.decodeU32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeU32Array", (t) => {
    const bc = fromBytes()
    bare.encodeU32Array(bc, Uint32Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0, 0, 0, 0x42, 0, 0, 0])
})

test("bare.decodeU32FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.deepEqual(bare.decodeU32FixedArray(bc, 2), Uint32Array.of(0x31, 0x42))
    t.throws(
        () => bare.decodeU32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x31, 0, 0, 0, 0x42, 0, 0, 0)
    t.throws(
        () => bare.decodeU32FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeU32FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeU32FixedArray(bc, Uint32Array.of(0x31, 0x42), 2)
    t.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0x42, 0, 0, 0])
    t.throws(
        () => bare.encodeU32FixedArray(bc, Uint32Array.of(0x31, 0x42), 1),
        { name: "AssertionError" },
        "unmatched length"
    )
})
