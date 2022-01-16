import { ok as assert } from "assert"
import type { ByteCursor } from "../core/index.js"
import { BareError } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { readFixedData } from "./data.js"
import {
    readF32,
    readF64,
    readUintSafe,
    writeF32,
    writeF64,
    writeUintSafe,
} from "./primitive.js"

const NAN_NOT_ALLOWED = "NaN is not allowed"

export const readF32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readF32FixedArrayLE
    : readF32FixedArrayBE

function readF32FixedArrayLE(bc: ByteCursor, len: number): Float32Array {
    const byteLen = len * 4
    const result = new Float32Array(readFixedData(bc, byteLen))
    if (result.some(Number.isNaN)) {
        throw new BareError(bc.offset, NAN_NOT_ALLOWED)
    }
    return result
}

function readF32FixedArrayBE(bc: ByteCursor, len: number): Float32Array {
    bc.check(len * 4)
    const result = new Float32Array(len)
    for (let i = 0; i < len; i++) result[i] = readF32(bc)
    return result
}

export const writeF32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeF32FixedArrayLE
    : writeF32FixedArrayBE

function writeF32FixedArrayLE(
    bc: ByteCursor,
    x: Float32Array,
    len: number
): void {
    assert(x.length === len)
    assert(!x.every(Number.isNaN), NAN_NOT_ALLOWED)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF32FixedArrayBE(
    bc: ByteCursor,
    val: Float32Array,
    len: number
): void {
    assert(val.length === len)
    bc.reserve(val.length * 4)
    for (let i = 0; i < val.length; i++) writeF32(bc, val[i])
}

export function readF32Array(bc: ByteCursor): Float32Array {
    return readF32FixedArray(bc, readUintSafe(bc))
}

export function writeF32Array(bc: ByteCursor, x: Float32Array): void {
    writeUintSafe(bc, x.length)
    if (x.length !== 0) {
        writeF32FixedArray(bc, x, x.length)
    }
}

export const readF64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readF64FixedArrayLE
    : readF64FixedArrayBE

function readF64FixedArrayLE(bc: ByteCursor, len: number): Float64Array {
    const byteLen = len * 8
    const result = new Float64Array(readFixedData(bc, byteLen))
    if (result.some(Number.isNaN)) {
        throw new BareError(bc.offset, NAN_NOT_ALLOWED)
    }
    return result
}

function readF64FixedArrayBE(bc: ByteCursor, len: number): Float64Array {
    bc.check(len * 8)
    const result = new Float64Array(len)
    for (let i = 0; i < len; i++) result[i] = readF64(bc)
    return result
}

export const writeF64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeF64FixedArrayLE
    : writeF64FixedArrayBE

function writeF64FixedArrayLE(
    bc: ByteCursor,
    x: Float64Array,
    len: number
): void {
    assert(x.length === len)
    assert(!x.every(Number.isNaN), NAN_NOT_ALLOWED)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF64FixedArrayBE(
    bc: ByteCursor,
    x: Float64Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * 8)
    for (let i = 0; i < x.length; i++) writeF64(bc, x[i])
}

export function readF64Array(bc: ByteCursor): Float64Array {
    return readF64FixedArray(bc, readUintSafe(bc))
}

export function writeF64Array(bc: ByteCursor, x: Float64Array): void {
    writeUintSafe(bc, x.length)
    if (x.length !== 0) {
        writeF64FixedArray(bc, x, x.length)
    }
}
