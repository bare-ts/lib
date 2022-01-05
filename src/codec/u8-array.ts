import { ok as assert } from "assert"
import type { ByteCursor } from "../core/index.js"
import { decodeUintSafe, encodeUintSafe } from "./primitive.js"

export function decodeU8Array(bc: ByteCursor): Uint8Array {
    const len = decodeUintSafe(bc)
    return bc.read(len).slice()
}

export function encodeU8Array(bc: ByteCursor, x: Uint8Array): void {
    encodeUintSafe(bc, x.length)
    bc.write(x)
}

export function decodeU8FixedArray(bc: ByteCursor, len: number): Uint8Array {
    return bc.read(len).slice()
}

export function encodeU8FixedArray(
    bc: ByteCursor,
    x: Uint8Array,
    len: number
): void {
    assert(x.length === len)
    bc.write(x)
}
