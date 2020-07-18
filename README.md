# Utf-6i

Encode Small!

### Usage

First of all, install and import the `utf-6i` module:

```bash
npm install utf-6i
```

```js
const UTF6I = require("utf-6i");
```

To encode a string of text, use `<UTF6I>.encode(text)`:

```js
const UTF6I = require("utf-6i");
let encoded = UTF6I.encode("Hello, World!");
console.log(encoded); //"ﲁ䰰ￜϵ콈섿翿"
```

To decode a string, simply use `<UTF6I>.decode(encoded)`:

```js
const UTF6I = require("utf-6i");
let encoded = "ﲁ䰰ￜϵ콈섿翿";
console.log(UTF6I.decode(encoded)); //"Hello, World!"
```

Sometimes the mumble-jumble `"ﲁ䰰ￜϵ콈섿翿"` isn't fitted for what you want to do. That's fine! There are 3 other input/output modes to choose from when encoding / decoding.

#### base64

```js
const UTF6I = require("utf-6i");
UTF6I.mode = "base64"; //"BASE", "64", "base", "true", "1", etc... all work also

let encoded = UTF6I.encode("Hello, World!");
console.log(encoded); //"/IFMMP/cA/XPSME/f/=="

let decoded = UTF6I.decode(encoded);
console.log(decoded); //"Hello, World!"
```

#### binary

```js
const UTF6I = require("utf-6i");
UTF6I.mode = "bin"; //All invalid modes will fallback to this

let encoded = UTF6I.encode("Hello, World!");
console.log(encoded); //"111111001000000101001100001100001111111111011100000000111111010111001111010010001100000100111111011111"

let decoded = UTF6I.decode(encoded);
console.log(decoded); //"Hello, World!"
```

#### UInt8Array

```js
const UTF6I = require("utf-6i");
UTF6I.mode = "uint"; //All invalid modes will fallback to this

let encoded = UTF6I.encode("Hello, World!");
console.log(encoded); //"UInt8Array [252, 129, 76, 48, 255, 220, 3, 245, 207, 72, 193, 63, 127, 255]"

let decoded = UTF6I.decode(encoded);
console.log(decoded); //"Hello, World!"
```

### Compression

```
UTF-16 with regular english:
 [Most Common] [4KB] UTF-16 => [1.58KB] UTF-6i (60.4% compression rate)
UTF-16 JavaScript
[Quite Common] [4KB] UTF-16 => [1.89KB] UTF-6i (52.8% compression rate)
UTF-16 with unicode jumble:
  [Not Common] [4KB] UTF-16 => [5.24KB] UTF-6i (-31% compression rate)
```

### Performance:

(on intel i5 8GB laptop, running on (new) Edge Browser ES11)

```
UTF-16: n/a       UTF-6i: 3.1ms/KB (1,000-1,000,000x slower)
  GZip: ~100ms/KB UTF-6i: 3.1ms/KB (30x faster)
```

**Note:** this project was not made to have the best compression rate or best performance. The goal was to have an overall low performance overhead while still offering 1. Decent compression and 2. fixed block size (always 6bit)
