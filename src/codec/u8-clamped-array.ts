import type { ByteCursor } from "../core/index.js"
import { readFixedData } from "./data.js"
import { readUintSafe, writeUintSafe } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export function readU8ClampedArray(bc: ByteCursor): Uint8ClampedArray {
    return readU8ClampedFixedArray(bc, readUintSafe(bc))
}

export function writeU8ClampedArray(
    bc: ByteCursor,
    x: Uint8ClampedArray
): void {
    writeUintSafe(bc, x.length)
    writeU8ClampedFixedArray(bc, x, x.length)
}

export function readU8ClampedFixedArray(
    bc: ByteCursor,
    len: number
): Uint8ClampedArray {
    return new Uint8ClampedArray(readFixedData(bc, len))
}

export function writeU8ClampedFixedArray(
    bc: ByteCursor,
    x: Uint8ClampedArray,
    len: number
): void {
    writeU8FixedArray(
        bc,
        new Uint8Array(x.buffer, x.byteOffset, x.byteLength),
        len
    )
}
