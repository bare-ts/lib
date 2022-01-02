export function isI8(val: number): boolean {
    return val === (val << 24) >> 24
}

export function isI16(val: number): boolean {
    return val === (val << 16) >> 16
}

export function isI32(val: number): boolean {
    return val === (val | 0)
}

export function isI64(val: bigint): boolean {
    return val === BigInt.asIntN(64, val)
}

export function isSafeU64(val: number): boolean {
    return Number.isSafeInteger(val) && val >= 0
}

export function isU8(val: number): boolean {
    return val === (val & 0xff)
}

export function isU16(val: number): boolean {
    return val === (val & 0xffff)
}

export function isU32(val: number): boolean {
    return val === val >>> 0
}

export function isU64(val: bigint): boolean {
    return val === BigInt.asUintN(64, val)
}
