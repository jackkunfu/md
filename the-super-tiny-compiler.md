# the-super-tiny-compiler github 上的

## 逐个字符解析代码生成对象描述

```
function tokenizer (input) {
  let cur = 0
  let res = []
  while(cur < input.length) {
    let char = input[cur]
    if (char === '(') {
      res.push({ type: 'paren', value: '(' })

      cur++

      continue; // 停止执行进入下次while循环执行
    }

    if (char === ')') {
      res.push({ type: 'paren', value: '(' })

      cur++

      continue;
    }

    let space = /\s/
    if (space.test(char)) {
      cur++
      continue
    }
  }
}

```

## 根据对象描述 生成 AST

```

```

##
