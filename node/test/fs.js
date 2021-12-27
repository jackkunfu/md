const fs = require('fs')

fs.stat('./1.txt', 'r', (err, fd) => {
  //fd 是文件描述符。
  if (err) console.log(err)
  else {
    console.log(fd)
  }
})

const content = '\r一些内容'

fs.appendFile('./1.txt', content, err => {
  if (err) {
    console.error('appendFile err')
    console.error(err)
    return
  }
  //完成！
})