export const IS_LITTLE_ENDIAN_PLATFORM: boolean =
    /* @__PURE__ */ new DataView(Uint16Array.of(1).buffer).getUint8(0) === 1
