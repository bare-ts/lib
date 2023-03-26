import type { ByteCursor } from "../core/index.js"
import { DEV, assert } from "../util/assert.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import {
    readI32,
    readUintSafe32,
    writeI32,
    writeUintSafe32,
} from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readI32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readI32FixedArrayLE
    : readI32FixedArrayBE

export function readI32Array(bc: ByteCursor): Int32Array {
    return readI32FixedArray(bc, readUintSafe32(bc))
}

function readI32FixedArrayLE(bc: ByteCursor, len: number): Int32Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 4
    return new Int32Array(readFixedData(bc, byteCount))
}

function readI32FixedArrayBE(bc: ByteCursor, len: number): Int32Array {
    if (DEV) {
        assert(isU32(len))
    }
    bc.check(len * 4)
    const result = new Int32Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readI32(bc)
    }
    return result
}

export const writeI32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeI32FixedArrayLE
    : writeI32FixedArrayBE

export function writeI32Array(bc: ByteCursor, x: Int32Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length !== 0) {
        writeI32FixedArray(bc, x)
    }
}

function writeI32FixedArrayLE(bc: ByteCursor, x: Int32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeI32FixedArrayBE(bc: ByteCursor, x: Int32Array): void {
    bc.reserve(x.length * 4)
    for (let i = 0; i < x.length; i++) {
        writeI32(bc, x[i])
    }
}
