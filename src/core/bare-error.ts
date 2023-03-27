/**
 * @sealed
 */
export class BareError extends Error {
    override name = "BareError"

    readonly cause: unknown

    readonly issue: string

    readonly offset: number

    constructor(offset: number, issue: string, opts?: { cause: unknown }) {
        super(`(byte:${offset}) ${issue}`)
        this.issue = issue
        this.offset = offset
        this.cause = opts?.cause
    }
}
