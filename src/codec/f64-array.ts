//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { type ByteCursor, check, reserve } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.ts"
import { isU32 } from "../util/validator.ts"
import { readFixedData } from "./data.ts"
import { readF64, writeF64 } from "./fixed-primitive.ts"
import { writeU8FixedArray } from "./u8-array.ts"
import { readUintSafe32, writeUintSafe32 } from "./uint.ts"

export const readF64FixedArray: (
    bc: ByteCursor,
    len: number,
) => Float64Array<ArrayBuffer> = IS_LITTLE_ENDIAN_PLATFORM
    ? readF64FixedArrayLe
    : readF64FixedArrayBe

function readF64FixedArrayLe(
    bc: ByteCursor,
    len: number,
): Float64Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    const byteLen = len * 8
    const result = new Float64Array(readFixedData(bc, byteLen))
    return result
}

function readF64FixedArrayBe(
    bc: ByteCursor,
    len: number,
): Float64Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 8)
    const result = new Float64Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readF64(bc)
    }
    return result
}

export const writeF64FixedArray: (bc: ByteCursor, x: Float64Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeF64FixedArrayLe : writeF64FixedArrayBe

function writeF64FixedArrayLe(bc: ByteCursor, x: Float64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF64FixedArrayBe(bc: ByteCursor, x: Float64Array): void {
    reserve(bc, x.length * 8)
    for (let i = 0; i < x.length; i++) {
        writeF64(bc, x[i])
    }
}

export function readF64Array(bc: ByteCursor): Float64Array<ArrayBuffer> {
    return readF64FixedArray(bc, readUintSafe32(bc))
}

export function writeF64Array(bc: ByteCursor, x: Float64Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length > 0) {
        writeF64FixedArray(bc, x)
    }
}
