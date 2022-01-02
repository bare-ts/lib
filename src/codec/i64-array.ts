import assert from "assert"
import type { ByteCursor } from "../core/index.js"
import { IS_LITTLE_ENDIAN_PLATFORM } from "../util/util.js"
import { decodeFixedData } from "./data.js"
import {
    decodeI64,
    decodeUintSafe,
    encodeI64,
    encodeUintSafe,
} from "./primitive.js"

const I64_BYTE_COUNT = 8

export const decodeI64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? decodeI64FixedArrayLE
    : decodeI64FixedArrayBE

export function decodeI64Array(bc: ByteCursor): BigInt64Array {
    return decodeI64FixedArray(bc, decodeUintSafe(bc))
}

function decodeI64FixedArrayLE(bc: ByteCursor, len: number): BigInt64Array {
    const byteCount = len * I64_BYTE_COUNT
    return new BigInt64Array(decodeFixedData(bc, byteCount))
}

function decodeI64FixedArrayBE(bc: ByteCursor, len: number): BigInt64Array {
    bc.check(len * I64_BYTE_COUNT)
    const result = new BigInt64Array(len)
    for (let i = 0; i < len; i++) result[i] = decodeI64(bc)
    return result
}

export const encodeI64FixedArray = IS_LITTLE_ENDIAN_PLATFORM
    ? encodeI64FixedArrayLE
    : encodeI64FixedArrayBE

export function encodeI64Array(bc: ByteCursor, x: BigInt64Array): void {
    encodeUintSafe(bc, x.length)
    if (x.length !== 0) {
        encodeI64FixedArray(bc, x, x.length)
    }
}

function encodeI64FixedArrayLE(
    bc: ByteCursor,
    x: BigInt64Array,
    len: number
): void {
    assert(x.length === len)
    bc.write(new Uint8Array(x.buffer, x.byteOffset, x.byteLength))
}

function encodeI64FixedArrayBE(
    bc: ByteCursor,
    x: BigInt64Array,
    len: number
): void {
    assert(x.length === len)
    bc.reserve(x.length * I64_BYTE_COUNT)
    for (let i = 0; i < x.length; i++) encodeI64(bc, x[i])
}
