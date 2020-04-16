---
title: 手写 Promise 对象方法
tags: [ES6, JavaScript]
---



## Promise.all(arr)

> 传入一个 Promise 实例数组, 如果有的 item 不是 Promise 的实例, 则用 Promise.resolve 包裹
>
> 如果全部成功, 返回成功的 value 的数组, 如果有一个失败, 返回拒因

```js
Promise.myAll = arr => new Promise((resolve, reject) => {
    const result = []
    arr.forEach(item => {
        if (!(item instanceof Promise)) {
            item = Promise.resolve(item)
        }
        item.then(v => {
            result.push(v)
            if (result.length === arr.length) resolve(result)
        }, e => {
            reject(e)
        })
    })
})
```

## Promise.race(arr)

> 和 all 类似, 但是会返回第一个触发的 Promise, 不论是成功还是失败

```js
Promise.myRace = (arr, time) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve()
    }, time)
    arr.forEach(item => {
        if (!(item instanceof Promise)) item = Promise.resolve(item)
        item.then(v => resolve(v), e => reject(e))
    })
})
```

## Promise.allSettled(arr)

> es 2020 标准, 和 all 类似, 但是不论正确还是错误都会有返回值

```js
Promise.myAllSettled = arr => new Promise((resolve, reject) => {
    let result = []
    arr.forEach(item => {
        if (!(item instanceof Promise)) item = Promise.resolve(item)
        item.then(v => {
            result.push({
                status: 'fullfilled',
                value: v
            })
            if (result.length === arr.length) resolve(result)
        }, e => {
            result.push({
                status: 'rejected',
                reason: e
            })
            if (result.length === arr.length) resolve(result)
        })
    })
})
```

## Promise.any

> 只在第一个触发为 resolved 的情况下resolve, 如果全部为 reject, 返回 reject 数组

```js
Promise.myAny = arr => new Promise((resolve, reject) => {
    const reasons = []
    arr.forEach(item => {
        if (!(item instanceof Promise)) item = Promise.resolve(item)
        item.then(v => {
            resolve(v)
        }, e => {
            reasons.push(e)
            if (reasons.length === arr.length) reject(reasons)
        })
    })
})
```

