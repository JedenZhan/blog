## 常见排序的JS实现

### 快排

> 时间复杂度: O(nlgn)
> 不稳定
> 和数据情况有关, 如果中间值打偏了, 可能会变成O(n ^ 2)

```js
const quickSort = arr => {
  const n = arr.length
  if (n < 2) return arr
  const pivot = arr[n - 1],
    left = arr.filter((num, i) => num <= pivot && i !== n - 1),
    right = arr.filter((num, i) => num > pivot && i !== n - 1)

  return [...quickSort(left), pivot, ...quickSort(right)]
}
```

### 冒泡排序

> 时间复杂度: O(n ^ 2)
> 稳定

```js
const bubbleSort = arr => {
  const n = arr.length
  if (n < 2) return arr
  for (let i = 0; i < n; i ++) {
    for (let j = i; j < n; j ++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}
```

### 插入排序

> 时间复杂度: O(n ^ 2)
> 稳定

```js
const insertSort = arr => {
  const n = arr.length
  if (n < 2) return arr
  for (let i = 0; i < n; i ++) {
    let j = i, target = arr[i]
    while (j > 0 && arr[j - 1] > target) { // 向后移位给target让出空位
      arr[j] = arr[j - 1]
      j --
    }
    arr[j] = target
  }
  return arr
}
```

## 选择排序

> 时间复杂度: O(n ^ 2)
> 不稳定

```js
const selectSort = arr => {
  const n = arr.length
  if (n < 2) return arr
  for (let i = 0; i < n; i ++) {
    let minIndex = i
    // 遍历选择最小的放在已排序的后面
    for (let j = 0; j < n; j ++) {
      arr[minIndex] > arr[j] && (minIndex = j)
    }
    minIndex !== i && ([arr[i], arr[minIndex]] = arr[minIndex], arr[i])
  }

  return arr
}
```