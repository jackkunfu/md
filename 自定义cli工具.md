# 开发自己的 cli 工具

## 初始化 package.json 定义 bin 属性
```
设置执行命令名称以及对应的入口文件
执行文件一般都放在bin目录下
主要会用到的依赖
  npm i commander download-git-repo ora handlebars figlet clear chalk -S
```
```
{
  "name": "cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "sgq": "./bin/sgq.js" // 具体命令行中输入 sgq 执行对应脚本 ./bin/sgq.js
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.0",
    "clear": "^0.1.0",
    "commander": "^6.0.0",
    "download-git-repo": "^3.0.2",
    "figlet": "^1.5.0",
    "handlebars": "^4.7.6",
    "ora": "^5.0.0"
  }
}
```

## 执行文件 ./bin/sgq.js
```
1.设置 node 执行标识  #!/usr/bin/env node
2.使用 command 模块 定义 cli 工具的执行的命令，设置命令的描述 description 以及 执行的 action 
  const cmd = require('commander')
  // 定义 init 命令 <> 中接收传参
  cmd.command('init <name>')
    .description('init')
    .action(name => { // init 命令相关的操作
      require('./lib/init')(name)
    })
3.解析执行输入的命令对应的 action
cmd.parse(process.argv)
```

## 命令 action
```
const { promisify } = require('util')
const figlet = promisify(require('figlet')) // 包装使用async await工具 字体放大
const clear = require('clear')
const chalk = require('chalk') // 粉饰文字

const { clone } = require('./download')

const log = text => console.log(chalk.red(text))

// 安装依赖命令
const spawn = async (...argus) => {
  const { spawn } = require('child_process')
  return new Promise((rs, rj) => {
    const proc = spawn(...argus)
    proc.stdout.pipe(process.stdout) // 子进程的数据流和主进程流关联
    proc.stderr.pipe(process.stderr) // 子进程的错误数据流和主进程流关联
    proc.on('close', rs)
  })
}
module.exports = async str => {
  clear()
  
  // 打印粉饰字体
  log(await figlet(str))

  log('创建项目')

  // 下载模板
  log('下载模板')
  await clone('github:su37josephxia/vue-template', str)

  // 安装依赖
  log('安装依赖...')
  await spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'], { cwd: `./${str}` })
  log(
    chalk.red(`
    ---------------
    cd ${str}
    npm run serve
    ---------------
    `)
  )
}
```

## 完成之后可以node命令执行 执行文件 js 也可以在当前项目目录执行npm link 相当与把 npm i -g 全局安装当前执行命令 可以直接在命令行执行 bin 中设置的 命令 key