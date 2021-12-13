- 打印着色
  - chalk 库
    ```
    npm i chalk
    const chalk = require('chalk')
    console.log(chalk.yellow('你好')) // 在控制台打印黄色的你好文字
    ```

- 打印进度条
  - progress 库
    ```
    npm install progress
    const ProgressBar = require('progress')
    
    // 以下代码段会创建一个 10 步的进度条，每 100 毫秒完成一步。 当进度条结束时，则清除定时器：
    const bar = new ProgressBar(':bar', { total: 10 })
    const timer = setInterval(() => {
      bar.tick()
      if (bar.complete) {
        clearInterval(timer)
      }
    }, 100)
    ```

- 接收输入
  - readline 模块（node version >= 7）
    - 每次一行地从可读流（例如 process.stdin 流，在 Node.js 程序执行期间该流就是终端输入）获取输入。
    ```
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    
    // 这段代码会询问用户名，当输入了文本并且用户按下回车键时，则会发送问候语。
    readline.question(`你叫什么名字?`, name => {
      console.log(`你好 ${name}!`)
      readline.close()
    })
    ```
  - inquirer 
    - 更完整、更抽象的交互工具库
    - 自定义工程化 CLI 工具输入提升到更高的水平的选择
    
    ```
    npm install inquirer

    var questions = [
      {
        type: 'input',
        name: 'name',
        message: "你叫什么名字?"
      }
    ]
    inquirer.prompt(questions).then(answers => {
      console.log(`你好 ${answers['name']}!`)
    })
    ```