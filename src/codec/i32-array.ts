//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { type ByteCursor, check, reserve } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.ts"
import { isU32 } from "../util/validator.ts"
import { readFixedData } from "./data.ts"
import { readI32, writeI32 } from "./fixed-primitive.ts"
import { writeU8FixedArray } from "./u8-array.ts"
import { readUintSafe32, writeUintSafe32 } from "./uint.ts"

export const readI32FixedArray: (
    bc: ByteCursor,
    len: number,
) => Int32Array<ArrayBuffer> = IS_LITTLE_ENDIAN_PLATFORM
    ? readI32FixedArrayLe
    : readI32FixedArrayBe

export function readI32Array(bc: ByteCursor): Int32Array<ArrayBuffer> {
    return readI32FixedArray(bc, readUintSafe32(bc))
}

function readI32FixedArrayLe(
    bc: ByteCursor,
    len: number,
): Int32Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 4
    return new Int32Array(readFixedData(bc, byteCount))
}

function readI32FixedArrayBe(
    bc: ByteCursor,
    len: number,
): Int32Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 4)
    const result = new Int32Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readI32(bc)
    }
    return result
}

export const writeI32FixedArray: (bc: ByteCursor, x: Int32Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeI32FixedArrayLe : writeI32FixedArrayBe

export function writeI32Array(bc: ByteCursor, x: Int32Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length > 0) {
        writeI32FixedArray(bc, x)
    }
}

function writeI32FixedArrayLe(bc: ByteCursor, x: Int32Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeI32FixedArrayBe(bc: ByteCursor, x: Int32Array): void {
    reserve(bc, x.length * 4)
    for (let i = 0; i < x.length; i++) {
        writeI32(bc, x[i])
    }
}
