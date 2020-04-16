---
title: Node事件队列处理雪崩
tags: [Node, 碎片]
---
为什么需要事件队列

什么是雪崩

> 在计算机里面, 缓存存在于内存中, 访问速度特别快, 用于数据库则是避免多次重复的查询直接从缓存取就完事了, 但是, 如果缓存在大量请求的时候失效, 就会有大量的请求直接涌向数据库, 数据库无法承受, 这就是雪崩问题



## 事件队列实现

```js
let proxy = new events.EventEmitter()
let status = 'ready'

const select = callback => {
    proxy.once('selected', callback)
    if (status === 'ready') {
        status = 'pending'
        db.select('SQL OR Others', result => {
            proxy.emit('selected', result)
            status = ready
        })
    }
}

// 注意是重复的查询可以使用
```

-- 来自深入浅出 Node

