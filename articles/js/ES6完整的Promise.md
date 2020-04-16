---
title: 手写一个符合 Promise/A+ 规范的 Promise
tags: [JavaScript, ES6]
---

之前一篇文章说了怎么写一个简单版本的 Promise, 今天继续完成实现一个符合 Promise/A+ 规范的 Promise 的手写

传送门: [手写简单版Promise]([https://jedenzhan.github.io/2019/04/28/ES6%E7%9A%84Promise/](https://jedenzhan.github.io/2019/04/28/ES6的Promise/)), [手写Promise自带方法]([https://jedenzhan.github.io/2020/01/18/Promise%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E6%89%8B%E5%86%99/](https://jedenzhan.github.io/2020/01/18/Promise对象方法手写/))

## 开始

- 对于 resolve 函数, 需要新增判断传入的值是否为 Promise

```js
function resolve (v) {
	if (v instanceof MyPromise) return value.then(resolve, reject)
    setTimeout(() => { // 使用 settimeout 保证执行顺序
        if (this.state === PENDING) {
            this.state = RESOLVED
            this.value = value
            this.resolvedCallbacks.map(cb => cb(that.value))
        }
    }, 0)
}

function reject (e) {
    setTimeout(() => {
        if (this.state === PENDING) {
            this.state = RESOLVED
            this.value = value
            this.resolvedCallbacks.map(cb => cb(that.value))
        }
    }, 0)
}
```

---



- 重写 then 函数, 需要新增 promise2 变量, 因为 Promise 的链式调用, then 会返回一个新的 Promise, promise2 用于保存新的返回值

```js
MyPromise.prototype.then = function (fullfilled, rejected) {
    // ...
    const _this = this
    if (this.state === PENDING) {
        return (promise2 = new MyPromise((resolve, reject) => {
            _this.resolvedCallbacks.push(() => {
                try {
                    const x = fullfilled(_this.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
            _this.rejectedCallbacks.push(() => {
                try {
                    const x = rejected(that.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch (r) {
                    reject(r)
                }
            })
        }))
    }
    // ...
}
```

- 首先返回了一个 新的 Promise 对象, 并且传入一个函数
- 执行函数的过程使用 try...catch 包裹
- 规范规定, 执行 `onFulfilled` 或者 `onRejected` 函数时会返回一个 `x`, 并且执行 `Promise` 解决过程, 这是为了不同的 `Promise` 都可以兼容使用
- 下面讲解 `resolutionProcedure` 函数

---



```js
MyPromise.prototype.then = function (fullfilled, rejected) {
    // ...
    if (this.state === RESOLVED) {
        return (promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
            	try {
                    const x = fullfilled(_this.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                }
            })
        }))
    }
}
```

- 传入函数的函数体需要异步执行

---

- resolutionProcedure 函数

```js
function resolutionProcedure(promsie2, x, resolve, reject) {
    if (promise2 === x) return reject(new Error('...')) // x 和 promise2 不能一样, 会导致循环引用问题
    if (x instanceof MyPromise) {
        x.then(v => {
            resolutionProcedure(promise2, v, resolve, reject)
        })
    }
    
	// 继续根据规范写出
    let called = false
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(
                    x,
                    y => {
                        if (called) return
                        called = true
                        resolutionProcedure(promise2, y, resolve, reject)
                    },
                    e => {
                        if (called) return
                        called = true
                        reject(e)
                    }
                )
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }

}
```



## 完整的 Promise

```js
const pending = 'pending', resolve = 'resolve', reject = 'reject'
class MyPromise {
    constructor (fn) {
        this.state = pending
        this.value = null
        this.resolvedCallbacks = []
        this.rejectedCallbacks = []

        const reject = e => {
            setTimeout(() => { // 主要是在 then 后实行
                if (this.state === pending) {
                    this.state = reject
                    this.value = e
                    this.rejectedCallbacks.map(fn => fn(e))
                }
            }, 0)
        }

        const resolve = v => {
            if (v instanceof MyPromise) return v.then(resolve, reject)
            setTimeout(() => {
                if (this.state === pending) {
                    this.state = resolve
                    this.value = v
                    this.resolvedCallbacks.map(fn => fn(v))
                }
            }, 0)
        }

        try {
            fn(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then (onFullfilled, onRejected) {
        onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : e => {throw e}
        const _this = this
        function resolutionProcedure(promise2, x, resolve, reject) {
            if (promise2 === x) return reject(new Error('...'))
            if (x instanceof MyPromise) {
                x.then(v => {
                    resolutionProcedure(promise2, v, resolve, reject)
                })
            }
            let called = false
            if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
                try {
                    let then = x.then
                    if (typeof then === 'function') {
                        then.call(
                            x,
                            y => {
                                if (called) return
                                called = true
                                resolutionProcedure(promise2, y, resolve, reject)
                            },
                            e => {
                                if (called) return
                                called = true
                                reject(e)
                            }
                        )
                    } else {
                        resolve(x)
                    }
                } catch (e) {
                    if (called) return
                    called = true
                    reject(e)
                }
            } else {
                resolve(x)
            }
        }


        if (this.state === pending) {
            let promise2
            return (promise2 = new MyPromise((resolve, reject) => {
                _this.resolvedCallbacks.push(() => {
                    try {
                        let x = onFullfilled(_this.value)
                        resolutionProcedure(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })

                _this.rejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(_this.value)
                        resolutionProcedure(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }))
        }

        if (this.state === resolve) {
            let promise2
            return (promise2 = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onFullfilled(_this.value)
                        resolutionProcedure(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }))
        }

        if (this.state === reject) {
            let promise2
            return (promise2 = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const x = onRejected(_this.value)
                        resolutionProcedure(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }))
        }
    }
}
```

可以把代码复制一份 debugger 试一试

共勉