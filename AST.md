# 编译原理
```
Parse:
词法分析   --->   生成tokens
语法分析   --->   生成AST

Traverse/Transform:
代码转换   --->   改变AST

Generator:
代码生成   --->   根据新的AST生成新代码
```

# AST
```
code:  const add = (a, b) => a + b;

一个 AST 的根节点始终都是 Program
{
  program: Script {
    type: 'Program',
    body: [
      {
        "type": "VariableDeclaration", // 变量声明
        "declarations": [ // 具体声明
          {
            "type": "VariableDeclarator", // 变量声明
            "id": {
              "type": "Identifier", // 标识符（最基础的）
              "name": "add" // 函数名
            },
            "init": {
              "type": "ArrowFunctionExpression", // 箭头函数
              "id": null,
              "expression": true,
              "generator": false,
              "params": [ // 参数
                {
                  "type": "Identifier",
                  "name": "a"
                },
                {
                  "type": "Identifier",
                  "name": "b"
                }
              ],
              "body": { // 函数体
                "type": "BinaryExpression", // 二项式
                "left": { // 二项式左边
                  "type": "Identifier",
                  "name": "a"
                },
                "operator": "+", // 二项式运算符
                "right": { // 二项式右边
                  "type": "Identifier",
                  "name": "b"
                }
              }
            }
          }
        ],
        "kind": "const"
      }
    ],
    sourceType: 'script',
    loc: {
      tokens: []
    },
    errors: []
  },
  name: null,
  loc: {
    start: { line: 1, column: 0, token: 0 },
    end: { line: 3, column: 2, token: 13 },
    lines: Lines {
      infos: [Array],
      mappings: [],
      cachedSourceMap: null,
      cachedTabWidth: undefined,
      length: 3,
      name: null
    },
    indent: 0,
    tokens: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ]
  },
  type: 'File',
  comments: null,
  tokens: [
    { type: 'Keyword', value: 'const', loc: [Object] },
    { type: 'Identifier', value: 'add', loc: [Object] },
    { type: 'Punctuator', value: '=', loc: [Object] },
    { type: 'Punctuator', value: '(', loc: [Object] },
    { type: 'Identifier', value: 'a', loc: [Object] },
    { type: 'Punctuator', value: ',', loc: [Object] },
    { type: 'Identifier', value: 'b', loc: [Object] },
    { type: 'Punctuator', value: ')', loc: [Object] },
    { type: 'Punctuator', value: '=>', loc: [Object] },
    { type: 'Identifier', value: 'a', loc: [Object] },
    { type: 'Punctuator', value: '+', loc: [Object] },
    { type: 'Identifier', value: 'b', loc: [Object] },
    { type: 'Punctuator', value: ';', loc: [Object] }
  ]
}
```