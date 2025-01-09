## JS 柯里化


柯里化, 很高大上的一个名词, 可以这么理解, curry, 携带, **柯里化函数就是能携带参数的函数**

比如请求一个接口, 接口地址`https:xxx`, 参数`{options: 1}`

我们请求这个接口多次, 就得这么写

```js
getData('https:xxx', {options: 1})
getData('https:xxx', {options: 2})
getData('https:xxx', {options: 3})
```
这样, 第一个参数, 是不变的, 但是每次调用都得传入, 明显的代码冗余

我们可以包装下这个函数

```js
function enhancer(url) {
  return (options) => getData(url, options)
}

const enhancerGetData = enhancer('https:xxx')
```

然后, 我们就可以随意调用 enhancerGetData

```js
enhancerGetData({options: 1})
enhancerGetData({options: 2})
enhancerGetData({options: 3})
```

这里可以理解为我们把url参数携带了, 也就是curry, 这就是柯里化函数思想

比如面试题, add(1)(2)(3) // 6

也是柯里化思想

我们可以写一个柯里化函数


```js
function add(a, b, c) {
  return a + b + c
}

// curry

const curry = fn => judge = (...args) => args.length === fn.length ? fn(...args) : arg => judge(...args, arg)

function curry(fn) {
  return function judge(...args) {
    if (args.length === fn.length) return fn(...args)
    return arg => judge(...args, arg)
  }
}

const curriedAdd = curry(add)
```

其实就是利用闭包, 保存参数, 判断当前保存参数长度和函数长度是否一样, 一样就去执行函数, 否则返回一个新函数