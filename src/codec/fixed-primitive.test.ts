//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { DEV } from "#dev"
import { fromBytes, toBytes } from "./_util.test.ts"
import {
    readBool,
    readF32,
    readF64,
    readI8,
    readI16,
    readI32,
    readI64,
    readI64Safe,
    readU8,
    readU16,
    readU32,
    readU64,
    readU64Safe,
    writeBool,
    writeF32,
    writeF64,
    writeI8,
    writeI16,
    writeI32,
    writeI64,
    writeI64Safe,
    writeU8,
    writeU16,
    writeU32,
    writeU64,
    writeU64Safe,
} from "./fixed-primitive.ts"

test("readBool", () => {
    {
        const bc = fromBytes(0, 0x1)
        assert.deepEqual(readBool(bc), false, "readd false")
        assert.deepEqual(readBool(bc), true, "readd true")
        assert.throws(
            () => readBool(bc),
            { name: "BareError", issue: "missing bytes", offset: 2 },
            "missing bytes",
        )
    }

    {
        const bc = fromBytes(0x42)
        assert.throws(
            () => readBool(bc),
            {
                name: "BareError",
                issue: "a bool must be equal to 0 or 1",
                offset: 0,
            },
            "malformed bool",
        )
    }
})

test("writeBool", () => {
    const bc = fromBytes()
    writeBool(bc, false)
    writeBool(bc, true)
    assert.deepEqual(bc.offset, 2)
    assert.deepEqual(toBytes(bc)[0], 0, "written false")
    assert.deepEqual(toBytes(bc)[1], 1, "written true")
})

test("readF32", () => {
    {
        const bc = fromBytes(0, 0, 0xfa, 0x41)
        assert.deepEqual(readF32(bc), 1000 / 2 ** 5) // dyadic number
        assert.throws(
            () => readF32(bc),
            { name: "BareError", issue: "missing bytes", offset: 4 },
            "missing bytes",
        )
    }

    {
        const bc = fromBytes(0, 0, 0xc0, 0x7f)
        assert.deepEqual(Number.isNaN(readF32(bc)), true)
    }

    {
        // test with a NaN payload
        const bc = fromBytes(0, 1, 0xc0, 0x7f)
        assert.deepEqual(Number.isNaN(readF32(bc)), true)
    }
})

test("writeF32", () => {
    {
        const bc = fromBytes()
        writeF32(bc, 1000 / 2 ** 5) // dyadic number
        assert.deepEqual(toBytes(bc), [0, 0, 0xfa, 0x41])
    }

    {
        const bc = fromBytes()
        writeF32(bc, Number.NaN)
        // canonical quiet NaN emitted by v8
        assert.deepEqual(toBytes(bc), [0, 0, 0xc0, 0x7f])
    }

    {
        const bc = fromBytes()
        const action = () => writeF32(bc, 10 ** 20 / 2 ** 30)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0xec, 0x78, 0xad, 0x51])
        }
    }
})

test("readF64", () => {
    {
        const bc = fromBytes(64, 140, 181, 120, 29, 175, 53, 66)
        assert.deepEqual(readF64(bc), 10 ** 20 / 2 ** 30) // dyadic number
        assert.throws(
            () => readF64(bc),
            { name: "BareError", issue: "missing bytes", offset: 8 },
            "missing bytes",
        )
    }

    {
        const bc = fromBytes(0, 0, 0, 0, 0, 0, 0xf8, 0x7f)
        assert.deepEqual(Number.isNaN(readF64(bc)), true)
    }

    {
        // test with a NaN payload
        const bc = fromBytes(0, 0, 0, 1, 0, 0, 0xf8, 0x7f)
        assert.deepEqual(Number.isNaN(readF64(bc)), true)
    }
})

test("writeF64", () => {
    {
        const bc = fromBytes()
        writeF64(bc, 10 ** 20 / 2 ** 30) // dyadic number
        assert.deepEqual(toBytes(bc), [64, 140, 181, 120, 29, 175, 53, 66])
    }

    {
        const bc = fromBytes()
        writeF64(bc, Number.NaN)
        // canonical quiet NaN emitted by v8
        assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0xf8, 0x7f])
    }
})

test("readI8", () => {
    const bc = fromBytes(0xd6)
    assert.deepEqual(readI8(bc), -42)
    assert.throws(
        () => readI8(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes",
    )
})

test("writeI8", () => {
    {
        const bc = fromBytes()
        writeI8(bc, -42)
        assert.deepEqual(toBytes(bc), [0xd6])
    }

    {
        const bc = fromBytes()
        const action = () => writeI8(bc, 2 ** 7)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0x80])
        }
    }

    {
        const bc = fromBytes()
        const action = () => writeI8(bc, -(2 ** 7 + 1))
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large negative",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0x7f])
        }
    }
})

