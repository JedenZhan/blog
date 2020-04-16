---
title: 这一次讲讲 hooks
tags: [React, JavaScript, ES6]
---

## Hooks

是什么: React 16.8 提供的可以让函数组件拥有自己状态, 也可以独立使用的一组 api

为什么: `在 hooks 之前, React 没有提供将可复用性行为附加到组件的途径, 比如我们用的 redux, 需要使用 react-redux 提供的 provider 来连接组件和 store, React 需要为共享状态逻辑提供更好的原生途径`

大概可以有这几点

- 我们维护的组件经常含有很多业务逻辑, 导致组件难以复用
- class 内部 this 指向让人头疼
- hooks 可以在组件外编写特定逻辑, 然后在组件内部使用, 这样分离会有很大的复用率

具体可以参考 [动机](https://react.docschina.org/docs/hooks-intro.html#motivation)

注意: hooks 在 class 组件内部不起作用

## 基本的 Hooks

### useState

让函数组件拥有 state

```jsx
import React, { Fragment, useState } from 'react'

const app = props => {
    const [a, setA] = useState(0)
    
    return (
        <Fragment>
        	<button onClick={() => setA(a + 1)}>
            	{a}
            </button>
        </Fragment>
    )
}
```

### useEffect

当组件重新渲染, DOM 更新完毕后执行

```jsx
const UseEffectExp = props => {
  const [a, seta] = useState(0)

  useEffect(() => {
    console.log('aChanged', a)
    return () => {
        // 返回的函数里面写清除副作用的操作
    }
  }, [a]) // 第二个参数是数组, 表示数组内部数据变化才会触发回调函数

  return (
    <Fragment>
      <button onClick={() => seta(a + 1)}>
        {a}
      </button>
    </Fragment>
  )
```

### useContext

让函数组件可以使用 Context

```jsx
const Mycontext = createContext('jeden')

const Inner = props => {
    let value = useContext(MyContext)
    console.log(value) // jeden
    return (
        <Fragment>
            Inner
        </Fragment>
    )
}

const App = props => {
    <MyContext.Provider value='jeden'>
    	<Inner />
    </MyContext.Provider>
}
```

## 额外的 Hooks

### useReducer

类似 redux. useState 的替代方案, 可以使用对象

```````jsx
const initState = { // 初始状态
    count: 0
}

function reducer(state, action) { // 类似 reducer 函数
    switch (action.type) {
        case 'add':
            return {
                count: state.count + 1
            }
           	break
        case 'increment':
            return {
                count: state.count - 1
            }
            break
    }
}

const UseReducerExp = props => {
    const [state, dispatch] = useReducer(reducer, initState)
    
    return (
    	<Fragment>
        	{state.count}
            <button onclick={() => dispatch({type: 'add'})}>add</button>
            <button onclick={() => dispatch({type: 'increment'})}>increment</button>
        </Fragment>
    )
}
```````

### useCallback

返回特定的回调函数, 这个函数在特定的值变化了才会更新

```jsx
// 下面有详细讲解
```

### useMemo

当依赖项改变的时候才会重新计算值

```jsx
const UseMemoExp = props => {
  const [a, setA] = useState(0)
  const [b, setB] = useState(999)
  const memoValue = useMemo(() => {
      console.log('重新计算')
      return a + b
  }, [a, b])

  return (
    <Fragment>
      <button onClick={() => { setA(a + 1) }}>a: {a} memo: {memoValue}</button>
      <button onClick={() => { setB(b - 1) }}>b: {b} memo: {memoValue}</button>
    </Fragment>
  )
}
```

### useRef

帮助函数组件访问原生元素

```jsx
const UseRefExp = props => {
    const el = useRef(null)
    const onclick = () => {
        console.log(el.current) // input element
        el.current.focus()
    }
    
    return (
    	<Fragment>
        	<input ref={el} type='text'/>
            <button onClick={() => {onclick()}}>click me</button>
        </Fragment>
    )
}
```

### useLayoutEffect

但它会在所有的 DOM 变更之后同步调用 effect, 可以使用它来读取 DOM 布局并同步触发重渲染. 在浏览器执行绘制之前, `useLayoutEffect` 内部的更新计划将被同步刷新

**类似 useEffect**



## useCallback 和 useMemo

这俩好像有点难懂....

在 class 组件中, 如果内部状态更新, 我们可以通过 shouldComponentUpdate 来判断组件是否需要更新, 但是在函数组件中, 没有了这个函数, 就造成很多不必要的更新, 这两个 hooks 就是为了解决这个问题

```jsx
const WithoutMemo = props => {
    const [a, setA] = useState(0)
    const [b, setB] = useState(999)
    
    const expensive = () => {
        console.log('computed')
        let sum = 0
        for (let i = 0; i < a * 100; i ++) {
            sum += i
        }
        return sum
    }
    
    return (
    	<Fragment>
        	<p>{count}-{val}-{expensive()}</p>
            <button onClick={() => {setA(a + 1)}}>set a</button>
            <button onClick={() => {setB(b - 1)}}>set b</button>
        </Fragment>
    )
}
```

在这个例子中, 点击 set b, 虽然 expensive 函数并不依赖 b, 但是仍会执行, 这就造成了多余的调用

如果添加了 memo

```js
const expensive = useMemo(() => {
    console.log('computed')
    let sum = 0
    for (let i = 0; i < a * 100; i ++) {
        sum += i
    }
    return sum
}, [a])
```

这样,  b 变化的时候, 这个函数就不会执行, 就减少了很大计算量啦

下面看看 useCallback

```jsx
const set = new Set()

const UseCallbackExp = props => {
    const [a, setA] = useState(0)
    const [b, setB] = useState(999)
    
    const callback = useCallback(() => {
        console.log(a)
    }, [a])
    set.add(callback) // 只有点击 set a 的时候, size 才会增加
    
    return (
        <Fragment>
			a:{a}, size:{set.size}
            <button onClick={() => setA(a + 1)}></button>
            <button onClick={() => setB(b - 1)}></button>
        </Fragment>
    )
}
```

useCallback使用场景: 子组件接受一个函数 props, 如果父组件更新, 因为子组件 props 依赖父组件的 state, 也会更新, 这样可以使用 callback, callback 确保 函数不变, 子组件也不会触发更新

Hooks 大概就以上这些, 下一个博客讲解如何自定义 hooks

共勉



