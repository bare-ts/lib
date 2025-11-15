//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import * as assert from "node:assert/strict"
import { test } from "node:test"
import { ByteCursor, check, reserve } from "./byte-cursor.ts"
import { Config } from "./config.ts"

test("ByteCursor", () => {
    const config = Config({
        initialBufferLength: 0,
        maxBufferLength: 3,
    })
    assert.throws(
        () => {
            new ByteCursor(new Uint8Array(6), config)
        },
        {
            name: "BareError",
            issue: "too large buffer",
            offset: 0,
        },
        "too large buffer",
    )
    assert.doesNotThrow(() => {
        new ByteCursor(new Uint8Array(6).subarray(0, 3), config)
    })

    const bc = new ByteCursor(new Uint8Array(6).subarray(2, 5), config)
    assert.deepEqual(bc.bytes.byteOffset, bc.view.byteOffset)
    assert.deepEqual(bc.bytes.byteLength, bc.view.byteLength)
    assert.deepEqual(bc.bytes.byteOffset, 2)
    assert.deepEqual(bc.bytes.byteLength, 3)
})

test("check", () => {
    const bc = new ByteCursor(new Uint8Array(5), Config({}))
    assert.doesNotThrow(() => check(bc, 5), "enough bytes")
    assert.throws(
        () => check(bc, 6),
        {
            name: "BareError",
            issue: "missing bytes",
            offset: 0,
        },
        "missing bytes",
    )
})

test("reserve", () => {
    let bc = new ByteCursor(
        new Uint8Array(0),
        Config({
            initialBufferLength: 0,
            maxBufferLength: 10,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 5), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 5), "reserved bytes")
    assert.doesNotThrow(() => reserve(bc, 10), "max reservable bytes")
    assert.throws(
        () => reserve(bc, 15),
        {
            name: "BareError",
            issue: "too large buffer",
            offset: 0,
        },
        "max buffer length hit",
    )

    bc = new ByteCursor(new Uint8Array(new ArrayBuffer(20), 5, 10), Config({}))
    assert.doesNotThrow(() => check(bc, 10), "enough room")
    assert.doesNotThrow(() => reserve(bc, 15))
})

test("reserve-resizable-array-buffer", () => {
    let resizable = new ArrayBuffer(0, { maxByteLength: 5 })
    let bc = new ByteCursor(
        new Uint8Array(resizable),
        Config({
            initialBufferLength: 0,
            maxBufferLength: 5,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 5), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 5), "reserved bytes")
    assert.equal(bc.bytes.buffer, resizable, "resized in-place")

    resizable = new ArrayBuffer(0, { maxByteLength: 5 })
    bc = new ByteCursor(
        new Uint8Array(resizable),
        Config({
            initialBufferLength: 0,
            maxBufferLength: 10,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 5), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 5), "reserved bytes")
    assert.equal(bc.bytes.buffer, resizable, "resized in-place")
    assert.doesNotThrow(() => reserve(bc, 10), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 10), "reserved bytes")
    assert.notEqual(bc.bytes.buffer, resizable, "replaced buffer")

    resizable = new ArrayBuffer(0, { maxByteLength: 10 })
    bc = new ByteCursor(
        new Uint8Array(resizable),
        Config({
            initialBufferLength: 0,
            maxBufferLength: 5,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 5), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 5), "reserved bytes")
    assert.equal(bc.bytes.buffer, resizable, "resized in-place")
    assert.throws(
        () => reserve(bc, 10),
        {
            name: "BareError",
            issue: "too large buffer",
            offset: 0,
        },
        "max buffer length hit",
    )

    const view = new Uint8Array(new ArrayBuffer(5, { maxByteLength: 10 }), 0, 0)
    bc = new ByteCursor(
        view,
        Config({
            initialBufferLength: 0,
            maxBufferLength: 10,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 10), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 10), "reserved bytes")
    assert.notEqual(
        bc.bytes.buffer,
        view.buffer,
        "don't override excluded bytes",
    )
})

test("reserve-growable-shared-array-buffer", () => {
    let growable = new SharedArrayBuffer(0, { maxByteLength: 5 })
    let bc = new ByteCursor(
        new Uint8Array(growable),
        Config({
            initialBufferLength: 0,
            maxBufferLength: 5,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 5), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 5), "reserved bytes")
    assert.equal(bc.bytes.buffer, growable, "grown in-place")

    growable = new SharedArrayBuffer(0, { maxByteLength: 5 })
    bc = new ByteCursor(
        new Uint8Array(growable),
        Config({
            initialBufferLength: 0,
            maxBufferLength: 10,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 5), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 5), "reserved bytes")
    assert.equal(bc.bytes.buffer, growable, "grown in-place")
    assert.doesNotThrow(() => reserve(bc, 10), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 10), "reserved bytes")
    assert.notEqual(bc.bytes.buffer, growable, "replaced buffer")

    growable = new SharedArrayBuffer(0, { maxByteLength: 10 })
    bc = new ByteCursor(
        new Uint8Array(growable),
        Config({
            initialBufferLength: 0,
            maxBufferLength: 5,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 5), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 5), "reserved bytes")
    assert.equal(bc.bytes.buffer, growable, "grown in-place")
    assert.throws(
        () => reserve(bc, 10),
        {
            name: "BareError",
            issue: "too large buffer",
            offset: 0,
        },
        "max buffer length hit",
    )

    const view = new Uint8Array(
        new SharedArrayBuffer(5, { maxByteLength: 10 }),
        0,
        0,
    )
    bc = new ByteCursor(
        view,
        Config({
            initialBufferLength: 0,
            maxBufferLength: 10,
        }),
    )
    assert.doesNotThrow(() => reserve(bc, 10), "reservable bytes")
    assert.doesNotThrow(() => check(bc, 10), "reserved bytes")
    assert.notEqual(
        bc.bytes.buffer,
        view.buffer,
        "don't override excluded bytes",
    )
})
