## 大致过程原理链接
  - 从入口模块开始解析,解析出当前的依赖，得到依赖的代码块 chunk
    - parse/transform/generator
      - 生成当前文件以及递归依赖文件的抽象语法树
      - 经过配置的 loader plugin 转换相关的处理
      - 生成目标代码字符串
  - 根据当前所有的依赖map对象
    - 生成的代码块 chunk，生成map对象 
    - key 是当前的依赖路径
    - value
      - 当前文件的子级依赖对象信息
      - 当前文件的代码块 chunk
    ```
    var codeMap = {
      "./src/index.js": {
        "deps": { "./add.js": "./src/add.js" },
        "code": "....."
      },
      "./src/add.js": {
        "deps": {},
        "code": "......"
      }
    }
    ```
  - 生成 bundle 文件
    - 模拟生成 exports 对象
      - var exports = {}
    - 模拟 require 函数
      ```
      function require(file) {
        var exports = {};
        (function (exports, code) {
          eval(code)
        })(exports, file.code)
        return exports
      }
      ```
    - 自执行函数包裹生成 bundle 文件
      ```
      (function (map) {
        function require(file) {
          var exports = {};
          (function (exports, code) {
            eval(code);
          })(exports, map[file].code);
          return exports;
        }
        require("index.js"); // require 执行入口文件
      })(codeMap);
      ```

  - https://juejin.cn/post/6961961165656326152
  - https://www.bilibili.com/video/BV1dV411p7gp

## 优化项目打

- vue-cli 配置见 vue/vue-cli.md

- resolve.modules
  - 减小文件搜索范围
- 多线程打包
  - 替换 UglifyJS
    - 默认提供的 UglifyJS 插件，由于采用单线程压缩，速度慢
    - webpack-parallel-uglify-plugin
      - 可以并行运行 UglifyJS 插件，更加充分而合理的使用 CPU 资源，这可以大大减少的构建时间
  - thread-loader 、happyPack
- 设置 babel 的 cacheDirectory 为 true
  - loader: 'babel-loader?cacheDirectory=true'
- 动态链 DLLPlugin/DLLReferencePlugin
  - 分离出第三方库无变化无须重新打包
- external 设置第三方依赖外链引用
  - cdn 引入各种库链接
- 如果你确定一个模块中，没有其它新的依赖，可以配置 noParse， Webpack 将不再扫描这个文件中的依赖

  - 对于比较大型类库，将能促进性能表现
  - module: { noParse: /node_modules\/(element-ui\.js)/ }

- 生成 gzip 文件
  - compression

