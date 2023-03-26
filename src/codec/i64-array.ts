import type { ByteCursor } from "../core/index.js"
import { DEV, assert } from "../util/assert.js"
import { I64_BYTE_COUNT } from "../util/constants.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import {
    readI64,
    readUintSafe32,
    writeI64,
    writeUintSafe32,
} from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export const readI64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? readI64FixedArrayLE
    : readI64FixedArrayBE

export function readI64Array(bc: ByteCursor): BigInt64Array {
    return readI64FixedArray(bc, readUintSafe32(bc))
}

function readI64FixedArrayLE(bc: ByteCursor, len: number): BigInt64Array {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * I64_BYTE_COUNT
    return new BigInt64Array(readFixedData(bc, byteCount))
}

function readI64FixedArrayBE(bc: ByteCursor, len: number): BigInt64Array {
    if (DEV) {
        assert(isU32(len))
    }
    bc.check(len * I64_BYTE_COUNT)
    const result = new BigInt64Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readI64(bc)
    }
    return result
}

export const writeI64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? writeI64FixedArrayLE
    : writeI64FixedArrayBE

export function writeI64Array(bc: ByteCursor, x: BigInt64Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length !== 0) {
        writeI64FixedArray(bc, x)
    }
}

function writeI64FixedArrayLE(bc: ByteCursor, x: BigInt64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeI64FixedArrayBE(bc: ByteCursor, x: BigInt64Array): void {
    bc.reserve(x.length * I64_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) {
        writeI64(bc, x[i])
    }
}
