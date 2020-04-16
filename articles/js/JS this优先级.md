---
title: 你知道 this, 你知道 this 的优先级吗
tags: [JavaScript, 碎片]
---

## 前言

在 JS 里面, this 代表当前执行上下文, 默认指向全局, 分为**默认绑定, 显式绑定和隐式绑定**

默认绑定就是指向全局, 不多说了

## 隐式绑定

```js
function test() {
    console.log(this.a)
}

let obj = {
    a: 1,
    test: test
}

obj.test() // 1
```

隐式绑定是可能丢失的, 因为普通函数的 this 是在执行的时候确定的

```js
let obj = {
    a: 1,
    test: function () {
        console.log(this.a)
    }
}

let test = obj.test()
test() // undefined
```

## 显式绑定

使用 call, apply, bind 可以对 this 进行显式绑定, 如果不了解这三个函数的话可以看[这篇](./手写bind-apply-call.md)



## new 绑定

我们在使用 new 调用构造函数的时候, 会产生 new 绑定



## 绑定的优先级

很明显的是默认绑定的优先级是最低的, 我们可以看看隐式绑定和显式绑定

```js
let obj1 = {
    a: 1,
    test () {
        console.log(this.a)
    }
}

let obj2 = {
    a: 2,
    test () {
        console.log(this.a)
    }
}
obj1.test() // 1
obj2.test() // 2
obj1.test.call(obj2) // 2
obj2.test.call(obj1) // 1
// 显式绑定优先级是高于隐式的
```

new 呢

其实在手写 bind 的时候就明白了, new 会修改 bind 的 this

## 最后

this 优先级排序: new > 显式 > 隐式 > 默认

