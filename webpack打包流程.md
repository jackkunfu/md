## 线上去除 console 增加 UglifyJsPlugin 配置 compress 的 drop_console

```
new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    drop_debugger: true,
    drop_console: true
  },
  sourceMap: true
})
```

# webpack 构建流程

## Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :

```
## 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。

## 用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。

## 确定入口：根据配置中的 entry 找出所有的入口文件。

## 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。

## 在经过使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。

## 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。

## 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。
```

```
在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。
```

# 简易实现

## 借用 babel 编译工具方法

```
----准备文件解析函数----
handleFile (filepath) {
  let str = fs.readFileAsync(filepath)
  let ast = require('@babel/parser').parse(require('fs').readFileSync(filepath, 'utf-8'), {
    sourceType: 'module'
  })
  return {
    filepath,
    dependences: ((ast, filepath) => {
      let dependecies = {}
      require('@babel/traverse').default(ast, {
        // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
        ImportDeclaration({ node }) {
          const dirname = path.dirname(filepath) // 保存依赖模块路径,之后生成依赖关系图需要用到
          const filepath = './' + path.join(dirname, node.source.value)
          dependecies[node.source.value] = filepath
        }
      })
      return dependecies
    })(ast, filepath),
    code: require('@babel/core').transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    }).code
  }
}
```

```
1. 从入口文件开发解析编译
let entryModule = handleFile(this.entry)
// 初始化模块保存数组 modules
let modules = []
modules.push(entryModule)
modules.forEach(el => {
  for(let filename in el.dependences) {
    modules.push(handleFile(filename))
  }
})
```

```
2.重写 require函数 (浏览器不能识别commonjs语法),输出bundle
// 输出文件路径
const filePath = path.join(this.output.path, this.output.filename)
// 懵逼了吗? 没事,下一节我们捋一捋
const bundle = `(function(graph){
  function require(module){
    function localRequire(relativePath){
      return require(graph[module].dependecies[relativePath])
    }
    var exports = {};
    (function(require,exports,code){
      eval(code)
    })(localRequire,exports,graph[module].code);
    return exports;
  }
  require('${this.entry}')
})(${JSON.stringify(code)})`
// 把文件内容写入到文件系统
fs.writeFileSync(filePath, bundle, 'utf-8')
```
