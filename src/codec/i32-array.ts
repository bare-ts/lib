import assert from "assert"
import type { ByteCursor } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { decodeFixedData } from "./data.js"
import {
    decodeI32,
    decodeUintSafe,
    encodeI32,
    encodeUintSafe,
} from "./primitive.js"

const I32_BYTE_COUNT = 4

export const decodeI32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeI32FixedArrayLE
    : decodeI32FixedArrayBE

export function decodeI32Array(bc: ByteCursor): Int32Array {
    return decodeI32FixedArray(bc, decodeUintSafe(bc))
}

function decodeI32FixedArrayLE(bc: ByteCursor, len: number): Int32Array {
    const byteCount = len * I32_BYTE_COUNT
    return new Int32Array(decodeFixedData(bc, byteCount))
}

function decodeI32FixedArrayBE(bc: ByteCursor, len: number): Int32Array {
    bc.check(len * I32_BYTE_COUNT)
    const result = new Int32Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeI32(bc)
    return result
}

export const encodeI32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeI32FixedArrayLE
    : encodeI32FixedArrayBE

export function encodeI32Array(bc: ByteCursor, x: Int32Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeI32FixedArray(bc, x, x.length)
    }
}

function encodeI32FixedArrayLE(
    bc: ByteCursor,
    x: Int32Array,
    len: number
): void {
    assert(x.length === len)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeI32FixedArrayBE(
    bc: ByteCursor,
    x: Int32Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * I32_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) encodeI32(bc, x[i])
}
