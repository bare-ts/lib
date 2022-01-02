import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeU64Array", (t) => {
    let bc = fromBytes(/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(bare.decodeU64Array(bc), BigUint64Array.of(BigInt(0x31)))
    t.throws(
        () => bare.decodeU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.decodeU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeU64Array", (t) => {
    const bc = fromBytes()
    bare.encodeU64Array(bc, BigUint64Array.of(BigInt(0x31)))
    t.deepEqual(toBytes(bc), [/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0])
})

test("bare.decodeU64FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(
        bare.decodeU64FixedArray(bc, 1),
        BigUint64Array.of(BigInt(0x31))
    )
    t.throws(
        () => bare.decodeU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.decodeU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeU64FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeU64FixedArray(bc, BigUint64Array.of(BigInt(0x31)), 1)
    t.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0, 0, 0, 0])
    t.throws(
        () => bare.encodeU64FixedArray(bc, BigUint64Array.of(BigInt(0x31)), 2),
        { name: "AssertionError" },
        "unmatched length"
    )
})
