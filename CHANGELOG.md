# Changelog

## 0.1.0 (2022-01-02)

* `ByteCursor` abstraction to read and write safely a buffer of bytes

* Enable to configure at runtime:
    - initial buffer length
    - maximum buffer length
    - thresholds (string length) for switching from custom to native UTF-8 decoders/encoders

* Decoders and encoders for basic types (bool, opaque data, floats, integers, typed arrays, UTF-8 string)
