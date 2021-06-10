# vue2

## vue diff 算法 - 同级比对渲染
## diff - patch(vnode, oldVnode)
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
        watcher.evaluate() // 执行 evaluate: 调用 get 方法重新计算值并把当前的 watcher 的 dirty 属性重置为 false，继续缓存
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

# vue3
```
diff算法优化：vue3通过优化diff算法减少了遍历成本，然后通过静态提升以及时间侦听器缓存减少了多次创建的开销，从而组件更新性能得到了提升。
  diff算法的优化
    新增了静态标记（PatchFlag），在创建虚拟DOM的时候，如果节点会发生变化，就会加上静态标记， 然后对比的时候只比较带有Patchflag的节点。
  hoistStatic 静态提升
    对于不参与更新的静态节点元素，会做静态提升、只会被创建一次，在渲染时直接复用即可。
  cacheHandlers 事件侦听器缓存
    事件绑定点函数都是同一个函数，所以不用追踪变化，不做标记，直接缓存起来复用即可。
  ssr渲染
    当有大量静态内容的时候，这些内容会被当作纯字符串推进一个buffer里面，即使存在动态的绑定，会通过模板插值嵌入进去。这样会比通过虚拟DOM来渲染的快上很多。
    当静态内容大到一定量级的时候，会用_createStaticVNode方法在客户端去生成一个static node，这些静态节点，会被直接innerHtml， 就不需要再创建对象，然后根据对象渲染。
```

```
数据劫持优化：在渲染 DOM 的时候访问了数据，我们可以对它进行访问劫持，这样就在内部建立了依赖关系，也就知道数据对应的 DOM 是什么了
  vue2 中使用 Object.defineProperty, 嵌套较深对象处理方式是初始化就得需要深层次递归劫持数据定义所有层级的 get set，性能负担较大
  vue3 使用 proxy，劫持的是整个对象，嵌套较深对象的处理方式是在 getter 中去递归响应式，好处是真正访问到的内部对象才会变成响应式，很大程度上提升了性能
```

```
打包体积优化：引入 tree-shaking 的技术，减少打包体积。
  编译阶段，静态分析打标记：依赖 ES2015 模块语法的静态结构（即 import 和 export），通过编译阶段的静态分析，找到没有引入的模块并打上标记。
  压缩阶段，删除标记无用代码：会利用例如 uglify-js、terser 等压缩工具真正地删除这些没有用到的代码。
```

```
Composition API:
  1. 优化逻辑组织
  2. 优化逻辑复用
  3. 对 tree-shaking 友好，代码也更容易压缩。
  4. 函数对类型声明支持的更方便
```

```
组件渲染更新：创建 vnode -> 渲染 vnode -> 生成 DOM
```

## 实例化流程
```
App 组件挂载到节点容器中
  import { createApp } from 'vue'
  import App from './app'
  const app = createApp(App)
  app.mount('#app')
  app.mount('#container')

const createApp = ((...args) => {
  // 创建 app 对象
  const app = ensureRenderer().createApp(...args)
  const { mount } = app
  // 重写 mount 方法
  app.mount = (containerOrSelector) => {
    // ...
  }
  return app
})

// 根据自定义 nodeOps 生成并且缓存当前自定以渲染器
function ensureRenderer() {
  return renderer || (renderer = createRenderer({
    patchProp,
    ...nodeOps
  }))
}
function createRenderer(options) {
  return baseCreateRenderer(options)
}
function baseCreateRenderer(options) {
  function render(vnode, container) {
    // 组件渲染的核心逻辑
  }
  return {
    render,
    createApp: function createAppAPI(render) {
      // createApp createApp 方法接受的两个参数：根组件的对象和 prop
      return function createApp(rootComponent, rootProps = null) {
        const app = {
          _component: rootComponent,
          _props: rootProps,
          mount(rootContainer) { // 不仅仅是为 Web 平台服务，它的目标是支持跨平台渲染，跨平台通用挂载逻辑，具体实例化之后会根据当前 container 再次改写
            // 创建根组件的 vnode
            const vnode = createVNode(rootComponent, rootProps)
            // 利用渲染器渲染 vnode
            render(vnode, rootContainer)
            app._container = rootContainer
            return vnode.component.proxy
          }
        }
        return app
      }
    }
  }
}


// 重写 app.mount 适合 Web 平台下的渲染逻辑
const { mount } = app // 保存通用化挂载方法
app.mount = (containerOrSelector) => {
  // 标准化容器
  const container = normalizeContainer(containerOrSelector)
  if (!container) return
  const component = app._component
   // 如组件对象没有定义 render 函数和 template 模板，则取容器的 innerHTML 作为组件模板内容
  if (!isFunction(component) && !component.render && !component.template) {
    component.template = container.innerHTML
  }
  // 挂载前清空容器内容
  container.innerHTML = ''
  // 真正的挂载
  return mount(container) // 传入处理后的容器对象执行通用化挂载方法
}
```

