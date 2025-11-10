//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { BareError } from "../core/bare-error.ts"
import { type ByteCursor, check, reserve } from "../core/byte-cursor.ts"
import { assert, DEV } from "../util/assert.ts"
import {
    INT_SAFE_MAX_BYTE_COUNT,
    NON_CANONICAL_REPRESENTATION,
    TOO_LARGE_NUMBER,
    UINT_MAX_BYTE_COUNT,
    UINT_SAFE32_MAX_BYTE_COUNT,
} from "../util/constants.ts"
import {
    isI8,
    isI16,
    isI32,
    isI64,
    isU8,
    isU16,
    isU32,
    isU64,
    isU64Safe,
} from "../util/validator.ts"

export function readBool(bc: ByteCursor): boolean {
    const val = readU8(bc)
    if (val > 1) {
        bc.offset--
        throw new BareError(bc.offset, "a bool must be equal to 0 or 1")
    }
    return val > 0
}

export function writeBool(bc: ByteCursor, x: boolean): void {
    writeU8(bc, x ? 1 : 0)
}

export function readF32(bc: ByteCursor): number {
    check(bc, 4)
    const result = bc.view.getFloat32(bc.offset, true)
    bc.offset += 4
    return result
}

export function writeF32(bc: ByteCursor, x: number): void {
    reserve(bc, 4)
    bc.view.setFloat32(bc.offset, x, true)
    if (DEV) {
        assert(
            Number.isNaN(x) ||
                Math.abs(bc.view.getFloat32(bc.offset, true) - x) <=
                    Number.EPSILON,
            TOO_LARGE_NUMBER,
        )
    }
    bc.offset += 4
}

export function readF64(bc: ByteCursor): number {
    check(bc, 8)
    const result = bc.view.getFloat64(bc.offset, true)
    bc.offset += 8
    return result
}

export function writeF64(bc: ByteCursor, x: number): void {
    reserve(bc, 8)
    bc.view.setFloat64(bc.offset, x, true)
    bc.offset += 8
}

export function readI8(bc: ByteCursor): number {
    check(bc, 1)
    return bc.view.getInt8(bc.offset++)
}

export function writeI8(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isI8(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 1)
    bc.view.setInt8(bc.offset++, x)
}

export function readI16(bc: ByteCursor): number {
    check(bc, 2)
    const result = bc.view.getInt16(bc.offset, true)
    bc.offset += 2
    return result
}

export function writeI16(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isI16(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 2)
    bc.view.setInt16(bc.offset, x, true)
    bc.offset += 2
}

export function readI32(bc: ByteCursor): number {
    check(bc, 4)
    const result = bc.view.getInt32(bc.offset, true)
    bc.offset += 4
    return result
}

export function writeI32(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isI32(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 4)
    bc.view.setInt32(bc.offset, x, true)
    bc.offset += 4
}

export function readI64(bc: ByteCursor): bigint {
    check(bc, 8)
    const result = bc.view.getBigInt64(bc.offset, true)
    bc.offset += 8
    return result
}

