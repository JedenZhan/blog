---
title: 封装自己的连接池(MongoDB+Express)
tags: Node
---

## 数据库连接

在做自己的小 demo 的时候, 发现一个问题, 当需要使用数据库的时候, 每一次使用都需要重新连接, 但是连接是比较耗费时间的

因为 Node 的数据库连接使用回调函数来操作, 一直与数据库保持连接也不行



## 数据库连接池

> 简单来说就是创建很多数据库连接实例, 如果有数据库操作就在连接池里面取一个空闲操作

自己写一个数据库连接池

使用了 mongodb, generic-pool 工具包

```js
const MongoClient = require('mongodb').MongoClient,
      GenericPool = require('generic-pool'),
      MongoURL = '你的数据库连接地址'

const factory = { // 创建连接池的模板
    create () {
        return MongoClient.connect(MongoURL, {
            useUnifiedTopology: true
        })
    },
    destory (client) {
        client.close()
    }
}

const opts = {
    max: 100,
    min: 1
} // 最多100个, 最少1个

const connectPool = GenericPool.createPool(factory, opts) // 连接池建立完成

// 如果需要使用则申请一个连接
const connection = connectPool.acquire() // 返回一个 Promise
```

但是这样一个一个的申请连接其实也不是很方便, 我们还可以进一步封装

```js
const curd = (dbName, cb) => {
    if (typeof dbName === 'function') {
        cb = dbName
        dbName = 'demo' // 默认数据库名字
    }
    const dataBaseConnection = connectPool.acquire()
    
    dataBaseConnection.then(client => {
        cb(client.db(dbName))
    }, err => {
        console.log('出错啦')
    }).catch(err => {
        console.log('错误信息', err)
    })
}

module.exports = curd // 导出这个方法
```

封装完毕, 这个函数的使用方法是

```js
curd('数据库名字(可选)',db => {
    db.collection('your database name').find({}).toArray((err, res) => {
        // ...
    })
})
```

好啦, 这就是全部啦