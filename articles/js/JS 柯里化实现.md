---
title: JavaScript 柯里化
tags: [JavaScript]
---

## 什么是柯里化

[参考](https://github.com/mqyqingfeng/Blog/issues/42)

用人话解释, 就是函数执行方式, 可以一个一个的传参

 `show me your code` 

比如

```js
const add = (a, b) => a + b
add(1, 2) // 3
// 如果有 curry 函数
let curriedAdd = curry(add)

// 这样, add 就可以这样用
curriedAdd(1)(2) // 3
let mid = curriedAdd(1) // 不返回结果, 而是返回一个函数, 这个函数保存了参数 1
mid(2) // 3
```

## 柯里化的应用

ajax

比如封装了一个 ajax 函数, 是这样用的

```js
ajax('url1', 'method', {data: 1})
ajax('url2', 'method', {data: 1})
```

url 如果不变的情况下, 这样就有代码冗余

如果有了 curry

```js
const curriedAjax = curry(ajax)
let mid = curriedAjax('url', 'method')
mid({data: 1})
```

## 辅助函数

```js
const help = (fn, ...outer) => (...inner) => {
    fn.apply(this, [...outer, ...inner])
}

// 使用
let curried = help(add, 1, 2)
curried() // 3
let curried2 = help(add, 1)
curried(2) // 3
```

但是你会发现这个辅助函数只能执行两次, 不能多次保存参数

## 真正的 curry 函数

```js
const help = (fn, ...outer) => (...inner) => {
    fn.apply(this, [...outer, ...inner])
}

const curry = (fn, length) => {
    length = fn.length || length
    return (...inner) => {
        if (inner.length < length) {
            return curry(help(fn, ...inner), length - inner.length)
        } else {
            return fn(inner)
        }
    }
}
```

## 高颜值写法 ?

```js
const curry = fn => 
	judge = (...args) => 
		args.length === fn.length 
		? fn(...args)
		: arg => judge(...args, arg)
```

其实...柯里化就是

**利用闭包的特性当参数没有传完的时候, 返回一个新的函数, 这个函数会保存当前传入的参数, 当参数传输完毕, 就去执行这个函数**