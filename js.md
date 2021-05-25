# curry 柯里化

## 实现柯里化的核心就是要确定传入参数的个数，并通通取到

## fn.length 为 fn 函数接受的参数个数，那么该实现方法就能解读为：

## 不断递归获取传入参数，直到取到的参数个数等于 fn 的参数个数为止，最终将获取到的所有参数传给 fn 并返回执行结果。

```
function curry (fn) {
  const c = (...args) => (args.length === fn.length) ?
          fn(...args) : (..._args) => c(...args, ..._args)
  return c
}
```

### 柯里化思想能让我们在遇到只能确定一个参数而无法确定另一个参数时，代码设计编的变得更方便与高效，达到提升性能的目的。

### 避免频繁调用具有相同参数的函数

# 拷贝

```
// 浅拷贝
// 对象
let data = { a: 1 }
1. let res = Object.assign({}, data)
2. let res = { ...data }
3. let res = ((){
  let res
  for (var i in data) {
    res[i] = data[i]
  }
  reurn res
})()
// 数组
let data = [1, 2]
1. let res = data.concat() // concat 方法 直接浅拷贝
2. let res = data.slice(0) // slice 方法 直接浅拷贝
3. let res = ((){
  let res = []
  for (var i = 0;i < data.length; i++) {
    res.push(data[i])
  }
  reurn res
})()

```

```
// 深拷贝
let data = { a: 1 }
1. JSON.parse(JSON.stringify(data))
2. function deepClone (data) {
  return Objects.keys(data).map(el => {
    return {}
  })
}

JSON 深拷贝 问题：
undefied 函数 symbol 这些数据项会消失
date 类型会变成字符串
无法拷贝对象的原型链
无法拷贝不可枚举的属性
正则类型数据会变成null
NaN Infinity -Infinity会变成null
{
  a: function () {},
  b: { v: 1 },
  c: undefined,
  d: /123/g,
  e: NaN,
  f: Infinity,
  g: new Date('2021-01-01'),
  h: symbol('1')
}
--->
{
  b: {v: 1}
  d: {}
  e: null
  f: null
  g: "2021-01-01T00:00:00.000Z"
}
```

# 内存泄漏

```
方法内部意外的全局属性不会被释放
function a () { xx = 'fvd' } // xx 不用 let/var 等声明成为全局属性
闭包可以维持函数内局部变量，使其得不到释放
```

# call/apply/bind

```
Function.prototype.call = function (context, ...args) {
  var context = context || window;
  context.fn = this;
  var result = eval('context.fn(...args)');
  delete context.fn
  return result;
}
Function.prototype.apply = function (context, args) {
  let context = context || window;
  context.fn = this;
  let result = eval('context.fn(...args)');
  delete context.fn
  return result;
}
Function.prototype.bind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("this must be a function");
  }
  var self = this;
  var fbound = function () {
    self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
  }
  if(this.prototype) {
    fbound.prototype = Object.create(this.prototype);
  }
  return fbound;
}
```

# 闭包

```
闭包其实就是一个可以访问其他函数内部变量的函数
本质：当前环境中存在指向父级作用域的引用，可以访问指向父级函数的变量，使其能被访问到，从而一直保留在内存中
```

## 作用域

```
全局作用域
函数作用域
块级作用域：存在'暂时性死区',声明之前不能访问
```

## 作用域链

```
当访问一个变量时，代码解释器会首先在当前的作用域查找，如果没找到，就去父级作用域去查找，直到找到该变量或者不存在父级作用域中，这样的链路就是作用域链。
```

# 垃圾回收
## 引用计数
```
计数为0 立即清除
无法处理循环引用的对象，计数无引用的时候，也不为0
```
## 标记清除
```
新生代的垃圾回收算法 Scavenge GC

1. 我们维护一个列表，老生代对象每次指向一个新生对象的时候，记录下来；每次删除指向的时候，删除记录。（这样我们就知道新生代对象里面，哪些对象是存活的了）

2. 我们把新生代对象的内存平均分开 2 份空间From 和 To 

3. 每当有新生对象诞生，就会在 From 空间出现

4. 一旦 From 空间被占满，就触发 Scavenge GC

5. 根据维护的列表，我们从 From 空间拿出存活的对象，复制到 To 空间

6. 清空 From 空间 （这样就可以实现把不活跃的对象给回收掉）

7. From To 空间角色互换，开始下一轮循环

其中经历过回收还存活的对象，age++，在 Java 默认情况下，age 15 的时候会晋升到老生代，JS 规定的 age，博主还没查明

还有一种情况，当复制到 To 空间的时候， To 空间已经使用了25%，那么这个对象直接晋升到老生代。
```

# 箭头函数
```
本身不具备this，定义时所在当前上线文中的this，不会改变
本身不具备 new.target/super，不能作为构造函数被实例化，new 操作会报错
本身不具备 prototype 不存在原型链
class 类中的箭头函数，实例化类时会成为实例的本身属性，不会在原型对象上
```

# const
```
块级作用域，须初始化赋值
不能更改 const 初始化的值，如果初始化是对象，对象的属性值可以更改，但不能指向别的对象
本质是 const 会保持当前对象的引用指针指向不变，修改指向新的数据内存地址会报错不生效
如果初始化指向的是对象，对象本身属性的改变不影响当前指针的指向，可以正常执行，const只能确保指针的指向不变，主体指向内存中的值变化无法处理
```

