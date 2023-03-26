declare const process: { readonly env: Record<string, string | undefined> }

export const DEV: boolean = process.env["NODE_ENV"] === "development"
