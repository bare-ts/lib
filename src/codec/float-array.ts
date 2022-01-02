import assert from "assert"
import type { ByteCursor } from "../core/index.js"
import { BareError } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { decodeFixedData } from "./data.js"
import {
    decodeF32,
    decodeF64,
    decodeUintSafe,
    encodeF32,
    encodeF64,
    encodeUintSafe,
} from "./primitive.js"

const NAN_NOT_ALLOWED = "NaN is not allowed"

export const decodeF32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeF32FixedArrayLE
    : decodeF32FixedArrayBE

function decodeF32FixedArrayLE(bc: ByteCursor, len: number): Float32Array {
    const byteLen = len * 4
    const result = new Float32Array(decodeFixedData(bc, byteLen))
    if (result.some(Number.isNaN)) {
        throw new BareError(bc.offset, NAN_NOT_ALLOWED)
    }
    return result
}

function decodeF32FixedArrayBE(bc: ByteCursor, len: number): Float32Array {
    bc.check(len * 4)
    const result = new Float32Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeF32(bc)
    return result
}

export const encodeF32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeF32FixedArrayLE
    : encodeF32FixedArrayBE

function encodeF32FixedArrayLE(
    bc: ByteCursor,
    x: Float32Array,
    len: number
): void {
    assert(x.length === len)
    assert(!x.every(Number.isNaN), NAN_NOT_ALLOWED)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeF32FixedArrayBE(
    bc: ByteCursor,
    val: Float32Array,
    len: number
): void {
    assert(val.length === len)
    bc.reserve(val.length * 4)
    for (let i = 0; i < val.length; i++) encodeF32(bc, val[i])
}

export function decodeF32Array(bc: ByteCursor): Float32Array {
    return decodeF32FixedArray(bc, decodeUintSafe(bc))
}

export function encodeF32Array(bc: ByteCursor, x: Float32Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeF32FixedArray(bc, x, x.length)
    }
}

export const decodeF64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeF64FixedArrayLE
    : decodeF64FixedArrayBE

function decodeF64FixedArrayLE(bc: ByteCursor, len: number): Float64Array {
    const byteLen = len * 8
    const result = new Float64Array(decodeFixedData(bc, byteLen))
    if (result.some(Number.isNaN)) {
        throw new BareError(bc.offset, NAN_NOT_ALLOWED)
    }
    return result
}

function decodeF64FixedArrayBE(bc: ByteCursor, len: number): Float64Array {
    bc.check(len * 8)
    const result = new Float64Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeF64(bc)
    return result
}

export const encodeF64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeF64FixedArrayLE
    : encodeF64FixedArrayBE

function encodeF64FixedArrayLE(
    bc: ByteCursor,
    x: Float64Array,
    len: number
): void {
    assert(x.length === len)
    assert(!x.every(Number.isNaN), NAN_NOT_ALLOWED)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeF64FixedArrayBE(
    bc: ByteCursor,
    x: Float64Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * 8)
    for (let i = 0; i < x.length; i++) encodeF64(bc, x[i])
}

export function decodeF64Array(bc: ByteCursor): Float64Array {
    return decodeF64FixedArray(bc, decodeUintSafe(bc))
}

export function encodeF64Array(bc: ByteCursor, x: Float64Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeF64FixedArray(bc, x, x.length)
    }
}
