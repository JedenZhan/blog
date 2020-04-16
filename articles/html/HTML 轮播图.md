---
title: 定时器和requestAnimationFrame实现简单版轮播图
tags: [JavaScript, HTML, CSS]
---

轮播图一直都是前端学习的基础实现, 通常使用定时器完成, 现在可以使用 requestAnimationFrame 完成

## 基础代码(html & css)

```html
<style>
    * {
        margin: 0;
        padding: 0;
    }

    .view {
        position: fixed;
        height: 100px;
        width: 300px;
        border: 1px solid #ccc;
        left: calc(50% - 150px);
        top: calc(50% - 50px);
        overflow: hidden;
    }

    .wrapper {
        list-style: none;
        width: 1200px;
        height: 100px;
        position: relative;
        left: 0;
    }

    .item {
        width: 300px;
        height: 100px;
        float: left;
    }

    .item1 {
        background-color: #f00;
    }

    .item2 {
        background-color: #0f0;
    }

    .item3 {
        background-color: #00f;
    }
</style>
<div class="view">
    <ul class="wrapper" id="wrapper">
        <li class="item item1"></li>
        <li class="item item2"></li>
        <li class="item item3"></li>
        <li class="item item1"></li> <!--这样实现无缝轮播-->
    </ul>
</div>
```

## JS部分

### 定时器版本

```js
const wrapper = document.getElementById('wrapper')

const run = () => {
    let step = 5, // 一步走的像素
        originLeft = parseInt(wrapper.style.left) || 0, // 初始 left
        offset = 0, // 本次偏移量
        timeout = 10 // 每布间隔

    let interval = setInterval(() => {
        offset += step
        wrapper.style.left = originLeft - offset + 'px'

        if (offset === 300) {
            if (parseInt(wrapper.style.left) <= -900) { // 越界, 重置
                wrapper.style.left = 0 + 'px'
            }
            clearInterval(interval) // 清空定时器
            offset = 0
        }
    }, timeout)
}

setInterval(() => {
    run()
}, 1000)
```

### requestAnimationFrame 版本

一个简单的例子帮助理解 RAF

```js
let count = 0,
    raf = null
const start = () => {
    console.log(count)
    if (count < 10) {
        count++
        requestAnimationFrame(start)
    } else {
        cancelAnimationFrame(raf)
        count = 0
    }
}
setInterval(() => {
    raf = requestAnimationFrame(start)
}, 1000)
```

上面的例子可以每隔一秒打印出 1 -> 10

**轮播图代码:**

```js
const wrapper = document.getElementById('wrapper')

let reqId
let offset = 0
const run = () => {
    let step = 5,
        originLeft = parseInt(wrapper.style.left) || 0
    
    if (offset < 300) {
        offset += step
        wrapper.style.left = originLeft - step + 'px'
        requestAnimationFrame(run)
    } else {
        if (originLeft <= -900) {
            wrapper.style.left = 0
        }
        cancelAnimationFrame(reqId)
        offset = 0
    }
}

setInterval(() => {
    reqId = requestAnimationFrame(run)
}, 2000)
```

## 对比

requestAnimationFrame 与 setTimeout 相比有以下优点

- 无需计算回调时间, 动画流畅性更有保障
- 性能优秀
- 熟悉 JS 任务流的都知道, setTimeout 并不能保证动画流畅性, requestAnimationFrame 则是基于帧, 动画更稳定
- 在网页处于后台时候, RAF 会暂停执行 `在移动端有很大用处`

