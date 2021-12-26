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

- 文件夹
  - fs.access()
    - 监测文件是否存在以及是否具有访问权限
  - fs.mkdir() / fs.mkdirSync() 
    - 创建新的文件夹
  - fs.existsSync
  - fs.readdir() / fs.readdirSync()
    - 读取目录的内容， 并返回它们的相对路径
  - fs.rmdir() / fs.rmdirSync()
    - 删除文件夹
  - fs.rename() / fs.renameSync()
    - 文件夹重命名

- fs-extra
  - fs 基础上提供更多的功能

- fs.access(): 检查文件是否存在，以及 Node.js 是否有权限访问。
- fs.appendFile(): 追加数据到文件。如果文件不存在，则创建文件。
- fs.chmod(): 更改文件（通过传入的文件名指定）的权限。相关方法：fs.lchmod()、fs.fchmod()。
- fs.chown(): 更改文件（通过传入的文件名指定）的所有者和群组。相关方法：fs.fchown()、fs.lchown()。
- fs.close(): 关闭文件描述符。
- fs.copyFile(): 拷贝文件。
- fs.createReadStream(): 创建可读的文件流。
- fs.createWriteStream(): 创建可写的文件流。
- fs.link(): 新建指向文件的硬链接。
- fs.mkdir(): 新建文件夹。
- fs.mkdtemp(): 创建临时目录。
- fs.open(): 设置文件模式。
- fs.readdir(): 读取目录的内容。
- fs.readFile(): 读取文件的内容。相关方法：fs.read()。
- fs.readlink(): 读取符号链接的值。
- fs.realpath(): 将相对的文件路径指针（.、..）解析为完整的路径。
- fs.rename(): 重命名文件或文件夹。
- fs.rmdir(): 删除文件夹。
- fs.stat(): 返回文件（通过传入的文件名指定）的状态。相关方法：fs.fstat()、fs.lstat()。
- fs.symlink(): 新建文件的符号链接。
- fs.truncate(): 将传递的文件名标识的文件截断为指定的长度。相关方法：fs.ftruncate()。
- fs.unlink(): 删除文件或符号链接。
- fs.unwatchFile(): 停止监视文件上的更改。
- fs.utimes(): 更改文件（通过传入的文件名指定）的时间戳。相关方法：fs.futimes()。
- fs.watchFile(): 开始监视文件上的更改。相关方法：fs.watch()。
- fs.writeFile(): 将数据写入文件。相关方法：fs.write()。



