---
title: Redux 源码
tags: React
---

## 下载源码

[地址](https://github.com/reduxjs/redux)

## 基本使用

回顾下 Redux 的使用, reducer, defaultState, actionTypes ...

```js
const defaultState = {
    count: 0
},
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE';

const increaseCount = (state = defaultState, action) => {
    const { type, count = 1 } = action
    if (type === INCREASE) {
      return {
        count: state.count + count
      }
    }
}
const decreaseCount = (state, action) => {
  const { type, count = 1 } = action
  if (type === DECREASE) {
    return {
      count: state.count - count
    }
  }
}

const reducers = Redux.combineReducers({increaseCount, decreaseCount}) // 合并 reducers

const store = createStore(reducers)

store.dispatch({ type: INCREASE, count: 1 })
store.dispatch({ type: DECREASE, count: 2 })
console.log(store.getState());
/*
{
  incrementCount: { count: 1 },
  decrementCount: { count: -2 }
}
*/
```
和React结合的时候

```js
const App = () => <div onClick={store.dispatch({type: INCREASE})}>{store.getState().incrementCount.count}</div>

render = () => ReactDOM.render(<App />, 'Your root element')
store.subscribe(render)
render()
```

## src目录结构
├── applyMiddleware.ts `中间件处理`
├── bindActionCreators.ts
├── combineReducers.ts `合并 reducer 方法`
├── compose.ts `注册中间件函数`
├── createStore.ts `创建store`
├── index.ts
├── types `ts数据类型`
│   ├── actions.ts
│   ├── middleware.ts
│   ├── reducers.ts
│   └── store.ts
└── utils 工具方法
    ├── actionTypes.ts 内置action, 比如初始化
    ├── isPlainObject.ts 是不是纯对象, dispatch的对象需要是纯对象
    ├── symbol-observable.ts
    └── warning.ts 警告

## 开始解析

utils
### actionTypes

```js
const randomString = () => Math.Random().toString(36).subString(7).split('').join('.')

const ActionTypes = {
  INIT: `XXXX${randomString()}`, // 初始化 store 的action type
  // ...
}
```

### isPlainObject
```js
const isPlainObject = obj => {
  if (typeof obj !== 'object' || obj === null) return false
  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  } // 这一步就是获取到原型链顶端的对象
  return Object.getPrototypeOf(obj) === proto
}
```
判断 action 是不是纯对象, `就是 __proto__ 的 constructor 直接指向 Object 的对象`
比较抽象
e. g.
```js
class Me {}
isPlainObject(new Me()) // false, (new Me()).__proto__.__proto__ 是原型链顶端对象
isPlainObject([]) // false, [].__proto__.__proto__ 是顶端对象
isPlainObject({}) // true, {}.__proto__ 直接是顶端对象
```
### warning

注意下 ie 8是不支持 console 的......

所以有了`if (typeof console !== 'undefined')`



**以下为重点部分**

### index.js

这里面一般都是功能代码汇集并且导出的地方, 但是有一个函数 `isCrushed`并且是空函数, 那这个是干啥的

我们知道 webpack 有压缩代码功能, 如果 isCrushed 函数被压缩, 可能是 function a () {} 但是字符串是不会被压缩的

这时候获取 a.name 是 a 就不是 'isCrushed' 了

所以这个意思就是 **不要在开发环境/非生产环境使用压缩代码**

```js
function isCrushed () {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('不能在非生产环境使用压缩代码!!!')
}
```

### createStore.js

还记得怎么使用createStore方法吗

```js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const store = createStore(reducer, applyMiddleware(thunk))
```
createStore接收参数是reducer, enhancer

精简化的源码

```js
e. g.ort default function createStore(reducer, preloadedState, enhancer) {
  // 如果preloadedState和enhancer是函数, 或者enhancer, 第四个参数是函数
  // 提示你好像没有使用applyMiddleware合并中间件
  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('你好像没有使用applyMiddleWare合并中间件, 你应该compose它们')
  }
  // 如果 preloadedState是函数, enhancer没传, 交换变量
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }
  // 如果 enhancer存在
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('enhancer需要是函数!!!')
    }

    // 如果enhancer是函数, createStore return
    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('enhancer必须是函数!!!')
  }
  
  let currentReducer = reducer,
    currentState = preloadedState,
    currentListeners,
    nextListeners = currentListeners,
    isDispatching = false
  
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) nextListeners = currentListeners.slice() // 数组浅拷贝
  }

  function getState() {
    if (isDispatching) throw new Error('正在dispatch, 不许获取state!!')
    return currentState
  }

  function subscribe(listener) {
    // 新增监听函数, 返回一个取消监听函数, 精妙, 闭包思想
    if (typeof listener !== 'function') {
      throw new Error('listener必须是函数!!!')
    }
    if (isDispatching) throw new Error('正在dispatch, 禁止新增订阅者')
    
    let isSubscribed = true
    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() { // 因为闭包, listener被保存, 可以直接方便的删除
      if (!isSubscribed) return
      if (!isDisPatching) throw new Error('正在dispatch,不要取消监听')
      isSubscribed = false
      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }

  function dispatch(action) {
    if (isPlainObject) throw new Error('action必须是纯对象')
    if (action.type === undefined) throw new Error('action必须有type属性')
    if (isDispatching) throw new Error('reducer可能没有dispatch action')
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    // 每次dispatch都会触发所有的listener执行
    const listeners = (currentListeners = nextListeners)
    listeners.forEach(listener => listener())

    return action
  }

  function replaceReducer(nextReducer) {
    // 不常用
    // 判断
    // ...
  }

  function observable () {
    // 不常用
  }

  dispatch({ type: ActionTypes.INIT }) // 初始化store, dispatch一个几乎不可能重复的type, 让reducer返回一个默认的state

  const store = {
    dispatch,
    getState,
    subscribe,
    replaceReducer,
    observable
  }

  return store
}
```
其实createStore的核心代码就是dispatch, getState, subscribe三个方法
然后dispatch一个INIT, 初始化state

getState直接把当前的state返回, 我们可以直接修改这个state, 但是触发listeners执行的只有dispatch, 所以直接改不会造成页面刷新, 也不是redux推荐的做法

subscribe比较精妙的使用闭包, 返回一个unsubscribe用于取消订阅

dispatch把state, action传给reducer执行, reducer返回一个新的state, 然后这个时候redux的currentState就是你的reducer返回的State

## combineReducers.js

使用这个合并我们的reducer, 那这个函数做了什么呢

```js
e. g.ort default function combineReducers (reducers) {
  const reducerKeys = Object.keys(reducers),
    finalReducers = {}
  
  reducerKeys.forEach(reducerKey => {
    // 非生产环境, 没有对应的reducer, 报错
    if (typeof reducers[reducerKey] === 'function') finalReducers[reducerKey] = reducers[reducerKey]
  })

  const finalReducerKeys = Object.keys(finalReducers)

  // 使用combineReducers函数拿到的合并后的reducer
  return function combination(state, action) {
    let hasChanged = false
    const nextState = {}
    for (let i = 0, len = finalReducerKeys.length; i < len; i ++) {
      const key = finalReducerKeys[i],
        reducer = finalReducers[key],
        previousStateForKey = state[key],
        nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey // 对象之间比较的是指针, 这也是redux让我们必须返回一个全新的对象的原因
    }
    // 再次判断就是判断state的长度和reducer的长度
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length

    // 若未更新(你的reducer直接返回原来的state)就返回旧的state
    return hasChanged ? nextState : state
  }
}
```

combineReducer核心函数就是我们常用的combineReducers, 它返回一个全新的reducer

这个reducer保存我们所有的reducer, dispatch的时候会利用for循环一个个的执行这些reducer, 给每个reducer创建一个state的key, key对应每个reducer维护的state

我们的reducer必须返回全新的对象, 否则redux会认为这个reducer对应的state未更新, 返回旧的state

## 中间件机制

applyMiddleWare.ts

回顾下我们怎么使用applyMiddleware的

```js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const store = createStore(reducer, applyMiddleware([thunk]))
```
根据上面对createStore的解析, 我们知道, 第二个参数为preloadedState, 但第三个参数是空, 第二个参数是函数的时候, 会交换变量, 所以, **这里的enhancer就是applyMiddleware的返回值**

enhancer是柯里化函数

调用enhancer方法就是 enhancer(createStore)(reducer, preloadedState)

applyMiddleware源码
```js
const applyMiddleware = createStore => middlesares => {
  return (reducer, preloadedState) => {
    // 因为enhancer存在, 之前的createStorez'duan
    const store = createStore(reducer, preloadedState)
    let dispatch = () => throw new Error('正在配置middleware!!不允许执行dispatch!!!')
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }

    // 关键代码
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```
注意到 compose 函数, 定义在 compose.ts里面, 这个函数也是柯里化函数, 接收我们传进去的middleware和dispatch



```js
const compose = (...funcs) => {
  if (func.length === 0) return args => args
  if (func.length === 1) return funcs[0]
  
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

compose函数就几行, 但还是比较难理解的

e. g.

```js
const a = aa => {
        console.log(`i am ${aa}`)
        return aa
      },
      b = bb => {
        console.log(`i am ${bb}`)
        return bb
      },
      c = cc => {
        console.log(`i am ${cc}`)
        return cc
      };

const d = [a, b, c].reduce((func1, func2) => (...args) => func1(func2(...args)))

d('dispatch')

// 返回值
// i am dispatch
// i am dispatch
// i am dispatch
// 'i am diapatch'
```

也就是说, 这个compose函数是将我们的中间件函数整合, 然后返回一个头部函数, 在上面的例子里, d最终变成了`a(b(c(...args)))` 其中args就是我们传进去的'diapatch', d的意思是, c执行, 结果传给b, b执行, 结果传给a, a执行

所以, **redux的中间件是数组从后向前执行的**




## 使用 redux-thunk 来模拟一下

可能看完上面还是一头雾水, 我们可以用redux-thunk模拟下

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

export default thunk
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
// dispatch 和 getState 作为参数传入 thunk, 柯里化函数
const ThunkMiddleWare = next => action => { // next 以后会是 diapatch 或者 其他中间件函数, 最终是 dispatch
  if (typeof action === 'function') { // 如果 dispatch 参数是函数, 就去执行这个函数
    return action(dispatch, getState);
  }
  return next(action);
}
```

chain 经过 componse 后呢, 不变, 然后在上面可以看出来 store.dispatch 是 next 实参

当我们调用一个函数 action 的时候, 比如这样

```js
function getData(url) {
  	const data = fetch(url)
    return dispatch => {
        dispatch({
            type: 'xxx',
            data
        })
    }
}

// 进行 dispatch 操作
const a = getData('your url')
store.dispatch(a)
// 经过thunk的时候, 发现这个action是函数, 就会把diapatch当做参数传入, 并且执行
const url = 'my url'
store.dispatch(a(dispatch))
// 注意store.dispatch是增强的dispatch, 类似上面例子的d, 但是a的参数diapatch是初始的dispatch
```

ok, redux源码就是这些了, 有错误还请指出