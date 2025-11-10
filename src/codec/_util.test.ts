//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { ByteCursor } from "../core/byte-cursor.ts"
import { Config } from "../core/config.ts"

export function fromBytes(...rest: number[]): ByteCursor {
    return new ByteCursor(Uint8Array.from(rest), Config({}))
}

export function toBytes(bc: ByteCursor): number[] {
    return Array.from(
        new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset),
    )
}
