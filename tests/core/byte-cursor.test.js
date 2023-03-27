import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"

test("ByteCursor", (t) => {
    const config = bare.Config({
        initialBufferLength: 0,
        maxBufferLength: 3,
    })
    t.throws(
        () => void new bare.ByteCursor(new Uint8Array(6), config),
        {
            name: "BareError",
            issue: "too large buffer",
            offset: 0,
        },
        "too large buffer",
    )
    t.doesNotThrow(
        () =>
            void new bare.ByteCursor(new Uint8Array(6).subarray(0, 3), config),
    )

    const bc = new bare.ByteCursor(new Uint8Array(6).subarray(2, 5), config)
    t.deepEqual(bc.bytes.byteOffset, bc.view.byteOffset)
    t.deepEqual(bc.bytes.byteLength, bc.view.byteLength)
    t.deepEqual(bc.bytes.byteOffset, 2)
    t.deepEqual(bc.bytes.byteLength, 3)
})

test("bare.check", (t) => {
    const bc = new bare.ByteCursor(new Uint8Array(5), bare.Config({}))
    t.doesNotThrow(() => bare.check(bc, 5), "enough bytes")
    t.throws(
        () => bare.check(bc, 6),
        {
            name: "BareError",
            issue: "missing bytes",
            offset: 0,
        },
        "missing bytes",
    )
})

test("bare.reserve", (t) => {
    let bc = new bare.ByteCursor(
        new Uint8Array(0),
        bare.Config({
            initialBufferLength: 10,
            maxBufferLength: 10,
        }),
    )
    t.doesNotThrow(() => bare.reserve(bc, 5), "reservable bytes")
    t.doesNotThrow(() => bare.check(bc, 5), "reserved bytes")
    t.doesNotThrow(() => bare.reserve(bc, 10), "max reservable bytes")
    t.throws(
        () => bare.reserve(bc, 15),
        {
            name: "BareError",
            issue: "too large buffer",
            offset: 0,
        },
        "max buffer length hit",
    )

    bc = new bare.ByteCursor(
        new Uint8Array(new ArrayBuffer(20), 5, 10),
        bare.Config({}),
    )
    t.doesNotThrow(() => bare.check(bc, 10), "enough room")
    t.doesNotThrow(() => bare.reserve(bc, 15))
})
