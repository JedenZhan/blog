---
title: 大根堆和小根堆
tags: 算法
---

## 堆

堆, 就是完全二叉树, 一般是数组模拟

> 数组模拟的堆, 头节点是 i, 左叶子节点为 2i + 1, 右叶子节点为 2i + 2

大根堆: 头节点比任意一个叶子节点要大

小根堆: 头节点比任意一个子节点小

## 大根堆



```js
const swap = (arr, l, r) => {
      [arr[l], arr[r]] = [arr[r], arr[l]]
    }

const heapInsert = (arr, index) => { // 建立大根堆
    while (arr[index] > arr[Math.floor((index - 1) / 2)]) { // JS 的特性...需要下标整数化
        swap(arr, index, Math.floor((index - 1) / 2))
        index = Math.floor((index - 1) / 2)
    }
}

const heapify = arr => { // 当大根堆的某个值变化了以后
    let left = 1,
        size = arr.length,
        index = 0
    while (left < size) {
          // 两个孩子, 谁大, 谁当头部
        let largest = left + 1 < size && arr[left + 1] > arr[left] ? left + 1 : left
        largest = arr[largest] > arr[index] ? largest : index
        if (largest === index) break
        swap(arr, largest, index)
        index = largest
        left = index * 2 + 1
    }
}

const getMaxHeap = arr => {
    if (!arr || arr.length < 2) return arr
    for (let i = 0, len = arr.length; i < len; i++) {
        heapInsert(arr, i)
    }
    return arr
}
```

**堆排序**就是利用的大根堆的特性, 先建立大根堆(O(N)), 然后不断的将头部取出, 调整堆的结构的过程



## 小根堆

大根堆了解了以后, 小根堆就比较简单了

```js
const swap = (arr, l, r) => {
      [arr[l], arr[r]] = [arr[r], arr[l]]
    }

const heapInsert = (arr, index) => {
    while (arr[index] < arr[Math.floor((index - 1) / 2)]) {
        swap(arr, index, Math.floor((index - 1) / 2))
        index = Math.floor((index - 1) / 2)
    }
}

const heapify = arr => {
    let left = 1,
        size = arr.length,
        index = 0 // 顶部开始
    while (left < size) { // 要求不越界
        let minst = left + 1 > size && arr[left + 1] < arr[left] ? left + 1 : left
        minst = arr[minst] < arr[index] ? largest : index
        if (minst === index) break
        swap(arr, minst, index)
        index = minst
        left = index * 2 + 1
    }
}

const getMinHeap = arr => {
    if (!arr || arr.length < 2) return arr
    for (let i = 0, len = arr.length; i < len; i++) {
        heapInsert(arr, i)
    }
    return arr
}
```

