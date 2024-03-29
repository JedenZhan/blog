---
title: 七种跨域方式
tags: 网络
---

## 跨域方法

千万别只知道 JSONP

### 跨域的概念

同源策略和跨域

一个URL由http:// `协议`www. `子域名`google.com `主域名`:8080 `端口号`/script/index.js `资源地址`

出于安全考虑, 浏览器设计了同源策略

限制cookie, localStorage, indexedDB等缓存, DOM节点, AJAX请求如果跨域, 浏览器拦截

**域名不同, 协议不同, 端口不同, 三者有一项符合即为跨域**



### 1. JSONP

原理: 利用 Script 标签 没有跨域限制的漏洞, 网页可以得到其他来源动态产生的JSON数据,*** JSONP跨域需要服务端做相应的支持**

JSONP和AJAX一样, 都是客户端向服务器发送请求, 但是AJAX是同源策略, JSONP是跨域请求

JSONP 优点: 兼容性好, 可以解决主流浏览器跨域问题

缺点: **只支持Get方法, 不安全容易遭到XSS攻击 (本质是代码注入)**

```js
function jsonp(req) {
  let script = document.creteElement('script') // 创建script标签
  let url = req.url + '?callback=' + req.callback.name // 拼接参数
  script.url = url // 设置url属性
  document.getElementsByTagName('head')[0].appendChild(script) // 加入script标签
}
```



### 2. CORS

CORS 需要前端和后端同时实现, 主要是后端, **后端服务器需要设置允许Access-Control-Allow-Origin来开启CORS**, 这样就实现了跨域



使用 CORS 来实现跨域时, 前端请求会出现两种请求方式`简单请求和复杂请求`

- 简单请求

  > 满足两个条件:
  >
  > 1. 使用GET, HEAD, POST 请求方法
  > 2. ContentType仅限text/plain, mulitipart/form-data, application/x-www-form-urlencode
  >
  > 这种情况实现正常跨域

  

- 复杂请求

  > 不符合简单请求的请求为复杂请求
  >
  > 复杂请求在跨域请求之前要先进行一次 http 请求, 称为预检请求, 后台需要特定的配置, 比如put方法, 后台需要单独设置put方法



### 3. postMessage

postMessage 是 html5 XMLHttpRequest level2的API, 并且是为数不多的跨域跨域的window属性之一

这种方式可以用于解决以下问题:

- 页面和其打开的新窗口数据传递
- 多窗口之间的数据传递
- 页面与嵌套的iframe标签信息传递
- 上面三个场景的跨域信息传递

**postMessage() 允许使用来自不同源的脚本采用异步方法来进行有限的通讯, 可以实现跨文本档, 多窗口, 跨域消息传递**

例子:

```html
<iframe src="url" frameborder="0" id="frame" onload="load()"></iframe>
<script>
    const frame = document.getElementById('frame');
    frame.contentWindow.postMessage('数据', 'url') //发送数据
    window.onMessage = function (e) {
        console.log(e.data)
    }
</script>
```

### 4. websocket

webSocket是 html5 新提出的一个持久化协议, 它体现了浏览器与服务器全双工通讯

**也是跨域的一种解决方案, websocket和http都属于应用层协议,都是基于tcp协议 **

但是websocket与服务器建立连接后, server和client都可以发送数据

```js
const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('发送数据');
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
```

附带server.js

```js
// server.js
let express = require('express');
let app = express();
let WebSocket = require('ws');//记得安装ws
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws) {
  ws.on('message', function (data) {
    console.log(data);
    ws.send('我不爱你')
  });
})
```

### 5. Node 中间件代理

实现原理: **同源策略是限制浏览器的, 服务器与服务器发送请求没有同源策略**

有这几步:

1. 拿到客户端的请求
2. 将请求转发给服务器
3. 拿到服务器响应数据并且将数据返回给客户端

### 6. nginx 反向代理

类似Node中间件代理

需要搭建nginx环境来转发客户端请求

### 7. document.domain + iframe

只能用于二级域名相同的情况下

比如 a.google.com 和 b.google.com 适用于该方式

只需要给页面添加 `document.domain ='test.com'` 表示二级域名都相同就可以实现跨域。



### 总结:

- CORS支持所有的跨域请求方法, 是跨域的根本解决方案
- JSONP只支持Get方法, 可以用于老式浏览器以及不支持CORS的服务器
- node中间件和nginx反向代理都是利用服务器没有同源策略的特性
- 日常工作中用的比较多的是CORS和nginx反向代理