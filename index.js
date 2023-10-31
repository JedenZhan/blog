function packback(weight, value, w) {
  const n = weight.length;
  let max = [];
  function dfs(i = 0, curry = [], left = w) {
    // if (i === n || left === 0) max.push(curry.reduce((a, b) => a + b));
    if (i === n || left === 0) max.push([...curry]);
    else {
      for (let j = i; j < n; j++) {
        if (left - weight[j] < 0) continue;
        curry.push(value[j]);
        dfs(j + 1, curry, left - weight[j]);
        curry.pop();
      }
    }
  }

  dfs();
  console.log(max);
  return Math.max(...max);
}

console.log(packback([2, 2, 3, 1, 5, 2], [2, 3, 1, 5, 4, 3], 2));
