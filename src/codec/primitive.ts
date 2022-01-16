import { ok as assert } from "assert"
import { BareError, type ByteCursor } from "../core/index.js"
import {
    isI16,
    isI32,
    isI64,
    isI8,
    isSafeU64,
    isU16,
    isU32,
    isU64,
    isU8,
} from "../util/validator.js"

const NAN_NOT_ALLOWED = "NaN is not allowed"
const NON_CANONICAL_REPRESENTATION = "must be canonical"
const TOO_LARGE_NUMBER = "too large number"

export function readBool(bc: ByteCursor): boolean {
    const val = readU8(bc)
    if (val > 1) {
        bc.offset--
        throw new BareError(bc.offset, "a bool must be equal to 0 or 1")
    }
    return val !== 0
}

export function writeBool(bc: ByteCursor, x: boolean): void {
    writeU8(bc, x ? 1 : 0)
}

export function readF32(bc: ByteCursor): number {
    bc.check(4)
    const result = bc.view.getFloat32(bc.offset, true)
    if (Number.isNaN(result)) {
        throw new BareError(bc.offset, NAN_NOT_ALLOWED)
    }
    bc.offset += 4
    return result
}

export function writeF32(bc: ByteCursor, x: number): void {
    assert(!Number.isNaN(x), NAN_NOT_ALLOWED)
    bc.reserve(4)
    bc.view.setFloat32(bc.offset, x, true)
    assert(
        Math.abs(bc.view.getFloat32(bc.offset, true) - x) <= Number.EPSILON,
        TOO_LARGE_NUMBER
    )
    bc.offset += 4
}

export function readF64(bc: ByteCursor): number {
    bc.check(8)
    const result = bc.view.getFloat64(bc.offset, true)
    if (Number.isNaN(result)) {
        throw new BareError(bc.offset, NAN_NOT_ALLOWED)
    }
    bc.offset += 8
    return result
}

export function writeF64(bc: ByteCursor, x: number): void {
    assert(!Number.isNaN(x), NAN_NOT_ALLOWED)
    bc.reserve(8)
    bc.view.setFloat64(bc.offset, x, true)
    bc.offset += 8
}

export function readI8(bc: ByteCursor): number {
    bc.check(1)
    return bc.view.getInt8(bc.offset++)
}

export function writeI8(bc: ByteCursor, x: number): void {
    assert(isI8(x), TOO_LARGE_NUMBER)
    bc.reserve(1)
    bc.view.setInt8(bc.offset++, x)
}

export function readI16(bc: ByteCursor): number {
    bc.check(2)
    const result = bc.view.getInt16(bc.offset, true)
    bc.offset += 2
    return result
}

export function writeI16(bc: ByteCursor, x: number): void {
    assert(isI16(x), TOO_LARGE_NUMBER)
    bc.reserve(2)
    bc.view.setInt16(bc.offset, x, true)
    bc.offset += 2
}

export function readI32(bc: ByteCursor): number {
    bc.check(4)
    const result = bc.view.getInt32(bc.offset, true)
    bc.offset += 4
    return result
}

export function writeI32(bc: ByteCursor, x: number): void {
    assert(isI32(x), TOO_LARGE_NUMBER)
    bc.reserve(4)
    bc.view.setInt32(bc.offset, x, true)
    bc.offset += 4
}

export function readI64(bc: ByteCursor): bigint {
    bc.check(8)
    const result = bc.view.getBigInt64(bc.offset, true)
    bc.offset += 8
    return result
}

export function writeI64(bc: ByteCursor, x: bigint): void {
    assert(isI64(x), TOO_LARGE_NUMBER)
    bc.reserve(8)
    bc.view.setBigInt64(bc.offset, x, true)
    bc.offset += 8
}

export function readI64Safe(bc: ByteCursor): number {
    const result = readU32(bc) + readI32(bc) * 0x1_00_00_00_00 // 2 ** 32
    if (!Number.isSafeInteger(result)) {
        bc.offset -= 8
        throw new BareError(bc.offset, TOO_LARGE_NUMBER)
    }
    return result
}

export function writeI64Safe(bc: ByteCursor, x: number): void {
    assert(Number.isSafeInteger(x), TOO_LARGE_NUMBER)
    const lowest32 = x >>> 0
    writeU32(bc, lowest32)
    let highest32 = (x / /* 2**32 */ 0x1_00_00_00_00) | 0
    if (x < 0) {
        // get two's complement representation of the highest 32bits
        highest32 = ~Math.abs(highest32) >>> 0
        if (lowest32 === 0) {
            highest32++
        }
    }
    writeU32(bc, highest32)
}

export function readInt(bc: ByteCursor): bigint {
    const zigZag = readUint(bc)
    return (zigZag >> BigInt(1)) ^ -(zigZag & BigInt(1))
}

export function writeInt(bc: ByteCursor, x: bigint): void {
    assert(isI64(x), TOO_LARGE_NUMBER)
    const zigZag = (x >> BigInt(63)) ^ (x << BigInt(1))
    writeUint(bc, zigZag)
}

const INT_SAFE_MAX_BYTE_COUNT = 8

