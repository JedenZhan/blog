## LeetCode 995 K连续位最小翻转次数-差分数组


差分数组思想, 翻转是不分顺序的(三个元素, 翻转两次, 前俩和后俩, 先翻转前俩和先翻转后俩是一样的), 所以我们可以从i = 0开始找, 遇到0就翻转i到i+k-1的位置

记录翻转总次数, 
```js
const minKBitFlips = (arr, k) => {
  const n = arr.length, diff = new Array(n + 1).fill(0)
  let ret = 0, s = 0
  for (let i = 0; i < n; i ++) {
    s += diff[i]
    if ((s + arr[i]) % 2 === 0) { // 通过累加diff数组得到当前需要翻转的次数, 如果该位置是翻转奇数次得到的1, 该位置就是0, 否则为1
      if (s + k > n) return -1 // 如果大于长度了, 越界, 不能满足要求
      diff[i] ++ // 这时候i位置翻转了, i位置翻转差+1
      diff[i + k] -- // 到k位置, 翻转差-1
      ret ++ // 翻转次数+ 1
      s ++ // s是当前位置的翻转次数
    }
  }
  return ret
}
```