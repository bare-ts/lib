import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeI64Array", (t) => {
    let bc = fromBytes(1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.decodeI64Array(bc), BigInt64Array.of(BigInt(-1)))
    t.throws(
        () => bare.decodeI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(2, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.decodeI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeI64Array", (t) => {
    const bc = fromBytes()
    bare.encodeI64Array(bc, BigInt64Array.of(BigInt(-1)))
    t.deepEqual(
        toBytes(bc),
        [/* length */ 1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
    )
})

test("bare.decodeI64FixedArray", (t) => {
    let bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.decodeI64FixedArray(bc, 1), BigInt64Array.of(BigInt(-1)))
    t.throws(
        () => bare.decodeI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.decodeI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeI64FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeI64FixedArray(bc, BigInt64Array.of(BigInt(-1)), 1)
    t.deepEqual(toBytes(bc), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    t.throws(
        () => bare.encodeI64FixedArray(bc, BigInt64Array.of(BigInt(-1)), 2),
        { name: "AssertionError" },
        "unmatched length"
    )
})
