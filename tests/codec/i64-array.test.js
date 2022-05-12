import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readI64Array", (t) => {
    let bc = fromBytes(1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.readI64Array(bc), BigInt64Array.of(BigInt(-1)))
    t.throws(
        () => bare.readI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(2, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.readI64Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI64Array", (t) => {
    const bc = fromBytes()
    bare.writeI64Array(bc, BigInt64Array.of(BigInt(-1)))
    t.deepEqual(
        toBytes(bc),
        [/* length */ 1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    )
})

test("bare.readI64FixedArray", (t) => {
    let bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.deepEqual(bare.readI64FixedArray(bc, 1), BigInt64Array.of(BigInt(-1)))
    t.throws(
        () => bare.readI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
    t.throws(
        () => bare.readI64FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeI64FixedArray", (t) => {
    const bc = fromBytes()
    bare.writeI64FixedArray(bc, BigInt64Array.of(BigInt(-1)))
    t.deepEqual(toBytes(bc), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
})
