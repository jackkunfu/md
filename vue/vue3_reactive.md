- vue3 响应式原理

  - proxy
    - 对比 Object.defineProperty
    - 能监听对象属性新增和删除
    - 不用初始化递归，性能好
    - 能监测数组各种操作
    - proxy api 更多的拦截触发操作，更精细的监测

- reactive 函数

  - \_\_v_isReadonly: readonly proxy 响应式的直接 return 当前响应式对象
  - 如果不是对象或者数组，提示无法响应式处理，返回原数据
  - \_v_raw && \_\_v_isReactive：已经是响应式对象的直接 return 响应式对象
    - 多次用 reactive 处理一个响应式对象，返回本身，再次处理的响应式对象和原响应式对象完全相等 ===
  - 响应式类型的数据才做 proxy 处理，其他类型数据直接 return 原对象
    - 'Object,Array,Map,Set,WeakMap,WeakSet'类型数据可以响应式处理
    - \_\_v_skip 属性的对象、被冻结的对象、Date 数据对象不能响应式处理
  - 验证数据通过用 Proxy 处理对象
    - const observed = new Proxy(data, handler)
    - target[\_\_v_isReadonly | \_\_v_isReactive] = observed
    - return observed

- Proxy 第二个参数 handler 监测数据获取以及变化增加响应式

```
  const mutableHandlers = {
    get(访问触发),
    set(设置触发),
    deleteProperty(delete触发),
    has(in 操作触发),
    ownKeys(Object.getOwnPropertyNames 访问触发)
  }
```

- get 函数

  - 劫持对响应式 proxy 数据对象 observed 的一些操作
  - 处理返回值，并触发依赖收集 track 方法

  ```
  get (target, key, receiver) {
    // 特殊 key 的处理
    if (key === "__v_isReactive" /* isReactive */) { // 代理 observed.__v_isReactive
      return !isReadonly
    } else if (key === "__v_isReadonly" /* isReadonly */) { // 代理 observed.__v_isReadonly
      return isReadonly;
    } else if (key === "__v_raw" /* raw */) { // 代理 observed.__v_raw
      return target
    }
    // 如果是数组，处理 ['includes', 'indexOf', 'lastIndexOf']
    const targetIsArray = isArray(target)
    // arrayInstrumentations 包含对数组一些方法修改的函数
    if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }
    const value = Reflect.get(target, key,receiver)
    track(target, 'get', key)
    // get 访问获取数据的时候，如果数据是对象，递归处理对象的响应式
    return isObject(value) ? reactivite(value) : value // 如果 value 是对象，递归处理 value 形成响应式
  }
  ```

- proxy 仍需要递归处理子数据

  - Proxy 劫持的是对象本身，并不能劫持子对象的变化
  - 递归处理与 Object.defineProperty 的不同
    - Object.defineProperty 是在初始化阶段，即定义劫持对象的时候就已经递归执行了
    - Proxy 是在对象属性被访问 get 的时候才递归执行下一步 reactive
    - Proxy 是延时定义子对象响应式的实现，在性能上会有较大的提升

- 依赖收集 track 函数
