import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.readData", (t) => {
    let bc = fromBytes(/* length */ 2, 42, 21)
    t.deepEqual(bare.readData(bc), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(/* length */ 3, 42, 21)
    t.throws(
        () => bare.readData(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes"
    )
})

test("bare.writeData", (t) => {
    const bc = fromBytes()
    bare.writeData(bc, Uint8Array.of(42, 21).buffer)
    t.deepEqual(toBytes(bc), [/* length */ 2, 42, 21])
})

test("bare.readFixedData", (t) => {
    let bc = fromBytes(42, 21)
    t.deepEqual(bare.readFixedData(bc, 2), Uint8Array.of(42, 21).buffer)

    bc = fromBytes(0x42)
    t.throws(
        () => bare.readFixedData(bc, 2),
        { name: "BareError", issue: "missing bytes", offset: 0 },
        "missing bytes"
    )
})

test("bare.writeFixedData", (t) => {
    let bc = fromBytes()
    bare.writeFixedData(bc, Uint8Array.of(42, 21).buffer)
    t.deepEqual(toBytes(bc), [42, 21])

    bc = fromBytes()
    const data = Uint8Array.of(0, 0, 42, 21, 0, 0)
    bare.writeFixedData(bc, data.subarray(2, 4))
    t.deepEqual(toBytes(bc), [42, 21], "writed subarray")
})
