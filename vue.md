# vue diff 算法 - 同级比对渲染
# diff - patch(vnode, oldVnode)
```
sameVnode - key 相等 tag 相等 data 相等 ...
  patchVnode 流程
!sameVnode
  1.let el = vnode.el = oldVnode.el // 真实dom(oldVnode的el属性)赋值给vnode
  2.创建vnode的dom 插入到el前面
  el.parentNode.insertBedore(el, createElemnt)
  3.父级中删除老节点
```

## patchVnode
```
vnode oldVnode 如果一致 直接 renturn
如果是都存在 text 属性并且值不相等 替换文本内容
updateChildren
  准备两组 两个指针 分别指向 vode 的 children 和 oldVnode 的 children
  头头 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换
  尾尾 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换
  头尾 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换
  尾头 sameVnode 判断 如果一致 进行 patchVnode 比较更新 不一致进行直接创建替换
  最后判断是否有 key，如果有 key 在剩余的 oldVnode 中找到相同 key 的 sameVnode 判断 如果一致 进行 patchVnode 比较更新
  不存在 key 或者 !sameVnode 不一致 进行直接创建替换
  指针变化 循环以上操作 直到某一组指针的头大于尾巴结束 while 循环
  新的 vnode 的 chileren 指针之间还有数据 直接创建追加操作
  旧的 oldVnode 的 children 指针之间还有数据 直接删除对应的所有老节点
```
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
```
computed watcher 实例 updata 的时候 判断如果 存在 lazy: true 则 把 watcher.dirty = true
数据变化触发当前 computed watcher 时触发 get 属性：createComputedGetter 方法时 if (watcher.dirty) 执行 watcher.evaluate() 重新计算下当前最新的值，其他变化直接展示之前的数据不会重新计算
```
```
vue3通过优化diff算法减少了遍历成本，然后通过静态提升以及时间侦听器缓存减少了多次创建的开销，从而组件更新性的能得到了提升。
  diff算法的优化
    新增了静态标记（PatchFlag），在创建虚拟DOM的时候，如果节点会发生变化，就会加上静态标记， 然后对比的时候只比较带有Patchflag的节点。
  hoistStatic 静态提升
    对于不参与更新的静态节点元素，会做静态提升、只会被创建一次，在渲染时直接复用即可。
  cacheHandlers 事件侦听器缓存
    事件绑定点函数都是同一个函数，所以不用追踪变化，不做标记，直接缓存起来复用即可。
  ssr渲染
    当有大量静态内容的时候，这些内容会被当作纯字符串推进一个buffer里面，即使存在动态的绑定，会通过模板插值嵌入进去。这样会比通过虚拟DOM来渲染的快上很多。
    当静态内容大到一定量级的时候，会用_createStaticVNode方法在客户端去生成一个static node，这些静态node，会被直接innerHtml， 就不需要再创建对象，然后根据对象渲染。
```