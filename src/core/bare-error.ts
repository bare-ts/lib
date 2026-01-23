//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

/**
 * @sealed
 */
export class BareError extends Error {
    override name = "BareError"

    readonly issue: string

    /**
     * Byte offset in the read buffer where the error occurred.
     */
    readonly offset: number

    constructor(offset: number, issue: string, options?: ErrorOptions) {
        super(`(byte:${offset}) ${issue}`, options)
        this.issue = issue
        this.offset = offset
    }
}
