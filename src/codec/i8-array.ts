//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import type { ByteCursor } from "../core/byte-cursor.js"
import { assert, DEV } from "../util/assert.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import { readUintSafe, writeUintSafe32 } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export function readI8Array(bc: ByteCursor): Int8Array<ArrayBuffer> {
    return readI8FixedArray(bc, readUintSafe(bc))
}

export function writeI8Array(bc: ByteCursor, x: Int8Array): void {
    writeUintSafe32(bc, x.length)
    writeI8FixedArray(bc, x)
}

export function readI8FixedArray(
    bc: ByteCursor,
    len: number,
): Int8Array<ArrayBuffer> {
    if (DEV) {
        assert(isU32(len))
    }
    return new Int8Array(readFixedData(bc, len))
}

export function writeI8FixedArray(bc: ByteCursor, x: Int8Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}
