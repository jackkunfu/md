# 设置变量 NODE_ENV

- cmd 终端执行

  - NODE_ENV=production
  - windows: SET NODE_ENV=production

- 跨系统平台：安装 cross-env

  - cross-env NODE_ENV=production

- vue3 项目设置 NODE_ENV
  - 增加 .env.modename 文件， 内容 NODE_ENV = 'production'
  - vue-cli-service build --mode modename

# 使用 esm 模块

- .js 文件命名为 .mjs
- 或者
- 2: package.json 里增加 type 属性 设置为 'module'
  - type 两个属性 module / commonjs
  - 设置为 module 时，需要使用到 commonjs 模块的文件
    - 可以把 commonjs 模块的文件后缀 .js 改为 .cjs, import 引入使用
    - .cjs 文件中无法不能 require esm 模块文件
