- Buffer
  - Buffer 是内存区域
  - 表示在 V8 JavaScript 引擎外部分配的固定大小的内存块（无法调整大小）
  - 可以将 buffer 视为整数数组，每个整数代表一个数据字节
  - Buffer 被引入用以帮助开发者处理二进制数据，在此生态系统中传统上只处理字符串而不是二进制数据
  - Buffer 与流紧密相连
    - 流处理器 接收数据的速度 快于 其消化的速度时，则会将数据放入 buffer 中
    - 比如看视频时，红线超过了观看点：即下载数据的速度比查看数据的速度快，且浏览器会对数据进行缓冲

- 创建 Buffer
  - 使用 Buffer.from()、Buffer.alloc() 和 Buffer.allocUnsafe() 方法可以创建 buffer
    - Buffer.from
      - Buffer.from(array)
      - Buffer.from(arrayBuffer[, byteOffset[, length]])
      - Buffer.from(buffer)
      - Buffer.from(string[, encoding])
    - Buffer.alloc() / Buffer.allocUnsafe()
      - 只初始化 buffer（传入大小）
        - 创建一个长度是 1KB 的 buffer： Buffer.alloc(1024)
      - alloc 和 allocUnsafe 均分配指定大小的 Buffer（以字节为单位）
      - alloc 创建的 Buffer 会被使用零进行初始化，而 allocUnsafe 创建的 Buffer 不会被初始化
      - allocUnsafe
        - allocUnsafe 比 alloc 要快得多，但是分配的内存片段可能包含可能敏感的旧数据
        - 当 Buffer 内存被读取时，如果内存中存在较旧的数据，则可以被访问或泄漏。 这就是真正使 allocUnsafe 不安全的原因，在使用它时必须格外小心

- 数据操作
- 获取
  - Buffer（字节数组）可以像数组一样使用下标访问
    - Buffer.from('Hey!')
      - <Buffer 48 65 79 21>
        - 数据内容为对应的 16 进制
    - Buffer.from('Hey!')[0]
      - 返回 72
        - 72 是 字符H 对应的 Unicode 码的十进制，上面的第一个显示数字是 48，是 H 的 Unicode 码的 16 进制
      - var a = Buffer.from('abc')
      - console.log(a) // <Buffer 61 62 63>  // 61|62|63 字符对应的 Unicode 码的 16 进制
  - 使用 toString() 方法打印 buffer 的全部内容
    - Buffer.from('abc').toString() // 'abc'
  - .length
    - Buffer.from('abc').toString() // 3
  - for of 迭代

- 操作
  - write
    - 返回操作数据的长度
    - 会顺序替换 Buffer 对象的内容
      ```
        var a = Buffer.from('abc')
        a.write('12')
        console.log(a.toString()) // '12c'
      ```
  - 下标操作
    ```
      var a = Buffer.from('abc')
      a[1] = 100 // 字符 d 对应的 Unicode 码的十进制
      console.log(a.toString()) // 'adc'
      console.log(a) // <Buffer 61 64 63>  // 61|64|63 是对应的数据的 16 进制
    ```

- 复制
  - copy
    ```
      var a = Buffer.from('abc')
      var b = Buffer.alloc(20)
      var c = Buffer.alloc(2)
      a.copy(b)
      a.copy(c)
      console.log(a) // <Buffer 61 64 63>
      console.log(a.toString()) // abc
      console.log(b) // <Buffer 61 64 63 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
      console.log(b.toString()) // abc
      console.log(c) // <Buffer 61 62>
      console.log(c.toString()) // ab
    ```

- 切片 buffer
  - 创建 buffer 的局部视图，则可以创建切片
  - 切片不是副本
    - 原始 buffer 仍然是真正的来源。 如果那改变了，则切片也会改变
  - slice() 方法创建它。 第一个参数是起始位置，可以指定第二个参数作为结束位置
  ```
    const buf = Buffer.from('Hey!')
    buf.slice(0).toString() //Hey!
    const slice = buf.slice(0, 2)
    console.log(slice.toString()) //He
    buf[1] = 111 //o
    console.log(slice.toString()) //Ho
  ```
    