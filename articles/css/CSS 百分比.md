---
title: CSS 百分比那些事
tags: CSS
---

## 百分比单位

CSS 具有多种单位, 有px, pt 绝对单位, 也有rem, em, 百分比, vh, vw等相对单位, 其他单位都还好理解, 但是百分比这个是相对于谁的百分比呢, 这篇文章做一个总结

## 总结

```html
<style>
    #app {
        height: 100px;
        width: 200px;
        background-color: #f00;
    }

    #inner {
        width: 20%;
        height: 20%;
        background-color: #00f;
        margin-left: 20%;
        margin-top: 20%;
        padding-left: 20%;
        padding-top: 20%;
    }
</style>
<div id="app">
    <div id="inner"></div>
</div>
```

然后得到 inner 的结果如下

![img](./Imgs/percent.png)

可以得到结论

| 属性         | 百分比依据     |
| ------------ | -------------- |
| margin-横向  | 父元素宽度     |
| margin-竖向  | **父元素宽度** |
| padding-横向 | 父元素宽度     |
| padding-竖向 | **父元素宽度** |
| 宽高         | 父元素宽高     |

## 对于定位元素

```html
<style>
    #app {
        height: 100px;
        width: 200px;
        background-color: #f00;
    }

    #inner {
        width: 20%;
        height: 20%;
        background-color: #00f;
        left: 20%; /*40px*/
        top: 20%; /*20px*/
    }
</style>
<div id="app">
    <div id="inner"></div>
</div>
```

绝对定位元素是相对于最近的非 static 元素的宽高进行计算

相对定位元素直接按照父元素计算

**最终总结为: **

- padding / margin 不论横向竖向都是根据父元素宽度计算
- 对于相对定位元素: left, top 根据父元素宽高决定
- 对于绝对定位元素: left, top 最近一层非 static 元素宽高绝定