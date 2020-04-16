---
title: chrome 插件美化 stylus 文件(滚动槽)
tags: [CSS, 碎片]
---

需要使用 浏览器 styus 插件

## 滚动条美化 CSS

```css
/* 设置滚动条的样式 */
::-webkit-scrollbar {
    width: 5px;
    background-color: rgba(255, 255, 255, 0);
}
/* 滚动槽 */
::-webkit-scrollbar-track {
    width: 5px;
    background-color: rgba(255, 255, 255, 0);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #aaa;
}
```

很漂亮哦

