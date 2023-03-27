export { DEV } from "#dev"

/**
 * @sealed
 */
export class AssertionError extends Error {
    override name = "AssertionError"

    constructor(message: string) {
        super(message)
    }
}

interface V8ErrorConstructor extends ErrorConstructor {
    readonly captureStackTrace?: (e: Error, f: unknown) => void
}

const V8Error = Error as V8ErrorConstructor

export function assert(test: boolean, message = ""): asserts test {
    if (!test) {
        const e = new AssertionError(message)
        if (V8Error.captureStackTrace) {
            V8Error.captureStackTrace(e, assert)
        }
        throw e
    }
}
