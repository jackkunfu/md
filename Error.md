# 错误捕获

## try catch
```
try {} catch (e) {}
能捕获进入 try 执行语句，且没结束同步任务执行之前出现的错误
不能捕获的异常：
  异步任务抛出的异常（执行时try catch已经从执行完了）
  promise（异常内部捕获到了，并未往上抛异常，使用catch处理）
  语法错误（代码运行前，在编译时就检查出来了的错误）
```

## window.onerror
```
windw.onerror = function () {}
window.addEventListener('error', function() { console.log(error); });
最大的好处就是同步任务、异步任务都可捕获
可以全局监听
可以得到具体的异常信息、异常文件的URL、异常的行号与列号及异常的堆栈信息
缺点:
  有一定的浏览器兼容性
  跨域脚本无法准确捕获异常，跨域之后window.onerror捕获不到正确的异常信息，而是统一返回一个Script error，可通过在<script>使用crossorigin属性来规避这个问题
  无法捕获Promise实例抛出的异常
```

## Promise 异常
```
onerror 以及 try-catch 也无法捕获Promise实例抛出的异常，只能最后在 catch 函数上处理，较多 Promise 实例时不太好控制
解决方案：
  添加一个 Promise 全局异常捕获事件 unhandledrejection
  window.addEventListener("unhandledrejection", e => {
    console.log('unhandledrejection',e)
  });
```

## .vue 文件中的异常
```
window.onerror 不能捕获.vue文件发生的获取
解决方案: errorHandler (内部用 try catch 捕获)
  Vue 2.2.0+: Vue.config.errorHandler = function (e) {}
  Vue 3: app.config.errorHandler = function (e) {};
```