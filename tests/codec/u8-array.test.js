import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readU8Array", (t) => {
    let bc = fromBytes(/* length */ 2, 0x31, 0x42)
    t.deepEqual(bare.readU8Array(bc), Uint8Array.of(0x31, 0x42))
    t.throws(
        () => bare.readU8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(/* length */ 3, 0x31, 0x42)
    t.throws(
        () => bare.readU8Array(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU8Array", (t) => {
    const bc = fromBytes()
    bare.writeU8Array(bc, Uint8Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [/* length */ 2, 0x31, 0x42])
})

test("bare.readU8FixedArray", (t) => {
    let bc = fromBytes(0x31, 0x42)
    t.deepEqual(bare.readU8FixedArray(bc, 2), Uint8Array.of(0x31, 0x42))
    t.throws(
        () => bare.readU8FixedArray(bc, 2),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x31, 0x42)
    t.throws(
        () => bare.readU8FixedArray(bc, 3),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeU8FixedArray", (t) => {
    let bc = fromBytes()
    bare.writeU8FixedArray(bc, Uint8Array.of(0x31, 0x42))
    t.deepEqual(toBytes(bc), [0x31, 0x42])

    const bytes = Uint8Array.of(42, 0)
    bc = new bare.ByteCursor(bytes.subarray(1), bare.Config({}))
    bare.writeU8FixedArray(bc, Uint8Array.of(24))
    t.deepEqual(Array.from(bytes), [42, 24])
})
