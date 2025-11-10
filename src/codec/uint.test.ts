//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readUint,
    readUintSafe,
    readUintSafe32,
    writeUint,
    writeUintSafe,
    writeUintSafe32,
} from "./uint.ts"

const MAX_U64 = BigInt(2 ** 32) * BigInt(2 ** 32) - BigInt(1)

test("readUint", () => {
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
    assert.deepEqual(readUint(bc), BigInt(0))
    assert.deepEqual(readUint(bc), BigInt(0x7f))
    assert.deepEqual(readUint(bc), BigInt(0x1337))
    assert.deepEqual(readUint(bc), MAX_U64)
    assert.throws(
        () => readUint(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0)
    assert.throws(
        () => readUint(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x2)
    assert.throws(
        () => readUint(bc),
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
    assert.throws(
        () => readUint(bc),
        { name: "BareError", issue: "must be canonical" },
        "too many bytes",
    )

    bc = fromBytes(0x80)
    assert.throws(
        () => readUint(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeUint", () => {
    let bc = fromBytes()
    writeUint(bc, BigInt(0))
    writeUint(bc, BigInt(0x7f))
    writeUint(bc, BigInt(0x1337))
    writeUint(bc, BigInt(MAX_U64))
    assert.deepEqual(
        toBytes(bc),
        [
            0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0x1,
        ],
    )

    bc = fromBytes()
    assert.throws(
        () => writeUint(bc, MAX_U64 + BigInt(1)),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("readUintSafe32", () => {
    let bc = fromBytes(0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xf)
    assert.deepEqual(readUintSafe32(bc), 0)
    assert.deepEqual(readUintSafe32(bc), 0x7f)
    assert.deepEqual(readUintSafe32(bc), 0x1337)
    assert.deepEqual(readUintSafe32(bc), 2 ** 32 - 1)
    assert.throws(
        () => readUintSafe32(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0)
    assert.throws(
        () => readUintSafe32(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0",
    )

    bc = fromBytes(0x81, 0x81, 0x81, 0x81, 0x10)
    assert.throws(
        () => readUintSafe32(bc),
        { name: "BareError", issue: "too large number" },
        "too large number",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x1)
    assert.throws(
        () => readUintSafe32(bc),
        { name: "BareError", issue: "too large number" },
        "too many bytes",
    )

    bc = fromBytes(0x80)
    assert.throws(
        () => readUintSafe32(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeUintSafe32", () => {
    let bc = fromBytes()
    writeUintSafe32(bc, 0)
    writeUintSafe32(bc, 0x7f)
    writeUintSafe32(bc, 0x1337)
    writeUintSafe32(bc, 2 ** 32 - 1)
    assert.deepEqual(
        toBytes(bc),
        [0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xf],
    )

    bc = fromBytes()
    assert.throws(
        () => writeUintSafe32(bc, 2 ** 32),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})

test("readUintSafe", () => {
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
    assert.deepEqual(readUintSafe(bc), 0)
    assert.deepEqual(readUintSafe(bc), 0x7f)
    assert.deepEqual(readUintSafe(bc), 0x1337)
    assert.deepEqual(readUintSafe(bc), Number.MAX_SAFE_INTEGER)
    assert.throws(
        () => readUintSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )

    bc = fromBytes(0x80, 0)
    assert.throws(
        () => readUintSafe(bc),
        { name: "BareError", issue: "must be canonical" },
        "non canonical: last byte is 0",
    )

    bc = fromBytes(0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x10)
    assert.throws(
        () => readUintSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too large number",
    )

    bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x1)
    assert.throws(
        () => readUintSafe(bc),
        { name: "BareError", issue: "too large number" },
        "too many bytes",
    )

    bc = fromBytes(0x80)
    assert.throws(
        () => readUintSafe(bc),
        { name: "BareError", issue: "missing bytes" },
        "missing bytes",
    )
})

test("writeUintSafe", () => {
    let bc = fromBytes()
    writeUintSafe(bc, 0)
    writeUintSafe(bc, 0x7f)
    writeUintSafe(bc, 0x1337)
    writeUintSafe(bc, Number.MAX_SAFE_INTEGER)
    assert.deepEqual(
        toBytes(bc),
        [0, 0x7f, 0xb7, 0x26, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf],
    )

    bc = fromBytes()
    assert.throws(
        () => writeUintSafe(bc, Number.MAX_SAFE_INTEGER + 1),
        { name: "AssertionError", message: "too large number" },
        "too large number",
    )
})
