import { ByteCursor } from "@bare-ts/lib"

export function fromBytes(...rest: number[]): ByteCursor

export function toBytes(bc: ByteCursor): number[]
