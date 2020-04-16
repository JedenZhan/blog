---
title: 前端路由原理
tags: [浏览器, JavaScript]
---

## 前端路由

SPA `single page application` 是前端路由的典型应用

## history 模式与 hash 模式

直观上的不同就是 hash 使用 url 后面的 #xxx 来匹配路由 `前端锚点` , 而 history 没有

### hash 模式的特点:

- url 后缀 hash 改变, 不会触发请求, 不会重新加载页面
- hash 变化会被浏览器记录下来, 浏览器的前进后退可正常使用
- window.onhashchange 可监听 hash 的变化

### history 模式特点:

在 html5 规范里面, history 里面多了 `pushState, replaceState, go, back, forward ` api 给了前端路由自由

```js
history.go(-1) // 后退两次
history.go(1) // 前进一次
history.forward() // 前进
history.back() // 后退
```

history 改变路由状态主要使用 pushState 和 replaceState

```js
history.pushState('需要保存的数据, 在触发 popstate 的时候可以在 event.state里面获取', 'title, 一般是 null', '目标 url')

// eg.
history.pushState(null, null, './cc') // www.eg.com/a/cc/ 相对路径
history.pushState(null, null, 'bb') // www.eg.com/bb/ 绝对路径
```

**注意**

history 在用户刷新的时候会向服务器发送请求

服务器可以处理, 如果未匹配 url 成功, 一律返回 index.html

## 例子

### hash

```html
<a href="#red">to red</a>
<a href="#blue">to blue</a>
<div id="color"></div>
<script>
    const $ = e => document.getElementById(e)
    window.onhashchange = e => {
        let targetHash = location.hash
        let color = $('color')
        switch (targetHash) {
            case '#red':
                color.style.backgroundColor = 'red'
                break
            case '#blue':
                color.style.backgroundColor = 'blue'
                break
        }
    }
</script>
```

可以看出根据 hash 变化页面可以进行不同的反应

### history

```html
<a onclick="toRed()">to red</a>
<a onclick="toBlue()">to blue</a>
<div id="color"></div>
<script>
    const $ = e => document.getElementById(e)
    const color = $('color')
    const toRed = () => {
        history.pushState(null, null, './red')
        color.style.backgroundColor = 'red'
    }
    const toBlue = () => {
        history.pushState(null, null, './blue')
        color.style.backgroundColor = 'blue'
    }
</script>
```

可以通过 `pushState 和 replaceState` 这两个 api 来实现对应的路由切换, 然后回调相应的逻辑

## 对比

| 对比         | hash路由                               | History API 路由                                            |
| ------------ | :------------------------------------- | :---------------------------------------------------------- |
| url字符串    | 丑                                     | 正常                                                        |
| 命名限制     | 通常只能在同一个`document`下进行改变   | url地址可以自己来定义，只要是同一个域名下都可以，自由度更大 |
| url地址变更  | 会改变                                 | 可以改变，也可以不改变                                      |
| 状态保存     | 无内置方法，需要另行保存页面的状态信息 | 将页面信息压入历史栈时可以附带自定义的信息                  |
| 参数传递能力 | 受到url总长度的限制，                  | 将页面信息压入历史栈时可以附带自定义的信息                  |
| 实用性       | 可直接使用                             | 通常服务端需要修改代码以配合实现                            |
| 兼容性       | IE8以上                                | IE10以上                                                    |



参考

(1)[https://www.cnblogs.com/dashnowords/p/9671213.html]

(2)[https://juejin.im/post/5e5b6906518825492a7207b4]