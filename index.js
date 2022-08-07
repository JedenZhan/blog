const startReg = /\d+\:/,
  typeReg = /\:\w+\:/,
  endReg = /\:\d+/;
function exclusiveTime(n, logs) {
  const stack = [];
  const res = new Array(n).fill(0);
  logs.forEach(log => {
    debugger;
    const idx = parseInt(startReg.exec(log)[0]);
    const type = typeReg.exec(log)[0];
    const timesTmp = parseInt(endReg.exec(log)[0].slice(1));
    if (type === ":start:") {
      if (stack.length) {
        const n = stack.length;
        res[stack[n - 1][0]] += timesTmp - stack[n - 1][1];
        stack[n - 1][1] = timesTmp;
      }
      stack.push([idx, timesTmp]);
    } else {
      const t = stack.pop();
      res[t[0]] += timesTmp - t[1] + 1;
      if (stack.length) stack[stack.length - 1][1] = timesTmp + 1;
    }
  });
  return res;
}

exclusiveTime(2, ["0:start:0", "1:start:2", "1:end:5", "0:end:6"]);
