import type { ByteCursor } from "../core/byte-cursor.js"
import { assert, DEV } from "../util/assert.js"
import { isU32 } from "../util/validator.js"
import { readFixedData } from "./data.js"
import { readUintSafe32, writeUintSafe32 } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export function readU8ClampedArray(bc: ByteCursor): Uint8ClampedArray {
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
): Uint8ClampedArray {
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
