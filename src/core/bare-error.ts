export class BareError extends Error {
    readonly cause: unknown

    readonly issue: string

    readonly offset: number

    constructor(offset: number, issue: string, opts?: { cause: unknown }) {
        super(`(byte:${offset}) ${issue}`)
        this.name = "BareError"
        this.issue = issue
        this.offset = offset
        this.cause = opts?.cause
    }
}
