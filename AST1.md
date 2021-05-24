# 抽象语法树 -- abstract syntax tree

```
源代码的抽象语法结构的树状表示，树上的每个节点都表示源代码中的一种结构，抽象表示把js代码进行了结构化的转化，转化为一种数据结构。这种数据结构其实就是一个大的json对象
babel插件将 ES6转化成ES5、使用 UglifyJS来压缩代码 、css预处理器、开发WebPack插件、Vue-cli前端自动化工具等
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

## babel 原理
```
2.parser 生成抽象语法树
```
```
3.traverse 根据规则转换抽象语法树
```
```
4.generator 深度遍历新的抽象语法树 转换生成js字符串代码
```

