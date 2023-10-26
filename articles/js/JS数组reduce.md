---
title: 面试官:讲一下reduce?
tags: JS
---

## 基本使用与概念

reduce是一个累加器,

**接收两个参数, 第一个是回调函数, 第二个是初始值**

```js
[].reduce((total, currentValue,currentIndex, arr) => {
    return total + currentValue;
    // total 当前已经累加的值
    // currentValue 当前数组元素
    // currentIndex 当前数组元素的索引
    // arr 当前数组
}, num) // num是初始值, 默认是第一个值
```

可以这样用

```js
let arr = [1, 2, 3, 4];
arr.reduce((a, b) => a + b); // 10
```

## 怎么累加对象的值 ?

比如一个数据是

```js
let counters = [
    {
        id: 1,
        value: 4
    },
    {
        id: 2,
        value: 3
    },
    {
        id: 3,
        value: 2
    },
    {
        id: 4,
        value: 1
    }
]
```

解决方案:

```js
counters.reduce((a, b) => {return a + b.value}, 0) // 默认值必须传, 不然第一个值是对象, 会有意想不到的错误
```

## compose

整合函数

```js
function compose(fns) {
  return fns.reduce((a, b) => arg => a(b(...arg)))
}
```

