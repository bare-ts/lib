import { assert, DEV } from "../util/assert.js"
import { TOO_LARGE_BUFFER } from "../util/constants.js"
import { isU32 } from "../util/validator.js"
import { BareError } from "./bare-error.js"
import type { Config } from "./config.js"

/**
 * @invariant `bytes.buffer === view.buffer`
 * @invariant `bytes.byteOffset === view.byteOffset`
 * @invariant `bytes.byteLength === view.byteLength`
 * @invariant `0 <= offset <= bytes.byteLength`
 * @invariant `bytes.byteLength <= config.maxBufferLength`
 *
 * ```txt
 * |         {bytes,view}.buffer                      |
 *        |          bytes                    |
 *        |          view                     |
 *        |<------ offset ------>|
 *        |<----------- config.maxBufferLength ------------>|
 * ```
 *
 * @sealed
 */
export class ByteCursor {
    bytes: Uint8Array

    readonly config: Config

    /**
     * Read and write Offset in {@link view} and {@link bytes}
     */
    offset = 0

    view: DataView

    /**
     * @throws {BareError} Buffer exceeds `config.maxBufferLength`
     */
    constructor(bytes: Uint8Array, config: Config) {
        if (bytes.length > config.maxBufferLength) {
            throw new BareError(0, TOO_LARGE_BUFFER)
        }
        this.bytes = bytes
        this.config = config
        this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.length)
    }
}

/**
 * Check that `min` number of bytes are available.
 *
 * @throws {BareError} bytes are missing.
 */
export function check(bc: ByteCursor, min: number): void {
    if (DEV) {
        assert(isU32(min))
    }
    if (bc.offset + min > bc.bytes.length) {
        throw new BareError(bc.offset, "missing bytes")
    }
}

/**
 * Reserve `min` number of bytes.
 *
 * @throws {BareError} Buffer exceeds `config.maxBufferLength`.
 */
export function reserve(bc: ByteCursor, min: number): void {
    if (DEV) {
        assert(isU32(min))
    }
    const minLen = (bc.offset + min) | 0
    if (minLen > bc.bytes.length) {
        if (minLen > bc.config.maxBufferLength) {
            throw new BareError(0, TOO_LARGE_BUFFER)
        }
        //
        // |     bytes,view}.buffer         |
        //     |        bytes        |
        //     |        view         |
        //     |<-- offset -->|<-- min -->|
        //     |<-------- minLen -------->|
        //     |         new view                         |
        //     |         new bytes                        |
        //     |         new {bytes,view}.buffer          |
        //     |<------------- config.maxBufferLength -------------->|
        //
        const newLen = Math.min(minLen << 1, bc.config.maxBufferLength)
        const newBytes = new Uint8Array(newLen)
        newBytes.set(bc.bytes)
        bc.bytes = newBytes
        bc.view = new DataView(newBytes.buffer)
    }
}
