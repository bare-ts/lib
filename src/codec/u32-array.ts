import { type ByteCursor, check, reserve } from "../core/byte-cursor.js"
import { assert, DEV } from "../util/assert.js"
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

export const readU32FixedArray: (
    bc: ByteCursor,
    len: number,
) => Uint32Array<ArrayBuffer> = IS_LITTLE_ENDIAN_PLATFORM
    ? readU32FixedArrayLe
    : readU32FixedArrayBe

export function readU32Array(bc: ByteCursor): Uint32Array<ArrayBuffer> {
    return readU32FixedArray(bc, readUintSafe32(bc))
}

function readU32FixedArrayLe(
    bc: ByteCursor,
    len: number,
): Uint32Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 4
    return new Uint32Array(readFixedData(bc, byteCount))
}

function readU32FixedArrayBe(
    bc: ByteCursor,
    len: number,
): Uint32Array<ArrayBuffer> {
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

export const writeU32FixedArray: (bc: ByteCursor, x: Uint32Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeU32FixedArrayLe : writeU32FixedArrayBe

export function writeU32Array(bc: ByteCursor, x: Uint32Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length > 0) {
        writeU32FixedArray(bc, x)
    }
}

function writeU32FixedArrayLe(bc: ByteCursor, x: Uint32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeU32FixedArrayBe(bc: ByteCursor, x: Uint32Array): void {
    reserve(bc, x.length * 4)
    for (let i = 0; i < x.length; i++) {
        writeU32(bc, x[i])
    }
}
