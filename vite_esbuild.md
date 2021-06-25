# vite

## 为什么很快

```
由于大多数现代浏览器都支持上面的 ES module 语法，所以在开发阶段，我们就不必对其进行打包，这节省了大量的服务启动时间
  type: module 模式浏览器遇到 import 就会生成发送一个请求获取文件并执行
按需加载当前页面所需文件
  根据当前文件需要使用到的 import 的文件发起请求
一个文件一个http请求
  将 ESM 文件模块依赖的多个内部模块转化为一个模块，以减少浏览器请求从而提升页面加载速度。
缓存减少页面更新时间
  每个文件通过 http 头缓存在浏览器端
  当编辑完一个文件，只需让此文件缓存失效
  当基于 ES module 进行热更新时，仅需更新失效的模块，这使得更新时间不随包的增大而增大。
```

## 服务启动

```
发送请求、服务端响应、浏览器解析
监听端口，执行其他服务之前，会执行optimizeDeps方法，即优化依赖。
vite 文档将这部分优化叫做依赖预打包Dependency Pre-Bundling，这么做的理由有两个：
  对于使用的依赖如果是 CommonJS 或 AMD 的模块，则需要进行模块类型的转化（ES Module）
  不做预编译优化的话，请求某个依赖可能会触发很多请求，预编译来减少当前第三方库请求为一个
    我们引入的一些依赖，它自己又会有一些其他依赖。其他依赖又会依赖其他依赖，可能会挺深的依赖关系
    将 ESM 依赖的多个内部模块转化为一个模块，以减少浏览器请求从而提升页面加载速度。
```

```
优化依赖:
  默认情况下，Vite 会将 package.json 中生产依赖 dependencies 的部分启用依赖预编译，即会先对该依赖进行编译，然后将编译后的文件缓存在内存中（node_modules/.vite 文件下），在启动 DevServer 时直接请求该缓存内容。
  在 vite.config.js 文件中配置 optimizeDeps 选项可以选择需要或不需要进行预编译的依赖的名称，Vite 则会根据该选项来确定是否对该依赖进行预编译。
  在启动时添加 --force options，可以用来强制重新进行依赖预编译。
```

```
export function createServer(config) {
  ...
  const app = new Koa()
  const server = resolveServer(config, app.callback())
  ...
  // 加载插件
  ...

  const listen = server.listen.bind(server)
  server.listen = (async (port, ...args) => {
    if (optimizeDeps.auto !== false) {
      await require('../optimizer').optimizeDeps(config)
    }
    return listen(port, ...args)
  })
  ...

  return server;
}
```

## 请求处理流程

```
请求中增加中间件处理会重写 .js 文件中的 import 的解析方式，返回给浏览器
  import { createApp } from 'vue'   -->    import { createApp } from '/@modules/vue.js'
  import App from './App.vue'       -->    import App from '/src/App.vue'

app.use(async (ctx, next) => {
  await next()
  if (ctx.body && ctx.response.is('js'))
  const content = await fs.readFilesync(ctx.body);
  // 重写import中无法识别的路径
  const r = rewriteImports(content);
  ctx.body = r;
})

const { Readable } = require('stream')
async function readBody(stream) {
    if (stream instanceof Readable) { //
        return new Promise((resolve, reject) => {
            let res = '';
            stream
                .on('data', (chunk) => res += chunk)
                .on('end', () => resolve(res));
        })
    }else{
        return stream.toString()
    }
}
```

```
rewriteImports 改写完成发送给浏览器 浏览器解析文件遇到 import { createApp } from '/@modules/vue.js'，
遇到 import 再次发起请求具体 js 请求
增加中间件处理 /@modules 开头的请求，把具体预编译好的对应的 js 文件发送给浏览器执行
  const fs = require('fs').promises;
  const path = require('path');
  const { resolve } = require('path');
  const moduleRE = /^\/@modules\//;
  const {resolveVue} = require('./utils')
  function moduleResolvePlugin({ app, root }) {
      const vueResolved = resolveVue(root)
      app.use(async (ctx, next) => {
          // 对 /@modules 开头的路径进行映射
          if(!moduleRE.test(ctx.path)){
              return next();
          }
          // 去掉 /@modules/路径
          const id = ctx.path.replace(moduleRE,'');
          ctx.type = 'js';
          const content = await fs.readFile(vueResolved[id],'utf8');
          ctx.body = content
      });
  }
```