export function writeI64(bc: ByteCursor, x: bigint): void {
    if (DEV) {
        assert(isI64(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 8)
    bc.view.setBigInt64(bc.offset, x, true)
    bc.offset += 8
}

export function readI64Safe(bc: ByteCursor): number {
    const result = readU32(bc) + readI32(bc) * /* 2**32 */ 0x1_00_00_00_00
    if (!Number.isSafeInteger(result)) {
        bc.offset -= 8
        throw new BareError(bc.offset, TOO_LARGE_NUMBER)
    }
    return result
}

export function writeI64Safe(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(Number.isSafeInteger(x), TOO_LARGE_NUMBER)
    }
    let lowest32 = x >>> 0
    writeU32(bc, lowest32)
    let highest32 = (x / /* 2**32 */ 0x1_00_00_00_00) | 0
    if (x < 0) {
        // get two's complement representation of the highest 21bits
        highest32 = ~(Math.abs(highest32) & /* 2**21-1 */ 0x1f_ffff) >>> 0
        if (lowest32 === 0) {
            if (highest32 === 0x1f_ffff) {
                // maps -2**53 to Number.MIN_SAFE_INTEGER
                // this is useful when assertions are skipped
                lowest32 = 1
            } else {
                highest32++
            }
        }
    }
    writeU32(bc, highest32)
}

export function readInt(bc: ByteCursor): bigint {
    const zigZag = readUint(bc)
    return (zigZag >> BigInt(1)) ^ -(zigZag & BigInt(1))
}

export function writeInt(bc: ByteCursor, x: bigint): void {
    // truncate to mimic DataView#setBigInt64
    // this is useful when assertions are skipped
    const truncated = BigInt.asIntN(64, x)
    if (DEV) {
        assert(truncated === x, TOO_LARGE_NUMBER)
    }
    const zigZag = (truncated >> BigInt(63)) ^ (truncated << BigInt(1))
    writeTruncatedUint(bc, zigZag)
}

export function readIntSafe(bc: ByteCursor): number {
    const firstByte = readU8(bc)
    let result = (firstByte & 0x7f) >> 1
    if (firstByte >= 0x80) {
        let shiftMul = /* 2**6 */ 0x40
        let byteCount = 1
        let byte: number
        do {
            byte = readU8(bc)
            result += (byte & 0x7f) * shiftMul
            shiftMul *= /* 2**7 */ 0x80
            byteCount++
        } while (byte >= 0x80 && byteCount < INT_SAFE_MAX_BYTE_COUNT)
        if (byte === 0) {
            bc.offset -= byteCount - 1
            throw new BareError(bc.offset, "must be canonical")
        }
        if (
            byteCount === INT_SAFE_MAX_BYTE_COUNT &&
            (byte > 0x1f || firstByte === 0xff)
        ) {
            // First byte must not be equal to 0xff in order to exclude -2**53
            // Number.MIN_SAFE_INTEGER equals to -(2**53 - 1)
            bc.offset -= byteCount - 1
            throw new BareError(bc.offset, TOO_LARGE_NUMBER)
        }
    }
    const isNeg = (firstByte & 1) === 1
    if (isNeg) {
        result = -result - 1
    }
    return result
}

export function writeIntSafe(bc: ByteCursor, x: number): void {
    const sign = x < 0 ? 1 : 0
    let zigZag = x < 0 ? -(x + 1) : x
    let first7Bits = ((zigZag & 0x3f) << 1) | sign
    zigZag = Math.floor(zigZag / /* 2**6 */ 0x40)
    if (zigZag > 0) {
        if (!Number.isSafeInteger(x)) {
            if (DEV) {
                assert(false, TOO_LARGE_NUMBER)
            }
            // keep only the remaining 53 - 6 = 47 bits
            // this is useful when assertions are skipped
            const low = zigZag & 0x7fff
            const high = ((zigZag / 0x8000) >>> 0) * 0x8000
            if (first7Bits === 0x7f && low === 0x7fff && high === 0xffff_ffff) {
                // maps -2**53 to Number.MIN_SAFE_INTEGER
                // this is useful when assertions are skipped
                first7Bits &= ~0b10
            }
            zigZag = high + low
        }
        writeU8(bc, 0x80 | first7Bits)
        writeUintSafe(bc, zigZag)
    } else {
        writeU8(bc, first7Bits)
    }
}

export function readU8(bc: ByteCursor): number {
    check(bc, 1)
    return bc.bytes[bc.offset++]
}

export function writeU8(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isU8(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 1)
    bc.bytes[bc.offset++] = x
}

export function readU16(bc: ByteCursor): number {
    check(bc, 2)
    const result = bc.view.getUint16(bc.offset, true)
    bc.offset += 2
    return result
}

export function writeU16(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isU16(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 2)
    bc.view.setUint16(bc.offset, x, true)
    bc.offset += 2
}

export function readU32(bc: ByteCursor): number {
    check(bc, 4)
    const result = bc.view.getUint32(bc.offset, true)
    bc.offset += 4
    return result
}

export function writeU32(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isU32(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 4)
    bc.view.setUint32(bc.offset, x, true)
    bc.offset += 4
}

export function readU64(bc: ByteCursor): bigint {
    check(bc, 8)
    const result = bc.view.getBigUint64(bc.offset, true)
    bc.offset += 8
    return result
}

export function writeU64(bc: ByteCursor, x: bigint): void {
    if (DEV) {
        assert(isU64(x), TOO_LARGE_NUMBER)
    }
    reserve(bc, 8)
    bc.view.setBigUint64(bc.offset, x, true)
    bc.offset += 8
}

export function readU64Safe(bc: ByteCursor): number {
    const result = readU32(bc) + readU32(bc) * /* 2**32 */ 0x1_00_00_00_00
    if (!isU64Safe(result)) {
        bc.offset -= 8
        throw new BareError(bc.offset, TOO_LARGE_NUMBER)
    }
    return result
}

export function writeU64Safe(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isU64Safe(x), TOO_LARGE_NUMBER)
    }
    writeU32(bc, x >>> 0)
    writeU32(bc, (x / /* 2**32 */ 0x1_00_00_00_00) & /* 2**21-1 */ 0x1f_ffff)
}

