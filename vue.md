# vue diff 算法

## 统计比对渲染

## patch(vnode, oldVnode)

# diff

## sameVnode - key 相等 tag 相等 data 相等 ...

### 走 patchVnode 流程

## !sameVnode

```
  1.let el = vnode.el = oldVnode.el // 真实dom(oldVnode的el属性)赋值给vnode
  2.创建vnode的dom 插入到el前面
  el.parentNode.insertBedore(el, createElemnt)
  3.父级中删除老节点
```

## patchVnode

### vnode oldVnode 如果一致 直接 renturn

### 如果是都存在 text 属性并且值不相等 替换文本内容

### updateChildren

#### 准备两组 两个指针 分别指向 vode 的 children 和 oldVnode 的 children

#### 头头 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换

#### 尾尾 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换

#### 头尾 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换

#### 尾头 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换

#### 最后判断是否有 key，如果有 key 在剩余的 oldVnode 中找到相同 key 的 sameVnode 判断 如果一致 进行 patchVnode 比较更新

#### 不存在 key 或者 !sameVnode 不一致 进行直接创建替换

#### 指针变化 循环以上操作 直到某一组指针的头大于尾巴结束 while 循环

#### 新的 vnode 的 chileren 指针之间还有数据 直接创建追加操作

#### 旧的 oldVnode 的 children 指针之间还有数据 直接删除对应的所有老节点

# computed 缓存原理

## 每个 computed 回调都会生成一个 watch 增加属性 lazy: true

```
function initComputed () {
  vm._computedWatchers = Object.create(null)
  for (const key in computed) {
    defineComputed(vm, key, computed[key])
    vm._computedWatchers = new Watch(
      vm,
      computed[key].get ? computed[key].get() : computed[key],
      () => {},
      { lazy: true }
    )
  }
}
function defineComputed (vm, key, fn) {
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: fn.set || function () {}
  })
}
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = vm._computedWatchers && vm._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

## computed watcher 实例 updata 的时候 判断如果 存在 lazy: true 则 把 watcher.dirty = true

## 数据变化触发当前 computed watcher 时触发 get 属性：createComputedGetter 方法时 if (watcher.dirty) 执行 watcher.evaluate() 重新计算下当前最新的值，其他变化直接展示之前的数据不会重新计算
