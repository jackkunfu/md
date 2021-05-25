# 编译原理
```
Parse:
词法分析   --->   遍历代码字符，生成tokens
语法分析   --->   生成AST

Traverse/Transform:
代码转换   --->   改变AST

Generator:
代码生成   --->   根据新的AST生成新代码
```

# 抽象语法树 AST -- abstract syntax tree

```
源代码的抽象语法结构的树状表示，树上的每个节点都表示源代码中的一种结构，抽象表示把js代码进行了结构化的转化，转化为一种数据结构。这种数据结构其实就是一个大的json对象
用途：babel插件将 ES6转化成ES5、使用 UglifyJS来压缩代码 、css预处理器、开发WebPack插件、Vue-cli前端自动化工具等
```

## AST 生成流程
```
1.词法分析 scanner --- scanner 扫描源代码，生成tokens流
  循环遍历代码，根据字母 数字 符号 等，根据不同类型 push 进入 tokens 数组
  const reservedWords = ['if', 'int', 'for', 'while', 'do', 'return', 'break', 'continue'];
  const operators = ['+', '-', '*', '/', '=', '<', '>', '!', '>=', '<=', '!='];
  const separators = [',', ';', '{', '}', '(', ')'];
  function Lexical_Analysis(str) {
    let cur = 0;
    let tokens = [];
    while (cur < str.length) {
      if (/\s/.test(str[cur])) { // 跳过空格
          cur++;
      } else if (/[a-z]/i.test(str[cur])) { // 读单词
          let word = "" + str[cur++];
          // 测试下一位字符,如果不是字母直接进入下一次循环(此时cur已经右移)
          // 如果是则继续读字母,并将cur向右移动
          while (cur < str.length && /[a-z]/i.test(str[cur])) word += str[cur++];

          if (reservedWords.includes(word)) tokens.push({ type: 1, value: word }); // 存储保留字(关键字)
          else tokens.push({ type: 2, value: word }); // 存储普通单词                            
      } else if (separators.includes(str[cur])) {
          tokens.push({ type: 5, value: str[cur++] }); // 存储分隔符并将cur向右移动                                            
      } else if (operators.includes(str[cur])) {
          let operator = "" + str[cur++];
          if (['>', '<', '!'].includes(operator)) {
              // 如果下一个字符是=就添加到operator并再次向右移动cur
              if (str[cur] = '=') operator += str[cur++];
          }
          tokens.push({ type: 4, value: operator }); // 存储运算符                        
      } else if (/[0-9]/.test(str[cur])) {
          let val = "" + str[cur++];
          while (cur < str.length && /[0-9]/.test(str[cur])) val += str[cur++];
          tokens.push({ type: 3, value: val }); // 存储整数数字    
      } else {
          return "包含非法字符：" + str[cur];
      }
    }
    return tokens;
  }

例子：
var company = 'zhuanzhuan'
转换为：
[
  { "type" : "Keyword" , "value" : "var" },
  { "type" : "Identifier" , "value" : "company" },
  { "type" : "Punctuator" , "value" : "=" },
  { "type" : "String" , "value" : "zhuanzhuan" },
]
2.语法分析
把一个令牌流转化为AST的形式，同时这个阶段会把令牌中的信息转化为AST的表述结构
```

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

