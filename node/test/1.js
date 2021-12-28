/* module.exports / exports */
// console.log(require('./exoprt'))

/* Buffer */
// var a = Buffer.from('abc')
// console.log(a) // <Buffer 61 62 63>  // 61|62|63 字符对应的 Unicode 码的 16 进制
// a[1] = '100' // 字母 d 对应的 Unicode 码
// console.log(a.toString()) // 'adc'
// console.log(a)

// var a = Buffer.from('abc')
// var b = Buffer.alloc(20)
// var c = Buffer.alloc(2)
// a.copy(b)
// a.copy(c)
// console.log(a) // <Buffer 61 64 63>
// console.log(a.toString()) // abc
// console.log(b) // <Buffer 61 64 63 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
// console.log(b.toString()) // abc
// console.log(c) // <Buffer 61 62>
// console.log(c.toString()) // ab

// const buf = Buffer.from('Hey!')
// for (const item of buf) {
//   console.log(item) // 72 101 121 33
//   console.log(typeof item) // 72 101 121 33
// }

const Stream = require('stream')
const readableStream = new Stream.Readable({
  read() {}
})

readableStream.push('hi!')
readableStream.push('ho!')

const writableStream = new Stream.Writable({
  write (chunk, encoding, next) {
    // console.log('encoding, ', encoding) // buffer
    console.log('chunk: ', chunk.toString())
    next()
  }
})
readableStream.pipe(writableStream)

process.nextTick(() => {
  writableStream.end() // 使用信号通知已结束写入的可写流
})

// readableStream.on('readable', () => {
//   console.log(readableStream.read().toString())
// })
