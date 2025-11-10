//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import * as bare from "@bare-ts/lib"

import { fromBytes, toBytes } from "./_util.test.ts"

test("bare.readFixedString", () => {
    let bc = fromBytes(
        ..."b"
            .repeat(300)
            .split("")
            .map((s) => s.charCodeAt(0)),
    )
    assert.deepEqual(
        bare.readFixedString(bc, 300),
        "b".repeat(300),
        "can natively read ASCII",
    )

    bc = fromBytes(98, 97, 114, 101)
    assert.deepEqual(bare.readFixedString(bc, 4), "bare", "can read ASCII")
})

test("bare.readString", () => {
    let bc = fromBytes(/* byteLength */ 4, 98, 97, 114, 101)
    assert.deepEqual(bare.readString(bc), "bare", "can read ASCII")

    bc = fromBytes(/* byteLength */ 6, 0xc3, 0xa9, 0xc3, 0xa0, 0xc3, 0xb9)
    assert.deepEqual(bare.readString(bc), "éàù", "can decode 2-bytes chars")

    bc = fromBytes(
        /* byteLength */ 21,
        0xf0,
        0x9f,
        0x8e,
        0x88,
        0xf0,
        0x9f,
        0x8f,
        0x83,
        0xf0,
        0x9f,
        0x8f,
        0xbf,
        0xe2,
        0x80,
        0x8d,
        0xe2,
        0x99,
        0x82,
        0xef,
        0xb8,
        0x8f,
    )
    assert.deepEqual(bare.readString(bc), "🎈🏃🏿‍♂️", "can read surrogate chars")

    bc = fromBytes(
        /* byteLength */ 0x1b,
        0xe3,
        0x81,
        0x93,
        0xe3,
        0x82,
        0x93,
        0xe3,
        0x81,
        0xab,
        0xe3,
        0x81,
        0xa1,
        0xe3,
        0x81,
        0xaf,
        0xe3,
        0x80,
        0x81,
        0xe4,
        0xb8,
        0x96,
        0xe7,
        0x95,
        0x8c,
        0xef,
        0xbc,
        0x81,
    )
    assert.deepEqual(
        bare.readString(bc),
        "\u3053\u3093\u306B\u3061\u306F\u3001\u4E16\u754C\uFF01",
    )
    assert.throws(
        () => bare.readString(bc),
        {
            name: "BareError",
            issue: "missing bytes",
        },
        "missing bytes",
    )

    bc = fromBytes(0x1)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "missing bytes" },
        "some chars are missing",
    )

    bc = fromBytes(0x1, 0xc0, 0x80)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: too short byte length",
    )

    bc = fromBytes(0x1, 0x80)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid start tag",
    )

    bc = fromBytes(0x1, 0xf8)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag",
    )

    bc = fromBytes(0x1, 0xfc)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag",
    )

    bc = fromBytes(0x1, 0xfe)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag",
    )

    bc = fromBytes(0x1, 0xff)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag",
    )

    bc = fromBytes(0x2, 0xc0, 0x80)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: overlong code point",
    )

    bc = fromBytes(0x3, 0xe0, 0x80, 0x80)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: overlong code point",
    )

    bc = fromBytes(0x4, 0xf0, 0x80, 0x80, 0x80)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: overlong code point",
    )

    bc = fromBytes(0x4, 0xf5, 0x80, 0x80, 0x80)
    assert.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: code point is grater than 10ffff",
    )
})

test("bare.writeFixedString", () => {
    let bc = fromBytes()
    bare.writeFixedString(bc, "b".repeat(300))
    assert.deepEqual(
        toBytes(bc),
        "b"
            .repeat(300)
            .split("")
            .map((s) => s.charCodeAt(0)),
        "can natively write ASCII",
    )

    bc = fromBytes()
    bare.writeFixedString(bc, "bare")
    assert.deepEqual(toBytes(bc), [98, 97, 114, 101], "can write ASCII")
})

test("bare.writeString", () => {
    let bc = fromBytes()
    bare.writeString(bc, "bare")
    assert.deepEqual(
        toBytes(bc),
        [/* byteLength */ 4, 98, 97, 114, 101],
        "can write ASCII string",
    )

    bc = fromBytes()
    bare.writeString(bc, "é".repeat(42))
    assert.deepEqual(
        toBytes(bc),
        Array.from(
            (function* () {
                yield/* byteLength */ 42 * 2
                let i = 0
                while (i++ < 42) {
                    yield 0xc3
                    yield 0xa9
                }
            })(),
        ),
        "can write short string",
    )

    bc = fromBytes()
    bare.writeString(bc, "é".repeat(60))
    assert.deepEqual(
        toBytes(bc),
        Array.from(
            (function* () {
                yield/* byteLength */ 60 * 2
                let i = 0
                while (i++ < 60) {
                    yield 0xc3
                    yield 0xa9
                }
            })(),
        ),
        "can write medium string",
    )

    bc = fromBytes()
    bare.writeString(bc, "é".repeat(128))
    assert.deepEqual(
        toBytes(bc),
        Array.from(
            (function* () {
                yield/* byteLength */ 0x80
                yield/* byteLength */ 0x1 * 2
                let i = 0
                while (i++ < 128) {
                    yield 0xc3
                    yield 0xa9
                }
            })(),
        ),
        "can write large string",
    )

    bc = fromBytes()
    bare.writeString(bc, "éàù")
    assert.deepEqual(
        toBytes(bc),
        [/* byteLength */ 6, 0xc3, 0xa9, 0xc3, 0xa0, 0xc3, 0xb9],
        "can write 2-bytes chars",
    )

    bc = fromBytes()
    bare.writeString(bc, "🎈🏃🏿‍♂️")
    assert.deepEqual(
        toBytes(bc),
        [
            /* byteLength */ 21, 0xf0, 0x9f, 0x8e, 0x88, 0xf0, 0x9f, 0x8f, 0x83,
            0xf0, 0x9f, 0x8f, 0xbf, 0xe2, 0x80, 0x8d, 0xe2, 0x99, 0x82, 0xef,
            0xb8, 0x8f,
        ],
        "can write surrogate chars",
    )

    bc = fromBytes()
    bare.writeString(
        bc,
        "\u3053\u3093\u306B\u3061\u306F\u3001\u4E16\u754C\uFF01",
    )
    assert.deepEqual(
        toBytes(bc),
        [
            /* byteLength */ 27, 0xe3, 0x81, 0x93, 0xe3, 0x82, 0x93, 0xe3, 0x81,
            0xab, 0xe3, 0x81, 0xa1, 0xe3, 0x81, 0xaf, 0xe3, 0x80, 0x81, 0xe4,
            0xb8, 0x96, 0xe7, 0x95, 0x8c, 0xef, 0xbc, 0x81,
        ],
    )
})
