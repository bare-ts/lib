# Changelog

This project adheres to [Semantic Versioning][semver].

## Unreleased

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
