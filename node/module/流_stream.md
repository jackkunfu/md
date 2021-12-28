- 流
  - 是一种以高效的方式处理读/写文件、网络通信、或任何类型的端到端的信息交换。
  - 内存效率: 无需加载大量的数据到内存中即可进行处理。
  - 时间效率: 当获得数据之后即可立即开始处理数据，这样所需的时间更少，而不必等到整个数据有效负载可用才开始。
  - 在传统的方式中，当告诉程序读取文件时，这会将文件从头到尾读入内存，然后进行处理
  - 使用流，则可以逐个片段地读取并处理（而无需全部保存在内存中）

- Node.js 中的流
  - stream 模块 提供了构建所有流 API 的基础。 所有的流都是 EventEmitter 的实例。

- 可读流
  ```
    // 创建
    const Stream = require('stream')
    const readableStream = new Stream.Readable({
      read() {}
    })
    // 发送数据
    readableStream.push('hi!')
    readableStream.push('ho!')
  ```
- 可写流
  ```
    // 创建
    const Stream = require('stream')
    const writableStream = new Stream.Writable({
      write (chunk, encoding, next) {
        console.log(chunk.toString())
        next()
      }
    })
    // 传输流
    process.stdin.pipe(writableStream)
  ```

- 获取可读流中的数据
  ```
    // 创建并发送数据
    const Stream = require('stream')
    const readableStream = new Stream.Readable({
      read() {}
    })
    readableStream.push('hi!')
    readableStream.push('ho!')

    /* 1. pipe 到可写流中 */
    /*
     * 分别输出 chunk:  hi! 和 chunk:  ho!
     */
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

    /* 2. 使用 readable 事件直接地消费可读流 */
    /*
     * 一次性输出 <Buffer 68 69 21 68 6f 21>
     * toString() 方法 一次性输出：hi!ho!
     */
    readableStream.on('readable', () => {
      console.log(readableStream.read()) // <Buffer 68 69 21 68 6f 21>
      console.log(readableStream.read().toString()) // hi!ho!
    })

  ```

- 发送数据到可写流
  - writableStream.write('hey!\n')
- 使用信号通知已结束写入的可写流 ？
  - writableStream.end()

- 各种流
- process.stdin 返回连接到 stdin 的流。
- process.stdout 返回连接到 stdout 的流。
- process.stderr 返回连接到 stderr 的流。
- fs.createReadStream() 创建文件的可读流。
  ```
    const http = require('http')
    const fs = require('fs')
    const server = http.createServer((req, res) => {
      const stream = fs.createReadStream(__dirname + '/data.txt')
      stream.pipe(res)
    })
    server.listen(3000)
  ```
  - pipe
    - 获取来源流，并将其通过管道传输到目标流。
      - data.pipe(res)
      - 链式操作
        - data.pipe(dest1).pipe(dest2)
          - 相当于 data.pipe(dest1) dest1.pipe(pipe2)

- fs.createWriteStream() 创建到文件的可写流。
- net.connect() 启动基于流的连接。
- http.request() 返回 http.ClientRequest 类的实例，该实例是可写流。
- zlib.createGzip() 使用 gzip（压缩算法）将数据压缩到流中。
- zlib.createGunzip() 解压缩 gzip 流。
- zlib.createDeflate() 使用 deflate（压缩算法）将数据压缩到流中。
- zlib.createInflate() 解压缩 deflate 流。

- 不同种类的流
  - Readable: 可以通过管道读取、但不能通过管道写入的流（可以接收数据，但不能向其发送数据）。 当推送数据到可读流中时，会对其进行缓冲，直到使用者开始读取数据为止。
  - Writable: 可以通过管道写入、但不能通过管道读取的流（可以发送数据，但不能从中接收数据）。
  - Duplex: 可以通过管道写入和读取的流，基本上相对于是可读流和可写流的组合。
  - Transform: 类似于双工流、但其输出是其输入的转换的转换流。