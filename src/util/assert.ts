export class AssertionError extends Error {
    declare readonly name: "AssertionError"

    constructor(message: string) {
        super(message)
        this.name = "AssertionError"
    }
}

export default function assert(
    test: boolean,
    message: Error | string
): asserts test {
    if (!test) {
        if (message instanceof Error) {
            throw message
        }
        const e = new AssertionError(message)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(e, assert)
        }
        throw e
    }
}