export function readUint(bc: ByteCursor): bigint {
    let low = readU8(bc)
    if (low >= 0x80) {
        low &= 0x7f
        let shiftMul = 0x80
        let byteCount = 1
        let byte: number
        do {
            byte = readU8(bc)
            low += (byte & 0x7f) * shiftMul
            shiftMul *= /* 2**7 */ 0x80
            byteCount++
        } while (byte >= 0x80 && byteCount < 7)
        let height = 0
        shiftMul = 1
        while (byte >= 0x80 && byteCount < UINT_MAX_BYTE_COUNT) {
            byte = readU8(bc)
            height += (byte & 0x7f) * shiftMul
            shiftMul *= /* 2**7 */ 0x80
            byteCount++
        }
        if (byte === 0 || (byteCount === UINT_MAX_BYTE_COUNT && byte > 1)) {
            bc.offset -= byteCount
            throw new BareError(bc.offset, NON_CANONICAL_REPRESENTATION)
        }
        return BigInt(low) + (BigInt(height) << BigInt(7 * 7))
    }
    return BigInt(low)
}

export function writeUint(bc: ByteCursor, x: bigint): void {
    // truncate to mimic DataView#setBigUint64
    // this is useful when assertions are skipped
    const truncated = BigInt.asUintN(64, x)
    if (DEV) {
        assert(truncated === x, TOO_LARGE_NUMBER)
    }
    writeTruncatedUint(bc, truncated)
}

function writeTruncatedUint(bc: ByteCursor, x: bigint): void {
    // For better performances, we decompose `x` into two safe uint.
    let tmp = Number(BigInt.asUintN(7 * 7, x))
    let rest = Number(x >> BigInt(7 * 7))
    let byteCount = 0
    while (tmp >= 0x80 || rest > 0) {
        writeU8(bc, 0x80 | (tmp & 0x7f))
        tmp = Math.floor(tmp / /* 2**7 */ 0x80)
        byteCount++
        if (byteCount === 7) {
            tmp = rest
            rest = 0
        }
    }
    writeU8(bc, tmp)
}

export function readUintSafe32(bc: ByteCursor): number {
    let result = readU8(bc)
    if (result >= 0x80) {
        result &= 0x7f
        let shift = 7
        let byteCount = 1
        let byte: number
        do {
            byte = readU8(bc)
            result += ((byte & 0x7f) << shift) >>> 0
            shift += 7
            byteCount++
        } while (byte >= 0x80 && byteCount < UINT_SAFE32_MAX_BYTE_COUNT)
        if (byte === 0) {
            bc.offset -= byteCount - 1
            throw new BareError(
                bc.offset - byteCount + 1,
                NON_CANONICAL_REPRESENTATION,
            )
        }
        if (byteCount === UINT_SAFE32_MAX_BYTE_COUNT && byte > 0xf) {
            bc.offset -= byteCount - 1
            throw new BareError(bc.offset, TOO_LARGE_NUMBER)
        }
    }
    return result
}

export function writeUintSafe32(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isU32(x), TOO_LARGE_NUMBER)
    }
    // truncate to mimic other int encoders
    // this is useful when assertions are skipped
    let zigZag = x >>> 0
    while (zigZag >= 0x80) {
        writeU8(bc, 0x80 | (x & 0x7f))
        zigZag >>>= 7
    }
    writeU8(bc, zigZag)
}

export function readUintSafe(bc: ByteCursor): number {
    let result = readU8(bc)
    if (result >= 0x80) {
        result &= 0x7f
        let shiftMul = /* 2**7 */ 0x80
        let byteCount = 1
        let byte: number
        do {
            byte = readU8(bc)
            result += (byte & 0x7f) * shiftMul
            shiftMul *= /* 2**7 */ 0x80
            byteCount++
        } while (byte >= 0x80 && byteCount < INT_SAFE_MAX_BYTE_COUNT)
        if (byte === 0) {
            bc.offset -= byteCount - 1
            throw new BareError(
                bc.offset - byteCount + 1,
                NON_CANONICAL_REPRESENTATION,
            )
        }
        if (byteCount === INT_SAFE_MAX_BYTE_COUNT && byte > 0xf) {
            bc.offset -= byteCount - 1
            throw new BareError(bc.offset, TOO_LARGE_NUMBER)
        }
    }
    return result
}

export function writeUintSafe(bc: ByteCursor, x: number): void {
    if (DEV) {
        assert(isU64Safe(x), TOO_LARGE_NUMBER)
    }
    let byteCount = 1
    let zigZag = x
    while (zigZag >= 0x80 && byteCount < INT_SAFE_MAX_BYTE_COUNT) {
        writeU8(bc, 0x80 | (zigZag & 0x7f))
        zigZag = Math.floor(zigZag / /* 2**7 */ 0x80)
        byteCount++
    }
    if (byteCount === INT_SAFE_MAX_BYTE_COUNT) {
        // truncate to mimic other int encoders
        // this is useful when assertions are skipped
        zigZag &= 0x0f
    }
    writeU8(bc, zigZag)
}
