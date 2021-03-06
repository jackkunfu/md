- process
  - 捕获 node 中未捕获的异常
    ```
      process.on('uncaughtException', err => {
        console.error('有一个未捕获的错误', err)
        process.exit(1) //强制性的（根据 Node.js 文档）
      })
    ```
  - 无须 require，直接使用
  - process.exit()
    - 代码结束进程
  - process.on
  - process.kill
    ```
      const server = require('express')().listen(3000, () => {})
      process.on('SIGTERM', () => {
        server.close()
      })

      // 其他地方需要销毁线程的时候可以调用kill时传输 SIGTERM ，触发相关回调执行
      process.kill(process.kid, 'SIGTERM') // 发送信号 SIGTERM, process.on 可以监听到执行回调函数
    ```

  - 提供了 env 属性，该属性承载了在启动进程时设置的所有环境变量。
    - process.env.NODE_ENV
      - 设置/获取环境变量 NODE_ENV
    - 访问设置的任何自定义的环境变量

  - process.argv
    - 获取命令行中的参数,执行命令字符串以空格分隔开的类数组
      - 第一个参数是 node 命令的完整路径。
      - 第二个参数是正被执行的文件的完整路径。
    - 循环获取
      ```
      process.argv.forEach((val, index) => {
        console.log(`${index}: ${val}`)
      })
      ```
    - 获取前两个之后的参数
      - const args = process.argv.slice(2)
    - minimist 库
      - 解析node 执行命令输入的参数
        - require('minimist')(process.argv.slice(2));
        ```
          // 输入命令
          node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
          // require('minimist')(process.argv.slice(2)) 执行解析得到的参数对象
          {
            _: [ 'foo', 'bar', 'baz' ],
            x: 3,
            y: 4,
            n: 5,
            a: true,
            b: true,
            c: true,
            beep: 'boop'
          }
        ```

- global
  - 全局变量

- 特殊的命令 _
  - _ 
    - 返回前一个执行语句 return 的值
  - .help
    - 显示帮助命令
  - .editor
    - 启用编辑器模式
  - .save
    - 保存当前输入的历史内容到文件，须指定文件名
  - .load
    - 加载 js 文件，相对于当前目录

