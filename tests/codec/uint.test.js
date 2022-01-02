import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

const MAX_U64 = BigInt(2 ** 32) * BigInt(2 ** 32) - BigInt(1)

test("bare.decodeUint", (t) => {
    let bc = fromBytes(
        0,
        0x7f,
        0xb7,
        0x26,
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
    t.deepEqual(bare.decodeUint(bc), BigInt(0))
    t.deepEqual(bare.decodeUint(bc), BigInt(0x7f))
    t.deepEqual(bare.decodeUint(bc), BigInt(0x1337))
    t.deepEqual(bare.decodeUint(bc), MAX_U64)
    t.throws(
        () => bare.decodeUint(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.decodeUint(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x2)
    t.throws(
        () => bare.decodeUint(bc),
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
        () => bare.decodeUint(bc),
        { name: "BareError", issue: "must be canonical" },
        "too many bytes"
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.decodeUint(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeUint", (t) => {
    let bc = fromBytes()
    bare.encodeUint(bc, BigInt(0))
    bare.encodeUint(bc, BigInt(0x7f))
    bare.encodeUint(bc, BigInt(0x1337))
    bare.encodeUint(bc, BigInt(MAX_U64))
    t.deepEqual(
        toBytes(bc),
        [
            0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0x1,
        ]
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeUint(bc, MAX_U64 + BigInt(1)),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )
})

test("bare.decodeUintSafe", (t) => {
    let bc = fromBytes(
        0,
        0x7f,
        0xb7,
        0x26,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xf
    )
    t.deepEqual(bare.decodeUintSafe(bc), 0)
    t.deepEqual(bare.decodeUintSafe(bc), 0x7f)
    t.deepEqual(bare.decodeUintSafe(bc), 0x1337)
    t.deepEqual(bare.decodeUintSafe(bc), Number.MAX_SAFE_INTEGER)
    t.throws(
        () => bare.decodeUintSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.decodeUintSafe(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0"
    )

    bc = fromBytes(0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x10)
    t.throws(
        () => bare.decodeUintSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too large number"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x1)
    t.throws(
        () => bare.decodeUintSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too many bytes"
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.decodeUintSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes"
    )
})

test("bare.encodeUintSafe", (t) => {
    let bc = fromBytes()
    bare.encodeUintSafe(bc, 0)
    bare.encodeUintSafe(bc, 0x7f)
    bare.encodeUintSafe(bc, 0x1337)
    bare.encodeUintSafe(bc, Number.MAX_SAFE_INTEGER)
    t.deepEqual(
        toBytes(bc),
        [0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf]
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeUintSafe(bc, Number.MAX_SAFE_INTEGER + 1),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )
})
