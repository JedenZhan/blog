---
title: Drag API (拖动) 的使用
tags: [JavaScript, HTML, 碎片]
---

## 介绍

托放是 html5 的新特性, 不像之前我们写拖动

1. 判断鼠标点击位置
2. 计算相对位置
3. 监听鼠标移动方法
4. 设置元素位置

还是比较麻烦的, 而且还需要节流. 如果需要拖动的时候, 可以使用这个新的特性

## 使用

1. 需要拖动的 element 设置 dragable='true'
2. 拖动的时候, 触发 dragstart 
3. 放到哪里 `drop`
4. 进行放置 `ondrop`

```html
<style>
    #target {
        width: 500px;
        height: 200px;
        border: 1px solid #000;
    }
    #drag-element {
        width: 100px;
        height: 100px;
        background-color: #ccc;
    }
</style>
<body>
    <div id='target' ondrop='drop(event)' ondragover='allowDrag(event)'>Target</div>
	<div id='drag-element' draggable="true" ondragstart='drag(event)'></div>

	<script>
		function allowDrag(e) {
			e.preventDefault() // 取消浏览器的默认处理
		}

		function drag(e) {
			e.dataTransfer.setData('targetID', e.target.id) // 设置数据为拖动元素的 ID
		}

		function drop(e) {
			e.preventDefault()
			const data = e.dataTransfer.getData('targetID')
			e.target.appendChild(document.getElementById(data)) // 获取这个 ID, 把它添加到目标元素, 如果不放置的话, 元素拖动失败, 放到原位置
		}
	</script>
</body>
```

其实在整个过程都可以通过 event.target 属性拿到两个元素, 我们可以进行一系列的麻烦的操作

共勉