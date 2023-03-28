import { type ByteCursor, check, reserve } from "../core/byte-cursor.js"
import { DEV, assert } from "../util/assert.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import {
    readF32,
    readF64,
    readUintSafe32,
    writeF32,
    writeF64,
    writeUintSafe32,
} from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readF32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readF32FixedArrayLE
    : readF32FixedArrayBE

function readF32FixedArrayLE(bc: ByteCursor, len: number): Float32Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteLen = len * 4
    const result = new Float32Array(readFixedData(bc, byteLen))
    return result
}

function readF32FixedArrayBE(bc: ByteCursor, len: number): Float32Array {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 4)
    const result = new Float32Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readF32(bc)
    }
    return result
}

export const writeF32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeF32FixedArrayLE
    : writeF32FixedArrayBE

function writeF32FixedArrayLE(bc: ByteCursor, x: Float32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF32FixedArrayBE(bc: ByteCursor, val: Float32Array): void {
    reserve(bc, val.length * 4)
    for (let i = 0; i < val.length; i++) {
        writeF32(bc, val[i])
    }
}

export function readF32Array(bc: ByteCursor): Float32Array {
    return readF32FixedArray(bc, readUintSafe32(bc))
}

export function writeF32Array(bc: ByteCursor, x: Float32Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length !== 0) {
        writeF32FixedArray(bc, x)
    }
}

export const readF64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readF64FixedArrayLE
    : readF64FixedArrayBE

function readF64FixedArrayLE(bc: ByteCursor, len: number): Float64Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteLen = len * 8
    const result = new Float64Array(readFixedData(bc, byteLen))
    return result
}

function readF64FixedArrayBE(bc: ByteCursor, len: number): Float64Array {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 8)
    const result = new Float64Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readF64(bc)
    }
    return result
}

export const writeF64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeF64FixedArrayLE
    : writeF64FixedArrayBE

function writeF64FixedArrayLE(bc: ByteCursor, x: Float64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF64FixedArrayBE(bc: ByteCursor, x: Float64Array): void {
    reserve(bc, x.length * 8)
    for (let i = 0; i < x.length; i++) {
        writeF64(bc, x[i])
    }
}

export function readF64Array(bc: ByteCursor): Float64Array {
    return readF64FixedArray(bc, readUintSafe32(bc))
}

export function writeF64Array(bc: ByteCursor, x: Float64Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length !== 0) {
        writeF64FixedArray(bc, x)
    }
}
