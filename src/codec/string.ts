import { BareError } from "../core/bare-error.js"
import type { ByteCursor } from "../core/index.js"
import { readUintSafe, writeUintSafe } from "./primitive.js"

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
        bc.write(strBytes)
    }
}

export function readFixedString(bc: ByteCursor, byteLen: number): string {
    const strBytes = bc.read(byteLen)
    try {
        return byteLen < bc.config.textDecoderThreshold
            ? readUtf8Js(strBytes)
            : UTF8_DECODER.decode(strBytes)
    } catch (cause) {
        throw new BareError(bc.offset - byteLen, "invalid UTF-8 string", {
            cause,
        })
    }
}

export function writeFixedString(bc: ByteCursor, x: string): void {
    if (x.length < bc.config.textEncoderThreshold) {
        const byteLen = utf8ByteLength(x)
        bc.reserve(byteLen)
        writeUtf8Js(bc, x)
    } else {
        bc.write(UTF8_ENCODER.encode(x))
    }
}

function readUtf8Js(bytes: Uint8Array): string {
    const bytesLen = bytes.length
    let result = ""
    let i = 0
    while (i < bytesLen) {
        let codePoint = bytes[i++] | 0
        switch (Math.clz32(~codePoint << 24)) {
            case 0:
                // 0xxx_xxxx
                break
            case 2: {
                // 110x_xxxx 10xx_xxxx
                if (i < bytesLen) {
                    codePoint = ((codePoint & 0x1f) << 6) | (bytes[i] & 0x3f)
                }
                if (
                    codePoint >> 7 === 0 || // non-canonical char
                    bytes[i] >> 6 !== 0b10 // invalid tag
                ) {
                    throw TypeError("Decoding failed")
                }
                i += 1
                break
            }
            case 3: {
                // 1110_xxxx 10xx_xxxx 10xx_xxxx
                if (i + 1 < bytesLen) {
                    codePoint =
                        ((codePoint & 0xf) << 12) |
                        ((bytes[i] & 0x3f) << 6) |
                        (bytes[i + 1] & 0x3f)
                }
                if (
                    codePoint >> 11 === 0 || // non-canonical char or missing data
                    bytes[i] >> 6 !== 0b10 || // invalid tag
                    bytes[i + 1] >> 6 !== 0b10 || // invalid tag
                    codePoint >> 11 === 0x1b // surrogate char (0xD800 <= codePoint <= 0xDFFF)
                ) {
                    throw TypeError("Decoding failed")
                }
                i += 2
                break
            }
            case 4: {
                // 1110_xxxx 10xx_xxxx 10xx_xxxx 10xx_xxxx
                if (i + 2 < bytesLen) {
                    codePoint =
                        ((codePoint & 0x7) << 18) |
                        ((bytes[i] & 0x3f) << 12) |
                        ((bytes[i + 1] & 0x3f) << 6) |
                        (bytes[i + 2] & 0x3f) // RangeError if code point si greater than 0x10_ff_ff
                }
                if (
                    codePoint >> 16 === 0 || // non-canonical char or missing data
                    codePoint > 0x10ffff || // too large code point
                    bytes[i] >> 6 !== 0b10 || // invalid tag
                    bytes[i + 1] >> 6 !== 0b10 || // invalid tag
                    bytes[i + 2] >> 6 !== 0b10 // invalid tag
                ) {
                    throw TypeError("Decoding failed")
                }
                i += 3
                break
            }
            default:
                // invalid starting tag
                throw TypeError("Decoding failed")
        }
        result += String.fromCodePoint(codePoint)
    }
    return result
}

function writeUtf8Js(bc: ByteCursor, s: string): void {
    const sLen = s.length
    let offset = bc.offset
    const view = bc.view
    let i = 0
    while (i < sLen) {
        const codePoint = s.codePointAt(i++) as number | 0 // i is a valid index
        if (codePoint < 128) {
            view.setUint8(offset++, codePoint)
        } else if (codePoint < 0x800) {
            view.setUint8(offset++, 0xc0 | (codePoint >> 6))
            view.setUint8(offset++, 0x80 | (codePoint & 0x3f))
        } else if (codePoint < 0x10_000) {
            view.setUint8(offset++, 0xe0 | (codePoint >> 12))
            view.setUint8(offset++, 0x80 | ((codePoint >> 6) & 0x3f))
            view.setUint8(offset++, 0x80 | (codePoint & 0x3f))
        } else {
            view.setUint8(offset++, 0xf0 | (codePoint >> 18))
            view.setUint8(offset++, 0x80 | ((codePoint >> 12) & 0x3f))
            view.setUint8(offset++, 0x80 | ((codePoint >> 6) & 0x3f))
            view.setUint8(offset++, 0x80 | (codePoint & 0x3f))
            i++ // surrogate char
        }
    }
    bc.offset = offset
}

function utf8ByteLength(s: string): number {
    const sLen = s.length
    let result = sLen
    for (let i = 0; i < sLen; i++) {
        const codePoint = s.codePointAt(i) as number | 0 // i is a valid index
        if (codePoint >= 128) {
            result++
            if (codePoint >= 0x800) {
                result++
                if (codePoint >= 0x10_000) {
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
    new (utfLabel: string, options: { fatal: boolean }): TextDecoder
}

declare const TextDecoder: TextDecoderConstructor