```
请求到 .vue 文件组件时:
  koa 插件serverPluginVue.ts会编译单文件组件, 并打上 etag（用于缓存）后再返回给浏览器
  最终把模板编译成 render 渲染函数，render 渲染函数绑定到默认导出组件实例对象返回

  // 编译的组件的 render 方法
  export function render(_ctx, _cache) {
    return (_openBlock(), _createBlock(_Fragment, null, [
      _createVNode("div", null, "计数器:" + _toDisplayString(_ctx.state.count), 1 /* TEXT */),
      _createVNode("button", {
        onClick: _cache[1] || (_cache[1] = $event => (_ctx.click($event)))
      }, "+")
    ], 64 /* STABLE_FRAGMENT */))
  }

  // 最终导出实例对象
  import {reactive} from '/@modules/vue';
  const __script = {
    setup() {
      let state = reactive({count:0});
      function click(){
        state.count+= 1
      }
      return {
        state,
        click
      }
    }
  }
  import { render as __render } from "/src/App.vue?type=template"
  __script.render = __render
  export default __script
```

## 组件热更新

```
通过 websocket
  数据通过 websockt 从服务端推送到浏览器  serverPluginHmr.ts
  client.ts 收到数据后，执行 import('/src/...?t=1609815863830'), 时间戳的作用是使url缓存失效
  览器发起请求执行
```

## vite 打包过程

```
runBuild -> build ->
```

```
// vite/src/node/cli.ts
async function runBuild(options: UserConfig) {
  try {
    await require('./build').build(options)
    process.exit(0)
  } catch (err) {
    console.error(chalk.red(`[vite] Build errored out.`))
    console.error(err)
    process.exit(1)
  }
}
```

```
build 过程：
  移除原先的 outDir 目录（默认情况下是 dist 目录）。
  解析应用的入口 index.html，创建 buildHtmlPlugin 解析入口 index.html
    createBuildHtmlPlugin
  创建 baseRollupPlugin，它会返回一个 plugin 数组，它包括初始化默认的 plugin 和用户自定义的 plugin，例如 buildResolvePlugin、esBuildPlugin、vuePlugin
    createBaseRollupPlugins
  解析 .env 文件，对于 VITE_ 开头的会通过 import.meta.env 的方式暴露给我们。
  调用 rollup.rollup() 生成 bundle。并且，这里会应用上面创建好的 baseRollupPlugin、buildHtmlPlugin 以及一些基础的打包选项。
    const rollup = require('rollup').rollup as typeof Rollup
    const bundle = await rollup({...})
  调用 bundle.generate 生成 output（对象），它包含每一个 chunk 的内容，例如文件名、文件内容
    bundle.generate
  遍历 output 并调用 fs 模块生成对应的 chunk 文件，从而结束整个打包过程。
```

# esbuild

```
为什么非常快：
它是用 Go 语言编写的，该语言可以编译为本地代码。而且 Go 的执行速度很快。一般来说，JS 的操作是毫秒级，而 Go 则是纳秒级。
解析，生成最终打包文件和生成 source maps 的操作全部完全并行化
无需昂贵的数据转换，只需很少的几步即可完成所有操作
  esbuild 仅触及整个JavaScript AST 3次：
    1. 进行词法分析，解析，作用域设置和声明符号的过程
    2. 绑定符号，最小化语法。比如：将 JSX/TS 转换为 JS, ES Next 转换为 es5。
    3. 最小标识符，最小空格，生成代码。
该库以提高编译速度为编写代码时的第一原则，并尽量避免不必要的内存分配。
```
