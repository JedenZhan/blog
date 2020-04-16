---
title: 解决a.b.c.d...之道
tags: JavaScript
---
## 前言

当我们做单页应用时, 最怕的就是报错... 一个报错很可能就会导致页面崩溃, 除了增错监控外, 也需要注意我们的代码问题
这种情况, 深度访问一个属性...

```js
let a = {
    b: {
        c: {
            d: 1
        }
    }
}
a.b.c.d // 1
```
怎么办???
就会出现标题中的情况 `a && a.b && a.b.c && a.b.c.d`, 这就很烦....

但是, 我们可以写一个函数来解决这种问题, 这个函数应该这么用

```
getDataByPath(a, 'b.c.d') // 两个参数是需要访问的对象, 属性路径
```

## 手起刀落, 开撸

我们的第一个版本长这个样子

```js
const getDataByPath = (obj, url) => {
  if (!obj) return obj
  const keys = url.split('.') // 把路径转为数组
  let target = obj[keys.shift()]; // 先获取第一个属性
  for (let i = 0, len = keys.length; i < len; i++) {
    let currentKey = keys.shift() // 依次取出属性名
    if (target) {
      target = target[currentKey]
    } else {
      return target // 如果不能再深度取值, 则返回
    }
  }
  return target // 最后走完循环, 也就拿到了我们需要的值
}

```

看官们可以去检验一下子

## 等等

细心的你可能发现了问题, 如果我们的对象不长这个样子, 如果有数组呢, 这样

```js
let a = {
    b: [
        {
            c: {
                d: 1
            }
        }
    ]
}

// 这样我们就只能这样访问
a.b[0].c.d
```

这种情况上面的函数就失效...

然后, 我可以改进我们的函数, 预期获取值是 `getDataByPath(a, 'b[0].c.d')`

```js
const getDataByPath = (obj, url) => {
  if (!obj) return obj
  const keys = url.split('.'),
    reg = /\[.+\]/ // 增加正则表达式
  let target = obj[keys.shift()]
  for (let i = 0, len = keys.length; i < len; i++) {
    let currentKey = keys.shift()
    if (currentKey.match(reg)) { // 如果可匹配
      let arrIndex = parseInt(currentKey.match(reg)[0].slice(1, -1))
      currentKey = currentKey.slice(0, currentKey.indexOf('[')) // 先取属性, 再取数组
      target[currentKey] ? target = target[currentKey][arrIndex] : null
    } else if (target) {
      target = target[currentKey]
    } else {
      return target
    }
  }
  return target
}

```

这样就比较符合我们应用场景啦, 可能还有更复杂的, 但是基本业务中, 这种就可以适用大部分场景了

共勉

