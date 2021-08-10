# http

## xhr / axios / fetch 取消请求

```
xhr -----------  xhr 实例本身带有 abort 方法，直接执行当前实例的 abort() 方法即可

axios  ------------  使用拦截器配置 CancelToken 实例取消请求
  const reqs = []
  const CancelToken = axios.CancelToken
  axios.interceptor.request.use(config => {
    config.cancelToken = new CancelToken(cancelFunction => {
      reqs.push(data: config, f: cancelFunction)
    })
    return config
  })

  reqs.forEach(el => {
    el.c() // 执行 cancelFunction 方法即可取消当前对应的请求
  })

fetch  -----------  实例本身不带有 abort 方法， 通过 Promise.race 可以变相实现
  var _fetch = (function(fetch){
    return function(url,options){
      var abort = null;
      var abort_promise = new Promise((resolve, reject)=>{
        abort = () => {
          reject('abort.');
          console.info('abort done.');
        };
      });
      var promise = Promise.race([
        fetch(url,options),
        abort_promise
      ]);
      promise.abort = abort;
      return promise;
    };
  })(fetch);
  var p = _fetch('https://www.baidu.com',{mode:'no-cors'});
  p.then(function(res) {
      console.log('response:', res);
  }, function(e) {
      console.log('error:', e);
  });
  p.abort(); // 调用实例的 abort 方法 ，
  每次请求都会生成一个是一个 fetch 请求返回的 promise 对象 加上一个 abort_promise 的 promise 对象组成的数组传入 Promise.race
  Promise.race 是其中任何一个 promise 有返回即结束所有 promise 执行，返回最早的 promise 返回
  需要取消时，调用请求对象的 abort 方法，改变 abort_promise 的状态，终止整个 Promise.race 的 promise 处理来达到取消请求的效果
```

```
fetch 也可以利用 Promise.race 模拟超时
fetch 获取请求进度: getReader: res.body.getReader()
function progress(reader) {
  var total = 0
  return new Promise((resolve, reject) => {
    function pump() {
      reader.read().then(({done, value}) => {
        if (done) {
          resolve();
          return;
        }
        total += value.byteLength;
        console.log(`获取 ${value.byteLength} 字节 (共 ${total} 字节)`);
        pump();
      }).catch(reject)
    }
    pump();
  });
}
fetch('http://localhost:10101/notification/', { mode:'no-cors' })
  .then(res => progress(res.body.getReader()))
  .then(() => console.log("consumed the entire body without keeping the whole thing in memory!"))
  .catch(e => console.log("something went wrong: " + e));
```
