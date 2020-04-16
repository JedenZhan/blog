---
title: ES6的Promise详解
tags: [ES6, JavaScript]
---

## 基本概念

- Promise的出现是为了解决回调地狱的问题
- 相当于异步操作结果的占位符, 它不会订阅一个事件, 也不好传递一个回调函数给目标函数, 就是让函数返回一个 Promise
- 只有三种状态(pending, Fulfilled, Rejected), 并且只能有两种变化, 从 pending 到 Fulfilled, 或者从 pending 到 Rejected
- 所有的 Promise 都是 thenable 对象



## 基本用法

```js
const pro1 = new Promise((reslove, rejected) = { 
    // 参数是一个回调函数, 这个函数在Promise中是直接执行的
    // 一般这里会写一些异步操作, 比如获取到了value值
    // 如果这里报错, 则将错误信息传递给rejected
    let value = 1;
    reslove(value); // 将值传入到reslove函数中
    rejected();
})
pro1.then((value) => { // 获得拿到的value
    console.log(value); // 操作拿到的value
    // return value; // then里面可以有返回值以供下一次then使用
}, (e) => { // 这个函数也可以在catch里面使用, 用于捕获异常, 并且catch也会捕获then函数里面的错误
    // 也就是说如果两个回调都写在then里面, resloved函数的错误不能捕获
    console.log(e)
}) // then参数是两个函数, 一个是resloved, 一个是rejected
```



## 进阶用法

### .all([]) 用来处理批量的Promise

```js
let p1 = new Promise((resloved, rejected) => {
    resloved('I am p1')
});
let p2 = new Promise((resloved, rejected) => {
    resloved('I am p2')
});
let p3 = new Promise((resloved, rejected) => {
    resloved('I am p3')
});
let pAll = Promise.all(p1, p2, p3); // 必须保证每一个Promise都可以成功, 否则只执行.catch()
```

### .race([]) 和 .all 类似

```js
let p1 = new Promise((resloved, rejected) => {
    resloved('I am p1')
});
let p2 = new Promise((resloved, rejected) => {
    resloved('I am p2')
});
let p3 = new Promise((resloved, rejected) => {
    resloved('I am p3')
});
let pAll = Promise.race(p1, p2, p3); // 只要有一个状态改变, 即执行结束
```

## 实际使用

加载图片实例

```html
<body>
    <div id='app'>
        
    </div>
    <script>
        let url = 'http://img5.imgtn.bdimg.com/it/u=935292084,2640874667&fm=26&gp=0.jpg'
        function loadImg (url) {
            return new Promise((resloved, rejected) => {
                let img = new Img();
                img.src = url;
                img.onload = () => {
                    resloved(img)
                }
                img.onerror = (e) => {
                    rejected(e)
                }
            })
        }
        loadImg(url).then((img) => {
            document.getElementById('app').appendChild(img);
        }, (e) => {
            console.log(e)
        })
    </script>
</body>
```

## 手撸简单版 Promise

```js
let PENDING = 'pending', RESLOVED = 'resloved', REJECTED = 'rejected'; // 定义三个状态

function MyPromise(fn) {
    const _this = this;
    _this.state = PENDING; // 初始状态
    _this.value = null; // 初始值是null
    _this.reslovedCallbacks = []; // 成功回调
    _this.rejectedCallbacks = []; // 失败回调
    function resloved(value) {
        if (_this.state === PENDING) {
            _this.state = RESLOVED;
            _this.value = value;
            _this.reslovedCallbacks.map(_ => _(_this.value))
        }
    }
    function rejected(value) {
        if (_this.state === PENDING) {
            _this.state = REJECTED;
            _this.value = value;
            _this.rejectedCallbacks.map(_ => _(_this.value))
        }
    }
    try {
        fn(resloved, rejected) // 这个函数是直接执行的
    } catch (e) {
        rejected(e)
    }
}

MyPromise.prototype.then = function (onFullResloved, onRejected) {
    const _this = this;
    onFullResloved = typeof onFullResloved === 'function' ? onFullResloved : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r};
    
    if (_this.state === PENDING) {
        _this.reslovedCallbacks.push(onFullResloved); // 如果promise里面没有reslove函数或者rejected函数,则向执行队列里面push函数, 下类似
        _this.rejectedCallbacks.push(onRejected);
    }
    
    if (_this.state === RESLOVED) {
        onFullResloved(_this.value); // 执行函数
    }
    if (_this.state === REJECTED) {
        onRejected(_this.value)
    }
}
```

