import type { ByteCursor } from "../core/index.js"
import { decodeFixedData } from "./data.js"
import { decodeUintSafe, encodeUintSafe } from "./primitive.js"
import { encodeU8FixedArray } from "./u8-array.js"

export function decodeI8Array(bc: ByteCursor): Int8Array {
    return decodeI8FixedArray(bc, decodeUintSafe(bc))
}

export function encodeI8Array(bc: ByteCursor, x: Int8Array): void {
    encodeUintSafe(bc, x.length)
    encodeI8FixedArray(bc, x, x.length)
}

export function decodeI8FixedArray(bc: ByteCursor, len: number): Int8Array {
    return new Int8Array(decodeFixedData(bc, len))
}

export function encodeI8FixedArray(
    bc: ByteCursor,
    x: Int8Array,
    len: number
): void {
    encodeU8FixedArray(
        bc,
        new Uint8Array(x.buffer, x.byteOffset, x.byteLength),
        len
    )
}
