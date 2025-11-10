//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import type { ByteCursor } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import { isU32 } from "../util/validator.ts"
import { readFixedData } from "./data.ts"
import { readUintSafe32, writeUintSafe32 } from "./primitive.ts"
import { writeU8FixedArray } from "./u8-array.ts"

export function readU8ClampedArray(
    bc: ByteCursor,
): Uint8ClampedArray<ArrayBuffer> {
    return readU8ClampedFixedArray(bc, readUintSafe32(bc))
}

export function writeU8ClampedArray(
    bc: ByteCursor,
    x: Uint8ClampedArray,
): void {
    writeUintSafe32(bc, x.length)
    writeU8ClampedFixedArray(bc, x)
}

export function readU8ClampedFixedArray(
    bc: ByteCursor,
    len: number,
): Uint8ClampedArray<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    return new Uint8ClampedArray(readFixedData(bc, len))
}

export function writeU8ClampedFixedArray(
    bc: ByteCursor,
    x: Uint8ClampedArray,
): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}
