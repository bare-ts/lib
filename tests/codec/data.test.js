import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeData", (t) => {
    let bc = fromBytes(/* length */ 2, 42, 21)
    t.deepEqual(bare.decodeData(bc), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(/* length */ 3, 42, 21)
    t.throws(
        () => bare.decodeData(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes"
    )
})

test("bare.encodeData", (t) => {
    const bc = fromBytes()
    bare.encodeData(bc, Uint8Array.of(42, 21).buffer)
    t.deepEqual(toBytes(bc), [/* length */ 2, 42, 21])
})

test("bare.decodeFixedData", (t) => {
    let bc = fromBytes(42, 21)
    t.deepEqual(bare.decodeFixedData(bc, 2), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(0x42)
    t.throws(
        () => bare.decodeFixedData(bc, 2),
        { name: "BareError", issue: "missing bytes", offset: 0 },
        "missing bytes"
    )
})

test("bare.encodeFixedData", (t) => {
    let bc = fromBytes()
    bare.encodeFixedData(bc, Uint8Array.of(42, 21).buffer, 2)
    t.deepEqual(toBytes(bc), [42, 21])

    bc = fromBytes()
    const data = Uint8Array.of(0, 0, 42, 21, 0, 0)
    bare.encodeFixedData(bc, data.subarray(2, 4), 2)
    t.deepEqual(toBytes(bc), [42, 21], "encoded subarray")
})
