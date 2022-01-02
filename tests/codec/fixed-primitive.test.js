import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, toBytes } from "./_util.js"

test("bare.decodeBool", (t) => {
    let bc = fromBytes(0, 0x1)
    t.deepEqual(bare.decodeBool(bc), false, "decoded false")
    t.deepEqual(bare.decodeBool(bc), true, "decoded true")
    t.throws(
        () => bare.decodeBool(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes"
    )

    bc = fromBytes(0x42)
    t.throws(
        () => bare.decodeBool(bc),
        {
            name: "BareError",
            issue: "a bool must be equal to 0 or 1",
            offset: 0,
        },
        "malformed bool"
    )
})

test("bare.encodeBool", (t) => {
    const bc = fromBytes()
    bare.encodeBool(bc, false)
    bare.encodeBool(bc, true)
    t.deepEqual(bc.offset, 2)
    t.deepEqual(toBytes(bc)[0], 0, "encoded false")
    t.deepEqual(toBytes(bc)[1], 1, "encoded true")
})

test("bare.decodeF32", (t) => {
    let bc = fromBytes(0, 0, 0xfa, 0x41)
    t.deepEqual(bare.decodeF32(bc), 1000 / 2 ** 5) // dyadic number
    t.throws(
        () => bare.decodeF32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes"
    )

    bc = fromBytes(0, 0, 0xc0, 0x7f)
    t.throws(
        () => bare.decodeF32(bc),
        { name: "BareError", issue: "NaN is not allowed", offset: 0 },
        "NaN is not allowed"
    )
})

test("bare.encodeF32", (t) => {
    let bc = fromBytes()
    bare.encodeF32(bc, 1000 / 2 ** 5) // dyadic number
    t.deepEqual(toBytes(bc), [0, 0, 0xfa, 0x41])

    bc = fromBytes()
    t.throws(
        () => bare.encodeF32(bc, 10 ** 20 / 2 ** 30),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeF32(bc, Number.NaN),
        { name: "AssertionError", message: "NaN is not allowed" },
        "NaN is not allowed"
    )
})

test("bare.decodeF64", (t) => {
    let bc = fromBytes(64, 140, 181, 120, 29, 175, 53, 66)
    t.deepEqual(bare.decodeF64(bc), 10 ** 20 / 2 ** 30) // dyadic number
    t.throws(
        () => bare.decodeF64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes"
    )

    bc = fromBytes(0, 0, 0, 0, 0, 0, 0xf8, 0x7f)
    t.throws(
        () => bare.decodeF64(bc),
        { name: "BareError", issue: "NaN is not allowed", offset: 0 },
        "NaN is not allowed"
    )
})

test("bare.encodeF64", (t) => {
    let bc = fromBytes()
    bare.encodeF64(bc, 10 ** 20 / 2 ** 30) // dyadic number
    t.deepEqual(toBytes(bc), [64, 140, 181, 120, 29, 175, 53, 66])

    bc = fromBytes(0, 0, 192, 127)
    t.throws(
        () => bare.encodeF64(bc, Number.NaN),
        { name: "AssertionError", message: "NaN is not allowed" },
        "NaN is not allowed"
    )
})

test("bare.decodeI8", (t) => {
    const bc = fromBytes(0xd6)
    t.deepEqual(bare.decodeI8(bc), -42)
    t.throws(
        () => bare.decodeI8(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes"
    )
})

test("bare.encodeI8", (t) => {
    let bc = fromBytes()
    bare.encodeI8(bc, -42)
    t.deepEqual(toBytes(bc), [0xd6])

    bc = fromBytes()
    t.throws(
        () => bare.encodeI8(bc, 2 ** 7),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeI8(bc, -(2 ** 7 + 1)),
        { name: "AssertionError", message: "too large number" },
        "too large negative"
    )
})

test("bare.decodeI16", (t) => {
    const bc = fromBytes(0x2e, 0xfb)
    t.deepEqual(bare.decodeI16(bc), -1234)
    t.throws(
        () => bare.decodeI16(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes"
    )
})

test("bare.encodeI16", (t) => {
    let bc = fromBytes()
    bare.encodeI16(bc, -1234)
    t.deepEqual(toBytes(bc), [0x2e, 0xfb])

    bc = fromBytes()
    t.throws(
        () => bare.encodeI16(bc, 2 ** 15),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeI16(bc, -(2 ** 15 + 1)),
        { name: "AssertionError", message: "too large number" },
        "too large negative"
    )
})

test("bare.decodeI32", (t) => {
    const bc = fromBytes(0xb2, 0x9e, 0x43, 0xff)
    t.deepEqual(bare.decodeI32(bc), -12345678)
    t.throws(
        () => bare.decodeI32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes"
    )
})

test("bare.encodeI32", (t) => {
    let bc = fromBytes()
    bare.encodeI32(bc, -12345678)
    t.deepEqual(toBytes(bc), [0xb2, 0x9e, 0x43, 0xff])

    bc = fromBytes()
    t.throws(
        () => bare.encodeI32(bc, 2 ** 31),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeI32(bc, -(2 ** 31 + 1)),
        { name: "AssertionError", message: "too large number" },
        "too large negative"
    )
})

const BIG_NEG_INT = -(BigInt(12345678) * BigInt(10 ** 9) + BigInt(987654321))

test("bare.decodeI64", (t) => {
    const bc = fromBytes(0x4f, 0x0b, 0x6e, 0x9d, 0xab, 0x23, 0xd4, 0xff)
    t.deepEqual(bare.decodeI64(bc), BIG_NEG_INT)
    t.throws(
        () => bare.decodeI64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes"
    )
})

test("bare.encodeI64", (t) => {
    let bc = fromBytes()
    bare.encodeI64(bc, BIG_NEG_INT)
    t.deepEqual(toBytes(bc), [0x4f, 0x0b, 0x6e, 0x9d, 0xab, 0x23, 0xd4, 0xff])

    bc = fromBytes()
    t.throws(
        () => bare.encodeI64(bc, BigInt(2 ** 31) * BigInt(2 ** 32)),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )

    bc = fromBytes()
    t.throws(
        () =>
            bare.encodeI64(
                bc,
                -(BigInt(2 ** 31) * BigInt(2 ** 32) + BigInt(1))
            ),
        { name: "AssertionError", message: "too large number" },
        "too large negative"
    )
})

test("bare.decodeI64Safe", (t) => {
    let bc = fromBytes(
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0x1f,
        0,
        0xd6,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0xff,
        0,
        0,
        0,
        0,
        0xff,
        0xff,
        0xff,
        0xff,
        1,
        0,
        0,
        0,
        0,
        0,
        0xe0,
        0xff
    )
    t.deepEqual(bare.decodeI64Safe(bc), 0)
    t.deepEqual(bare.decodeI64Safe(bc), Number.MAX_SAFE_INTEGER)
    t.deepEqual(bare.decodeI64Safe(bc), -42)
    t.deepEqual(bare.decodeI64Safe(bc), -(2 ** 32))
    t.deepEqual(bare.decodeI64Safe(bc), Number.MIN_SAFE_INTEGER)
    t.throws(
        () => bare.decodeI64Safe(bc),
        { name: "BareError", issue: "missing bytes", offset: 5 * 8 },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x20, 0)
    t.throws(
        () => bare.decodeI64Safe(bc),
        { name: "BareError", issue: "too large number", offset: 0 },
        "too large number"
    )
})

test("bare.encodeI64Safe", (t) => {
    let bc = fromBytes()
    bare.encodeI64Safe(bc, 0)
    bare.encodeI64Safe(bc, Number.MAX_SAFE_INTEGER)
    bare.encodeI64Safe(bc, -42)
    bare.encodeI64Safe(bc, -(2 ** 32))
    bare.encodeI64Safe(bc, Number.MIN_SAFE_INTEGER)
    t.deepEqual(
        toBytes(bc),
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0,
            0xd6, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0, 0, 0, 0, 0xff,
            0xff, 0xff, 0xff, 1, 0, 0, 0, 0, 0, 0xe0, 0xff,
        ]
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeI64Safe(bc, Number.MAX_SAFE_INTEGER + 1),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )

    bc = fromBytes()
    t.throws(
        () => bare.encodeI64Safe(bc, Number.MIN_SAFE_INTEGER - 1),
        { name: "AssertionError", message: "too large number" },
        "too large negative"
    )
})

test("bare.decodeU8", (t) => {
    const bc = fromBytes(0x42)
    t.deepEqual(bare.decodeU8(bc), 0x42)
    t.throws(
        () => bare.decodeU8(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes"
    )
})

test("bare.encodeU8", (t) => {
    let bc = fromBytes()
    bare.encodeU8(bc, 0x42)
    t.deepEqual(toBytes(bc), [0x42])

    bc = fromBytes()
    t.throws(
        () => bare.encodeU8(bc, 0x100),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )
})

test("bare.decodeU16", (t) => {
    const bc = fromBytes(0xfe, 0xca)
    t.deepEqual(bare.decodeU16(bc), 0xcafe)
    t.throws(
        () => bare.decodeU16(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes"
    )
})

test("bare.encodeU16", (t) => {
    let bc = fromBytes()
    bare.encodeU16(bc, 0xcafe)
    t.deepEqual(toBytes(bc), [0xfe, 0xca])

    bc = fromBytes()
    t.throws(
        () => bare.encodeU16(bc, 0x10000),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )
})

test("bare.decodeU32", (t) => {
    const bc = fromBytes(0xef, 0xbe, 0xad, 0xde)
    t.deepEqual(bare.decodeU32(bc), 0xdeadbeef)
    t.throws(
        () => bare.decodeU32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes"
    )
})

test("bare.encodeU32", (t) => {
    let bc = fromBytes()
    bare.encodeU32(bc, 0xdeadbeef)
    t.deepEqual(toBytes(bc), [0xef, 0xbe, 0xad, 0xde])

    bc = fromBytes()
    t.throws(
        () => bare.encodeU32(bc, 2 ** 32),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )
})

const CAFE_BABE_DEAD_BEEF =
    (BigInt(0xcafe_babe) << BigInt(32)) + BigInt(0xdead_beef)

test("bare.decodeU64", (t) => {
    const bc = fromBytes(0xef, 0xbe, 0xad, 0xde, 0xbe, 0xba, 0xfe, 0xca)
    t.deepEqual(bare.decodeU64(bc), CAFE_BABE_DEAD_BEEF)
    t.throws(
        () => bare.decodeU64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes"
    )
})

test("bare.encodeU64", (t) => {
    let bc = fromBytes()
    bare.encodeU64(bc, CAFE_BABE_DEAD_BEEF)
    t.deepEqual(toBytes(bc), [0xef, 0xbe, 0xad, 0xde, 0xbe, 0xba, 0xfe, 0xca])

    bc = fromBytes()
    t.throws(
        () => bare.encodeU64(bc, BigInt(2 ** 32) * BigInt(2 ** 32)),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )
})

test("bare.decodeU64Safe", (t) => {
    let bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0)
    t.deepEqual(bare.decodeU64Safe(bc), Number.MAX_SAFE_INTEGER)
    t.throws(
        () => bare.decodeU64Safe(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes"
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x20, 0)
    t.throws(
        () => bare.decodeU64Safe(bc),
        { name: "BareError", issue: "too large number", offset: 0 },
        "too large number"
    )
})

test("bare.encodeU64Safe", (t) => {
    let bc = fromBytes()
    bare.encodeU64Safe(bc, Number.MAX_SAFE_INTEGER)
    t.deepEqual(toBytes(bc), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0])

    bc = fromBytes()
    t.throws(
        () => bare.encodeU64Safe(bc, 0xcafe_babe_dead_beef),
        { name: "AssertionError", message: "too large number" },
        "too large number"
    )
})

test("bare.decodeVoid", (t) => {
    let bc = fromBytes()
    t.deepEqual(bare.decodeVoid(bc), undefined)
})

test("bare.encodeVoid", (t) => {
    let bc = fromBytes()
    bare.encodeVoid(bc, undefined)
    t.deepEqual(toBytes(bc), [])
})
