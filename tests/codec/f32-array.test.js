import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.readF32Array", (t) => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0)
    t.deepEqual(bare.readF32Array(bc), Float32Array.of(0))
    t.throws(
        () => bare.readF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0)
    t.throws(
        () => bare.readF32Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.writeF32Array", (t) => {
    const bc = fromBytes()
    bare.writeF32Array(bc, Float32Array.of(0))
    t.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0])
})

test("bare.readF32FixedArray", (t) => {
    let bc = fromBytes(0, 0, 0, 0)
    t.deepEqual(bare.readF32FixedArray(bc, 1), Float32Array.of(0))
    t.throws(
        () => bare.readF32FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0, 0, 0, 0)
    t.throws(
        () => bare.readF32FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.writeF32FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeF32FixedArray(bc, Float32Array.of(0))
    t.deepEqual(toBytes(bc), [0, 0, 0, 0])
})
