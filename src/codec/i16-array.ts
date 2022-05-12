import type { ByteCursor } from "../core/index.js"
import { I16_BYTE_COUNT } from "../util/constants.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { readFixedData } from "./data.js"
import { readI16, readUintSafe, writeI16, writeUintSafe } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readI16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readI16FixedArrayLE
    : readI16FixedArrayBE

export function readI16Array(bc: ByteCursor): Int16Array {
    return readI16FixedArray(bc, readUintSafe(bc))
}

function readI16FixedArrayLE(bc: ByteCursor, len: number): Int16Array {
    const byteCount = len * I16_BYTE_COUNT
    return new Int16Array(readFixedData(bc, byteCount))
}

function readI16FixedArrayBE(bc: ByteCursor, len: number): Int16Array {
    bc.check(len * I16_BYTE_COUNT)
    const result = new Int16Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readI16(bc)
    }
    return result
}

export const writeI16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeI16FixedArrayLE
    : writeI16FixedArrayBE

export function writeI16Array(bc: ByteCursor, x: Int16Array): void {
    writeUintSafe(bc, x.length)
    if (x.length !== 0) {
        writeI16FixedArray(bc, x)
    }
}

function writeI16FixedArrayLE(bc: ByteCursor, x: Int16Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeI16FixedArrayBE(bc: ByteCursor, x: Int16Array): void {
    bc.reserve(x.length * I16_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) {
        writeI16(bc, x[i])
    }
}
