import type { ByteCursor } from "../core/index.js"
import { DEV, assert } from "../util/assert.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import {
    readU16,
    readUintSafe32,
    writeU16,
    writeUintSafe32,
} from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readU16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readU16FixedArrayLE
    : readU16FixedArrayBE

export function readU16Array(bc: ByteCursor): Uint16Array {
    return readU16FixedArray(bc, readUintSafe32(bc))
}

function readU16FixedArrayLE(bc: ByteCursor, len: number): Uint16Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 2
    return new Uint16Array(readFixedData(bc, byteCount))
}

function readU16FixedArrayBE(bc: ByteCursor, len: number): Uint16Array {
    if (DEV) {
        assert(isU32(len))
    }
    bc.check(len * 2)
    const result = new Uint16Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readU16(bc)
    }
    return result
}

export const writeU16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeU16FixedArrayLE
    : writeU16FixedArrayBE

export function writeU16Array(bc: ByteCursor, x: Uint16Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length !== 0) {
        writeU16FixedArray(bc, x)
    }
}

function writeU16FixedArrayLE(bc: ByteCursor, x: Uint16Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeU16FixedArrayBE(bc: ByteCursor, x: Uint16Array): void {
    bc.reserve(x.length * 2)
    for (let i = 0; i < x.length; i++) {
        writeU16(bc, x[i])
    }
}
