import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeF64Array", (t) => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(bare.decodeF64Array(bc), Float64Array.of(0))
    t.throws(
        () => bare.decodeF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.decodeF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeF64Array", (t) => {
    const bc = fromBytes()
    bare.encodeF64Array(bc, Float64Array.of(0))
    t.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0])
})

test("bare.decodeF64FixedArray", (t) => {
    let bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(bare.decodeF64FixedArray(bc, 1), Float64Array.of(0))
    t.throws(
        () => bare.decodeF64FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.decodeF64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeF64FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeF64FixedArray(bc, Float64Array.of(0), 1)
    t.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0, 0])
    t.throws(
        () => bare.encodeF64FixedArray(bc, Float64Array.of(0), 2),
        { name: "AssertionError" },
        "unmatched length"
    )
})
