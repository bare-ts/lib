import * as bare from "@bare-ts/lib"
import { default as test } from "oletus"
import { toBytes } from "../codec/_util.js"

test("ByteCursor", (t) => {
    const config = bare.Config({
        initialBufferLength: 0,
        maxBufferLength: 0,
    })
    const expectedError = {
        name: "BareError",
        issue: "too large buffer",
        offset: 0,
    }
    t.throws(
        () => void new bare.ByteCursor(new ArrayBuffer(5), config),
        expectedError,
        "too large buffer"
    )
    t.throws(
        () => void new bare.ByteCursor(new Uint8Array(5), config),
        expectedError,
        "too large buffer"
    )
})

test("ByteCursor.check", (t) => {
    const bc = new bare.ByteCursor(new ArrayBuffer(5), bare.Config({}))
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
        new ArrayBuffer(0),
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
            name: "AssertionError",
            message: "too large buffer",
        },
        "max buffer length hit"
    )

    bc = new bare.ByteCursor(
        new Uint8Array(new ArrayBuffer(20), 5, 10),
        bare.Config({})
    )
    t.doesNotThrow(() => bc.check(10), "enough room")
    t.throws(
        () => bc.reserve(15),
        {
            name: "AssertionError",
            message: "un-growable buffer",
        },
        "un-growable buffer"
    )
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
    let bc = new bare.ByteCursor(new ArrayBuffer(1), bare.Config({}))
    bc.write(Uint8Array.of(42))
    t.deepEqual(toBytes(bc), [42])

    const bytes = Uint8Array.of(42, 0)
    bc = new bare.ByteCursor(bytes.subarray(1), bare.Config({}))
    bc.write(Uint8Array.of(24))
    t.deepEqual(Array.from(bytes), [42, 24])
})
