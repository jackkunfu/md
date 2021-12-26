- fa.open
  - 在 POSIX 系统上，对于每个进程，内核都维护着一张当前打开着的文件和资源的表格。
    - 每个打开的文件都分配了一个称为文件描述符的简单的数字标识符。
    - 在系统层，所有文件系统操作都使用这些文件描述符来标识和跟踪每个特定的文件。
    - Windows 系统使用了一个虽然不同但概念上类似的机制来跟踪资源。
    - 为了简化用户的工作，Node.js 抽象出操作系统之间的特定差异，并为所有打开的文件分配一个数字型的文件描述符。
    - fs.open() 方法用于分配新的文件描述符。 一旦被分配，则文件描述符可用于从文件读取数据、向文件写入数据、或请求关于文件的信息。

- fs.stats
  - 获得文件的详细信息
  - 使用 stats.isFile() 和 stats.isDirectory() 判断文件是否目录或文件。
  - 使用 stats.isSymbolicLink() 判断文件是否符号链接。
  - 使用 stats.size 获取文件的大小（以字节为单位）。 //1024000 //= 1MB

- fs.readFile
  - 读取文件
  - fs.readFile() 和 fs.readFileSync() 都会在返回数据之前将文件的全部内容读取到内存中。
    - 这意味着大文件会对内存的消耗和程序执行的速度产生重大的影响。
    - 在这种情况下，更好的选择是使用流来读取文件的内容。
      - fs.createReadStream/fs.createWriteStream

- fs.writeFile/writeFileSync/appendFileSync/appendFile
  - 写文件/将内容追加到文件末尾
    - 所有这些方法都是在将全部内容写入文件之后才会将控制权返回给程序（在异步的版本中，这意味着执行回调）。
    - 在这种情况下，更好的选择是使用流写入文件的内容。
      - fs.createReadStream/fs.createWriteStream

- 流
  - 详见 流.md