test("readI16", () => {
    const bc = fromBytes(0x2e, 0xfb)
    assert.deepEqual(readI16(bc), -1234)
    assert.throws(
        () => readI16(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes",
    )
})

test("writeI16", () => {
    {
        const bc = fromBytes()
        writeI16(bc, -1234)
        assert.deepEqual(toBytes(bc), [0x2e, 0xfb])
    }

    {
        const bc = fromBytes()
        const action = () => writeI16(bc, 2 ** 15)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0x80])
        }
    }

    {
        const bc = fromBytes()
        const action = () => writeI16(bc, -(2 ** 15 + 1))
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large negative",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0xff, 0x7f])
        }
    }
})

test("readI32", () => {
    const bc = fromBytes(0xb2, 0x9e, 0x43, 0xff)
    assert.deepEqual(readI32(bc), -12345678)
    assert.throws(
        () => readI32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes",
    )
})

test("writeI32", () => {
    {
        const bc = fromBytes()
        writeI32(bc, -12345678)
        assert.deepEqual(toBytes(bc), [0xb2, 0x9e, 0x43, 0xff])
    }

    {
        const bc = fromBytes()
        const action = () => writeI32(bc, 2 ** 31)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0, 0, 0x80])
        }
    }

    {
        const bc = fromBytes()
        const action = () => writeI32(bc, -(2 ** 31 + 1))
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large negative",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0xff, 0xff, 0xff, 0x7f])
        }
    }
})

const BIG_NEG_INT = -(BigInt(12345678) * BigInt(10 ** 9) + BigInt(987654321))

test("readI64", () => {
    const bc = fromBytes(0x4f, 0x0b, 0x6e, 0x9d, 0xab, 0x23, 0xd4, 0xff)
    assert.deepEqual(readI64(bc), BIG_NEG_INT)
    assert.throws(
        () => readI64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes",
    )
})

test("writeI64", () => {
    {
        const bc = fromBytes()
        writeI64(bc, BIG_NEG_INT)
        assert.deepEqual(
            toBytes(bc),
            [0x4f, 0x0b, 0x6e, 0x9d, 0xab, 0x23, 0xd4, 0xff],
        )
    }

    {
        const bc = fromBytes()
        const action = () => writeI64(bc, BigInt(2 ** 31) * BigInt(2 ** 32))
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0, 0x80])
        }
    }

    {
        const bc = fromBytes()
        const action = () =>
            writeI64(bc, -(BigInt(2 ** 31) * BigInt(2 ** 32) + BigInt(1)))
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large negative",
            )
        } else {
            action()
            assert.deepEqual(
                toBytes(bc),
                [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f],
            )
        }
    }
})

test("readI64Safe", () => {
    {
        const bc = fromBytes(
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
        assert.deepEqual(readI64Safe(bc), 0)
        assert.deepEqual(readI64Safe(bc), Number.MAX_SAFE_INTEGER)
        assert.deepEqual(readI64Safe(bc), -42)
        assert.deepEqual(readI64Safe(bc), -(2 ** 32))
        assert.deepEqual(readI64Safe(bc), Number.MIN_SAFE_INTEGER)
        assert.throws(
            () => readI64Safe(bc),
            { name: "BareError", issue: "missing bytes", offset: 5 * 8 },
            "missing bytes",
        )
    }

    {
        const bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x20, 0)
        assert.throws(
            () => readI64Safe(bc),
            { name: "BareError", issue: "too large number", offset: 0 },
            "too large number",
        )
    }
})

test("writeI64Safe", () => {
    {
        const bc = fromBytes()
        writeI64Safe(bc, 0)
        writeI64Safe(bc, Number.MAX_SAFE_INTEGER)
        writeI64Safe(bc, -42)
        writeI64Safe(bc, -(2 ** 32))
        writeI64Safe(bc, Number.MIN_SAFE_INTEGER)
        assert.deepEqual(
            toBytes(bc),
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0x1f, 0, 0xd6, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0, 0,
                0, 0, 0xff, 0xff, 0xff, 0xff, 1, 0, 0, 0, 0, 0, 0xe0, 0xff,
            ],
        )
    }

    {
        const bc = fromBytes()
        const action = () => writeI64Safe(bc, Number.MAX_SAFE_INTEGER + 1)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0x20, 0])
        }
    }

    {
        const bc = fromBytes()
        const action = () => writeI64Safe(bc, Number.MIN_SAFE_INTEGER - 1)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large negative",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0, 0])
        }
    }
})

