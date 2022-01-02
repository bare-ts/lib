import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeF32Array", (t) => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0)
    t.deepEqual(bare.decodeF32Array(bc), Float32Array.of(0))
    t.throws(
        () => bare.decodeF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0)
    t.throws(
        () => bare.decodeF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeF32Array", (t) => {
    const bc = fromBytes()
    bare.encodeF32Array(bc, Float32Array.of(0))
    t.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0])
})

test("bare.decodeF32FixedArray", (t) => {
    let bc = fromBytes(0, 0, 0, 0)
    t.deepEqual(bare.decodeF32FixedArray(bc, 1), Float32Array.of(0))
    t.throws(
        () => bare.decodeF32FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0, 0, 0, 0)
    t.throws(
        () => bare.decodeF32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeF32FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeF32FixedArray(bc, Float32Array.of(0), 1)
    t.deepEqual(toBytes(bc), [0, 0, 0, 0])
    t.throws(
        () => bare.encodeF32FixedArray(bc, Float32Array.of(0), 2),
        { name: "AssertionError" },
        "unmatched length"
    )
})
