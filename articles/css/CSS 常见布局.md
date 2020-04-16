---
title: CSS 常见布局
tags: [CSS, HTML]
---

## 单列布局

> header, content, footer 的单列布局, 比较简单

## 两列自适应布局

> 一列由内容撑开, 另一列将剩余空间填满的布局

实现方式:

使用 BFC 的特性, BFC 不会重叠浮动元素

```html
<style>
    .wrapper, .left, .right {
      height: 100px;
    }

    .wrapper {
      overflow: hidden;
      background-color: #0f0;
    }

    .left {
      float: left;
      margin-right: 20px;
      background-color: #f00;
      width: 100px;
    }

    .right {
      overflow: hidden;
      background-color: #00f;
    }
</style>

<div class='wrapper'>
    <div class='left'></div>
    <div class='right'></div>
</div>
```

## 三栏布局

### 圣杯布局

> 比较特殊的三栏布局, 两边固定, 中间自适应, 特点是先写中间 DOM `先被加载` 

1. 包裹元素左右 padding
2. 内部三个元素均 float left
3. 左边设置 margin-left: 100% 跳到和 center 一行, 设置相对定位到包裹元素的 padding 部位
4. 右边设置 margin-left: 本身宽度, 跳到和 center 一行, 也设置相对定位到包裹元素的 padding 部位

```html
<style>
    .container {
        padding-left: 220px;
        padding-right: 220px;
    }

    .left {
        float: left;
        width: 200px;
        height: 400px;
        background: red;
        margin-left: -100%;
        position: relative;
        left: -220px;
    }

    .center {
        float: left;
        width: 100%;
        height: 500px;
        background: yellow;
    }

    .right {
        float: left;
        width: 200px;
        height: 400px;
        background: blue;
        margin-left: -200px;
        position: relative;
        right: -220px;
    }
</style>

<div class="container">
    <div class="center">
        <h1>圣杯布局</h1>
    </div>
    <div class="left"></div>
    <div class="right"></div>
</div>
```



### 双飞翼布局

> 和圣杯模式类似, 解决了错乱问题, 内容和布局分开

1. 类似前圣杯模式布局 `包裹元素不需要设置 padding`
2. center部分增加一个内层div, 并设margin: 0 200px

```html
<style>
    .container {
        min-width: 600px;
    }
    .left {
        float: left;
        width: 200px;
        height: 400px;
        background: red;
        margin-left: -100%;
    }
    .center {
        float: left;
        width: 100%;
        height: 500px;
        background: yellow;
    }
    .center .inner {
        margin: 0 200px; //新增部分
    }
    .right {
        float: left;
        width: 200px;
        height: 400px;
        background: blue;
        margin-left: -200px;
    }
</style>

<div class="container">
    <div class="center">
        <div class="inner">双飞翼布局</div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
</div>
```

