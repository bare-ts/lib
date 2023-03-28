import { type ByteCursor, check, reserve } from "../core/byte-cursor.js"
import { DEV, assert } from "../util/assert.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import {
    readU32,
    readUintSafe32,
    writeU32,
    writeUintSafe32,
} from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readU32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readU32FixedArrayLE
    : readU32FixedArrayBE

export function readU32Array(bc: ByteCursor): Uint32Array {
    return readU32FixedArray(bc, readUintSafe32(bc))
}

function readU32FixedArrayLE(bc: ByteCursor, len: number): Uint32Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 4
    return new Uint32Array(readFixedData(bc, byteCount))
}

function readU32FixedArrayBE(bc: ByteCursor, len: number): Uint32Array {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 4)
    const result = new Uint32Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readU32(bc)
    }
    return result
}

export const writeU32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeU32FixedArrayLE
    : writeU32FixedArrayBE

export function writeU32Array(bc: ByteCursor, x: Uint32Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length !== 0) {
        writeU32FixedArray(bc, x)
    }
}

function writeU32FixedArrayLE(bc: ByteCursor, x: Uint32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeU32FixedArrayBE(bc: ByteCursor, x: Uint32Array): void {
    reserve(bc, x.length * 4)
    for (let i = 0; i < x.length; i++) {
        writeU32(bc, x[i])
    }
}
