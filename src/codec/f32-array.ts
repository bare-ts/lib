//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { type ByteCursor, check, reserve } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.ts"
import { isU32 } from "../util/validator.ts"
import { readFixedData } from "./data.ts"
import { readF32, writeF32 } from "./fixed-primitive.ts"
import { writeU8FixedArray } from "./u8-array.ts"
import { readUintSafe32, writeUintSafe32 } from "./uint.ts"

export const readF32FixedArray: (
    bc: ByteCursor,
    len: number,
) => Float32Array<ArrayBuffer> = IS_LITTLE_ENDIAN_PLATFORM
    ? readF32FixedArrayLe
    : readF32FixedArrayBe

function readF32FixedArrayLe(
    bc: ByteCursor,
    len: number,
): Float32Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    const byteLen = len * 4
    const result = new Float32Array(readFixedData(bc, byteLen))
    return result
}

function readF32FixedArrayBe(
    bc: ByteCursor,
    len: number,
): Float32Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 4)
    const result = new Float32Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readF32(bc)
    }
    return result
}

export const writeF32FixedArray: (bc: ByteCursor, x: Float32Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeF32FixedArrayLe : writeF32FixedArrayBe

function writeF32FixedArrayLe(bc: ByteCursor, x: Float32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeF32FixedArrayBe(bc: ByteCursor, val: Float32Array): void {
    reserve(bc, val.length * 4)
    for (let i = 0; i < val.length; i++) {
        writeF32(bc, val[i])
    }
}

export function readF32Array(bc: ByteCursor): Float32Array<ArrayBuffer> {
    return readF32FixedArray(bc, readUintSafe32(bc))
}

export function writeF32Array(bc: ByteCursor, x: Float32Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length > 0) {
        writeF32FixedArray(bc, x)
    }
}
