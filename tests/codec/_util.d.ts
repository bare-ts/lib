import { ByteCursor, Config } from "@bare-ts/lib"

export function fromConfigBytes(
    partConfig: Partial<Config>,
    ...rest: number[]
): ByteCursor

export function fromBytes(...rest: number[]): ByteCursor

export function toBytes(bc: ByteCursor): number[]
