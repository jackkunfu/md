- node 事件循环
  - 它阐明了 Node.js 如何做到异步且具有非阻塞的 I/O

- node
  - 单线程运行，一次只做一件事
  - 大大简化了编程方式，而不必担心并发问题

- process.nextTick(() => {})
  - 微任务
  - 事件循环下一个迭代异步任务开始之前，前事件循环同步任务当前迭代结束之后执行

- setImmediate
  - 宏任务，类似 setTimeout(() => {}, 0)

- setImmediate, setTimeout 事件循环的下一个迭代中运行