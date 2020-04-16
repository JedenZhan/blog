---
title: FileReader 的使用
tags: [JavaScript, HTML, 碎片]
---

## 什么是 FileReader

> 是 HTML5 提供的读取用户文件的 API, 允许 JS 读取 用户文件

其中 File 对象可以是 input 的 file 类型, 也可以是托放产生的 DataTransfer 对象

**仅用于安全(对于客户安全)的读取用户文件, 不能从文件系统读取, 通过路径读取需要使用 Ajax 获取, 遵守同源策略(CORS)**



## 使用

### 读取 txt 文件

```html
<body>
    <input id='file' type='file'/>
    <div id='text'>
        这里放置读取出的 txt 内容
    </div>
    
    <script>
        const file = $('file'),
              text = $('text')

        file.addEventListener('change', e => {
            const reader = new FileReader()
            reader.readAsText(e.target.files[0]) // 注意这里有一个[0]读取第一个文件
            reader.addEventListener('loadend', () => {
                let result = reader.result.replace(/\n/g, "<br/>") // 替换换行
                console.log(result)
                text.innerText = reader.result // 读取成功后插入内容
            })
        })
    </script>
</body>
```

### 读取 Img 文件

```html
<body>
    <input id='file' type='file'/>
    <div id='result'>
        这里放置读取出的 img
    </div>
    
    <script>
        const file = $('file'),
              result = $('result')

        file.addEventListener('change', e => {
            const reader = new FileReader()
            reader.readAsDataURL(e.target.files[0]) // 图片格式读取成 Base64编码
            reader.addEventListener('loadend', () => {
                let img = new Image()
                result.src = reader.result
                result.appendChild(img)
            })
        })
    </script>
</body>
```

**在实际使用场景可以根据文件对象格式判断使用哪种读取格式**

## 深入了解

我们可以使用 console.dir(FileReader) 打印出来

![img](./Imgs/method-on-filereader.png)

| 属性        | 作用                                 |
| ----------- | ------------------------------------ |
| readyState  | 0/1/2 分别代表读取前, 读取中, 读取后 |
| result      | 当读取完毕后, 拿到的读取结果         |
| error       | 出错的回调函数                       |
| onloadstart | 刚开始读取的回调函数                 |
| onload      | 读取完毕的回调函数                   |
| onabort     | 取消的回调函数                       |
| onloadend   | 加载结束的回调函数                   |
| onprogerss  | 加载进度回调函数                     |



| 方法               | 作用                             |
| ------------------ | -------------------------------- |
| readAsArrayBuffer  | 读取为 ArrayBuffer `暂不支持`    |
| readAsBinaryString | 读取文件中的内容为原始二进制数据 |
| readAsText         | 读取文本文件 `上有展示`          |
| readAsDataURL      | 读取为 `data:base64...` 格式     |
| abort              | 打断操作                         |

以上就是 FileReader 的解析了, 共勉