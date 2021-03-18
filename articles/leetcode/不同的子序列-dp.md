## 不同的子序列 动态规划 115


```js
const numDistinct = (s, t) => {
  const m = s.length, n = t.length
  if (n > m) return 0
  const dp = new Array(m + 1).fill(0).map(_ => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i ++) dp[i][n] = 1
  for (let i = m - 1; i >= 0; i --) {
    for (let j = n - 1; j >= 0; j --) {
      if (s[i] === t[j]) dp[i][j] = dp[i + 1][j + 1] + dp[i + 1][j]
      else dp[i][j] = dp[i + 1][j]
    }
  }
  return dp[0][0]
}

const numDistinct = (s, t) => {
  const m = s.length, n = t.length
  if (n > m) return 0
  const dp = new Array(n + 1).fill(0).map(_ => new Array(m + 1).fill(0))

  for (let i = 0; i <= n; i ++) {
    for (let j = 0; j <= m; j ++) {
      if (i === 0) dp[i][j] = 1
      else {
        if (t[i] === s[j]) dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1]
        else dp[i][j] = dp[i][j - 1]
      }
    }
  }
  return dp[n][m]
}
```