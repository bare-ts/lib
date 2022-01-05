import { ok as assert } from "assert"
import type { ByteCursor } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { decodeFixedData } from "./data.js"
import {
    decodeU16,
    decodeUintSafe,
    encodeU16,
    encodeUintSafe,
} from "./primitive.js"

const U16_BYTE_COUNT = 2

export const decodeU16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeU16FixedArrayLE
    : decodeU16FixedArrayBE

export function decodeU16Array(bc: ByteCursor): Uint16Array {
    return decodeU16FixedArray(bc, decodeUintSafe(bc))
}

function decodeU16FixedArrayLE(bc: ByteCursor, len: number): Uint16Array {
    const byteCount = len * U16_BYTE_COUNT
    return new Uint16Array(decodeFixedData(bc, byteCount))
}

function decodeU16FixedArrayBE(bc: ByteCursor, len: number): Uint16Array {
    bc.check(len * U16_BYTE_COUNT)
    const result = new Uint16Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeU16(bc)
    return result
}

export const encodeU16FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeU16FixedArrayLE
    : encodeU16FixedArrayBE

export function encodeU16Array(bc: ByteCursor, x: Uint16Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeU16FixedArray(bc, x, x.length)
    }
}

function encodeU16FixedArrayLE(
    bc: ByteCursor,
    x: Uint16Array,
    len: number
): void {
    assert(x.length === len)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeU16FixedArrayBE(
    bc: ByteCursor,
    x: Uint16Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * U16_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) encodeU16(bc, x[i])
}
