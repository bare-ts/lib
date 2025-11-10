//! Copyright (c) 2022 Victorien Elvinger
//! Licensed under the MIT License (https://mit-license.org/)

declare const process: { readonly env: Record<string, string | undefined> }

export const DEV: boolean = process.env.NODE_ENV === "development"
