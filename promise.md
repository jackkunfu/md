- promise.race
  - 拦截第一个改变状态的 promise 对象，执行回调函数
    - 参数是第一个 resolve 状态的返回对象
  - 如果第一个状态改变的是 resolve 的，则执行回调
    - 后续的状态变成 reject ，不影响第一个返回以及回调执行
  - 如果第一个状态改变的是 reject，则返回，不执行回调
  ```
  const first = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, '第一个')
  })
  const second = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, '第二个')
  })

  Promise.race([first, second]).then(result => {
    console.log(result) // 第二个
  })
  ```

- promise.all
  - 所有的 promise 状态变成 resolve ，才执行回调
    - 参数是 promise 返回的对象按顺序组成的数组

- async\await
  - 同步的形式书写异步代码
  - 默认返回一个 promise
  - promise 和生成器的组合 ?
  - 更容易调试
    - async 函数中可以直接 try catch 同步的形式捕捉到代码异常