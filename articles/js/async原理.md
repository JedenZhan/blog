---
title: Async 原理
tags: [JavaScript, ES6]
---

## Async

async 的用法

```js
const getValue = data => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(data + 1)
    }, 1000)
})

const getValue = async () => {
    let a = await getValue(1)
    let b = await getValue(a)
    let c = await getValue(b)
    console.log(c)
}

getValue() // 3s 后输出 3
```

看官们应该了解 async 就是 promise + generater 的语法糖



## 写出 Generator

```js
function *main() {
    let a = yield getValue(1)
    console.log(a)
    let b = yield getValue(a)
    console.log(b)
    let c = yield getValue(b)
    console.log(c)
}
```

是不是很像 async, await, 就是把 await 换成 yield

## 自动执行

```js
const myAsync = (genfn, ...args) => {
    const it = genfn.apply(this, args)

    const fn = next => {
        if (!next.done) { // 如果没完成继续执行then
            return next.value.then(
                v => fn(it.next(v)),
                e => fn(it.throw(e))
            )
        } else {
            console.log('done')
            return next.value // 完成则返回值
        }
    }
    return fn(it.next())
}
```

## 使用

```js
myAsync(main) // 每隔一秒分别输出 2, 3, 4
```

共勉

