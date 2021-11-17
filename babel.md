# babel：将新语法转化为 es5，默认只转换 JS 语法，而不转换新的 API，

```

配置：
options: {
  "presets": [
    [
      '@babel/preset-env',
      { // env 相关配置
        modules: false, // 设置 false , import 相关处理使用 webpack 的配置
        useBuiltIns: 'usage', // 按须引入使用新特性的相关 pollyfill, 避免整体引入，减少体积
        corejs: {
          // 设置版本 3 ，比版本 2 的特性更多更全
          // 须安装 npm install core-js regenerator-runtime --save
          // @babel/polyfill 只有 corejs 版本2 的内容
          // @babel/polyfill 实际只包含了 core-js regenerator-runtime 两个库，弃用 @babel/polyfill, 直接安装最新的两个库即可
          version: 3,
          proposals: true,
        }，
        "targets": {
          "browsers": ["last 2 versions", "ie 11"]
        }
      }
    ]
  ]
  "plugins": ["@babel/transform-runtime"] // 配置使用 transform-runtime 插件，利用插件中的 helps 函数对重复出现的函数进行集中打包，减少体积
}

```

- 执行顺序：

  - Plugin 会运行在 Preset 之前。
  - Plugin 会从前到后顺序执行。
  - Preset 的顺序则 刚好相反(从后向前)。 preset 的逆向顺序主要是为了保证向后兼容，一般配置 Preset 都是按照规范的时间顺序列出即可

- 更详细参考： https://zhuanlan.zhihu.com/p/43249121

- babel 总共分为三个阶段

  - 解析，转换，生成。
  - babel 本身不具有任何转化功能，它把转化的功能都分解到一个个 plugin 里面
  - 当不配置任何插件时，经过 babel 的代码和输入是相同的。

- 插件：

  - 语法插件： 解析这一步就使得 babel 能够解析更多的语法。(babel 内部使用的解析类库叫做 babylon)
  - 转译插件： 转换这一步把源码转换并输出： (a) => a 就会转化为 function (a) {return a}
  - 如果我们使用了转译插件，就不用再使用语法插件了。

- presets

  - 一组插件的集合
  - env：核心目的是通过配置得知目标环境的特点，然后只做必要的转换
  - targets：browsers、node
  - module：取值可以是 amd, umd, systemjs, commonjs 和 false。这可以让 babel 以特定的模块化格式来输出代码。如果选择 false 就不进行模块化处理。

- babel-polyfill：

  - babel 默认只转换 js 语法，而不转换新的 API
  - 比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法(比如 Object.assign)都不会转码。
  - 让这些方法运行，必须使用 babel-polyfill
  - 缺点：
    - 会导致打出来的包非常大，因为 babel-polyfill 是一个整体，把所有方法都加到原型链上
    - 会污染全局变量，给很多类的原型链上都作了修改

- babel-runtime：

  - core-js: 转换一些内置类 (Promise, Symbols 等等) 和静态方法 (Array.from 等)。绝大部分转换是这里做的。自动引入。
  - regenerator: 作为 core-js 的拾遗补漏，主要是 generator/yield 和 async/await 两组的支持。当代码中有使用 generators/async 时自动引入。
  - helpers：避免重复代码，定义方法抽离并统一起来，重复引用，解决代码重复的问题
