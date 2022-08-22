function solveEquation(equation) {
  let factor = 0,
    val = 0,
    i = 0,
    n = equation.length,
    sign1 = 1;
  while (i < n) {
    if (equation[i] === "=") {
      sign1 = -1;
      i++;
      continue;
    }
    let sign2 = sign1,
      number = 0,
      valid = false;
    if (equation[i] === "-" || equation[i] === "+") {
      sign2 = equation[i] === "-" ? -sign1 : sign1;
      i++;
    }
    while (i < n && !isNaN(equation[i])) {
      number = number * 10 + (equation[i].charCodeAt() - "0".charCodeAt());
      i++;
      valid = true;
    }
    if (i < n && equation[i] === "x") {
      factor += valid ? sign2 * number : sign2;
      i++;
    } else {
      val += sign2 * number;
    }
  }
  if (factor === 0) return val === 0 ? "Infinite solutions" : "No solution";
  return `x=${-val / factor}`;
}

console.log(solveEquation("x+5-3+x=6+x-2"));
