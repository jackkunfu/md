const fs = require('fs')

fs.stat('./1.txt', 'r', (err, fd) => {
  //fd 是文件描述符。
  if (err) console.log(err)
  else {
    console.log(fd)
  }
})