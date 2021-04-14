# handlerbar.js 编译简易原理

# https://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line

# 简单的字符匹配替换 <%name%> <%age%> 直接正则匹配 replace 替换

```
var TemplateEngine = function(tpl, data) {}
var template = 'Hello, my name is <%name%>. I\\'m <%age%> years old.';
console.log(TemplateEngine(template, {
    name: "Krasimir",
    age: 29
}));
```

```
var re = /<%([^%>]+)?%>/g;
var match = re.exec(tpl);
match: [
    "<%name%>",
    " name ",
    index: 21,
    input:
    "Hello, my name is <%name%>. I\\'m <%age%> years old."
]
// re.exec(tps) 指挥执行一次 匹配到第一个key替换之后就会结束
// while循环踢馆模板中所有匹配得key替换为内容
var re = /<%([^%>]+)?%>/g, match;
while(match = re.exec(tpl)) {
    console.log(match);
}
var TemplateEngine = function(tpl, data) {
    var re = /<%([^%>]+)?%>/g, match;
    while(match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
}
```

# 复杂的模板语法 以及深层次的数据替换 <% person.name.first %>

# -> 把模板编译成执行函数字符串 new Function(){} 生成方法执行

```
var fn = new Function("arg", "console.log(arg + 1);");
fn(2); // outputs 3
```

等同于

```
var fn = function(arg) {
    console.log(arg + 1);
}
fn(2); // outputs 3
```

```
var template =
'My skills:' +
'<%for(var index in this.skills) {%>' +
'<%this.skills[index]%>' +
'<%}%>';
```

转换成

```
return
'My skills:' +
for(var index in this.skills) { +
'' +
this.skills[index] +
'' +
}
```

```
<!-- 步骤 -->
var r = [];
r.push('My skills:');
for(var index in this.skills) {
r.push('');
r.push(this.skills[index]);
r.push('');
}
return r.join('');
```

```
<!-- 最终 -->
var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\\n', cursor = 0, match;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\\n' : 'r.push(' + line + ');\\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\\\"') + '");\\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\\r\\t\\n]/g, '')).apply(options);
}
```
