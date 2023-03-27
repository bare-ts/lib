import { DEV, assert } from "../util/assert.js"
import { TOO_LARGE_NUMBER } from "../util/constants.js"
import { isU32 } from "../util/validator.js"

export type Config = {
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
    if (DEV) {
        assert(isU32(initialBufferLength), TOO_LARGE_NUMBER)
        assert(isU32(maxBufferLength), TOO_LARGE_NUMBER)
        assert(isU32(textDecoderThreshold), TOO_LARGE_NUMBER)
        assert(isU32(textEncoderThreshold), TOO_LARGE_NUMBER)
        assert(
            initialBufferLength <= maxBufferLength,
            "initialBufferLength must be lower than or equal to maxBufferLength",
        )
    }
    return {
        initialBufferLength,
        maxBufferLength,
        textDecoderThreshold,
        textEncoderThreshold,
    }
}
