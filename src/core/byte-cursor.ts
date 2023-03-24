import { TOO_LARGE_BUFFER } from "../util/constants.js"
import { BareError } from "./bare-error.js"
import type { Config } from "./config.js"

/**
 * @invariant bytes.buffer === view.buffer
 * @invariant bytes.byteOffset === view.byteOffset
 * @invariant bytes.byteLength === view.byteLength
 * @invariant 0 <= offset <= bytes.byteLength
 * @invariant bytes.byteLength <= config.maxBufferLength
 *
 * |         {bytes,view}.buffer                      |
 *        |          bytes                    |
 *        |          view                     |
 *        |<------ offset ------>|
 *        |<----------- config.maxBufferLength ------------>|
 */
export class ByteCursor {
    bytes: Uint8Array

    readonly config: Config

    /**
     * Read and write Offset in {@link view} and {@link bytes}
     */
    offset: number

    view: DataView

    /**
     * @param bytes read and/or write buffer
     * @param config runtime configuration
     * @throw BareError when the buffer exceeds the maximum allowed length
     *  `config.maxBufferLength`
     */
    constructor(bytes: Uint8Array, config: Config) {
        if (bytes.length > config.maxBufferLength) {
            throw new BareError(0, TOO_LARGE_BUFFER)
        }
        this.bytes = bytes
        this.config = config
        this.offset = 0
        this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.length)
    }

    /**
     * @param min number of needed bytes
     * @throw BareError when there is not enough bytes
     */
    check(min: number): void {
        if (this.offset + min > this.bytes.length) {
            throw new BareError(this.offset, "missing bytes")
        }
    }

    /**
     * @param min number of bytes to reserve
     * @throw BareError when the buffer exceeds the maximum allowed length
     *  `config.maxBufferLength`
     */
    reserve(min: number): void {
        const minLen = (this.offset + min) | 0
        if (minLen > this.bytes.length) {
            if (minLen > this.config.maxBufferLength) {
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
            const newLen = Math.min(minLen << 1, this.config.maxBufferLength)
            const newBytes = new Uint8Array(newLen)
            newBytes.set(this.bytes)
            this.bytes = newBytes
            this.view = new DataView(newBytes.buffer)
        }
    }

    /**
     * Advance cursor by {@code len} bytes and return a view of the read bytes.
     * The returned array should not be modified.
     *
     * @param len number of bytes to read
     * @returns read bytes
     */
    read(len: number): Uint8Array {
        this.check(len)
        const offset = this.offset
        this.offset += len
        return this.bytes.subarray(offset, offset + len)
    }
}
