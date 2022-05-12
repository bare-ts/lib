import type { ByteCursor } from "../core/index.js"
import { U64_BYTE_COUNT } from "../util/constants.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { readFixedData } from "./data.js"
import { readU64, readUintSafe, writeU64, writeUintSafe } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readU64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readU64FixedArrayLE
    : readU64FixedArrayBE

export function readU64Array(bc: ByteCursor): BigUint64Array {
    return readU64FixedArray(bc, readUintSafe(bc))
}

function readU64FixedArrayLE(bc: ByteCursor, len: number): BigUint64Array {
    const byteCount = len * U64_BYTE_COUNT
    return new BigUint64Array(readFixedData(bc, byteCount))
}

function readU64FixedArrayBE(bc: ByteCursor, len: number): BigUint64Array {
    bc.check(len * U64_BYTE_COUNT)
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
    writeUintSafe(bc, x.length)
    if (x.length !== 0) {
        writeU64FixedArray(bc, x)
    }
}

function writeU64FixedArrayLE(bc: ByteCursor, x: BigUint64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeU64FixedArrayBE(bc: ByteCursor, x: BigUint64Array): void {
    bc.reserve(x.length * U64_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) {
        writeU64(bc, x[i])
    }
}
