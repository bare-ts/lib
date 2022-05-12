import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readU64Array", (t) => {
    let bc = fromBytes(/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(bare.readU64Array(bc), BigUint64Array.of(BigInt(0x31)))
    t.throws(
        () => bare.readU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 2, 0x31, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.readU64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU64Array", (t) => {
    const bc = fromBytes()
    bare.writeU64Array(bc, BigUint64Array.of(BigInt(0x31)))
    t.deepEqual(toBytes(bc), [/* length */ 1, 0x31, 0, 0, 0, 0, 0, 0, 0])
})

test("bare.readU64FixedArray", (t) => {
    let bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    t.deepEqual(bare.readU64FixedArray(bc, 1), BigUint64Array.of(BigInt(0x31)))
    t.throws(
        () => bare.readU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0, 0, 0, 0, 0, 0, 0)
    t.throws(
        () => bare.readU64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU64FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeU64FixedArray(bc, BigUint64Array.of(BigInt(0x31)))
    t.deepEqual(toBytes(bc), [0x31, 0, 0, 0, 0, 0, 0, 0])
})
