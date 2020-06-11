# Utf-6i
encode small!

### Usage
First, we'll import it:
```
npm install utf-6i
```
```js
const UTF6I = require("utf-6i")
```
To encode a string of text, use `<UTF6I>.encode(text)`:
```js
const UTF6I = require("utf-6i")
let encoded = UTF6I.encode("Hello, World!")
console.log(encoded) //"ﲁ䰰ￜϵ콈섿翿"
```
To decode a string, simply use `<UTF6I>.decode(encoded)`:
```js
const UTF6I = require("utf-6i")
let encoded = "ﲁ䰰ￜϵ콈섿翿"
console.log( UTF6I.decode(encoded) )
```
