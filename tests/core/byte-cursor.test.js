import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { toBytes } from "../codec/_util.js"

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
        "too large buffer"
    )
    t.doesNotThrow(
        () => void new bare.ByteCursor(new Uint8Array(6).subarray(0, 3), config)
    )

    const bc = new bare.ByteCursor(new Uint8Array(6).subarray(2, 5), config)
    t.deepEqual(bc.bytes.byteOffset, bc.view.byteOffset)
    t.deepEqual(bc.bytes.byteLength, bc.view.byteLength)
    t.deepEqual(bc.bytes.byteOffset, 2)
    t.deepEqual(bc.bytes.byteLength, 3)
})

test("ByteCursor.check", (t) => {
    const bc = new bare.ByteCursor(new Uint8Array(5), bare.Config({}))
    t.doesNotThrow(() => bc.check(5), "enough bytes")
    t.throws(
        () => bc.check(6),
        {
            name: "BareError",
            issue: "missing bytes",
            offset: 0,
        },
        "missing bytes"
    )
})

test("ByteCursor.reserve", (t) => {
    let bc = new bare.ByteCursor(
        new Uint8Array(0),
        bare.Config({
            initialBufferLength: 10,
            maxBufferLength: 10,
        })
    )
    t.doesNotThrow(() => bc.reserve(5), "reservable bytes")
    t.doesNotThrow(() => bc.check(5), "reserved bytes")
    t.doesNotThrow(() => bc.reserve(10), "max reservable bytes")
    t.throws(
        () => bc.reserve(15),
        {
            name: "BareError",
            issue: "too large buffer",
            offset: 0,
        },
        "max buffer length hit"
    )

    bc = new bare.ByteCursor(
        new Uint8Array(new ArrayBuffer(20), 5, 10),
        bare.Config({})
    )
    t.doesNotThrow(() => bc.check(10), "enough room")
    t.doesNotThrow(() => bc.reserve(15))
})

test("ByteCursor.read", (t) => {
    let bc = new bare.ByteCursor(Uint8Array.of(42), bare.Config({}))
    let read = bc.read(1)
    t.deepEqual(Array.from(read), [42])

    bc = new bare.ByteCursor(Uint8Array.of(42, 24).subarray(1), bare.Config({}))
    read = bc.read(1)
    t.deepEqual(Array.from(read), [24])
})

test("ByteCursor.write", (t) => {
    let bc = new bare.ByteCursor(new Uint8Array(1), bare.Config({}))
    bc.write(Uint8Array.of(42))
    t.deepEqual(toBytes(bc), [42])

    const bytes = Uint8Array.of(42, 0)
    bc = new bare.ByteCursor(bytes.subarray(1), bare.Config({}))
    bc.write(Uint8Array.of(24))
    t.deepEqual(Array.from(bytes), [42, 24])
})
