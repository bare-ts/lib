import type { ByteCursor } from "../core/index.js"
import {
    decodeU8Array,
    decodeU8FixedArray,
    encodeU8Array,
    encodeU8FixedArray,
} from "./u8-array.js"

export function decodeData(bc: ByteCursor): ArrayBuffer {
    return decodeU8Array(bc).buffer
}

export function encodeData(bc: ByteCursor, x: ArrayBuffer): void {
    encodeU8Array(bc, new Uint8Array(x))
}

export function decodeFixedData(bc: ByteCursor, len: number): ArrayBuffer {
    return decodeU8FixedArray(bc, len).buffer
}

export function encodeFixedData(
    bc: ByteCursor,
    x: ArrayBuffer,
    len: number
): void {
    encodeU8FixedArray(bc, new Uint8Array(x), len)
}
