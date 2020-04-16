---
title: 二叉树的遍历
tags: 算法
---

二叉树的遍历(前序遍历, 中序遍历, 后序遍历)有两个版本, 递归版本和非递归版本

## 前言

比如二叉树

```
	 1
    / \
   2   3
  / \ / \
 4  5 6  7
```

**前序遍历:** 先打印顶点, 打印完整左子树, 再打印完整右子树 结果为 `1, 2, 4, 5, 3, 6, 7  `

**中序便利:** 先打印完整左子树, 打印当前节点, 然后打印完整右子树 结果为 `4, 2, 5, 1, 6, 3, 7`

**后序遍历:** 先打印完整左子树, 然后打印完整右子树, 最后打印当前节点, 结果为 `4, 5, 2, 6, 3, 7, 1`



## 递归版本

```js
const preOrderRacer = head => {
    if (!head) return
    
    console.log(head.value)
    preOrderRacer(head.left)
    preOrderRacer(head.right)
} // 前序遍历
```

根据前序遍历(忽略打印行为)可以发现

这个函数的节点走向是 `1, 2, 4, 4, 4, 2, 5, 5, 5, 2, 1, 3, 6, 6, 6, 3, 7, 7, 7, 3, 1`

然后, 递归函数的打印时机所放的位置决定了这个遍历的类型

> 第一次遇到这个节点打印: 前序遍历
>
> 第二次遇到这个节点打印: 中序遍历
>
> 第三次遇到这个节点打印: 后序遍历

```js
const preOrderRacer = head => {
    if (!head) return
    
    preOrderRacer(head.left)
    console.log(head.value)
    preOrderRacer(head.right)
} // 中序遍历

const preOrderRacer = head => {
    if (!head) return
    
    preOrderRacer(head.left)
    preOrderRacer(head.right)
    console.log(head.value)
} // 后序遍历
```

## 非递归版本

### 先序遍历

```js
const preOrderRacer = head => {
    if (!head) return
    let arr = []
    arr.push(head)
    while (arr.length !== 0) {
        head = arr.pop()
        console.log(head.value)
        head.right && arr.push(head.right)
        head.left && arr.push(head.left)
    } 
}
// 当从 arr 里面取出一个 head 的时候, 先 push 右, 后 push 左, 而使用了栈的特性, 打印会先打印左, 后打印右
// 当 arr 为空时, 说明打印完毕
```



### 中序遍历

```js
const inOrderRacer = head => {
    if (!head) return
    let arr = []
    while (arr.length !== 0 || head) {
        if (head) {
            arr.push(head)
            head = head.left
        } else {
            head = arr.pop()
            console.log(head.value)
            head = head.right
        }
    }
}
// 当前节点为空, 从 arr 里面取出一个, 指针往右
// 当前节点不为空, 当前节点压入 arr, 指针往左
```



### 后序遍历

```js
const posOrderRacer = head => {
	if (!head) return
    let arr1 = [], arr2 = []
    arr1.push(head)
    while (arr1.length !== 0) {
        head = arr1.pop()
        arr2.push(head)
        head.left && arr1.push(head.left)
        head.right && arr1.push(head.right)
    }
    while (arr2.length !== 0) {
        console.log(arr2.pop().value)
    }
}
// 妙啊, 根据前序遍历(head, left, right), 压入变为 head, right, left, 并且存储在另一个栈中, 最后循环另一个栈打印即可
```

