//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

import { ByteCursor, Config } from "@bare-ts/lib"

/**
 *
 * @param  {...number} rest
 * @returns {ByteCursor}
 */
export function fromBytes(...rest) {
    return new ByteCursor(Uint8Array.from(rest), Config({}))
}

/**
 *
 * @param {ByteCursor} bc
 * @returns {number[]}
 */
export function toBytes(bc) {
    return Array.from(
        new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset),
    )
}
