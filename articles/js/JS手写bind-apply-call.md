---
title: 手写 apply, call, bind
tags: JavaScript
---

## 前言

我们知道, call, apply 和 bind 主要功能是用来显式绑定 this

call 和 apply 的用法:

```js
var a = 1
function test(arg) {
    console.log(this.a, arg)
}

let obj = {
    a: 1
}

test.apply(obj, [2]) // 1 2
test.call(obj, 2) // 1 2
```

bind 的用法:

```js
let obj = {
    a: 1
}

function test(arg, arg2) {
    console.log(this.a, arg, arg2)
}

let target = test.bind(obj, 1, 2) // 如果 bind 的时候传入实参, 以后的实参都会忽略
target(4, 5) // 忽略4 5, 打印 1 1 2

let target2 = test.bind(obj, 1) // bind 的时候只传入一个实参

target(2) // 1 1 2 会继续传入
```

而且, bind 是可以用于构造函数的

```js
var a = 1
let obj = {
    a: 1,
    b: 2
}

function Test() {
    console.log(this.a, this.b)
}

let Target = Test.bind(obj)

let target = new Target() // undefined undefined
Target() // 1 2
```

说明 bind 在用作构造函数的时候, 会抛弃之前的 this, 明白 new 过程的都知道, 这时候 this 指向实例对象

## call 手写

想象怎么改变 this 的指向, 当我们调用对象的方法的时候, this 就会指向这个对象, 这就是思路

1. 将函数变为目标对象的方法
2. 执行这个方法
3. 删除这个方法

```js
Function.prototype.myCall = function (_this, ...args) {
    if (!_this || typeof _this !== 'object') return null
    _this.method = this // 将函数变为对象的方法
    let result = _this.method(...args) // 如果有返回值的话
    return result
    delete _this.method
}
```

## apply 手写

写出来了 call, apply 就很简单了

两个的区别只有传参, call 一个一个的传, apply 当作一个数组传递

```js
Function.prototype.myCall = function (_this, args) {
    if (!_this || typeof _this !== 'object') return null
    _this.method = this // 将函数变为对象的方法
    let result = _this.method(...args) // 如果有返回值的话
    return result
    delete _this.method
}
```

## bind 手写

手写 bind 要注意

- 返回的是一个函数
- 当用作构造函数的时候, this 会失效, 但参数有效

先写一个不考虑构造函数的版本

```js
Function.prototype.myBind = function (_this, ...args) {
    let method = this
    return function (...innerArgs) {
        method.apply(_this, [...args, ...innerArgs])
    }
}
```

可以用作构造函数的版本

```js
Function.prototype.myBind = function (_this, ...args) {
    function F() {}
    const targetMethods = this
    function result(...innerArgs) {
        // 如果 this instanceOf F, 就是被用作构造函数了
        return targetMethods.apply(this instanceOf F ? this : _this, [...args, ...innerArgs])
    }
    F.prototype = this.prototype
    result.prototype = new F()
    return result
}
```

ok 今天就到这里啦

