import { type ByteCursor, check, reserve } from "../core/index.js"
import { DEV, assert } from "../util/assert.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import {
    readU64,
    readUintSafe32,
    writeU64,
    writeUintSafe32,
} from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readU64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readU64FixedArrayLE
    : readU64FixedArrayBE

export function readU64Array(bc: ByteCursor): BigUint64Array {
    return readU64FixedArray(bc, readUintSafe32(bc))
}

function readU64FixedArrayLE(bc: ByteCursor, len: number): BigUint64Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 8
    return new BigUint64Array(readFixedData(bc, byteCount))
}

function readU64FixedArrayBE(bc: ByteCursor, len: number): BigUint64Array {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 8)
    const result = new BigUint64Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readU64(bc)
    }
    return result
}

export const writeU64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeU64FixedArrayLE
    : writeU64FixedArrayBE

export function writeU64Array(bc: ByteCursor, x: BigUint64Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length !== 0) {
        writeU64FixedArray(bc, x)
    }
}

function writeU64FixedArrayLE(bc: ByteCursor, x: BigUint64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeU64FixedArrayBE(bc: ByteCursor, x: BigUint64Array): void {
    reserve(bc, x.length * 8)
    for (let i = 0; i < x.length; i++) {
        writeU64(bc, x[i])
    }
}
