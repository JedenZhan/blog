---
title: 自己封装 Ajax 以及 fetch 的使用
tags: [JavaScript, HTTP]
---

## 自己封装 Ajax

```js
const getParams = (obj) => { // 格式化参数方法, 公用函数放外面不会每次都要创建
    if (!obj) {
        return null
    }

    let arr = []
    for (let key in obj) {
        arr.push(`${key}=${obj[key]}`)
    }
    return arr.join('&')
}

const myAjax = options => {
    let {
        url,
        data,
        method = 'get',
        async = true,
        timeout = 1000,
        success,
        error
    } = options
    let params = getParams(data)
    let xhr = new(XMLHttpRequest ? XMLHttpRequest : ActiveXObject)()

    if (method.toUpperCase() === 'GET') {
        url = `${url}?${params}` // get拼接参数
    }

    xhr.open(method, url, async)

    if (method.toUpperCase() === 'POST') {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        console.log(params)
        xhr.send(params)
    } else {
        xhr.send(null)
    }

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            success(xhr.responseText)
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            let e = xhr.responseText
            error && error(e)
        }
    }
}



myAjax({
    url: 'http://localhost:3000', // 自己写了测试文件
    data: {
        username: 111,
        password: 'aaa'
    },
    method: 'get',
    async: true,
    success: (data) => {
        console.log(data)
    },
    error: (e) => {
        console.log(e)
    }
})
```

## 使用 fetch

fetch 并不是基于 XMLHttpRequest, 而是一个全新的 API

fetch 的用法:

```js
fetch('your url', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(v => v.json(), e => throw e).then(v => {
    console.log(v)
}).catch(e => throw e)
```

但是 fetch 的兼容性并不好, ie 和 safari 都不支持

基于 fetch 方法的 npm 包有 [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)



