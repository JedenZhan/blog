## this.nextTick()

## 回顾JS运行机制

我们知道js是单线程的, 基于事件循环, 事件循环分为下面几个步骤

1. 所有同步任务都在主线程上执行, 形成一个执行栈
2. 主线程之外, 还有任务队列, 只要异步任务有了结果, 就在任务队列注册事件
3. 当执行栈所有同步任务执行完毕, 系统读取任务队列, 看看那些事件, 哪些对应的异步任务, 结束等待状态, 进入执行栈, 开始执行
4. 主线程重复以上步骤

主线程的执行过程就是一个tick, 所有的异步结果都通过任务队列调度, 消息队列存放一个个任务, 规范中task分为两类, macroTask(宏任务)和microTask(微任务), 每当执行一个宏任务, 就清空微任务

- 宏任务: 整体代码, setTimeout, setImmediate, setInterval, I/O, UI-render
- 微任务: process.nextTick, Promises.then Object.observe

```js
for (const macroTask of macroTaskQueue) {
  // 处理当前一个宏任务
  handleMacroTask(macroTask)

  // 处理全部微任务
  for (const microTask of microTaskQueue) {
    handleMicroTask(microTask)
  }
}

```

## Vue的this.nextTick()

源码位置`/src/core/util/next-tick.js`

```js
const callbacks = []
let pending = false

function flushCallbacks() {
  pending = false
  const copies = [...callbacks]
  callbacks.length = 0
  callbacks.forEach(cb => cb())
}

let microTimerFunc, macroTimerFunc, useMacroTask = false

macroTimerFunc = () => setImmediate(flushCallbacks)

// 如果不存在setImmediate降级为MessageChannel
// 如果以上都不存在, 降级为setTimeout

microTimerFunc = () => Promise.resolve().then(flushCallbacks)
// 如果不存在promise, 降级为macroTimerFunc

export function withMacroTask (fn) {
  return fn._withTask || fn._withTask = function (...res) {
    useMacroTask = true
    const res = fn(...res)
    useMacroTask = false
    return res
  }
}

export function nextTick (cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        console.error(e)
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) macroTimerFunc()
    else microTimerFunc()
  }
  if (!cb) return new Promise(resolve => { _resolve = resolve })
}
```

这个nextTick函数就是我们使用的this.$nextTick(() => {
  console.log('i am updated')
})

其实逻辑比较简单, 就是将我们传进去的cb用函数包一下push到函数队列, 然后等到浏览器执行微任务的时候, 清空队列执行全部函数