import assert from "assert"
import { BareError } from "../core/bare-error.js"
import type { Config } from "./config.js"

const TOO_LARGE_BUFFER = "too large buffer"

export class ByteCursor {
    declare readonly config: Config

    declare offset: number

    declare view: DataView

    constructor(bytes: ArrayBuffer | Uint8Array, config: Config) {
        this.config = config
        this.offset = 0
        this.view =
            bytes instanceof Uint8Array
                ? new DataView(bytes.buffer, bytes.byteOffset, bytes.length)
                : new DataView(bytes)
        if (this.view.byteLength > config.maxBufferLength) {
            throw new BareError(0, TOO_LARGE_BUFFER)
        }
    }

    /**
     * @param min number of needed bytes
     * @throw BareError when there is not enough bytes
     */
    check(min: number): void {
        if (this.offset + min > this.view.byteLength) {
            throw new BareError(this.offset, "missing bytes")
        }
    }

    /**
     * @param min number of bytes to reserve
     */
    reserve(min: number): void {
        const { config, offset, view } = this
        if (offset + min > view.byteLength) {
            /*
            |           newBytes                                        |
                                |       newView                         |
            |           bytes                             |
                                |       view              |
            |<---byteOffset---->|<---offset---->|<----min------>|
            |<----------------------maxBufferLength--------------------------->|
            */
            const bytes = new Uint8Array(view.buffer)
            const minExtraLength = min + offset - view.byteLength
            assert(
                bytes.length === view.byteOffset + view.byteLength,
                "un-growable buffer"
            ) // data may lay after and could be overwritten
            assert(
                bytes.length + minExtraLength <= config.maxBufferLength,
                TOO_LARGE_BUFFER
            )
            const newLen = Math.min(
                bytes.length + Math.max(minExtraLength, bytes.length),
                config.maxBufferLength
            )
            const newBytes = new Uint8Array(newLen)
            newBytes.set(bytes)
            this.view = new DataView(newBytes.buffer, view.byteOffset)
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
        const bufferOffset = this.view.byteOffset + this.offset
        this.offset += len
        return new Uint8Array(this.view.buffer, bufferOffset, len)
    }

    /**
     * Write {@code bytes} in the buffer and advance cursor by
     *  {@code bytes.length}
     *
     * @param bytes bytes to copy
     */
    write(bytes: Uint8Array): void {
        const len = bytes.length
        if (len !== 0) {
            this.reserve(len)
            const bufferOffset = this.view.byteOffset + this.offset
            const buffer = new Uint8Array(this.view.buffer)
            buffer.set(bytes, bufferOffset)
            this.offset += len
        }
    }
}
