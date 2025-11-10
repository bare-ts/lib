//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

import { fromBytes, toBytes } from "./_util.js"

const MAX_U64 = BigInt(2 ** 32) * BigInt(2 ** 32) - BigInt(1)

test("bare.readUint", (t) => {
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
        0x1,
    )
    t.deepEqual(bare.readUint(bc), BigInt(0))
    t.deepEqual(bare.readUint(bc), BigInt(0x7f))
    t.deepEqual(bare.readUint(bc), BigInt(0x1337))
    t.deepEqual(bare.readUint(bc), MAX_U64)
    t.throws(
        () => bare.readUint(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.readUint(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x2)
    t.throws(
        () => bare.readUint(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: non-significant bits are set",
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
        0x1,
    )
    t.throws(
        () => bare.readUint(bc),
        { name: "BareError", issue: "must be canonical" },
        "too many bytes",
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.readUint(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeUint", (t) => {
    let bc = fromBytes()
    bare.writeUint(bc, BigInt(0))
    bare.writeUint(bc, BigInt(0x7f))
    bare.writeUint(bc, BigInt(0x1337))
    bare.writeUint(bc, BigInt(MAX_U64))
    t.deepEqual(
        toBytes(bc),
        [
            0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0x1,
        ],
    )

    bc = fromBytes()
    t.throws(
        () => bare.writeUint(bc, MAX_U64 + BigInt(1)),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("bare.readUintSafe32", (t) => {
    let bc = fromBytes(0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xf)
    t.deepEqual(bare.readUintSafe32(bc), 0)
    t.deepEqual(bare.readUintSafe32(bc), 0x7f)
    t.deepEqual(bare.readUintSafe32(bc), 0x1337)
    t.deepEqual(bare.readUintSafe32(bc), 2 ** 32 - 1)
    t.throws(
        () => bare.readUintSafe32(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.readUintSafe32(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0",
    )

    bc = fromBytes(0x81, 0x81, 0x81, 0x81, 0x10)
    t.throws(
        () => bare.readUintSafe32(bc),
        { name: "BareError", issue: "too large number" },
        "too large number",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x1)
    t.throws(
        () => bare.readUintSafe32(bc),
        { name: "BareError", issue: "too large number" },
        "too many bytes",
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.readUintSafe32(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeUintSafe32", (t) => {
    let bc = fromBytes()
    bare.writeUintSafe32(bc, 0)
    bare.writeUintSafe32(bc, 0x7f)
    bare.writeUintSafe32(bc, 0x1337)
    bare.writeUintSafe32(bc, 2 ** 32 - 1)
    t.deepEqual(toBytes(bc), [0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xf])

    bc = fromBytes()
    t.throws(
        () => bare.writeUintSafe32(bc, 2 ** 32),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("bare.readUintSafe", (t) => {
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
        0xf,
    )
    t.deepEqual(bare.readUintSafe(bc), 0)
    t.deepEqual(bare.readUintSafe(bc), 0x7f)
    t.deepEqual(bare.readUintSafe(bc), 0x1337)
    t.deepEqual(bare.readUintSafe(bc), Number.MAX_SAFE_INTEGER)
    t.throws(
        () => bare.readUintSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0)
    t.throws(
        () => bare.readUintSafe(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0",
    )

    bc = fromBytes(0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x10)
    t.throws(
        () => bare.readUintSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too large number",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x1)
    t.throws(
        () => bare.readUintSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too many bytes",
    )

    bc = fromBytes(0x80)
    t.throws(
        () => bare.readUintSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("bare.writeUintSafe", (t) => {
    let bc = fromBytes()
    bare.writeUintSafe(bc, 0)
    bare.writeUintSafe(bc, 0x7f)
    bare.writeUintSafe(bc, 0x1337)
    bare.writeUintSafe(bc, Number.MAX_SAFE_INTEGER)
    t.deepEqual(
        toBytes(bc),
        [0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf],
    )

    bc = fromBytes()
    t.throws(
        () => bare.writeUintSafe(bc, Number.MAX_SAFE_INTEGER + 1),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})
