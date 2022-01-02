import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

const MAX_I64 = BigInt(2 ** 31) * BigInt(2 ** 32) - BigInt(1)
const MIN_I64 = -(BigInt(2 ** 31) * BigInt(2 ** 32))

test("bare.decodeInt", (t) => {
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
    t.deepEqual(bare.decodeInt(bc), BigInt(0))
    t.deepEqual(bare.decodeInt(bc), BigInt(42))
    t.deepEqual(bare.decodeInt(bc), BigInt(-1337))
    t.deepEqual(bare.decodeInt(bc), MAX_I64)
    t.deepEqual(bare.decodeInt(bc), MIN_I64)
    t.throws(
        () => bare.decodeInt(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.decodeInt(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x2)
    t.throws(
        () => bare.decodeInt(bc),
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
        () => bare.decodeInt(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: too many bytes"
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.decodeInt(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeInt", (t) => {
    let bc = fromBytes()
    bare.encodeInt(bc, BigInt(0))
    bare.encodeInt(bc, BigInt(42))
    bare.encodeInt(bc, BigInt(-1337))
    bare.encodeInt(bc, MAX_I64)
    bare.encodeInt(bc, MIN_I64)
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
        () => bare.encodeInt(bc, MAX_I64 + BigInt(1)),
        { name: "AssertionError" },
        "too big"
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeInt(bc, MIN_I64 - BigInt(1)),
        { name: "AssertionError" },
        "Too big negative"
    )
})

test("bare.decodeIntSafe", (t) => {
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
    t.deepEqual(bare.decodeIntSafe(bc), 0)
    t.deepEqual(bare.decodeIntSafe(bc), 42)
    t.deepEqual(bare.decodeIntSafe(bc), -1337)
    t.deepEqual(bare.decodeIntSafe(bc), Number.MAX_SAFE_INTEGER)
    t.deepEqual(bare.decodeIntSafe(bc), Number.MIN_SAFE_INTEGER)
    t.throws(
        () => bare.decodeIntSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.decodeIntSafe(bc),
        { name: "BareError", issue: "must be canonical" },
        "non-canonical: last byte is 0"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x4f)
    t.throws(
        () => bare.decodeIntSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too large number"
    )

    bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f)
    t.throws(
        () => bare.decodeIntSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too large negative"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x1)
    t.throws(
        () => bare.decodeIntSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too many bytes"
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.decodeIntSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeIntSafe", (t) => {
    let bc = fromBytes()
    bare.encodeIntSafe(bc, 0)
    bare.encodeIntSafe(bc, 42)
    bare.encodeIntSafe(bc, -1337)
    bare.encodeIntSafe(bc, Number.MAX_SAFE_INTEGER)
    bare.encodeIntSafe(bc, Number.MIN_SAFE_INTEGER)
    t.deepEqual(
        toBytes(bc),
        [
            0, 0x54, 0xf1, 0x14, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f,
            0xfd, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f,
        ]
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeIntSafe(bc, Number.MAX_SAFE_INTEGER + 1),
        { name: "AssertionError" },
        "too big"
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeIntSafe(bc, Number.MIN_SAFE_INTEGER - 1),
        { name: "AssertionError" },
        "too big negative"
    )
})
