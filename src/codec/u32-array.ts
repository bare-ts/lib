import assert from "assert"
import type { ByteCursor } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { decodeFixedData } from "./data.js"
import {
    decodeU32,
    decodeUintSafe,
    encodeU32,
    encodeUintSafe,
} from "./primitive.js"

const U32_BYTE_COUNT = 4

export const decodeU32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeU32FixedArrayLE
    : decodeU32FixedArrayBE

export function decodeU32Array(bc: ByteCursor): Uint32Array {
    return decodeU32FixedArray(bc, decodeUintSafe(bc))
}

function decodeU32FixedArrayLE(bc: ByteCursor, len: number): Uint32Array {
    const byteCount = len * U32_BYTE_COUNT
    return new Uint32Array(decodeFixedData(bc, byteCount))
}

function decodeU32FixedArrayBE(bc: ByteCursor, len: number): Uint32Array {
    bc.check(len * U32_BYTE_COUNT)
    const result = new Uint32Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeU32(bc)
    return result
}

export const encodeU32FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeU32FixedArrayLE
    : encodeU32FixedArrayBE

export function encodeU32Array(bc: ByteCursor, x: Uint32Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeU32FixedArray(bc, x, x.length)
    }
}

function encodeU32FixedArrayLE(
    bc: ByteCursor,
    x: Uint32Array,
    len: number
): void {
    assert(x.length === len)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeU32FixedArrayBE(
    bc: ByteCursor,
    x: Uint32Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * U32_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) encodeU32(bc, x[i])
}
