import { ByteCursor, Config } from "@bare-ts/lib"

/**
 *
 * @param {Partial<Config>} partConfig
 * @param  {...number[]} rest
 * @returns {ByteCursor}
 */
export function fromConfigBytes(partConfig, ...rest) {
    return new ByteCursor(Uint8Array.from(rest), Config(partConfig))
}

/**
 *
 * @param  {...number[]} rest
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