export function readIntSafe(bc: ByteCursor): number {
    const firstByte = readU8(bc)
    let result = (firstByte & 0x7f) >> 1
    if (firstByte >= 0x80) {
        let shiftMul = 0x40 // 2**6
        let byteCount = 1
        let byte
        do {
            byte = readU8(bc)
            result += (byte & 0x7f) * shiftMul
            shiftMul *= 0x80 // 2**7
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
    assert(Number.isSafeInteger(x), TOO_LARGE_NUMBER)
    const sign = x < 0 ? 1 : 0
    if (x < 0) {
        x = -(x + 1)
    }
    const firstByte = ((x & 0x3f) << 1) | sign
    x = Math.floor(x / 0x40) // 2**6
    if (x > 0) {
        writeU8(bc, 0x80 | firstByte)
        writeUintSafe(bc, x)
    } else {
        writeU8(bc, firstByte)
    }
}

export function readU8(bc: ByteCursor): number {
    bc.check(1)
    return bc.bytes[bc.offset++]
}

export function writeU8(bc: ByteCursor, x: number): void {
    assert(isU8(x), TOO_LARGE_NUMBER)
    bc.reserve(1)
    bc.bytes[bc.offset++] = x
}

export function readU16(bc: ByteCursor): number {
    bc.check(2)
    const result = bc.view.getUint16(bc.offset, true)
    bc.offset += 2
    return result
}

export function writeU16(bc: ByteCursor, x: number): void {
    assert(isU16(x), TOO_LARGE_NUMBER)
    bc.reserve(2)
    bc.view.setUint16(bc.offset, x, true)
    bc.offset += 2
}

export function readU32(bc: ByteCursor): number {
    bc.check(4)
    const result = bc.view.getUint32(bc.offset, true)
    bc.offset += 4
    return result
}

export function writeU32(bc: ByteCursor, x: number): void {
    assert(isU32(x), TOO_LARGE_NUMBER)
    bc.reserve(4)
    bc.view.setUint32(bc.offset, x, true)
    bc.offset += 4
}

export function readU64(bc: ByteCursor): bigint {
    bc.check(8)
    const result = bc.view.getBigUint64(bc.offset, true)
    bc.offset += 8
    return result
}

export function writeU64(bc: ByteCursor, x: bigint): void {
    assert(isU64(x), TOO_LARGE_NUMBER)
    bc.reserve(8)
    bc.view.setBigUint64(bc.offset, x, true)
    bc.offset += 8
}

export function readU64Safe(bc: ByteCursor): number {
    const result = readU32(bc) + readU32(bc) * 0x1_00_00_00_00 // 2 ** 32
    if (!isSafeU64(result)) {
        bc.offset -= 8
        throw new BareError(bc.offset, TOO_LARGE_NUMBER)
    }
    return result
}

export function writeU64Safe(bc: ByteCursor, x: number): void {
    assert(isSafeU64(x), TOO_LARGE_NUMBER)
    writeU32(bc, x >>> 0)
    writeU32(bc, (x / /* 2**32 */ 0x1_00_00_00_00) >>> 0)
}

const UINT_MAX_BYTE_COUNT = 10

export function readUint(bc: ByteCursor): bigint {
    let low = readU8(bc)
    if (low >= 0x80) {
        low &= 0x7f
        let shiftMul = 0x80
        let byteCount = 1
        let byte
        do {
            byte = readU8(bc)
            low += (byte & 0x7f) * shiftMul
            shiftMul *= 0x80 // 2**7
            byteCount++
        } while (byte >= 0x80 && byteCount < 7)
        let height = 0
        shiftMul = 1
        while (byte >= 0x80 && byteCount < UINT_MAX_BYTE_COUNT) {
            byte = readU8(bc)
            height += (byte & 0x7f) * shiftMul
            shiftMul *= 0x80 // 2**7
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
    assert(isU64(x), TOO_LARGE_NUMBER)
    // For better performances, we decompose `x` into two safe uint.
    let tmp = Number(BigInt.asUintN(7 * 7, x))
    let rest = Number(x >> BigInt(7 * 7))
    let byteCount = 0
    while (tmp >= 0x80 || rest !== 0) {
        writeU8(bc, 0x80 | (tmp & 0x7f))
        tmp = Math.floor(tmp / 0x80) // 2**7
        byteCount++
        if (byteCount === 7) {
            tmp = rest
            rest = 0
        }
    }
    writeU8(bc, tmp)
}

const UINT_SAFE_MAX_BYTE_COUNT = 8

export function readUintSafe(bc: ByteCursor): number {
    let result = readU8(bc)
    if (result >= 0x80) {
        result &= 0x7f
        let shiftMul = 0x80 // 2**7
        let byteCount = 1
        let byte
        do {
            byte = readU8(bc)
            result += (byte & 0x7f) * shiftMul
            shiftMul *= 0x80 // 2**7
            byteCount++
        } while (byte >= 0x80 && byteCount < UINT_SAFE_MAX_BYTE_COUNT)
        if (byte === 0) {
            bc.offset -= byteCount - 1
            throw new BareError(
                bc.offset - byteCount + 1,
                NON_CANONICAL_REPRESENTATION
            )
        }
        if (byteCount === UINT_SAFE_MAX_BYTE_COUNT && byte > 0xf) {
            bc.offset -= byteCount - 1
            throw new BareError(bc.offset, TOO_LARGE_NUMBER)
        }
    }
    return result
}

export function writeUintSafe(bc: ByteCursor, x: number): void {
    assert(isSafeU64(x), TOO_LARGE_NUMBER)
    while (x >= 0x80) {
        writeU8(bc, 0x80 | (x & 0x7f))
        x = Math.floor(x / 0x80) // 2**7
    }
    writeU8(bc, x)
}

export function readVoid(_dc: ByteCursor): undefined {
    return undefined
}

export function writeVoid(_dc: ByteCursor, _x: undefined): void {
    // do nothing
}
