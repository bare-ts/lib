# Changelog

This project adheres to [Semantic Versioning][semver].

## Unreleased

* BREAKING CHANGE: rename all decode/encode into read/write

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

* BREAKING CHANGE: length can no longer be specified for fixed-array writers

    Previously, you had to specify the length of the fixed-array to encode.
    If the given length was different of the actual array's length,
    then an assertion was thrown ("umatched length").

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


## 0.1.1 (2022-01-09)

* Fix write offset when byteOffset > 0

    A ByteCursor may be instantiated with an array of bytes such that
    the array's byteOffset is greater than 0.
    The previous ByteCursor.write implementation did not take care of
    adding this byteOffset to the    ByteCursor's offset.

    The following code no longer fail:

    ```js
    const bytes = Uint8Array.of(42, 24).subarray(1)
    assert(bytes.byteOffset === 1)

    const bc = ByteCursor(bytes, ...)
    bc.write(Uint8Array.of(24))
    assert.deepEqual(Array.from(bytes), [42, 24]) // Previously failed
    ```

* Smaller CommonJS bundle

* Improve byte-length computation of small string

## 0.1.0 (2022-01-02)

* `ByteCursor` abstraction to read and write safely a buffer of bytes

* Enable to configure at runtime:
    - initial buffer length
    - maximum buffer length
    - thresholds (string length) for switching from custom to native
        UTF-8 decoders/encoders

* Decoders and encoders for basic types
    (bool, opaque data, floats, integers, typed arrays, UTF-8 string)


[semver]: https://semver.org/spec/v2.0.0.html
