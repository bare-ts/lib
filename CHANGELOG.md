# Changelog

This project adheres to [Semantic Versioning][semver].

## Unreleased

-   Fix `writeUintSafe32` that wrongly encoded numbers larger than 16383 (`2e14 - 1`)

    This bug affected the encoding of variable-length arrays with more than 16383 items.

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
    These threshold were configurable via `textDecoderThreshold` and `textEncoderThreshold` config properties.

    This is not clear whether this configuration is worth to expose.
    Most of decoded and encoded strings are small.
    Fixed thresholds seem fair enough.

-   Assertions and development mode

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

-   Full compliance to IEEE-754 (floating point numbers)

    NaN is now a valid value for f32 and f64.

-   Remove {read,write}Void

-   Make @bare-ts/lib platform-agnostic

    Use your favorite ESM-ready CDN and simply import @bare-ts/lib.
    This was made possible by removing the dependency over node:assert.

## 0.2.0 (2022-01-16)

-   Improve performance for reading and writing strings

-   Improve performance for reading variable integers encoded on a single byte

-   Add a reader and a writer for fixed-strings

    Users have now access to two new functions that enable to read and
    write fixed-length strings.

    ```js
    bare.readFixedString(bc, /* string's length in bytes */ 4)
    bare.writeFixedString(bc, "bare")
    ```

-   Simplification of ByteCursor

-   BREAKING CHANGE: rename all decode/encode into read/write

    read/write feel more low-level than decode/encode.
    read/write are also more used among BARE implementations than decode/encode.
    Moreover, in JS, decode and encode are used for high-level API such as
    TextDEcoder and TextEncoder.

    ```js
    bare.decodeU8(bc) // Previously
    bare.readU8(bc) // Now

    bare.encodeU8(bc, 42) // Previously
    bare.writeU8(bc, 42) // Now
    ```

-   BREAKING CHANGE: length can no longer be specified for fixed-array writers

    Previously, you had to specify the length of the fixed-array to encode.
    If the given length was different of the actual array's length,
    then an assertion was thrown ("unmatched length").

    It is no longer possible to specify the length.
    As a consequence, the fixed-array writers can no longer assert the length.

    Fixed-array writers now have the same signature as other writers.

    ```js
    bare.readerU8FixedArray(bc, Uint8Array.of(42, 24), 2) // Previously
    bare.writeU8FixedArray(bc, Uint8Array.of(42, 24)) // Now
    ```

    Note that fixed-array readers still require the specification of the
    length:

    ```js
    bare.decodeU8FixedArray(bc, 2)
    ```

-   BREAKING CHANGE: ByteCursor no longer accept ArrayBuffer

    ```js
    new ByteCursor(new ArrayBuffer(5), config) // Now fails
    new ByteCursor(new Uint8Array(5), config) // Update to this
    ```

-   BREAKING CHANGE: remove `ByteCursor#write`

    Use `writeU8FixedArray` instead:

    ```js
    const bc = new ByteCursor(buffer, config)

    bc.write(buffer) // Previously
    bare.writeU8FixedArray(bc, buffer) // Now
    ```

## 0.1.1 (2022-01-09)

-   Fix write offset when byteOffset > 0

    A ByteCursor may be instantiated with an array of bytes such that
    the array's byteOffset is greater than 0.
    The previous ByteCursor.write implementation did not take care of
    adding this byteOffset to the ByteCursor's offset.

    The following code no longer fail:

    ```js
    const bytes = Uint8Array.of(42, 24).subarray(1)
    assert(bytes.byteOffset === 1)

    const bc = ByteCursor(bytes, ...)
    bc.write(Uint8Array.of(24))
    assert.deepEqual(Array.from(bytes), [42, 24]) // Previously failed
    ```

-   Smaller CommonJS bundle

-   Improve byte-length computation of small string

## 0.1.0 (2022-01-02)

-   `ByteCursor` abstraction to read and write safely a buffer of bytes

-   Enable to configure at runtime:

    -   initial buffer length
    -   maximum buffer length
    -   thresholds (string length) for switching from custom to native
        UTF-8 decoders/encoders

-   Decoders and encoders for basic types
    (bool, opaque data, floats, integers, typed arrays, UTF-8 string)

[semver]: https://semver.org/spec/v2.0.0.html
