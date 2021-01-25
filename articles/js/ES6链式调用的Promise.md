---
title: 手写一个符合 Promise/A+ 规范的 Promise
tags: [JavaScript, ES6]
---

之前一篇文章说了怎么写一个简单版本的 Promise, 今天继续完成实现一个符合 Promise/A+ 规范的 Promise 的手写

传送门: [手写简单版Promise]([https://jedenzhan.github.io/2019/04/28/ES6%E7%9A%84Promise/](https://jedenzhan.github.io/2019/04/28/ES6的Promise/)), [手写Promise自带方法]([https://jedenzhan.github.io/2020/01/18/Promise%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E6%89%8B%E5%86%99/](https://jedenzhan.github.io/2020/01/18/Promise对象方法手写/))

## 开始

基础版Promise, 参考 **手写简单版Promise**

在这个版本里, 我们需要重写 then 方法

```js
class Promise {
    constructor (fn) {
        ...
    }


    then (onResolved, onRejected) {
        let promise2
        
        if (this.status === 'resolved') {
            return promise2 = new Promise((resolve, reject) => {})
        }

        if (this.status === 'rejected') {
            return promise2 = new Promise((resolve, reject) => {})
        }
        if (this.status === 'pending') {
            return promise2 = new Promise((resolve, reject) => {})
        }
    }
}

```

promise里面有三种状态, 在上面的then里面有三个判断返回一个新的promise

```js
promise2 = promise1.then(v => {
    return 4
}, reason => new Error('some wrong'))
```
如果promise1 resolve掉了, promise2将被4resolve, reject也一样

```js
then (onResolved, onRejected) {
    let promise2

    if (this.status === 'resolved') return new Promise((res, rej) => {
        try {
            let x = onResolved(this.state)
            if (x instanceof Promise) x.then(res, rej)
            res(x)
        } catch (e) {
            rej(e)
        }
    })

    if (this.status === 'rejected') return new Promise((res, rej) => {
        try {
            let x = onRejected(this.state)
            if (x instanceof Promise) x.then(res, rej)
        } catch (e) {
            rej(e)
        }
    })

    if (this.status === 'pending') return new Promise((res, rej) => {
        this.onResolvedCallbacks.push(v => {
            try {
                const x = onResolved(this.state)
                if (x instanceof Promise) x.then(res, rej)
            } catch (e) {
                rej(e)
            }
        })
        this.onRejectedCallbacks.push(v => {
            try {
                const x = onRejected(this.state)
                if (x instanceof Promise) x.then(res, rej)
            } catch (e) {
                rej(e)
            }
        })
    })
}

catch (onrejected) {
    return this.then(null, rejected)
}

```

最后完整版的 promise 是这样的

```js
const pen = "pending",
rej = "rejected",
res = "resolved";
class MyPromise {
    constructor(fn) {
        this.status = pen;
        this.state = null;
        this.resolvedCallbacks = [];
        this.rejectedCallbacks = [];
        const resolve = v => {
        if (this.status !== pen) return;
        this.state = v;
        this.status = res;
        this.resolvedCallbacks.forEach(cb => cb(v));
        };
        const reject = v => {
        if (this.status !== pen) return;
        this.state = v;
        this.status = rej;
        this.rejectedCallbacks.forEach(cb => cb(v));
    };

    try {
        fn(resolve, reject);
        } catch (e) {
        reject(e);
    }
}

then(onResolve, onReject) {
    let promise2;
    onResolve = typeof onResolve === "function" ? onResolve : v => v;
    onReject = typeof onReject === "function" ? onReject : e => new Error(e);

    if (this.status === res) return new MyPromise((res, rej) => {
        try {
            let x = onResolve(this.state);
            if (x instanceof MyPromise) x.then(res, rej);
            res(x);
        } catch (e) {
            rej(e);
        }
    });

    if (this.status === rej) return new MyPromise((res, rej) => {
        try {
            let x = onRejected(this.state);
        if (x instanceof MyPromise) x.then(res, rej);
        } catch (e) {
            rej(e);
        }
    });

    if (this.status === pen) return new MyPromise((res, rej) => {
        this.resolvedCallbacks.push(v => {
            try {
                const x = onResolve(this.state);
                if (x instanceof MyPromise) x.then(res, rej);
            } catch (e) {
                rej(e);
            }
            });
        this.rejectedCallbacks.push(v => {
            try {
                const x = onReject(this.state);
                if (x instanceof MyPromise) x.then(res, rej);
            } catch (e) {
                rej(e);
            }
        });
    });
    }
}
```
Promise是怎么实现链式调用的
> 返回了一个新的Promise