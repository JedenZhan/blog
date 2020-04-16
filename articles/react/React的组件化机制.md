---
title: React 组件化机制
tags: [React, JavaScript]
---

上一篇写了[虚拟 DOM 转化为真实 DOM](), 这一篇讲解 React 自定义组件的渲染

## 组件化

把前端页面的某一部分抽象出来形成可复用模块, 称为组件化

## extends Component 继承了什么

这里先写出来这个神秘的 Component

```js
class Component {
    constructor(props = {}) {
        this.props = props
        this.state = {}
    }
    
    setState = (newState) => {
        // 这里先不讨论 diff 以及 事务流
        Object.assign(this.state, newState)
        renderComponent(this) // 组件渲染函数, 下面会讲解
    }
}
```

其中 setState 的 diff 算法请[移步]()

## 重写 render

render 函数现在不仅要可以创建普通 DOM, 也要知道 React 组件该怎么应对

babel 是怎么编译自定义组件的呢

```jsx
class Hello extends Component {
  render () {
    return (
    	<div>hello</div>
    )
  }
}

<div>
	<Hello hello='hello'/>
</div>
```

编译完毕后

```js
class Hello extends Component {
  render() {
    return React.createElement("div", null, "hello");
  }

}

React.createElement("div", null, React.createElement(Hello/*注意这里是Hello变量*/, {
  hello: "hello"
}))
```

怎么判断呢 `众所周知, class 是语法糖...`

```js
typeof Hello === 'function' // true
```

就可以写 render 了

```js
const render = (vnode) => {
    if (typeof vnode === 'function') { // 判断需要渲染的元素是不是自定义组件
        const component = createComponent(vnode.tag, vnode.attrs) // 创建组件对象(未渲染)
        setComponentProps(component, vnode.attrs) // 设置组件 props
        return component.base
    }
}
```

我们定义的 React 组件有两种形式, 一种是 class 一种是 function

createComponent 的实现

```js
const createComponent = (tag, props) => {
    let init
    if (tag.prototype && tag.prototype.render) { // 类组件
        init = new tag(props)
    } else { // 函数组件
        init = new Component(props)
        init.constructor = tag
        init.render = function () {
            return this.constructor(props)
        }
    }
    return init
}
```

setComponentProps 的实现

> 上面的 createComponent 已经初始化了 props
>
> 这个函数主要为了实现 组件的接收 props 的时候, 执行周期函数

```js
const setComponentProps = (comp, props) => {
    if (!comp.base) { // 这个 base 代表组件是第一次挂载渲染还是更新渲染
        if (!comp.base) {
            comp.componentWillMount && comp.componentWillMount()
        } else if (comp.componentWillReceiveProps) {
            comp.componentWillReceiveProps()
        }
        comp.props = props
        renderComponent(comp) // 这个是真正的渲染函数
    }
}
```

renderComponent的实现

> 不管怎么自定义, 自定义的组件有多深, 最终肯定由 DOM 元素构成 `都可以调用之前的 render函数`

```js
const renderComponent = component => {
    let base
    const renderer = component.render() // 这里执行返回 render 返回的东西
    if (component.base && component.componentWillUpdate) { // 如果有 base, 说明不是初始化渲染, 是更新渲染
        console.log('组件需要更新')
        component.componentWillUpdate()
    }
    base = _render(renderer) // 递归调用 render
    if (!component.base && component.componentDidMount) component.componentDidMount()
    if (component.base && component.componentDidUpdate) component.componentDidUpdate()

    if (component.base && component.base.parentNode) { // 替换原来的 dom
        component.base.parentNode.replaceChild(base, component.base) // render 函数 return 不能 return 多个元素的原因
    }

    component.base = base // 更新上一个状态
    base._component = component
}
```

这篇文章主要讲解自定义 React 组件内部简单实现, 未涉及 diff 算法和 事务流