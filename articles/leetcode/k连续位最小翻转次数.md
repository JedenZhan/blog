## LeetCode 995 K连续位最小翻转次数-差分数组


差分数组思想, 翻转是不分顺序的(三个元素, 翻转两次, 前俩和后俩, 先翻转前俩和先翻转后俩是一样的), 所以我们可以从i = 0开始找, 遇到0就翻转i到i+k-1的位置

记录翻转总次数, 
```js
const minKBitFlips = (arr, k) => {
  const n = arr.length, diff = new Array(n + 1).fill(0)
  let ret = 0, s = 0
  for (let i = 0; i < n; i ++) {
    s += diff[i]
    if ((s + arr[i]) % 2 === 0) { // 通过累加diff数组得到当前需要翻转的次数,
      if (s + k > n) return -1
      diff[i] ++
      diff[i + k] --
      ret ++
      s ++
    }
  }
  return ret
}
```