## LeetCode 

1011. [在D天内送达包裹的能力](https://leetcode-cn.com/problems/capacity-to-ship-packages-within-d-days/)


```js
function shipWithinDays(weights, d) {
  let left = Math.max(...weights), right = weights.reduce((a, b) => a + b)
  while (left < right) {
    const mid = Math.floor((left + right) >> 1)
    // need是需要的天数, cur为当天总量
    let need = 1, cur = 0
    for (const weight of weights) {
      if (cur + weight > mid) {
        need ++
        cur = 0
      }
      cur += weight
    }
    if (need <= d) right = mid
    else left = mid + 1
  }
  return left
}
```