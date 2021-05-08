# 实例化流程
```
1.初始化 koa app 实例 this.middleware this.context this.request this.response 等
2.执行实例 listen 监听端口启动 http 服务
  listen 方法：http.createServer(this.callback()).listen(...args);
    使用 http 模块创建服务 传入 callback() 方法返回的参数未 req,res 的回调方法
    callback() {
      if (!this.listenerCount('error')) this.on('error', this.onerror);
      return (req, res) => {
        const context = this.createContext(req, res);
        return this.handleRequest(context, compose(this.middleware));
      }
    }

    handleRequest(ctx, fnMiddleware) {
      const res = ctx.res;
      res.statusCode = 404;
      const onerror = err => ctx.onerror(err);
      const handleResponse = () => respond(ctx);
      onFinished(res, onerror);
      return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }

3.开启一个http server，每一个请求经过经过回调函数，经过所有的的中间件级联洋葱模型处理后响应请求的最终结果
```

# 中间件
```
1. 是一个函数 function () {}
2. koa 实例 调用use方法使用
  use 原理
    把中间价函数加入到当前 Koa 实例中的 this.middlware 数组中
      还对 Generator 语法的中间件做了兼容，使用 isGeneratorFunction(fn) 这个方法来判断是否为 Generator 语法，并通过 convert(fn) 这个方法进行了转换，转换成 async/await 语
    return this -> 当前得Koa实例, 达到链式调用效果，可以继续 .use(其他的中间件)
3. 执行 callback 方法
  compose 方法把传入的中间件数组转换并级联执行
```
## 中间件大概逻辑
```
async function koaMiddleware(ctx, next){
  try{
    // do something
    await next()
    // do something
  }
  .catch(err){
    // handle err
  }
}
```
## 洋葱模型
```
compose 方法中 执行 dispatch(0) 执行第一个中间件的方法
当执行到 await next() 方法的时候 递归调用 dispatch 方法
等待所有的后续中间件执行之后返回的 promise 对象
继续执行 await next() 之后的代码，最终执行完毕返回
一层层从第一个到最后一个再一个个返回执行回到第一个中间件 next() 之后的代码处理，像一个洋葱的模型
```
## compose 方法：
```
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // 记录上一次执行中间件的位置 #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // 理论上 i 会大于 index，因为每次执行一次都会把 i递增，
      // 如果相等或者小于，则说明next()执行了多次
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      // 取到当前的中间件
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```