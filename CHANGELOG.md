# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning][semver].
The format of this changelog is [a variant][lib9-versionning] of [Keep a Changelog][keep-changelog].
New entries must be placed in a section entitled `Unreleased`.

## Unreleased

-   Export the default bare configuration

    ```js
    import * as bare from "@bare-ts/lib"

    const config: bare.Config = bare.DEFAULT_CONFIG
    ```

## 0.4.0 (2023-06-19)

-   BREAKING CHANGES: remove `ByteCursor` methods

    To make _bare-ts/lib_ API uniform, methods of `ByteCursor` are replaced by regular functions.

    ```diff
      import * as bare from "@bare-ts/lib"

      const bc = new bare.ByteCursor(new Uint8Array(5), bare.Config({}))
    - bc.check(5)
    - bc.reserve(5)
    - bc.read(5)
    + bare.check(bc, 5)
    + bare.reserve(bc, 5)
    + bare.readUnsafeU8FixedArray(bc, 5)
    ```

-   BREAKING CHANGES: remove `textDecoderThreshold` and `textEncoderThreshold` configuration

    Calls to native `TextDecoder.decode` and `TextEncoder.encode` have a fixed cost.
    This cost outperforms the native performance to decode and encode small strings.

    _bare-ts_ uses a custom implementation to decode and encode small strings.
    The choice between the custom and the native codecs is based on thresholds.
    These threshold were configurable via `textDecoderThreshold` and `textEncoderThreshold` config.

    This is not clear whether this configuration is worth to expose.
    Most of decoded and encoded strings are small.
    Fixed thresholds seem fair enough.

-   Add assertions and development mode

    Previously, bare-ts enabled a few assertions to check some function arguments.
    For instance, the following code could trigger an `AssertionError`:

    ```js
    import * as bare from "@bare-ts/lib"

    const bc = new bare.ByteCursor(new Uint8Array(5), bare.Config({}))
    bare.writeU8(bc, 2**10) // AssertionError: too large number
    ```

    Assertions are now disabled by default.
    They are enabled under the following condition:

    -   The code is executed under _node_ with `NODE_ENV=development`

    -   The code is executed or bundled under [`development` condition](https://nodejs.org/api/packages.html#community-conditions-definitions).

    New assertions were added to improve error reporting on development.
    More assertions could be added in the future.

    Because assertions can be disabled, we improved the code robustness:
    All uint/int writters truncate their input to ensure that the number of written bytes is bounded.


## 0.3.0 (2022-04-25)

-   BREAKING CHANGES: remove `readVoid` and `writeVoid`

-   Full compliance to _IEEE-754_ (floating point numbers)

    `NaN` is now a valid value for f32 and f64.

-   Make _bare-ts/lib_ platform-agnostic

    Use your favorite ESM-ready CDN and simply import `@bare-ts/lib`.
    This was made possible by removing the dependency over node:assert.

## 0.2.0 (2022-01-16)

-   BREAKING CHANGES: rename all decode/encode into read/write

    `read` and `write` feel more low-level than `decode` and `encode`.
    They are also more used among BARE implementations.
    `decode` and `encode` are also used for high-level API such as `TextDEcoder` and `TextEncoder`.

    ```js
    - bare.decodeU8(bc)
    + bare.readU8(bc)

    - bare.encodeU8(bc, 42)
    + bare.writeU8(bc, 42)
    ```

-   BREAKING CHANGES: remove `ByteCursor#write`

    Use `writeU8FixedArray` instead:

    ```diff
      const bc = new ByteCursor(buffer, config)

    - bc.write(buffer)
    + bare.writeU8FixedArray(bc, buffer)
    ```

-   BREAKING CHANGES: length can no longer be specified for fixed-array writers

    Previously, you had to specify the length of the fixed-array to encode.
    If the given length was different of the actual array's length,
    then an assertion was thrown ("unmatched length").

    It is no longer possible to specify the length.
    As a consequence, the fixed-array writers can no longer assert the length.

    Fixed-array writers now have the same signature as other writers.

    ```diff
    - bare.readerU8FixedArray(bc, Uint8Array.of(42, 24), 2)
    + bare.writeU8FixedArray(bc, Uint8Array.of(42, 24))
    ```

    Note that fixed-array readers still require the specification of the length:

    ```js
    bare.decodeU8FixedArray(bc, 2)
    ```

-   BREAKING CHANGES: `ByteCursor` no longer accept `ArrayBuffer`

    ```diff
    - new ByteCursor(new ArrayBuffer(5), config) // Now fails
    + new ByteCursor(new Uint8Array(5), config) // Update to this
    ```

-   Add a reader and a writer for fixed-strings

    Users have now access to two new functions that enable to read and
    write fixed-length strings.

    ```js
    bare.readFixedString(bc, /* string's length in bytes */ 4)
    bare.writeFixedString(bc, "bare")
    ```

-   Improve performance for reading and writing strings

-   Improve performance for reading variable integers encoded on a single byte

## 0.1.1 (2022-01-09)

-   Fix write offset when `byteOffset` > 0

    A `ByteCursor` may be instantiated with an array of bytes such that
    the array's `byteOffset` is greater than 0.
    The previous `ByteCursor#write` implementation did not take care of
    adding this `byteOffset` to the `ByteCursor`'s offset.

    The following code no longer fail:

    ```js
    const bytes = Uint8Array.of(42, 24).subarray(1)
    assert(bytes.byteOffset === 1)

    const bc = ByteCursor(bytes, ...)
    bc.write(Uint8Array.of(24))
    assert.deepEqual(Array.from(bytes), [42, 24]) // Previously failed
    ```

-   Improve byte length computation of small string

-   Smaller CommonJS bundle

## 0.1.0 (2022-01-02)

-   Add decoders and encoders for basic types
    (bool, opaque data, floats, integers, typed arrays, UTF-8 string)

-   Add `ByteCursor` abstraction to read and write safely a buffer of bytes

-   Add runtime configuration

    -   initial buffer length

    -   maximum buffer length

    -   thresholds (string length) for switching from custom to native UTF-8 decoding and encoding

[keep-changelog]: https://keepachangelog.com/en/1.0.0/
[lib9-versionning]: https://github.com/lib9/guides/blob/main/lib9-versioning-style-guide.md#keep-a-changelog
[semver]: https://semver.org/spec/v2.0.0.html
