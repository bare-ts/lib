import assert from "assert"
import { isU32 } from "../util/validator.js"

const TOO_LARGE_NUMBER = "too large number"

// Default values
const initialBufferLength = 1024
const maxBufferLength = 1024 * 1024 * 32 /* 32 MiB */
const textDecoderThreshold = 256
const textEncoderThreshold = 256

export interface Config {
    readonly initialBufferLength: number
    readonly maxBufferLength: number
    readonly textDecoderThreshold: number
    readonly textEncoderThreshold: number
}

export function Config(part: Partial<Config>): Config {
    const config = Object.assign(
        {
            initialBufferLength,
            maxBufferLength,
            textDecoderThreshold,
            textEncoderThreshold,
        },
        part
    )
    assert(isU32(config.initialBufferLength), TOO_LARGE_NUMBER)
    assert(isU32(config.maxBufferLength), TOO_LARGE_NUMBER)
    assert(isU32(config.textDecoderThreshold), TOO_LARGE_NUMBER)
    assert(isU32(config.textEncoderThreshold), TOO_LARGE_NUMBER)
    assert(
        config.initialBufferLength <= config.maxBufferLength,
        "initialBufferLength must be lower than or equal to maxBufferLength"
    )
    return config
}
