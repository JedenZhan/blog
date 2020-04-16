---
title: Babel 怎么转换 ESModule的
tags: Babel
---

我们可以打开 `https://babeljs.io/repl` 模拟

原始代码

```js
import react from 'react'
import { c } from 'c'

console.log(c)

let a = 1

export let b = 1

export default a
```

编译后的代码是 有点多.. 我们一点点分析

```js
"use strict"; // 严格模式

Object.defineProperty(exports, "__esModule", {
  value: true
}); // esmodlue 标记
exports.default = exports.b = void 0; // 清空导出

var _react = _interopRequireDefault(require("react"));

var _c = require("c");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }
    // 如果导出是由 module.exports(没有__esModule标记) 导出, 则赋值一个对象
}

console.log(_c.c); // require导入的是对象, 而且对应 exports 所以这里取对象的c属性
var a = 1;
var b = 1;
exports.b = b;
var _default = a;
exports.default = _default;
```

总的来说

- export 带 default 就把该属性值挂载在 export.default 上
- export 不带 defalut 则作为 exports 的属性

比如

```js
export default a // 编译为 exports.defalut = a
export b // 编译为 export.b = b
```

在导入的时候

```js
import a from 'a' // 如果相对应导出是_esmodule标记, 则直接把值给a
import { b } from 'b' // 这样会有一个中间值, 如果访问, 就访问这个中间值的 b 属性
```