test("readU8", () => {
    const bc = fromBytes(0x42)
    assert.deepEqual(readU8(bc), 0x42)
    assert.throws(
        () => readU8(bc),
        { name: "BareError", issue: "missing bytes", offset: 1 },
        "missing bytes",
    )
})

test("writeU8", () => {
    {
        const bc = fromBytes()
        writeU8(bc, 0x42)
        assert.deepEqual(toBytes(bc), [0x42])
    }

    {
        const bc = fromBytes()
        const action = () => writeU8(bc, 0x100)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0])
        }
    }
})

test("readU16", () => {
    const bc = fromBytes(0xfe, 0xca)
    assert.deepEqual(readU16(bc), 0xcafe)
    assert.throws(
        () => readU16(bc),
        { name: "BareError", issue: "missing bytes", offset: 2 },
        "missing bytes",
    )
})

test("writeU16", () => {
    {
        const bc = fromBytes()
        writeU16(bc, 0xcafe)
        assert.deepEqual(toBytes(bc), [0xfe, 0xca])
    }

    {
        const bc = fromBytes()
        const action = () => writeU16(bc, 0x10000)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0])
        }
    }
})

test("readU32", () => {
    const bc = fromBytes(0xef, 0xbe, 0xad, 0xde)
    assert.deepEqual(readU32(bc), 0xdeadbeef)
    assert.throws(
        () => readU32(bc),
        { name: "BareError", issue: "missing bytes", offset: 4 },
        "missing bytes",
    )
})

test("writeU32", () => {
    {
        const bc = fromBytes()
        writeU32(bc, 0xdeadbeef)
        assert.deepEqual(toBytes(bc), [0xef, 0xbe, 0xad, 0xde])
    }

    {
        const bc = fromBytes()
        const action = () => writeU32(bc, 2 ** 32)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0, 0, 0])
        }
    }
})

const CAFE_BABE_DEAD_BEEF =
    (BigInt(0xcafe_babe) << BigInt(32)) + BigInt(0xdead_beef)

test("readU64", () => {
    const bc = fromBytes(0xef, 0xbe, 0xad, 0xde, 0xbe, 0xba, 0xfe, 0xca)
    assert.deepEqual(readU64(bc), CAFE_BABE_DEAD_BEEF)
    assert.throws(
        () => readU64(bc),
        { name: "BareError", issue: "missing bytes", offset: 8 },
        "missing bytes",
    )
})

test("writeU64", () => {
    {
        const bc = fromBytes()
        writeU64(bc, CAFE_BABE_DEAD_BEEF)
        assert.deepEqual(
            toBytes(bc),
            [0xef, 0xbe, 0xad, 0xde, 0xbe, 0xba, 0xfe, 0xca],
        )
    }

    {
        const bc = fromBytes()
        const action = () => writeU64(bc, BigInt(2 ** 32) * BigInt(2 ** 32))
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(toBytes(bc), [0, 0, 0, 0, 0, 0, 0, 0])
        }
    }
})

test("readU64Safe", () => {
    {
        const bc = fromBytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0)
        assert.deepEqual(readU64Safe(bc), Number.MAX_SAFE_INTEGER)
        assert.throws(
            () => readU64Safe(bc),
            { name: "BareError", issue: "missing bytes", offset: 8 },
            "missing bytes",
        )
    }

    {
        const bc = fromBytes(0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x20, 0)
        assert.throws(
            () => readU64Safe(bc),
            { name: "BareError", issue: "too large number", offset: 0 },
            "too large number",
        )
    }
})

test("writeU64Safe", () => {
    {
        const bc = fromBytes()
        writeU64Safe(bc, Number.MAX_SAFE_INTEGER)
        assert.deepEqual(
            toBytes(bc),
            [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1f, 0],
        )
    }

    {
        const bc = fromBytes()
        // biome-ignore lint/correctness/noPrecisionLoss: the lost of precision is intended
        const action = () => writeU64Safe(bc, 0xcafe_babe_dead_beef)
        if (DEV) {
            assert.throws(
                action,
                { name: "AssertionError", message: "too large number" },
                "too large number",
            )
        } else {
            action()
            assert.deepEqual(
                toBytes(bc),
                [0, 0xc0, 0xad, 0xde, 0xbe, 0xba, 0x1e, 0],
            )
        }
    }
})
