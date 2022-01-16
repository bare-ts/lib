import type { ByteCursor } from "../core/index.js"
import { readUintSafe, writeUintSafe } from "./primitive.js"

export function readU8Array(bc: ByteCursor): Uint8Array {
    return readU8FixedArray(bc, readUintSafe(bc))
}

export function writeU8Array(bc: ByteCursor, x: Uint8Array): void {
    writeUintSafe(bc, x.length)
    writeU8FixedArray(bc, x)
}

export function readU8FixedArray(bc: ByteCursor, len: number): Uint8Array {
    return bc.read(len).slice()
}

export function writeU8FixedArray(bc: ByteCursor, x: Uint8Array): void {
    const len = x.length
    if (len !== 0) {
        bc.reserve(len)
        bc.bytes.set(x, bc.offset)
        bc.offset += len
    }
}
