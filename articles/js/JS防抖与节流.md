---
title: 防抖与节流
tags: [JavaScript, HTML, 浏览器]
---

## 什么是防抖

在浏览器里面会有一些事件在某个时间段会频繁触发

比如: window的resize, scroll, mousedown, mousemove, keyup, keydown

防抖思想就是每一次触发返回一个函数, 函数内部设置一个定时器为n ms 之后执行, 这样会在最后一次触发后n ms触发事件, 达到减少函数执行次数的效果

### 第一版

基本功能, this保存

```js
function debounce(fn, time) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this) // this应该指向目标元素
    }, time)
  }
} 
```

### 第二版

第一版基础增加 event 对象

```js
function debounce(fn, time) {
  let timer = null
  return function (...rest) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, rest)
    }, time)
  }
}
```

### 第三版

增加立即执行

```js
function debounce(fn, time, immediate) { // 增加立即执行参数
  let timer = null
  return function (...rest) {
    if (timer) clearTimeout(timer)
  	if (immediate) { // 如果立即执行, 看是否有定时器
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, time)
      callNow && fn.apply(this, rest) // 如果没有则执行函数, 否则设置time时间过后设置time为null
    } else {
      timer = setTimeout(() => {
        fn.apply(this, rest)
      }, time)
    }
  }
}
```

### 第四版

增加返回值功能

```js
function debounce(fn, time, immediate) {
  let timer = null, result
  return function (...rest) {
    if (timer) clearTimeout(timer)
    if (immediate) {
      let callNow = !immediate
      setTimeout(() => {
        timer = null
      }, time)
      callNow && result = fn.apply(this, rest)
    } else {
      timer = setTimeout(() => {
        fn.apply(this, rest)
      }, time)
    }
    return result
  }
}
```

## 什么是节流

节流和防抖都是要减少不必要的函数执行次数

但是节流在一段时间内会真正的执行一次函数, 但防抖只是在最后一次触发后才执行, 所以如果函数执行和中间态有关, 需要使用节流

### 节流有两种实现方式

#### 时间戳

缺点: 当最后一次触发函数和上一次触发间隔时间小于规定时间的时候, 不会触发函数调用

```js
function throttle(fn, time) {
  let previous = 0
  
  return function (...rest) {
    let now = + new Date() // + 换为数字
    if (now - previous > time) {
      fn.apply(this, rest)
      previous = now
    }
  }
}
```

#### 定时器

```js
function throttle(fn, time) {
  let timer
  let previous = 0
  
  return function (...rest) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, rest)
      }, time)
    }
  }
}
```

完美的节流

```js
function throttle(fn, delay) {
  let timer = null, startTime = Date.now()
  return (...rest) => {
    let currentTime = Date.now(),
      remainingTime = delay - (currentTime - startTime)
    clearTimeout(timer)
    if (remainingTime <= 0) {
      fn.apply(this, rest)
      startTime = Date.now()
    } else {
      timer = setTimeout(fn, remainingTime)
    }
  }
}
```