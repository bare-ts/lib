import type { ByteCursor } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { readFixedData } from "./data.js"
import { readI32, readUintSafe, writeI32, writeUintSafe } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

const I32_BYTE_COUNT = 4

export const readI32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readI32FixedArrayLE
    : readI32FixedArrayBE

export function readI32Array(bc: ByteCursor): Int32Array {
    return readI32FixedArray(bc, readUintSafe(bc))
}

function readI32FixedArrayLE(bc: ByteCursor, len: number): Int32Array {
    const byteCount = len * I32_BYTE_COUNT
    return new Int32Array(readFixedData(bc, byteCount))
}

function readI32FixedArrayBE(bc: ByteCursor, len: number): Int32Array {
    bc.check(len * I32_BYTE_COUNT)
    const result = new Int32Array(len)
    for (let i = 0; i < len; i++) result[i] = readI32(bc)
    return result
}

export const writeI32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeI32FixedArrayLE
    : writeI32FixedArrayBE

export function writeI32Array(bc: ByteCursor, x: Int32Array): void {
    writeUintSafe(bc, x.length)
    if (x.length !== 0) {
        writeI32FixedArray(bc, x)
    }
}

function writeI32FixedArrayLE(bc: ByteCursor, x: Int32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeI32FixedArrayBE(bc: ByteCursor, x: Int32Array): void {
    bc.reserve(x.length * I32_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) writeI32(bc, x[i])
}
