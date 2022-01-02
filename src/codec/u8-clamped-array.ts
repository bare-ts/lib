import type { ByteCursor } from "../core/index.js"
import { decodeFixedData } from "./data.js"
import { decodeUintSafe, encodeUintSafe } from "./primitive.js"
import { encodeU8FixedArray } from "./u8-array.js"

export function decodeU8ClampedArray(bc: ByteCursor): Uint8ClampedArray {
    return decodeU8ClampedFixedArray(bc, decodeUintSafe(bc))
}

export function encodeU8ClampedArray(
    bc: ByteCursor,
    x: Uint8ClampedArray
): void {
    encodeUintSafe(bc, x.length)
    encodeU8ClampedFixedArray(bc, x, x.length)
}

export function decodeU8ClampedFixedArray(
    bc: ByteCursor,
    len: number
): Uint8ClampedArray {
    return new Uint8ClampedArray(decodeFixedData(bc, len))
}

export function encodeU8ClampedFixedArray(
    bc: ByteCursor,
    x: Uint8ClampedArray,
    len: number
): void {
    encodeU8FixedArray(
        bc,
        new Uint8Array(x.buffer, x.byteOffset, x.byteLength),
        len
    )
}
