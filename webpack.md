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

```
----准备文件解析函数----
handleFile (filepath) {
  let str = fs.readFileAsync(filepath)
  let ast = require('@babel/parser').parse(
    require('fs').readFileSync(filepath, 'utf-8'),
    { sourceType: 'module' }
  )
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

# webpack 自定义 loader
```
增加自定义 loader 目录
配置 resolveLoader: [ 'node_modules', './myLoaderDir' ]

开发：
  导出一个函数， 参数是当前的处理的文件源码字符串
    自定义 loader 函数不能是箭头函数，因为自定义 loader 函数中会调取 webpack 的一些 api 实现功能，调取方式是通过 this.xxx(callback) 的方式，需要用到 this，箭头函数 this 会丢失
  须有返回值 return

  /myLoaderDir/self-less-plugin.js
    const less = require('less')

    module.exports = function (source) {
      console.log(this) // 借用 this 调用 webpack 的 api
      console.log(this.query) // 配置使用 loader 的时候的传参
      console.log(source)

      const result = handleRes(source)

      1. 同步的方法处理，直接 return 即可
        return result

      2. 可以不直接使用 return 返回单个数据，可以使用 this.callback
        // errorInfo：错误信息，如果没有，传 null
        // result：返回的数据
        this.callback(errorInfo, result)

      3. 异步的逻辑处理，须借用 webpack 提供的 this.async 方式返回结果
        const callback = this.async() // 声明一个 async 方法生成的 callback 对象
        setTimeout(() => {
          callback(null, result)
        })

      4. 例子: 使用 less 处理文件
        less.render(res, (err, res) => {
          this.callback(err, res.css)
        })
    }

使用：
  1. module.rules 直接使用
    {
      module: {
        rules: [
          {
            test: '\.js',
            1. 不传参
            use: path.resolve(__dirnama, './myLoaderDir/self-less-plugin.js')   // 须是绝对路径 经过 path.resolve(__dirnama 处理
            2. 传参
            use: { // 用对象形式可以传参 自定义 loader 中 通过 this.query 接收
              loader: path.resolve(__dirnama, './myLoaderDir/self-less-plugin.js')   // 须是绝对路径 经过 path.resolve(__dirnama 处理,
              options: { a: 1, b: 2 }
            }
          }
        ]
      }
    }
    
  2. 配置 resolveLoader
    {
      resolveLoader: [ 'node_modules', './myLoaderDir' ]
    }
    之后 可以直接文件名使用即可 不需要 path.resolve(__dirnama 处理
    use: 'self-less-plugin',
    use: {
      loader: 'self-less-plugin',
      options: { a: 1, b: 2 }
    }

```
