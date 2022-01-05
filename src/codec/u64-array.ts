import { ok as assert } from "assert"
import type { ByteCursor } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { decodeFixedData } from "./data.js"
import {
    decodeU64,
    decodeUintSafe,
    encodeU64,
    encodeUintSafe,
} from "./primitive.js"

const U64_BYTE_COUNT = 8

export const decodeU64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeU64FixedArrayLE
    : decodeU64FixedArrayBE

export function decodeU64Array(bc: ByteCursor): BigUint64Array {
    return decodeU64FixedArray(bc, decodeUintSafe(bc))
}

function decodeU64FixedArrayLE(bc: ByteCursor, len: number): BigUint64Array {
    const byteCount = len * U64_BYTE_COUNT
    return new BigUint64Array(decodeFixedData(bc, byteCount))
}

function decodeU64FixedArrayBE(bc: ByteCursor, len: number): BigUint64Array {
    bc.check(len * U64_BYTE_COUNT)
    const result = new BigUint64Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeU64(bc)
    return result
}

export const encodeU64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeU64FixedArrayLE
    : encodeU64FixedArrayBE

export function encodeU64Array(bc: ByteCursor, x: BigUint64Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeU64FixedArray(bc, x, x.length)
    }
}

function encodeU64FixedArrayLE(
    bc: ByteCursor,
    x: BigUint64Array,
    len: number
): void {
    assert(x.length === len)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeU64FixedArrayBE(
    bc: ByteCursor,
    x: BigUint64Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * U64_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) encodeU64(bc, x[i])
}
