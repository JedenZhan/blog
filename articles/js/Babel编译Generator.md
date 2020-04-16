---
title: 怎么实现 Generator
tags: [JavaScript, ES6]
---

参考[伢羽大大的文章](https://github.com/mqyqingfeng/Blog/issues/102)

## Generator

> ES6 新规范, 就是 emmm Python 里面的生成器

用法: 

```js
function *test() {
    yield 1
    yield 2
    yield 3
    return 1
}

let test1 = test()
test1.next() // {value: 1, done: false}
test1.next() // {value: 2, done: false}
test1.next() // {value: 3, done: fasle}
test1.next() // {value: 1, done: true}
// 这里注意有 return 和无 return 的区别
```

可以一直 next 下去, 但是 value 是 undefined, done 是 true

## 直接贴出最终代码 `es6 化`

源代码:

```js
function *helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

let hw = helloWorldGenerator()
hw.next()
hw.next()
hw.next()
hw.next()
```

编译完可执行代码`伢羽大大简略后的`: 

```js
(() => {
    const ContinueSentinel = {}

    const mark = genFun => {
        const generator = Object.create({
            next: function (arg) {
                return this._invoke('next', arg)
            }
        })
        genFun.prototype = generator
        return genFun
    }
    const makeInvokeMethod = (innerFn, context) => {
        let state = 'start'
        return function invoke(method, arg) {
            if (state === 'completed') return { // 已完成的生成器直接返回
                value: undefined,
                done: true
            }
            context.method = method
            context.arg = arg // arg 可以暂时忽略

            while (true) {
                state = 'executing'
                const record = {
                    type: 'normal',
                    arg: innerFn.call(null, context)
                }
                if (record.type === 'normal') {
                    state = context.done ? 'compeleted' : 'yield'

                    if (record.arg === ContinueSentinel) {
                        continue
                    }

                    return { // 这里是 next 返回的结果
                        value: record.arg,
                        done: context.done
                    }
                }
            }
        }
    }

    const wrap = (innerFn, outerFn, self) => { // outerfn 就是有 next 方法的原函数
        const generator = Object.create(outerFn.prototype)
        
        const context = { // 构建出数据结构
            done: false,
            method: 'next',
            next: 0,
            prev: 0,
            abrupt(type, arg) { // 生成器结束的时候调用
                const record = {}
                record.type = type
                record.arg = arg
                return this.complete(record)
            },
            complete(record, afterLoc) {
                if (record.type === 'return') {
                    this.rval = this.arg = record.arg
                    this.method = 'return'
                    this.next = 'end'
                }
                return ContinueSentinel
            },
            stop() {
                this.done = true
                return this.val
            }
        }

        generator._invoke = makeInvokeMethod(innerFn, context)
        return generator
    }

    window.regeneratorRuntime = {}
    regeneratorRuntime.wrap = wrap
    regeneratorRuntime.mark = mark
})()


var _marked = regeneratorRuntime.mark(helloWorldGenerator)


// 以下是 babel 编译出的片段
function helloWorldGenerator() {
    return regeneratorRuntime.wrap(
        function helloWorldGenerator$(_context) { // innerfn
            while (1) {
                switch ((_context.prev = _context.next)) {
                    case 0:
                        _context.next = 2
                        return "hello"

                    case 2:
                        _context.next = 4
                        return "world"

                    case 4:
                        return _context.abrupt("return", "ending") // 生成器完成

                    case 5:
                    case "end":
                        return _context.stop()
                }
            }
        },
        _marked,
        this
    )
}

// 执行
var hw = helloWorldGenerator();

console.log(hw.next());
console.log(hw.next());
console.log(hw.next());
console.log(hw.next());
```

认真看看还是可以看懂的....

1. innerFn 就是我们的主体函数, 进入流程后在 invoke 里面执行 (根据我们的函数构建 invoke 函数)
2. 主要逻辑在 invoke 函数里面, 传入一个数据结构对象(包括prev, next...具体在 context 对象), 一个编译好的函数(我们的)
3. 每一次执行 next, 读取 context 的 next 属性并设置为 prev, 更新 context 对象, 返回需要的值
4. 如果完成, 执行 context 的方法, 标记完成

需要自己好好看看, 共勉