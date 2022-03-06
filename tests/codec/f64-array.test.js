import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.readF64Array", (t) => {
    let bc = fromBytes(/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(bare.readF64Array(bc), Float64Array.of(0))
    t.throws(
        () => bare.readF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 2, 0, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.readF64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.writeF64Array", (t) => {
    let bc = fromBytes()
    bare.writeF64Array(bc, Float64Array.of(0))
    t.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0, 0, 0, 0, 0])

    bc = fromBytes()
    bare.writeF64Array(bc, Float64Array.of(Number.NaN))
    t.deepEqual(toBytes(bc), [/* length */ 1, 0, 0, 0, 0, 0, 0, 0xf8, 0x7f])
})

test("bare.readF64FixedArray", (t) => {
    let bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(bare.readF64FixedArray(bc, 1), Float64Array.of(0))
    t.throws(
        () => bare.readF64FixedArray(bc, 1),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.readF64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.writeF64FixedArray", (t) => {
    let bc = fromBytes()
    bare.writeF64FixedArray(bc, Float64Array.of(0))
    t.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0, 0])

    bc = fromBytes()
    bare.writeF64FixedArray(bc, Float64Array.of(Number.NaN))
    t.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0xf8, 0x7f])
})
