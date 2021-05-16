---
title: 几个自定义 Hooks
tags: [JavaScript, React, ES6]
---

[本文参考](https://juejin.im/post/5e57d0dfe51d4526ce6147f2#heading-7)

如果你还不了解 React Hooks 可以先看[这篇](https://jedenzhan.github.io/2020/02/12/hooks/)

## HOOKS 实现 Redux

我们可以通过 useReducer, useContext, createContext 三个 API 实现 我们的小型 Redux

actionType.js

```js
export default {
    INCREMENT: 'increment',
    DECREMENT: 'decrement',
    RESET: 'reset'
}
```

action.js

```js
import actionTypes from './actionTypes'

export const increment = () => ({
    type: actionTypes.ADD
})

export const decrement = () => ({
    type: actionTypes.DECREMENT
})

export const reset = () => ({
    type: actionTypes.RESET
})
```

reducer.js

```js
import actionTypes from './actionTypes'

export const init = initValue => {
    return {
        count: initValue
    }
}

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.INCREMENT:
            return {
                count: state.count ++
            }
            break
        case actionTypes.DECREMENT:
            return {
                count: state.count --
            }
            break
        case actionTypes.RESET:
            return {
                count: 0
            }
    }
}
```

index.js

```jsx
import React, { useReducer, useContext, createContext } from 'react'
import { init, reducer } from './reducer'

const Context = createContext()
const Provider = props => {
    const [state, dispatch] = useReducer(reducer, props.initValue || 0, init)
    return (
    	<Context.Provider value={{state, dispatch}}>
        	{ props.children }
        </Context.Provider>
    )
}

export default {
	Context,
    Provider,
    useRedux
}
```



## 实现防抖与节流

### 防抖

```js
import { useEffect, useRef } from 'react'

const useDebounce = (fn, time = 30, deps = []) => {
    let timeout = useRef()
    useEffect(() => {
        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            fn()
        }, time)
    }, deps)

    const cancel = () => {
        clearTimeout(timeout.current)
        timeout = null
    }
    return [cancel] // 暴露 cancel API
}

export default useDebounce
```

### 节流

```js
import { useEffect, useRef, useState } from 'react'

const useThrottle = (fn, ms = 30, deps) => {
    let previus = useRef(0)
    const [time, setTime] = useState(ms)
    useEffect(() => {
        let now = Date.now()
        if (now - previus.current > time) {
            fn()
            previus.current = now
        }
    }, deps)
    const cancel = () => {
        setTime(0)
    }
    
    return [cancel]
}

export default useThrottle
```

## 自定义 title

```js
import { useEffect } from 'react'

const useTitle = title => {
    useEffect(() => {
        document.title = title
    }, [title])
    return
}

export default useTitle
```

## 实现元素是否被hover
```js
function useHover(e) {
    const [isHover, setIsHover] = useState(false)
    useEffect(() => {
        function cb() {
            setIsHover(true)
        }
        e.addEventListener('mouseover', cb)
        return () => {
            e.removeEventListener(cb)
        }
    }, [e])
    return isHover
}
```