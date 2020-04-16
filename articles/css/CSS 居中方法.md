---
title: CSS 居中方法
tags: [CSS, HTML, 碎片]
---

## 左右居中

### text-align: center

居中块级元素内部的 inline `行内元素`或者 inline-block `行内块级`

### margin: 0 auto

要求内部元素是块级元素, 不能脱离文档流 `如不能设置 position:absolute`

**会脱离文档流的设置**

- position为absolute, fixed
- 浮动元素

### 脱离文档流方法

- 设置 position 为 fixed
- 设置 left 50%
- 如果知道元素宽度, 设置 margin-left 为负值一半 `比如元素宽200px, 设置margin-left: -100px`
- 如果不知道元素宽度, 设置 transform: translateX(-50%)



## 上下居中

### line-hight

行内元素通过设置 line-hight 为父元素的 hight 垂直居中

### translate

- 脱离文档流
- 设置 top: 50%;
- 设置 transform: translateY(-50%)

### flex

- 父元素设置 dispaly: flex

- 子元素设置 align-item: center

### calc

直接看代码

```css
.app {
      position: fixed;
      height: 200px;
      width: 500px;
      background-color: #000;
      top: calc(50% - 100px); /*减去高度的一半*/
      left: calc(50% - 250px); /*减去宽度的一半*/
    }
  </style>
  <div class="app">
  </div>
```

