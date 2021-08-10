/*
 * 解析表达式求值
 * 求出当前字符串中优先级最低的运算符
 * 最低优先级所在为之为界限，递归求出左右两边的值
 * 然后进行分支，根据当前运算符以及两边的值求出最终值
 * +、- 默认优先级为 1
 * *、/ 默认优先级为 2
 * 括号优先级更高，遇到括号当前的优先级基数加 100，再根据 + - * / 来计算每个运算符的优先级
 */
function calc(str, s, e) {
  let op = -1,
    pri = -1,
    cur_pri,
    temp = 0;
  for (let i = s; i <= e; i++) {
    // cur = 0;
    switch (str[i]) {
      case '+':
      case '-':
        cur = temp + 1;
        break;
      case '*':
      case '/':
        cur = temp + 2;
        break;
      case '(':
        temp += 100;
        break;
      case ')':
        temp -= 100;
        break;
    }
    if (cur_pri <= pri) {
      pri = cur_pri;
      op = i;
    }
  }
  if (op === -1) return 0;
  let a = calc(str, 0, op - 1);
  let b = calc(str, op + 1, r);
  let operate = str[op];
  if (operate === '+') return a + b;
  else if (operate === '-') return a - b;
  else if (operate === '*') return a * b;
  else if (operate === '/') return a / b;
}
// console.log(calc('1+1'));

function f(n) {
  let a = 0,
    b = 1;
  if (n == 0 || n == 1) return n;
  let i = 2;
  while (i < n) {
    b = b + a;
    a;
  }
  for (var i = 2; i <= n; i++) {
    var temp = b;
    b = a + b;
    a = temp;
  }
  return b;
}

console.log(f(3));

//  0 1 1 2 3 5 8 13 21 34 55
