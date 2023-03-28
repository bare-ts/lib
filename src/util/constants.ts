export const INT_SAFE_MAX_BYTE_COUNT = 8
export const UINT_MAX_BYTE_COUNT = 10
export const UINT_SAFE32_MAX_BYTE_COUNT = 5

export const INVALID_UTF8_STRING = "invalid UTF-8 string"
export const NON_CANONICAL_REPRESENTATION = "must be canonical"
export const TOO_LARGE_BUFFER = "too large buffer"
export const TOO_LARGE_NUMBER = "too large number"

export const IS_LITTLE_ENDIAN_PLATFORM: boolean =
    /* @__PURE__ */ new DataView(Uint16Array.of(1).buffer).getUint8(0) === 1
