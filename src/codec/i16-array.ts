import assert from "assert"
import type { ByteCursor } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { decodeFixedData } from "./data.js"
import {
    decodeI16,
    decodeUintSafe,
    encodeI16,
    encodeUintSafe,
} from "./primitive.js"

const I16_BYTE_COUNT = 2

export const decodeI16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeI16FixedArrayLE
    : decodeI16FixedArrayBE

export function decodeI16Array(bc: ByteCursor): Int16Array {
    return decodeI16FixedArray(bc, decodeUintSafe(bc))
}

function decodeI16FixedArrayLE(bc: ByteCursor, len: number): Int16Array {
    const byteCount = len * I16_BYTE_COUNT
    return new Int16Array(decodeFixedData(bc, byteCount))
}

function decodeI16FixedArrayBE(bc: ByteCursor, len: number): Int16Array {
    bc.check(len * I16_BYTE_COUNT)
    const result = new Int16Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeI16(bc)
    return result
}

export const encodeI16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeI16FixedArrayLE
    : encodeI16FixedArrayBE

export function encodeI16Array(bc: ByteCursor, x: Int16Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeI16FixedArray(bc, x, x.length)
    }
}

function encodeI16FixedArrayLE(
    bc: ByteCursor,
    x: Int16Array,
    len: number
): void {
    assert(x.length === len)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeI16FixedArrayBE(
    bc: ByteCursor,
    x: Int16Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * I16_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) encodeI16(bc, x[i])
}
