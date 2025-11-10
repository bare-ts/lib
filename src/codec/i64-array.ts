//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { type ByteCursor, check, reserve } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/constants.ts"
import { isU32 } from "../util/validator.ts"
import { readFixedData } from "./data.ts"
import { readI64, writeI64 } from "./fixed-primitive.ts"
import { writeU8FixedArray } from "./u8-array.ts"
import { readUintSafe32, writeUintSafe32 } from "./uint.ts"

export const readI64FixedArray: (
    bc: ByteCursor,
    len: number,
) => BigInt64Array<ArrayBuffer> = IS_LITTLE_ENDIAN_PLATFORM
    ? readI64FixedArrayLe
    : readI64FixedArrayBe

export function readI64Array(bc: ByteCursor): BigInt64Array<ArrayBuffer> {
    return readI64FixedArray(bc, readUintSafe32(bc))
}

function readI64FixedArrayLe(
    bc: ByteCursor,
    len: number,
): BigInt64Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    const byteCount = len * 8
    return new BigInt64Array(readFixedData(bc, byteCount))
}

function readI64FixedArrayBe(
    bc: ByteCursor,
    len: number,
): BigInt64Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len * 8)
    const result = new BigInt64Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = readI64(bc)
    }
    return result
}

export const writeI64FixedArray: (bc: ByteCursor, x: BigInt64Array) => void =
    IS_LITTLE_ENDIAN_PLATFORM ? writeI64FixedArrayLe : writeI64FixedArrayBe

export function writeI64Array(bc: ByteCursor, x: BigInt64Array): void {
    writeUintSafe32(bc, x.length)
    if (x.length > 0) {
        writeI64FixedArray(bc, x)
    }
}

function writeI64FixedArrayLe(bc: ByteCursor, x: BigInt64Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function writeI64FixedArrayBe(bc: ByteCursor, x: BigInt64Array): void {
    reserve(bc, x.length * 8)
    for (let i = 0; i < x.length; i++) {
        writeI64(bc, x[i])
    }
}
