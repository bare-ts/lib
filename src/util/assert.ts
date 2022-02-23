export class AssertionError extends Error {
    declare readonly name: "AssertionError"

    constructor(message: string) {
        super(message)
        this.name = "AssertionError"
    }
}

export function assert(test: boolean, message: string): asserts test {
    if (!test) {
        const e = new AssertionError(message)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(e, assert)
        }
        throw e
    }
}

declare const Error: V8ErrorConstructor

interface V8ErrorConstructor extends ErrorConstructor {
    readonly captureStackTrace?: (e: Error, f: unknown) => void
}
