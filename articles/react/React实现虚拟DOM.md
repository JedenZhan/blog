---
title: React 虚拟 DOM 的实现
tags: [React, JavaScript]
---

## 前言

本文主要参考 [手写 React 系列](https://juejin.im/post/5ad81c24f265da504c168c85)

在读本文前, 你应该先知道 **我们写的 jsx 语法, 会被 babel 转为什么样子**

```jsx
<div className='name'>
  <p> hello div jsx</p>
</div>
// 编译完是
React.createElement("div", {
  className: "name"
}, React.createElement("p", null, " hello div jsx"));
```

可以看出来, React.createElement是一个函数, 接受三个参数,  第一个是元素名字, 第二个是元素属性, 第三个是该元素的子元素

## JSX 与 VDom

在 React 0.14 的时候 React 被拆分成两个包, React 和 ReactDOM

我们实现的虚拟 DOM 只需要保存元素信息, 然后交给 ReactDOM.render 来渲染就行

```js
const createElement = (tag, attrs, ...children) => {
    tag,
    attrs,
    children
}

export class Component { // 这就是我们使用 React 组件继承的那个类, 里面
    constructor (props = {}) {
        this.isReactElement = true
        this.state = {}
        this.props = props
    }
    
    setState (state) {
        enqueueSetState(stateChange, this)
    }
}

export default {
    createElement,
    Component
}
```

在这里, Component 类就是我们使用 `class XXX extends Component {...}` 继承的那个类, 这里实现了添加 props, 主要是 setState 方法, 里面的 enqueueSetState 则是事务流 `接下来会讲到`

### render 方法

上面说到 render 方法, **就是将虚拟 DOM 转化为 DOM 的函数**, 这里看一下实现

```js
const render = (vnode, container) => {
    container.innerHTML = '' // 先清空内容
    if (typeof vnode === 'string') { // 如果 vnode 是字符串, 则渲染普通文本
        const textNode = document.createTextNode(vnode)
        return container.appendChild(textNode)
    }
    
    const dom = docunemt.createElement(vnode.tag) // 取出 tag name
    if (vnode.attrs) { // 如果有元素属性, 则进行赋值
        let attrs = vnode.attrs
        for (let key in attrs) {
            const value = attrs[key]
            setAttribute(dom, key, value) // 这里是设置属性函数, 下面会介绍
        }
    }
    vnode.children.forEach(child => render(child, dom))
    return container.append(dom)
}
```

设置属性的时候, 比如 className 需要转化为 class 等, 这里讲解下 setSttribute 函数

```js
const setSttribute = (dom, name, value) => {
    if (name === 'className') name = 'class'
    // 如果属性名是 onXXX 说明是事件监听
    if (/on\w+/.test(name)) {
        name = name.toLowerCase()
        dom[name] = value || ''
    } else if (name === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || ''
        } else if (value && typeof value === 'object') {
            for (let key in value) {
                dom.style[name] = typeof value[key] === 'number' ? value[name] + 'px' : value[name]
            }
        }
    } else { // 普通属性直接赋值即可
        if (name in dom) dom[name] = value || ''
        if (value) {
            dom.setAttribute(dom, value)
        } else {
            dom.removeAttribute(name)
        }
    }
}
```

实现了 jsx (仅包含 HTML 元素, 不包含自定义 Component) 渲染成为真实 DOM 的实现, 包括元素属性的设定





