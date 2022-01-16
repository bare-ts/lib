import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

const MAX_I64 = BigInt(2 ** 31) * BigInt(2 ** 32) - BigInt(1)
const MIN_I64 = -(BigInt(2 ** 31) * BigInt(2 ** 32))

test("bare.readInt", (t) => {
    let bc = fromBytes(
        0,
        0x54,
        0xf1,
        0x14,
        0xfe,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0x1,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0x1
    )
    t.deepEqual(bare.readInt(bc), BigInt(0))
    t.deepEqual(bare.readInt(bc), BigInt(42))
    t.deepEqual(bare.readInt(bc), BigInt(-1337))
    t.deepEqual(bare.readInt(bc), MAX_I64)
    t.deepEqual(bare.readInt(bc), MIN_I64)
    t.throws(
        () => bare.readInt(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.readInt(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x2)
    t.throws(
        () => bare.readInt(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: non-significant bits are set"
    )

    bc = fromBytes(
        0x80,
        0x80,
        0x80,
        0x80,
        0x80,
        0x80,
        0x80,
        0x80,
        0x80,
        0x80,
        0x1
    )
    t.throws(
        () => bare.readInt(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: too many bytes"
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.readInt(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.writeInt", (t) => {
    let bc = fromBytes()
    bare.writeInt(bc, BigInt(0))
    bare.writeInt(bc, BigInt(42))
    bare.writeInt(bc, BigInt(-1337))
    bare.writeInt(bc, MAX_I64)
    bare.writeInt(bc, MIN_I64)
    t.deepEqual(
        toBytes(bc),
        [
            0, 0x54, 0xf1, 0x14, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0x1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0x1,
        ]
    )

    bc = fromBytes()
    t.throws(
        () => bare.writeInt(bc, MAX_I64 + BigInt(1)),
        { name: "AssertionError" },
        "too big"
    )

    bc = fromBytes()
    t.throws(
        () => bare.writeInt(bc, MIN_I64 - BigInt(1)),
        { name: "AssertionError" },
        "Too big negative"
    )
})

test("bare.readIntSafe", (t) => {
    let bc = fromBytes(
        0,
        0x54,
        0xf1,
        0x14,
        0xfe,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0x1f,
        0xfd,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0x1f
    )
    t.deepEqual(bare.readIntSafe(bc), 0)
    t.deepEqual(bare.readIntSafe(bc), 42)
    t.deepEqual(bare.readIntSafe(bc), -1337)
    t.deepEqual(bare.readIntSafe(bc), Number.MAX_SAFE_INTEGER)
    t.deepEqual(bare.readIntSafe(bc), Number.MIN_SAFE_INTEGER)
    t.throws(
        () => bare.readIntSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.readIntSafe(bc),
        { name: "BareError", issue: "must be canonical" },
        "non-canonical: last byte is 0"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x4f)
    t.throws(
        () => bare.readIntSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too large number"
    )

    bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f)
    t.throws(
        () => bare.readIntSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too large negative"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x1)
    t.throws(
        () => bare.readIntSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too many bytes"
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.readIntSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.writeIntSafe", (t) => {
    let bc = fromBytes()
    bare.writeIntSafe(bc, 0)
    bare.writeIntSafe(bc, 42)
    bare.writeIntSafe(bc, -1337)
    bare.writeIntSafe(bc, Number.MAX_SAFE_INTEGER)
    bare.writeIntSafe(bc, Number.MIN_SAFE_INTEGER)
    t.deepEqual(
        toBytes(bc),
        [
            0, 0x54, 0xf1, 0x14, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f,
            0xfd, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f,
        ]
    )

    bc = fromBytes()
    t.throws(
        () => bare.writeIntSafe(bc, Number.MAX_SAFE_INTEGER + 1),
        { name: "AssertionError" },
        "too big"
    )

    bc = fromBytes()
    t.throws(
        () => bare.writeIntSafe(bc, Number.MIN_SAFE_INTEGER - 1),
        { name: "AssertionError" },
        "too big negative"
    )
})
