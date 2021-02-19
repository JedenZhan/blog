## LeetCode 最长湍流子数组



动态规划解决

对于每一个元素, 要么比前面大, 要么比前面小, (相等不计算) 我们把当比前面大的时候, 应该是之前累积的比前面小的+1
比前面小的时候, 应该是之前累积的比前面大的+1, 最终取这两个的最大值


- 二维数组, 对于dp[i][0] 代表到i位置, arr[i - 1] > arr[i] 的最长湍流子数组的长度
  - dp[i][1] 代表到i位置, arr[i - 1] < arr[i] 湍流子数组的长度



```js
const maxTurbulenceSize = arr => {
  const n = arr.length,
    dp = new Array(n).fill(0).map(() => new Array(2).fill(0))
  dp[0][0] = dp[0][1] = 1
  for (let i = 1; i < n; i ++) {
    dp[i][0] = dp[i][1] = 1
    if (arr[i - 1] > arr[i]) dp[i][0] = dp[i - 1][1] + 1
    else if (arr[i - 1] < arr[i]) dp[i][1] = dp[i - 1][0] + 1
  }
  let ret = 1
  for (let i = 0; i < n; i ++) {
    ret = Math.max(ret, dp[i][0])
    ret = Math.max(ret, dp[i][1])
  }

  return ret
}


// 简化版
const simple = arr => {
  const n = arr.length
  let a = 1, b = 1, ans = 1
  for (let i = 1; i < n; i ++) {
    const x = arr[i - 1], y = arr[i]
    if (x > y) {
      a = b + 1
      b = 1
    } else if (x < y) {
      b = a + 1
      a = 1
    } else {
      a = 1
      b = 1
    }
    ans = Math.max(a, b, ans)
  }
  return ans
}



```