//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

export { DEV } from "#dev"

const V8Error = Error as V8ErrorConstructor

/**
 * @throws {AssertionError} if `test` is `false`.
 *  The message of the error is set to `message`.
 */
export function assert(test: boolean, message = ""): asserts test {
    if (!test) {
        const e = new AssertionError(message)
        V8Error.captureStackTrace?.(e, assert)
        throw e
    }
}

interface V8ErrorConstructor extends ErrorConstructor {
    readonly captureStackTrace?: (e: Error, f: unknown) => void
}

/**
 * Indicates the failure of an assertion.
 * This error is thrown by {@link assert }.
 *
 * This error should not be caught.
 *
 * @sealed
 */
export class AssertionError extends Error {
    override name = "AssertionError"
}