## vnode
```
本质：是用来描述 DOM 的 JavaScript 对象: 普通元素节点、组件节点等 纯文本 vnode、注释 vnode
优点：1.抽象化利于比对，最小化的dom更新  2.跨平台

普通节点
  const vnode = {
    type: 'button',
    props: { 
      'class': 'btn',
      style: {
        width: '100px',
        height: '50px'
      }
    },
    children: 'click me'
  }

组件节点：
  const CustomComponent = {
    // 在这里定义组件对象
  }
  const vnode = {
    type: CustomComponent, // 类型为当前组件对象
    props: { 
      msg: 'test'
    }
  }
```

```
创建vnode:
app.mount() 时生成 vnode: const vnode = createVNode(rootComponent, rootProps)

createVNode 对 props 做标准化处理、对 vnode 的类型信息编码、创建 vnode 对象，标准化子节点 children 。
function createVNode(type, props = null ,children = null) {
  if (props) {
    // 处理 props 相关逻辑，标准化 class 和 style
  }
  // 对 vnode 类型信息编码
  const shapeFlag = isString(type)
    ? 1 /* ELEMENT */
    : isSuspense(type)
      ? 128 /* SUSPENSE */
      : isTeleport(type)
        ? 64 /* TELEPORT */
        : isObject(type)
          ? 4 /* STATEFUL_COMPONENT */
          : isFunction(type)
            ? 2 /* FUNCTIONAL_COMPONENT */
            : 0
  const vnode = {
    type,
    props,
    shapeFlag,
    // 一些其他属性
  }
  // 标准化子节点，把不同数据类型的 children 转成数组或者文本类型
  normalizeChildren(vnode, children)
  return vnode
}
```

```
渲染 vnode:
app.mount() 中执行 render(vnode, rootContainer)
const render = (vnode, container) => {
  if (vnode == null) {
    // 销毁组件
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    // 创建或者更新组件
    patch(container._vnode || null, vnode, container)
  }
  // 缓存 vnode 节点，表示已经渲染
  container._vnode = vnode
}


patch 函数有两个功能，一个是根据 vnode 挂载 DOM，一个是根据新旧 vnode 更新 DOM
const patch = (n1: oldVNode, n2: newVNode, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
  // 如果存在新旧节点, 且新旧节点类型不同，则销毁旧节点
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, true)
    n1 = null
  }
  const { type, shapeFlag } = n2
  switch (type) {
    case Text:
      // 处理文本节点
      break
    case Comment:
      // 处理注释节点
      break
    case Static:
      // 处理静态节点
      break
    case Fragment:
      // 处理 Fragment 元素
      break
    default:
      if (shapeFlag & 1 /* ELEMENT */) {
        // 处理普通 DOM 元素
        processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
      else if (shapeFlag & 6 /* COMPONENT */) {
        // 处理组件
        processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
      else if (shapeFlag & 64 /* TELEPORT */) {
        // 处理 TELEPORT
      }
      else if (shapeFlag & 128 /* SUSPENSE */) {
        // 处理 SUSPENSE
      }
  }
}
```