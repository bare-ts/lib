import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { fromBytes, fromConfigBytes, toBytes } from "./_util.js"

test("bare.readString", (t) => {
    let bc = fromConfigBytes(
        { textDecoderThreshold: 0 },
        /* byteLength */ 4,
        98,
        97,
        114,
        101
    )
    t.deepEqual(bare.readString(bc), "bare", "can natively read ASCII")

    bc = fromBytes(/* byteLength */ 4, 98, 97, 114, 101)
    t.deepEqual(bare.readString(bc), "bare", "can read ASCII")

    bc = fromBytes(/* byteLength */ 6, 195, 169, 195, 160, 195, 185)
    t.deepEqual(bare.readString(bc), "éàù", "can read 2-bytes chars")

    bc = fromBytes(
        /* byteLength */ 21,
        240,
        159,
        142,
        136,
        240,
        159,
        143,
        131,
        240,
        159,
        143,
        191,
        226,
        128,
        141,
        226,
        153,
        130,
        239,
        184,
        143
    )
    t.deepEqual(bare.readString(bc), "🎈🏃🏿‍♂️", "can read surrogate chars")

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
        0x81
    )
    t.deepEqual(
        bare.readString(bc),
        "\u3053\u3093\u306B\u3061\u306F\u3001\u4E16\u754C\uFF01"
    )
    t.throws(
        () => bare.readString(bc),
        {
            name: "BareError",
            issue: "missing bytes",
        },
        "missing bytes"
    )

    bc = fromBytes(0x1)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "missing bytes" },
        "some chars are missing"
    )

    bc = fromBytes(0x1, 0x80)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid start tag"
    )

    bc = fromBytes(0x1, 0xf8)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag"
    )

    bc = fromBytes(0x1, 0xfc)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag"
    )

    bc = fromBytes(0x1, 0xfe)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag"
    )

    bc = fromBytes(0x1, 0xff)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: invalid tag"
    )

    bc = fromBytes(0x2, 0xc0, 0x80)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: overlong code point"
    )

    bc = fromBytes(0x3, 0xe0, 0x80, 0x80)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: overlong code point"
    )

    bc = fromBytes(0x4, 0xf0, 0x80, 0x80, 0x80)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: overlong code point"
    )

    bc = fromBytes(0x4, 0xf5, 0x80, 0x80, 0x80)
    t.throws(
        () => bare.readString(bc),
        { name: "BareError", issue: "invalid UTF-8 string" },
        "mal-formed string: code point is grater than 10ffff"
    )
})

test("bare.writeString", (t) => {
    let bc = fromConfigBytes({ textEncoderThreshold: 0 })
    bare.writeString(bc, "bare")
    t.deepEqual(
        toBytes(bc),
        [/* byteLength */ 4, 98, 97, 114, 101],
        "can natively write ASCII"
    )

    bc = fromBytes()
    bare.writeString(bc, "bare")
    t.deepEqual(
        toBytes(bc),
        [/* byteLength */ 4, 98, 97, 114, 101],
        "can write ASCII"
    )

    bc = fromBytes()
    bare.writeString(bc, "éàù")
    t.deepEqual(
        toBytes(bc),
        [/* byteLength */ 6, 195, 169, 195, 160, 195, 185],
        "can write 2-bytes chars"
    )

    bc = fromBytes()
    bare.writeString(bc, "🎈🏃🏿‍♂️")
    t.deepEqual(
        toBytes(bc),
        [
            /* byteLength */ 21, 240, 159, 142, 136, 240, 159, 143, 131, 240,
            159, 143, 191, 226, 128, 141, 226, 153, 130, 239, 184, 143,
        ],
        "can write surrogate chars"
    )

    bc = fromBytes()
    bare.writeString(
        bc,
        "\u3053\u3093\u306B\u3061\u306F\u3001\u4E16\u754C\uFF01"
    )
    t.deepEqual(
        toBytes(bc),
        [
            /* byteLength */ 0x1b, 0xe3, 0x81, 0x93, 0xe3, 0x82, 0x93, 0xe3,
            0x81, 0xab, 0xe3, 0x81, 0xa1, 0xe3, 0x81, 0xaf, 0xe3, 0x80, 0x81,
            0xe4, 0xb8, 0x96, 0xe7, 0x95, 0x8c, 0xef, 0xbc, 0x81,
        ]
    )
})
