# Promise Generator Async/await

## Generator

### 迭代器函数 异步

```
function * ge() {
  yeild 1;
}
let g = ge() // 迭代器指针
g.next() { value: 1, done: false }
g.next() { value: undefined, done: true }
```

## Async/await

### Generator 的语法糖 异步

## Promise

### 异步

```
function cb(rs, rj) {
  rs(1)
}
new Promise(cb).then(() => {}).catch(e => {})
```

```
new Promise 实例化时参数回调函数 cb 是同步函数 正常任务中按顺序立即执行
then catch 方法的回调函数均添加到微任务队列，在正常任务之后执行
Promise.resolve(1) Promise.reject(1) .resolve .reject 执行返回的数据 均为微任务队列中的结果返回 在正常任务之后执行
Promise.reject(1) 直接执行的结果为微任务队列任务 直接 try catch 包裹 拦截不到异常错误 须增加 .catch() 回调拦截结果
```

```
循环执行await 的正确方法
forEah 回调函数是 async/await 函数，循环中的多个await同时执行，因此等待1s后将同时输出数组各个元素
  const fn = async (item)=>{
    await wait(1000);
    console.log(item);
  };
  array.forEach(fn);
正确：运用 for 循环：
  (async ()=>{
    for(let i=0,len=array.length;i<len;i++){
      await wait(1000);
      console.log(array[i]);
    }
  })();
```
