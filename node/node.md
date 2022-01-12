- js
  - 单线程的优点
    - 无多线程状态同步的问题
      - 不存在死锁
      - 不需要线程之间交换带来的性能开销
        - 启用 web-worker child-process 应该除外
  - 单线程的缺点
    - 无法利用多核 CPU
    - 错误会引起整个程序退出
    - cpu 密集型不适合
      - 大量 CPU 计算，长时间的占用 CPU，会导致后续的 I/O 无法发出调用，已完成的异步回调函数得不到及时执行
  - 缺点解决方案
    - child_process
      - 将计算分发到各个子进程，分解大量计算，最后通过进程之间的事件消息来传递结果  
    - 通过 Master-Worker 管理形式，很好管理各个工作进程，以达到更高的健壮性

- Node 应用场景
  - I/O 密集型
    - 利用事件循环的处理能力，擅长异步并行 I/O，资源占用极少，并非启动每一个线程为每一个请求服务
  - CPU 密集型
    - V8 执行效率十分高
    - js 单线程，如果大量长时间 CPU 计算，导致 CPU 时间片不能释放，后续 I/O 不能发起
      - 适当调整和分解大型计算任务
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
