---
title: CSS 实现风车效果
tags: [CSS, HTML, 碎片]
---

css 部分

```css
* {
    padding: 0;
    margin: 0;
}

.wrapper {
    position: relative;
    list-style: none;
    height: 40px;
    width: 160px;
    margin: 200px auto;
    animation: scroll 10s linear infinite;
}

.wrapper li {
    position: absolute;
    width: 0;
    height: 0;
    border: 60px solid transparent;
    border-top: solid 40px transparent;
    border-bottom: none;
    border-left-color: transparent!important;
}

.item1::after {
    content: '';
    position: absolute;
    height: 10px;
    width: 10px;
    background-color: #fff;
    border-radius: 50%;
    top: -45px;
    left: 55px;
}

.wrapper .item1 {
    z-index: 1;
    left: 0;
    top: -60px;
    transform: rotateZ(90deg);
    border-color: #f7f39b;
    border-top-color: #f7cd62;
}

.wrapper .item2 {
    left: 80px;
    top: -20px;
    transform: rotateZ(180deg);
    border-color: #9cd2b2;
    border-top-color: #58ba87;
}

.wrapper .item3 {
    left: 40px;
    top: 60px;
    transform: rotateZ(270deg);
    border-color: #f07349;
    border-top-color: #e23925;
}

.wrapper .item4 {
    left: -40px;
    top: 20px;
    transform: rotateZ(0deg);
    border-color: #e2dcdc;
    border-top-color: #eee7d4;
}

@keyframes scroll {
    from {
        transform: rotateZ(0)
    } to {
        transform: rotateZ(-360deg)
    }
}
```

```html
<ul class="wrapper">
    <li class="item1"></li>
    <li class="item2"></li>
    <li class="item3"></li>
    <li class="item4"></li>
</ul>
```

共勉