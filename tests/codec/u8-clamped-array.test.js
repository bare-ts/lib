import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeU8ClampedArray", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    t.deepEqual(bare.decodeU8ClampedArray(bc), Uint8ClampedArray.of(0x31, 0x42))
    t.throws(
        () => bare.decodeU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    t.throws(
        () => bare.decodeU8ClampedArray(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeU8ClampedArray", (t) => {
    const bc = fromBytes()
    bare.encodeU8ClampedArray(bc, Uint8ClampedArray.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("bare.decodeU8FixedArray", (t) => {
    let bc = fromBytes(0x31, 0x42)
    t.deepEqual(
        bare.decodeU8ClampedFixedArray(bc, 2),
        Uint8ClampedArray.of(0x31, 0x42)
    )
    t.throws(
        () => bare.decodeU8ClampedFixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x31, 0x42)
    t.throws(
        () => bare.decodeU8ClampedFixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeU8FixedArray", (t) => {
    const bc = fromBytes()
    bare.encodeU8ClampedFixedArray(bc, Uint8ClampedArray.of(0x31, 0x42), 2)
    t.deepEqual(toBytes(bc), [0x31, 0x42])
    t.throws(
        () =>
            bare.encodeU8ClampedFixedArray(
                bc,
                Uint8ClampedArray.of(0x31, 0x42),
                1
            ),
        { name: "AssertionError" },
        "unmatched length"
    )
})