- 体积优化

  - css 提取（mini-css-extract-plugin）
  - css 压缩 （optimize-css-assets-webpack-plugin
  - html 压缩 （html-webpack-plugin ）
  - externals （排除不需要被打包的第三方）
  - js 压缩 （production 模式自动开启）
  - tree-shake ( production 模式自动开启(webpack4 限 EsModule;webpack5 不限 EsModule,CommonJs,优秀得很) )
  - code-split ( optimization )
    - 配置 splitChunks
      ```
        splitChunks: {
          minChunks: 
        }
      ```
  - import(懒加载，预加载（预加载慎用））

  - 链接：https://juejin.cn/post/6883305742422507533

- Tree Shaking
  - 1. 设置 usedExports: true
    - 打包结果中只导出外部引用的成员
  - 2. 设置 minimize: true
    - 压缩结果把未被引用额成员移除

- HMR 热更新
  - 1. 设置 hot: true
  - 2. HotModuleReplacementPlugin
  - css 可以热更新不用做额外处理，js 等须做额外处理
    - css 热替换是更新后的代码替换旧的代码即可
    - 由于每个 js 模块不同的功能，无固定处理逻辑，须自定义处理,
      - 例如 main.js 中引用了 editor.js
      - 在 main.js 中增加代码监测 editor.js 模块变化 
      ```
        import editor from './editor.js'
        // 其他业务逻辑
        ...

        if (module.hot) {
          let newEditor = editor
          module.hot.accept('这里是监测的文件的路径: ./editor.js', () => {
            let html = newEditor.content
            document.body.removeChild(editor)
            newEditor = createEditor()
            newEditor.content = html
            document.body.appendChild(newEditor)
          })
        }
      ```

## Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
- 用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
- 确定入口：根据配置中的 entry 找出所有的入口文件。
- 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
- 在经过使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
- 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
- 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。
- 在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

## Compiler 相关

```

class Compiler {
  construtor () {
    this.hooks = Object.freeze({ // 定义各种钩子对象
      initialize: new SyncHook([]), // /** @type {SyncHook<[]>} \*/
      shouldEmit: new SyncBailHook(["compilation"]), // /** @type {SyncBailHook<[Compilation], boolean>} _/
      done: new AsyncSeriesHook(["stats"]), // /\*\* @type {AsyncSeriesHook<[Stats]>} _/
      afterDone: new SyncHook(["stats"]),
      additionalPass: new AsyncSeriesHook([]),
      beforeRun: new AsyncSeriesHook(["compiler"]),
      run: new AsyncSeriesHook(["compiler"]),
      emit: new AsyncSeriesHook(["compilation"]),
      assetEmitted: new AsyncSeriesHook(["file", "info"]),
      afterEmit: new AsyncSeriesHook(["compilation"]),
      thisCompilation: new SyncHook(["compilation", "params"]),
      compilation: new SyncHook(["compilation", "params"]),
      normalModuleFactory: new SyncHook(["normalModuleFactory"]),
      contextModuleFactory: new SyncHook(["contextModuleFactory"]),
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      make: new AsyncParallelHook(["compilation"]),
      finishMake: new AsyncSeriesHook(["compilation"]),
      afterCompile: new AsyncSeriesHook(["compilation"]),
      watchRun: new AsyncSeriesHook(["compiler"]),
      failed: new SyncHook(["error"]),
      invalid: new SyncHook(["filename", "changeTime"]),
      watchClose: new SyncHook([]),
      shutdown: new AsyncSeriesHook([]),
      infrastructureLog: new SyncBailHook(["origin", "type", "args"]),
      environment: new SyncHook([]),
      afterEnvironment: new SyncHook([]),
      afterPlugins: new SyncHook(["compiler"]),
      afterResolvers: new SyncHook(["compiler"]),
      entryOption: new SyncBailHook(["context", "entry"])
    })
  }
}

```

## plugin 钩子大致类型

```

const {
SyncHook, // 触发时按照顺序依次执行
SyncBailHook, // 根据每一步返回的值来决定要不要继续往下走，如果 return 了一个非 undefined 的值 那就不会往下走

SyncWaterfallHook, // 每一步都依赖上一步的执行结果, 上一步结果作为下一步的参数

let [first, ...others] = this.tasks;
others.reduce((res, fn) => {
  return fn(res);
},first(...args));

SyncLoopHook, // 在满足一定条件时 循环执行某个函数

---

this.hooks.tap('node',(name) => {
console.log('node',name);
/** 当不满足条件时 会循环执行该函数
_ 返回值为 udefined 时 终止该循环执行
_/
return ++this.index === 5 ? undefined : '学完 5 遍 node 后再学 react';
});
this.tasks.forEach((task)=>{
/** 注意 此处 do{}while()循环的是每个单独的 task _/
do{
/\*\* 拿到每个 task 执行后返回的结果 _/
result = task(...args);
/\*_ 返回结果不是 udefined 时 会继续循环执行该 task _/
} while (result !== undefined);
});

---

AsyncParallelHook, AsyncParallelBailHook, AsyncSeriesHook, AsyncSeriesBailHook, AsyncSeriesWaterfallHook
} = require("tapable")
Sync 开头的都是同步的钩子，Async 开头的都是异步的钩子。而异步的钩子又可分为并行和串行，其实同步的钩子也可以理解为串行的钩子。
使用：
声明，定义
this.hooks.同步钩子名称.tap()
this.hooks.异步钩子名称.tapAsync()
调用执行:
this.hooks.同步钩子名称.call()
this.hooks.异步钩子名称.callAsync()

```

# 简易实现 simple-webpack

```

const fs = require('fs')
  const babelParse = require('@babel/parser')
  module.exports = class Webpack {
  constructor (config) {
  this.config = config
  this.modules = []
}

run () {
  let { entry } = this.config
  // 从入口开始处理入口模块
  let entryModule = this.parse(entry)
  this.modules.push(entryModule)
  // 递归解析所有模块存入 this.modules
  this.modules.forEach(el => {
    Object.keys(el.dependences).forEach(depen => {
      this.modules.push(this.parse(el.dependences[depen]))、

      // 后续需要去重优化，可以解决重复打包以及相互循环引用的问题
    })
  })
}

parse (file) {
  return this.handleFile(file)
}

handleFile (filepath) {
  let str = fs.readFileAsync(filepath)
  let ast = require('@babel/parser').parse(
    fs.readFileSync(filepath, 'utf-8'),
    { sourceType: 'module' }
  )
  return {
    filepath,
    dependences: ((ast, filepath) => {
      let dependecies = {}
      require('@babel/traverse').default(ast, {
        // 类型为 ImportDeclaration 的 AST 节点 (即为 import 语句)
        ImportDeclaration({ node }) {
          const dirname = path.dirname(filepath) //  当前处理文件的目录名称，保存依赖模块路径,之后生成依赖关系图需要用到
          const curPath = './' + path.join(dirname, node.source.value)
          dependecies[node.source.value] = curPath 
        }
      })
      return dependecies
    })(ast, filepath),
    code: require('@babel/core').transformFromAst(ast, null, {
      presets: ['@babel/preset-env'] // 通过 预设 env 处理后生成低端浏览器兼容的代码
      }).code
    }
  }
}

```

```

重写 require 函数 (浏览器不能识别 commonjs 语法),输出 bundle
//  输出文件路径
const filePath = path.join(this.output.path, this.output.filename)
//  懵逼了吗?  没事,下一节我们捋一捋
const bundle = `(function(graph){ function require(module){ function localRequire(relativePath){ return require(graph[module].dependecies[relativePath]) } var exports = {}; (function(require,exports,code){ eval(code) })(localRequire,exports,graph[module].code); return exports; } require('${this.entry}') })(${JSON.stringify(code)})`
//  把文件内容写入到文件系统
fs.writeFileSync(filePath, bundle, 'utf-8')

```

## webpack 自定义 loader

- 是一个函数， 参数是当前的处理的文件源码字符串
- 须有返回值
- 自定义 loader 函数不能是箭头函数，因为自定义 loader 函数中会调取 webpack 的一些 api 实现功能，调取方式是通过 this.xxx(callback) 的方式，需要用到 this，箭头函数 this 会丢失
  - this.callback ---- 返回数据，类似 return
  - this.async ---- 告知返回的结果是异步的返回结果
  - this.query --- 获取配置使用 loader 的时候配置的参数

```
/myLoaderDir/self-less-loader.js
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
    less.render(source, (err, res) => {
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
          use: path.resolve(__dirname, './myLoaderDir/self-less-loader.js') // 须是绝对路径 经过 path.resolve(__dirname 处理
          2. 传参 自定义 loader 中 通过 this.query 接收
          use: {
          loader: path.resolve(__dirname, './myLoaderDir/self-less-loader.js') // 须是绝对路径 经过 path.resolve(__dirname 处理,
          // 用对象形式可以传参 自定义 loader 中 通过 this.query 接收
          options: { a: 1, b: 2 }
          }
        }
      ]
    }
   }

2. 配置 resolveLoader
  { resolveLoader: [ 'node_modules', './myLoaderDir' ] }
    之后 可以直接文件名使用即可 不需要 path.resolve(\_\_dirname 处理
    use: 'self-less-loader',
    use: {
    loader: 'self-less-loader',
    options: { a: 1, b: 2 }
  }
```

## webpack 自定义 plugin

```
1.  是一个构造函数，new 实例化之后，配置给 webpack 的 plugins 中等待声明周期的钩子执行触发执行
2.  如何定义在具体钩子事件执行：定义原型 apply 方法，定义触发何种钩子执行
  class SomePlugin {
    constructor (opt) {
      this.opt = opt
    }
    apply (compiler) { // apply 函数参数为当前的 compiler ，可以借此对象定义钩子触发函数，
      // 钩子类型有同步和异步两种
      // tap 同步钩子的定义触发，tapAsync 异步钩子的定义触发
      // 不同的钩子，有不同的参数传递， 例如：webpack 当前的资源对象： complication
      compiler.hooks.[hookName].tap('自定义的事件名称', complication => {
        console.log(complication)
        // tap 的同步钩子没有第二个回调参数函数执行
      })
      compiler.hooks.[hookName].tapAsync('自定义的事件名称', (complication, cb) => {
        console.log(complication)

        // 例子：生成文件 assets 属性处理
        complication.assets['a.txt'] = {
          source: function () {
            return '内容字符串'
          },
          size: function () {
            return 内容字符串的长度
          }
        }

        cb() // tapAsync 的异步钩子最终需要执行第二个回调函数    异步功能完成之后通知 webpack
      })
    }
  }

```