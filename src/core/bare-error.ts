export class BareError extends Error {
    declare readonly name: "BareError"

    declare readonly cause: unknown

    declare readonly issue: string

    declare readonly offset: number

    constructor(offset: number, issue: string, opts?: { cause: unknown }) {
        super(`(byte:${offset}) ${issue}`)
        this.name = "BareError"
        this.issue = issue
        this.offset = offset
        this.cause = opts?.cause
    }
}
