import { type ByteCursor, check, reserve } from "../core/byte-cursor.js"
import { assert, DEV } from "../util/assert.js"
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

export const readF32FixedArray: (bc: ByteCursor, len: number) => Float32Array =
    IS_LITTLE_ENDIAN_PLATFORM ? readF32FixedArrayLe : readF32FixedArrayBe

function readF32FixedArrayLe(bc: ByteCursor, len: number): Float32Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteLen = len * 4
    const result = new Float32Array(readFixedData(bc, byteLen))
    return result
}

function readF32FixedArrayBe(bc: ByteCursor, len: number): Float32Array {
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

export const writeF32FixedArray: (bc: ByteCursor, x: Float32Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeF32FixedArrayLe : writeF32FixedArrayBe

function writeF32FixedArrayLe(bc: ByteCursor, x: Float32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF32FixedArrayBe(bc: ByteCursor, val: Float32Array): void {
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
    if (x.length > 0) {
        writeF32FixedArray(bc, x)
    }
}

export const readF64FixedArray: (bc: ByteCursor, len: number) => Float64Array =
    IS_LITTLE_ENDIAN_PLATFORM ? readF64FixedArrayLe : readF64FixedArrayBe

function readF64FixedArrayLe(bc: ByteCursor, len: number): Float64Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteLen = len * 8
    const result = new Float64Array(readFixedData(bc, byteLen))
    return result
}

function readF64FixedArrayBe(bc: ByteCursor, len: number): Float64Array {
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

export const writeF64FixedArray: (bc: ByteCursor, x: Float64Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeF64FixedArrayLe : writeF64FixedArrayBe

function writeF64FixedArrayLe(bc: ByteCursor, x: Float64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF64FixedArrayBe(bc: ByteCursor, x: Float64Array): void {
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
    if (x.length > 0) {
        writeF64FixedArray(bc, x)
    }
}
