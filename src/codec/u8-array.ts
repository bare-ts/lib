import { type ByteCursor, check, reserve } from "../core/byte-cursor.js"
import { DEV, assert } from "../util/assert.js"
import { isU32 } from "../util/validator.js"
import { readUintSafe32, writeUintSafe32 } from "./primitive.js"

export function readU8Array(bc: ByteCursor): Uint8Array {
    return readU8FixedArray(bc, readUintSafe32(bc))
}

export function writeU8Array(bc: ByteCursor, x: Uint8Array): void {
    writeUintSafe32(bc, x.length)
    writeU8FixedArray(bc, x)
}

export function readU8FixedArray(bc: ByteCursor, len: number): Uint8Array {
    return readUnsafeU8FixedArray(bc, len).slice()
}

export function writeU8FixedArray(bc: ByteCursor, x: Uint8Array): void {
    const len = x.length
    if (len !== 0) {
        reserve(bc, len)
        bc.bytes.set(x, bc.offset)
        bc.offset += len
    }
}

/**
 * Advance `bc` by `len` bytes and return a view of the read bytes.
 *
 * WARNING: The returned array should not be modified.
 */
export function readUnsafeU8FixedArray(
    bc: ByteCursor,
    len: number,
): Uint8Array {
    if (DEV) {
        assert(isU32(len))
    }
    check(bc, len)
    const offset = bc.offset
    bc.offset += len
    return bc.bytes.subarray(offset, offset + len)
}
