//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { type ByteCursor, check, reserve } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.ts"
import { isU32 } from "../util/validator.ts"
import { readFixedData } from "./data.ts"
import {
    readI16,
    readUintSafe32,
    writeI16,
    writeUintSafe32,
} from "./primitive.ts"
import { writeU8FixedArray } from "./u8-array.ts"

export const readI16FixedArray: (
    bc: ByteCursor,
    len: number,
) => Int16Array<ArrayBuffer> = IS_LITTLE_ENDIAN_PLATFORM
    ? readI16FixedArrayLe
    : readI16FixedArrayBe

export function readI16Array(bc: ByteCursor): Int16Array<ArrayBuffer> {
    return readI16FixedArray(bc, readUintSafe32(bc))
}

function readI16FixedArrayLe(
    bc: ByteCursor,
    len: number,
): Int16Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 2
    return new Int16Array(readFixedData(bc, byteCount))
}

function readI16FixedArrayBe(
    bc: ByteCursor,
    len: number,
): Int16Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 2)
    const result = new Int16Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readI16(bc)
    }
    return result
}

export const writeI16FixedArray: (bc: ByteCursor, x: Int16Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeI16FixedArrayLe : writeI16FixedArrayBe

export function writeI16Array(bc: ByteCursor, x: Int16Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length > 0) {
        writeI16FixedArray(bc, x)
    }
}

function writeI16FixedArrayLe(bc: ByteCursor, x: Int16Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeI16FixedArrayBe(bc: ByteCursor, x: Int16Array): void {
    reserve(bc, x.length * 2)
    for (let i = 0; i < x.length; i++) {
        writeI16(bc, x[i])
    }
}
