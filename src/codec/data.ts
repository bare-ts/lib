//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import type { ByteCursor } from "../core/byte-cursor.js"
import { assert, DEV } from "../util/assert.js"
import { isU32 } from "../util/validator.js"
import {
    readU8Array,
    readU8FixedArray,
    writeU8Array,
    writeU8FixedArray,
} from "./u8-array.js"

export function readData(bc: ByteCursor): ArrayBuffer {
    return readU8Array(bc).buffer
}

export function writeData(bc: ByteCursor, x: ArrayBuffer): void {
    writeU8Array(bc, new Uint8Array(x))
}

export function readFixedData(bc: ByteCursor, len: number): ArrayBuffer {
    if (DEV) {
        assert(isU32(len))
    }
    return readU8FixedArray(bc, len).buffer
}

export function writeFixedData(bc: ByteCursor, x: ArrayBuffer): void {
    writeU8FixedArray(bc, new Uint8Array(x))
}
