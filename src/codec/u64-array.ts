//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { type ByteCursor, check, reserve } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.ts"
import { isU32 } from "../util/validator.ts"
import { readFixedData } from "./data.ts"
import {
    readU64,
    readUintSafe32,
    writeU64,
    writeUintSafe32,
} from "./primitive.ts"
import { writeU8FixedArray } from "./u8-array.ts"

export const readU64FixedArray: (
    bc: ByteCursor,
    len: number,
) => BigUint64Array<ArrayBuffer> = IS_LITTLE_ENDIAN_PLATFORM
    ? readU64FixedArrayLe
    : readU64FixedArrayBe

export function readU64Array(bc: ByteCursor): BigUint64Array<ArrayBuffer> {
    return readU64FixedArray(bc, readUintSafe32(bc))
}

function readU64FixedArrayLe(
    bc: ByteCursor,
    len: number,
): BigUint64Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 8
    return new BigUint64Array(readFixedData(bc, byteCount))
}

function readU64FixedArrayBe(
    bc: ByteCursor,
    len: number,
): BigUint64Array<ArrayBuffer> {
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

export const writeU64FixedArray: (bc: ByteCursor, x: BigUint64Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeU64FixedArrayLe : writeU64FixedArrayBe

export function writeU64Array(bc: ByteCursor, x: BigUint64Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length > 0) {
        writeU64FixedArray(bc, x)
    }
}

function writeU64FixedArrayLe(bc: ByteCursor, x: BigUint64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeU64FixedArrayBe(bc: ByteCursor, x: BigUint64Array): void {
    reserve(bc, x.length * 8)
    for (let i = 0; i < x.length; i++) {
        writeU64(bc, x[i])
    }
}
