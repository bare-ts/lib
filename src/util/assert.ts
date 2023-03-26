export { DEV } from "#dev"

export class AssertionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "AssertionError"
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
