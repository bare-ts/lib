import { BareError } from "../core/bare-error.js"
import type { ByteCursor } from "../core/index.js"
import { readUintSafe, writeUintSafe } from "./primitive.js"
import { writeU8FixedArray } from "./u8-array.js"

const INVALID_UTF8_STRING = "invalid UTF-8 string"

export function readString(bc: ByteCursor): string {
    return readFixedString(bc, readUintSafe(bc))
}

export function writeString(bc: ByteCursor, x: string): void {
    if (x.length < bc.config.textEncoderThreshold) {
        const byteLen = utf8ByteLength(x)
        writeUintSafe(bc, byteLen)
        bc.reserve(byteLen)
        writeUtf8Js(bc, x)
    } else {
        const strBytes = UTF8_ENCODER.encode(x)
        writeUintSafe(bc, strBytes.length)
        writeU8FixedArray(bc, strBytes)
    }
}

export function readFixedString(bc: ByteCursor, byteLen: number): string {
    if (byteLen < bc.config.textDecoderThreshold) {
        return readUtf8Js(bc, byteLen)
    }
    try {
        return UTF8_DECODER.decode(bc.read(byteLen))
    } catch (cause) {
        throw new BareError(bc.offset, INVALID_UTF8_STRING)
    }
}

export function writeFixedString(bc: ByteCursor, x: string): void {
    if (x.length < bc.config.textEncoderThreshold) {
        const byteLen = utf8ByteLength(x)
        bc.reserve(byteLen)
        writeUtf8Js(bc, x)
    } else {
        writeU8FixedArray(bc, UTF8_ENCODER.encode(x))
    }
}

function readUtf8Js(bc: ByteCursor, byteLen: number): string {
    bc.check(byteLen)
    let result = ""
    const bytes = bc.bytes
    let offset = bc.offset
    const upperOffset = offset + byteLen
    while (offset < upperOffset) {
        let codePoint = bytes[offset++]
        if (codePoint > 0x7f) {
            let malformed = true
            const byte1 = codePoint
            if (offset < upperOffset && codePoint < 0xe0) {
                // 110x_xxxx 10xx_xxxx
                const byte2 = bytes[offset++]
                codePoint = ((byte1 & 0x1f) << 6) | (byte2 & 0x3f)
                malformed =
                    codePoint >> 7 === 0 || // non-canonical char
                    byte1 >> 5 !== 0b110 || // invalid tag
                    byte2 >> 6 !== 0b10 // invalid tag
            } else if (offset + 1 < upperOffset && codePoint < 0xf0) {
                // 1110_xxxx 10xx_xxxx 10xx_xxxx
                const byte2 = bytes[offset++]
                const byte3 = bytes[offset++]
                codePoint =
                    ((byte1 & 0xf) << 12) |
                    ((byte2 & 0x3f) << 6) |
                    (byte3 & 0x3f)
                malformed =
                    codePoint >> 11 === 0 || // non-canonical char or missing data
                    codePoint >> 11 === 0x1b || // surrogate char (0xD800 <= codePoint <= 0xDFFF)
                    byte1 >> 4 !== 0b1110 || // invalid tag
                    byte2 >> 6 !== 0b10 || // invalid tag
                    byte3 >> 6 !== 0b10 // invalid tag
            } else if (offset + 2 < upperOffset) {
                // 1110_xxxx 10xx_xxxx 10xx_xxxx 10xx_xxxx
                const byte2 = bytes[offset++]
                const byte3 = bytes[offset++]
                const byte4 = bytes[offset++]
                codePoint =
                    ((byte1 & 0x7) << 18) |
                    ((byte2 & 0x3f) << 12) |
                    ((byte3 & 0x3f) << 6) |
                    (byte4 & 0x3f)
                malformed =
                    codePoint >> 16 === 0 || // non-canonical char or missing data
                    codePoint > 0x10ffff || // too large code point
                    byte1 >> 3 !== 0b11110 || // invalid tag
                    byte2 >> 6 !== 0b10 || // invalid tag
                    byte3 >> 6 !== 0b10 || // invalid tag
                    byte4 >> 6 !== 0b10 // invalid tag
            }
            if (malformed) {
                throw new BareError(bc.offset, INVALID_UTF8_STRING)
            }
        }
        result += String.fromCodePoint(codePoint)
    }
    bc.offset = offset
    return result
}

function writeUtf8Js(bc: ByteCursor, s: string): void {
    const bytes = bc.bytes
    let offset = bc.offset
    let i = 0
    while (i < s.length) {
        const codePoint = s.codePointAt(i++) as number | 0 // i is a valid index
        if (codePoint < 0x80) {
            bytes[offset++] = codePoint
        } else {
            if (codePoint < 0x800) {
                bytes[offset++] = 0xc0 | (codePoint >> 6)
            } else {
                if (codePoint < 0x10_000) {
                    bytes[offset++] = 0xe0 | (codePoint >> 12)
                } else {
                    bytes[offset++] = 0xf0 | (codePoint >> 18)
                    bytes[offset++] = 0x80 | ((codePoint >> 12) & 0x3f)
                    i++ // surrogate pair encoded as two ucs2 chars
                }
                bytes[offset++] = 0x80 | ((codePoint >> 6) & 0x3f)
            }
            bytes[offset++] = 0x80 | (codePoint & 0x3f)
        }
    }
    bc.offset = offset
}

function utf8ByteLength(s: string): number {
    let result = s.length
    for (let i = 0; i < s.length; i++) {
        const codePoint = s.codePointAt(i) as number | 0 // i is a valid index
        if (codePoint > 0x7f) {
            result++
            if (codePoint > 0x7ff) {
                result++
                if (codePoint > 0xff_ff) {
                    i++ // surrogate pair encoded as two ucs2 chars
                }
            }
        }
    }
    return result
}

/**
 * UTF-8 decoding and encoding using API that is supported in Node >= 12 and
 * modern browsers:
 * https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/write
 * https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/read
 *
 * If you're running in an environment where it's not available,
 * please use a polyfill, such as:
 * https://github.com/anonyco/FastestSmallestTextEncoderDecoder
 */
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true })
const UTF8_ENCODER = new TextEncoder()

interface EncodeResult {
    readonly read: number
    readonly written: number
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
 */
interface TextEncoder {
    readonly encode: (s: string) => Uint8Array
    readonly encodeInto: (s: string, target: Uint8Array) => EncodeResult
}

interface TextEncoderConstructor {
    new (): TextEncoder
}

declare const TextEncoder: TextEncoderConstructor

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
 */
interface TextDecoder {
    readonly decode: (data: ArrayBufferView) => string
}

interface TextDecoderConstructor {
    new (utf8Label: "utf-8", options: { fatal: boolean }): TextDecoder
}

declare const TextDecoder: TextDecoderConstructor
