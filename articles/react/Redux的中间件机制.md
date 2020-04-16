---
title: Redux 中间件机制
tags: React
---

## 下载源码

[地址](https://github.com/reduxjs/redux)



我们要关注的是 `src` 目录下面的内容 

## 使用

我们需要一个基本的 store, reducers, 两个基本的操作

```js
const baseStore = {
    cash: 200
}

const reducer = (state = baseStore, action) => {
    const { type, payload } = action
    switch (type) {
        case: 'XXX':
        
        break
    }
}

const reducers = Redux.combineReducers({treasury:reducer}) // 合并 reducers

const store = createStore(reducers) // 这样一个 store 就创建出来了

store.dispatch({ type: 'XXX', 'your data' })
```



## 开始解析

utils 里面的函数

### actionTypes

对外暴露两个 action 类型, 都是随机字符, 但是头部不一样

我们可以基于这个源码来写一个获取固定长度的随机字符串

```js
function randomString(length) {
    let str = ''
    while (length > 0) {
        const fragment = Math.random().toString(36).substring(2)
        if (length > fragment.length) {
            str += fragment;
            length -= fragment.length
        } else {
            str += fragment.substring(0, length)
            length = 0
        }
    }
    return str
}
```

### isPlainObject

判断 action 是不是纯对象, `就是 __proto__ 直接指向 Object 的对象`

### warning

注意下 ie 8是不支持 console 的......

---

以下为重点部分

### index.js

这里面一般都是功能代码汇集并且导出的地方, 但是有一个函数 `isCrashed`

下面有一个判断, 判断这个函数名是不是 `isCrashed` 意思就是 不要在开发环境使用压缩代码

### createStore.js

这个当然就是我们用来创建 store 的函数所在地了, 里面主体是 createStore 函数, 内部有我们常用的 getState 函数, dispatch 函数, 等等

整个源码读下来应该比较难的是 中间件机制 吧, 其他的还好, 所以着重记录下中间件



## 中间件机制

applyMiddleWare.ts

这个函数是 createStore的第三个参数, 这个函数会返回应该 enhancer , 用来增强 store, enhancer是一个柯理化函数, 是这样用的:

```js
enhancer(createStore)(reducer, preloadedState)

// 由用法可以推导出来　这个函数的大致写法是
const enhancer = createStore => (reducer, preloadState) => {
    // .....
}
```

然后我们观察 applyMiddleWare 函数

```js
// 简洁一下
const applyMiddleWare = () => createStore => (reducer, preloadState) => {
    // ...
    
}

// 很容易就发现 applyMiddleWare 函数返回的就是一个 enhancer
```

那这个 applyMiddleWare 函数 内部做了什么呢 `源码是 ts 写的, 去掉了类型类型判断`

```js
const applyMiddleWare = () => createStore => (reducer, preloadState) => {
    const store = createStore(reducer, ...args) // 先创建了 store
    let dispatch = () => { // dispatch 临时函数, 如果在新的值未生效前, 执行是报错
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch) // 在这里更新了 dispatch
	// componse是整合函数用的, 就是一层一层的包裹, 并且是从后往前执行
    // 比如 [a, b], compose后就是 a(b()) 先执行 b, 然后把执行结果给 a, a再执行
    return {
      ...store,
      dispatch
    }
}
```

## 使用 redux-thunk 来模拟一下

redux-thunk 源码

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

最终我们拿到的是这样的

```js
const thunk = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState, extraArgument)
  }
  return next(action);
}
```

经过了 applyMiddleWare 到 chain 的时候, chain 是这个样子

```js
// 定义 dispatch 和 getState
const ThunkMiddleWare = next => action => { // next 以后会是 diapatch 或者 其他中间件函数, 最终是 dispatch
  if (typeof action === 'function') { // 如果 dispatch 参数是函数, 就去执行这个函数
    return action(dispatch, getState);
  }
  return next(action);
} // 一个接收 next 的函数
```

chain 经过 componse 后呢, 不变, 然后在上面可以看出来 store.dispatch 函数被当做 next 参数传入

当我们调用一个函数 action 的时候, 比如这样

```js
function getData(url) {
    return () => {
        // 拿到 url 做一些羞羞的事
        dispatch({
            type: 'xxx',
            // ...
        })
    }
}

// 进行 dispatch 操作
store.dispatch(getData('your url'))
// 转化一下
const url = 'my url'
store.dispatch(() => {
    // 拿到 url 做一些事
    dispatch({
        type: 'xxx',
        // ...
    })
})

// 这时, thunk 发现这是一个函数, 就会去执行, 内部的 dispatch 也是未增强的, 达到提交数据的效果
```

共勉