import { assert } from "../util/assert.js"
import { TOO_LARGE_NUMBER } from "../util/constants.js"
import { isU32 } from "../util/validator.js"

export interface Config {
    readonly initialBufferLength: number
    readonly maxBufferLength: number
    readonly textDecoderThreshold: number
    readonly textEncoderThreshold: number
}

export function Config({
    initialBufferLength = 1024,
    maxBufferLength = 1024 * 1024 * 32 /* 32 MiB */,
    textDecoderThreshold = 256,
    textEncoderThreshold = 256,
}): Config {
    const config = {
        initialBufferLength,
        maxBufferLength,
        textDecoderThreshold,
        textEncoderThreshold,
    }
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
