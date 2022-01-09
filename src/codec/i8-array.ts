import type { ByteCursor } from "../core/index.js"
import { readFixedData } from "./data.js"
import { readUintSafe, writeUintSafe } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

export function readI8Array(bc: ByteCursor): Int8Array {
    return readI8FixedArray(bc, readUintSafe(bc))
}

export function writeI8Array(bc: ByteCursor, x: Int8Array): void {
    writeUintSafe(bc, x.length)
    writeI8FixedArray(bc, x)
}

export function readI8FixedArray(bc: ByteCursor, len: number): Int8Array {
    return new Int8Array(readFixedData(bc, len))
}

export function writeI8FixedArray(bc: ByteCursor, x: Int8Array): void {
    writeU8FixedArray(bc, new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}
