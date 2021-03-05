## LeetCode 300 最长递增子序列
> 注意这个不是最长递增子序列

## 纯动态规划

```js
const lengthOfLIS = arr => {
  const n = arr.length
  if (n < 2) return n
  const dp = new Array(n).fill(1)
  for (let i = 0; i < n; i ++) {
    for (let j = 0; j < i; j ++) {
      dp[i] = Math.max(dp[i], arr[i] > arr[j] ? dp[j] + 1 : 1) // 计算前面0到i位置的最长长度
    }
  }
  return Math.max(...dp)
}
```

## 动态规划+二分查找

```js
const binarySearch = (arr, t) => {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const mid = Math.floor((right - left) / 2) + left;
    if (arr[mid] > t) right = mid;
    else if (arr[mid] === t) return mid;
    else left = mid + 1;
  }
  return left;
};

const lengthOfLIS = arr => {
  const n = arr.length
  let len = 1
  if (n < 2) return n
  const dp = new Array(n + 1).fill(0)
  dp[len] = arr[0]
  for (let i = 1; i < n; i ++) {
    if (arr[i] > dp[len]) d[++len] = arr[i] // 数组如果一直递增, 当然最好
    else {
      // 如果发现不递增了, 往前二分找第一个比arr[i]小的数字, 并且更新dp[pos + 1] = arr[i]
      let l = 1, r = len, pos = 0
      while (l <= r) {
        const mid = Math.floor((l + r) / 2)
        if (d[mid] < arr[i]) {
          pos = mid
          l = mid + 1
        } else {
          r = mid - 1
        }
      }
      d[pos + 1] = arr[i]
    }
  }
  return len
}

```