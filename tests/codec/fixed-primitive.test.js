//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.js"

test("bare.readBool", () => {
    let bc = fromBytes(0, 0x1)
    assert.deepEqual(bare.readBool(bc), false, "readd false")
    assert.deepEqual(bare.readBool(bc), true, "readd true")
    assert.throws(
        () => bare.readBool(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes",
    )

    bc = fromBytes(0x42)
    assert.throws(
        () => bare.readBool(bc),
        {
            name: "BareError",
            issue: "a bool must be equal to 0 or 1",
            offset: 0,
        },
        "malformed bool",
    )
})

test("bare.writeBool", () => {
    const bc = fromBytes()
    bare.writeBool(bc, false)
    bare.writeBool(bc, true)
    assert.deepEqual(bc.offset, 2)
    assert.deepEqual(toBytes(bc)[0], 0, "writed false")
    assert.deepEqual(toBytes(bc)[1], 1, "writed true")
})

test("bare.readF32", () => {
    let bc = fromBytes(0, 0, 0xfa, 0x41)
    assert.deepEqual(bare.readF32(bc), 1000 / 2 ** 5) // dyadic number
    assert.throws(
        () => bare.readF32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes",
    )

    bc = fromBytes(0, 0, 0xc0, 0x7f)
    assert.deepEqual(Number.isNaN(bare.readF32(bc)), true)

    // test with a NaN payload
    bc = fromBytes(0, 1, 0xc0, 0x7f)
    assert.deepEqual(Number.isNaN(bare.readF32(bc)), true)
})

test("bare.writeF32", () => {
    let bc = fromBytes()
    bare.writeF32(bc, 1000 / 2 ** 5) // dyadic number
    assert.deepEqual(toBytes(bc), [0, 0, 0xfa, 0x41])

    bc = fromBytes()
    bare.writeF32(bc, Number.NaN)
    // canonical quiet NaN emitted by v8
    assert.deepEqual(toBytes(bc), [0, 0, 0xc0, 0x7f])

    bc = fromBytes()
    assert.throws(
        () => bare.writeF32(bc, 10 ** 20 / 2 ** 30),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("bare.readF64", () => {
    let bc = fromBytes(64, 140, 181, 120, 29, 175, 53, 66)
    assert.deepEqual(bare.readF64(bc), 10 ** 20 / 2 ** 30) // dyadic number
    assert.throws(
        () => bare.readF64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes",
    )

    bc = fromBytes(0, 0, 0, 0, 0, 0, 0xf8, 0x7f)
    assert.deepEqual(Number.isNaN(bare.readF64(bc)), true)

    // test with a NaN payload
    bc = fromBytes(0, 0, 0, 1, 0, 0, 0xf8, 0x7f)
    assert.deepEqual(Number.isNaN(bare.readF64(bc)), true)
})

test("bare.writeF64", () => {
    let bc = fromBytes()
    bare.writeF64(bc, 10 ** 20 / 2 ** 30) // dyadic number
    assert.deepEqual(toBytes(bc), [64, 140, 181, 120, 29, 175, 53, 66])

    bc = fromBytes()
    bare.writeF64(bc, Number.NaN)
    // canonical quiet NaN emitted by v8
    assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0xf8, 0x7f])
})

test("bare.readI8", () => {
    const bc = fromBytes(0xd6)
    assert.deepEqual(bare.readI8(bc), -42)
    assert.throws(
        () => bare.readI8(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes",
    )
})

test("bare.writeI8", () => {
    let bc = fromBytes()
    bare.writeI8(bc, -42)
    assert.deepEqual(toBytes(bc), [0xd6])

    bc = fromBytes()
    assert.throws(
        () => bare.writeI8(bc, 2 ** 7),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )

    bc = fromBytes()
    assert.throws(
        () => bare.writeI8(bc, -(2 ** 7 + 1)),
        { name: "AssertionError", message: "too large number" },
        "too large negative",
    )
})

test("bare.readI16", () => {
    const bc = fromBytes(0x2e, 0xfb)
    assert.deepEqual(bare.readI16(bc), -1234)
    assert.throws(
        () => bare.readI16(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes",
    )
})

test("bare.writeI16", () => {
    let bc = fromBytes()
    bare.writeI16(bc, -1234)
    assert.deepEqual(toBytes(bc), [0x2e, 0xfb])

    bc = fromBytes()
    assert.throws(
        () => bare.writeI16(bc, 2 ** 15),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )

    bc = fromBytes()
    assert.throws(
        () => bare.writeI16(bc, -(2 ** 15 + 1)),
        { name: "AssertionError", message: "too large number" },
        "too large negative",
    )
})

test("bare.readI32", () => {
    const bc = fromBytes(0xb2, 0x9e, 0x43, 0xff)
    assert.deepEqual(bare.readI32(bc), -12345678)
    assert.throws(
        () => bare.readI32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes",
    )
})

test("bare.writeI32", () => {
    let bc = fromBytes()
    bare.writeI32(bc, -12345678)
    assert.deepEqual(toBytes(bc), [0xb2, 0x9e, 0x43, 0xff])

    bc = fromBytes()
    assert.throws(
        () => bare.writeI32(bc, 2 ** 31),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )

    bc = fromBytes()
    assert.throws(
        () => bare.writeI32(bc, -(2 ** 31 + 1)),
        { name: "AssertionError", message: "too large number" },
        "too large negative",
    )
})

const BIG_NEG_INT = -(BigInt(12345678) * BigInt(10 ** 9) + BigInt(987654321))

test("bare.readI64", () => {
    const bc = fromBytes(0x4f, 0x0b, 0x6e, 0x9d, 0xab, 0x23, 0xd4, 0xff)
    assert.deepEqual(bare.readI64(bc), BIG_NEG_INT)
    assert.throws(
        () => bare.readI64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes",
    )
})

test("bare.writeI64", () => {
    let bc = fromBytes()
    bare.writeI64(bc, BIG_NEG_INT)
    assert.deepEqual(
        toBytes(bc),
        [0x4f, 0x0b, 0x6e, 0x9d, 0xab, 0x23, 0xd4, 0xff],
    )

    bc = fromBytes()
    assert.throws(
        () => bare.writeI64(bc, BigInt(2 ** 31) * BigInt(2 ** 32)),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )

    bc = fromBytes()
    assert.throws(
        () =>
            bare.writeI64(bc, -(BigInt(2 ** 31) * BigInt(2 ** 32) + BigInt(1))),
        { name: "AssertionError", message: "too large number" },
        "too large negative",
    )
})

test("bare.readI64Safe", () => {
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
        0xff,
    )
    assert.deepEqual(bare.readI64Safe(bc), 0)
    assert.deepEqual(bare.readI64Safe(bc), Number.MAX_SAFE_INTEGER)
    assert.deepEqual(bare.readI64Safe(bc), -42)
    assert.deepEqual(bare.readI64Safe(bc), -(2 ** 32))
    assert.deepEqual(bare.readI64Safe(bc), Number.MIN_SAFE_INTEGER)
    assert.throws(
        () => bare.readI64Safe(bc),
        { name: "BareError", issue: "missing bytes", offset: 5 * 8 },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x20, 0)
    assert.throws(
        () => bare.readI64Safe(bc),
        { name: "BareError", issue: "too large number", offset: 0 },
        "too large number",
    )
})

test("bare.writeI64Safe", () => {
    let bc = fromBytes()
    bare.writeI64Safe(bc, 0)
    bare.writeI64Safe(bc, Number.MAX_SAFE_INTEGER)
    bare.writeI64Safe(bc, -42)
    bare.writeI64Safe(bc, -(2 ** 32))
    bare.writeI64Safe(bc, Number.MIN_SAFE_INTEGER)
    assert.deepEqual(
        toBytes(bc),
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0,
            0xd6, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0, 0, 0, 0, 0xff,
            0xff, 0xff, 0xff, 1, 0, 0, 0, 0, 0, 0xe0, 0xff,
        ],
    )

    bc = fromBytes()
    assert.throws(
        () => bare.writeI64Safe(bc, Number.MAX_SAFE_INTEGER + 1),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )

    bc = fromBytes()
    assert.throws(
        () => bare.writeI64Safe(bc, Number.MIN_SAFE_INTEGER - 1),
        { name: "AssertionError", message: "too large number" },
        "too large negative",
    )
})

test("bare.readU8", () => {
    const bc = fromBytes(0x42)
    assert.deepEqual(bare.readU8(bc), 0x42)
    assert.throws(
        () => bare.readU8(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes",
    )
})

test("bare.writeU8", () => {
    let bc = fromBytes()
    bare.writeU8(bc, 0x42)
    assert.deepEqual(toBytes(bc), [0x42])

    bc = fromBytes()
    assert.throws(
        () => bare.writeU8(bc, 0x100),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("bare.readU16", () => {
    const bc = fromBytes(0xfe, 0xca)
    assert.deepEqual(bare.readU16(bc), 0xcafe)
    assert.throws(
        () => bare.readU16(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes",
    )
})

test("bare.writeU16", () => {
    let bc = fromBytes()
    bare.writeU16(bc, 0xcafe)
    assert.deepEqual(toBytes(bc), [0xfe, 0xca])

    bc = fromBytes()
    assert.throws(
        () => bare.writeU16(bc, 0x10000),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("bare.readU32", () => {
    const bc = fromBytes(0xef, 0xbe, 0xad, 0xde)
    assert.deepEqual(bare.readU32(bc), 0xdeadbeef)
    assert.throws(
        () => bare.readU32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes",
    )
})

test("bare.writeU32", () => {
    let bc = fromBytes()
    bare.writeU32(bc, 0xdeadbeef)
    assert.deepEqual(toBytes(bc), [0xef, 0xbe, 0xad, 0xde])

    bc = fromBytes()
    assert.throws(
        () => bare.writeU32(bc, 2 ** 32),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

const CAFE_BABE_DEAD_BEEF =
    (BigInt(0xcafe_babe) << BigInt(32)) + BigInt(0xdead_beef)

test("bare.readU64", () => {
    const bc = fromBytes(0xef, 0xbe, 0xad, 0xde, 0xbe, 0xba, 0xfe, 0xca)
    assert.deepEqual(bare.readU64(bc), CAFE_BABE_DEAD_BEEF)
    assert.throws(
        () => bare.readU64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes",
    )
})

test("bare.writeU64", () => {
    let bc = fromBytes()
    bare.writeU64(bc, CAFE_BABE_DEAD_BEEF)
    assert.deepEqual(
        toBytes(bc),
        [0xef, 0xbe, 0xad, 0xde, 0xbe, 0xba, 0xfe, 0xca],
    )

    bc = fromBytes()
    assert.throws(
        () => bare.writeU64(bc, BigInt(2 ** 32) * BigInt(2 ** 32)),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("bare.readU64Safe", () => {
    let bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0)
    assert.deepEqual(bare.readU64Safe(bc), Number.MAX_SAFE_INTEGER)
    assert.throws(
        () => bare.readU64Safe(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x20, 0)
    assert.throws(
        () => bare.readU64Safe(bc),
        { name: "BareError", issue: "too large number", offset: 0 },
        "too large number",
    )
})

test("bare.writeU64Safe", () => {
    let bc = fromBytes()
    bare.writeU64Safe(bc, Number.MAX_SAFE_INTEGER)
    assert.deepEqual(toBytes(bc), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0])

    bc = fromBytes()
    assert.throws(
        () => bare.writeU64Safe(bc, 0xcafe_babe_dead_beef),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})
