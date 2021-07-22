## keep-alive

```
keep-alive 原理：
  主要是把符合缓存的页面 vnode 对象存储到 this.cahce 里
  当符合条件再次展示的时候，cache 中有得直接渲染当前 vnode 实例渲染展示
  之后执行组件的 activated 生命周期钩子函数
```

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

- computed 缓存
  - computed watcher 初始化时，带有 lazy: false 的属性
  - 内部相关响应式对象属性和 computed watcher 相互依赖收集
  - 当相关的属性字段更新时，key 中的 subs watcher 数组中的所有 watcher 遍历执行
    - 如果 watcher 带有 dirty 属性，把 dirty 属性设置为 true，dirty 为 ture 时，才会执行到 watcher.evaluate()
      - evaluate: 重新执行 watch 的 getter 方法（重新计算） / 再把 dirty 设置为 false
  - updata 的时候 判断如果 存在 lazy 属性 则 把 watcher.dirty = true
  -

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

普通元素节点
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
    type, // 具体的元素名称或者组件对象
    props,
    shapeFlag, // 不同的 shapeFlag 对应不同的 vnode 节点类型
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
```

## patch 渲染

```
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

## patch 初次渲染创建

```
// 初始对比传入 App 组件是个组件 vnode  进入 default 中的 processComponent
const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  if (n1 == null) { // 首次旧的虚拟 dom 不存在，直接执行挂载组件 mountComponent
    mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
  } else { // 旧虚拟 dom 存在，说明需要更新组件，执行 updateComponent
    updateComponent(n1, n2, parentComponent, optimized)
  }
}
```

```
mountComponent: 处理渲染组件节点 vnode, 创建组件实例、设置组件实例、设置并运行带副作用的渲染函数。
// 首次创建挂载组件
const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  // 创建组件实例
  const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense))
  // 设置组件实例
  setupComponent(instance)
  // 设置并运行带副作用的渲染函数
  setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized)
}
```

```
副作用函数
这里你可以简单地理解为，当组件的数据发生变化时，effect 函数包裹的内部渲染函数 componentEffect 会重新执行一遍，从而达到重新渲染组件的目的。
渲染组件生成 subTree、把 subTree 挂载到 container 中。
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  // 创建响应式的副作用渲染函数
  instance.update = effect(function componentEffect() {
    if (!instance.isMounted) {
      // 渲染组件生成子树 vnode
      const subTree = (instance.subTree = renderComponentRoot(instance))
      // 把子树 vnode 挂载到 container 中
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)
      // 保留渲染生成的子树根 DOM 节点
      initialVNode.el = subTree.el
      instance.isMounted = true
    } else {
      // 更新组件
    }
  }, prodEffectOptions)
}
```

```
组件 vnode 与 子树 subtree vnode
组件本身的 vnode 节点是组件 vnode，本身节点的 vnode
组件渲染生成的组件内部的整个 vnode 成为 subtree vnode，组件内部整个组件树结构对应的 vnode
例子：index.vue 中使用 <hello></hello>, hello.vue: 内容 <div>Hello World</div>
  hello 组件这个节点本身的 vnode 是 组件vnode：{ type: hello, prop: ..., shapeflag: ... }
  对应的 subtree vnode : {
    type: 'div', props: {}, children: 'Hello World'
  }
```

```
setupRenderEffect 中生成 subtree 之后，开始递归调用 patch 对整个 subtree vnode 进行打补丁渲染
subtree vnode 属于组件内部的整个 vnode 对象，一般由元素节点包裹，patch 处理渲染普通元素节点就会使用到处理普通 DOM 元素的 processElement 函数
const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  isSVG = isSVG || n2.type === 'svg'
  if (n1 == null) { //挂载元素节点
    mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
  } else { //更新元素节点
    patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized)
  }
}
```

```
mountElement：处理渲染普通元素节点 vnode 创建 DOM 元素节点、处理 props、处理 children、挂载 DOM 元素到 container 上。
const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let el
  const { type, props, shapeFlag } = vnode
  // 创建 DOM 元素节点
  el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is)
  if (props) {
    // 处理 props，比如 class、style、event 等属性
    for (const key in props) {
      if (!isReservedProp(key)) {
        hostPatchProp(el, key, null, props[key], isSVG)
      }
    }
  }
  if (shapeFlag & 8 /* TEXT_CHILDREN */) {
    // 处理子节点是纯文本的情况
    hostSetElementText(el, vnode.children)
  } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
    // 处理子节点是数组的情况
    mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', optimized || !!vnode.dynamicChildren)
  }
  // 把创建的 DOM 元素节点挂载到 container 上
  hostInsert(el, container, anchor)
}
```

```
mountChildren：遍历 children 获取到每一个 child，然后递归执行 patch 方法挂载每一个 child
  从组件背部顶层 mountElement 创建 DOM 元素节点、处理 props、处理 children、挂载 DOM 元素到 container 上之后，处理子集节点 mountChildren
const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, start = 0) => {
  for (let i = start; i < children.length; i++) {
    // 预处理 child
    const child = (children[i] = optimized
      ? cloneIfMounted(children[i])
      : normalizeVNode(children[i]))
    // 递归 patch 挂载 child
    patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
  }
}

通过递归 patch 这种深度优先遍历树的方式，我们就可以构造每层级 vnode 对应的 dom 节点，最终构造出完整的 DOM 树，完成组件的渲染。
处理完所有子节点后，最后通过 hostInsert 方法把创建的 DOM 元素节点挂载到 container 上
```

## patch diff 对比更新 组件级别

```
更新组件 vnode 节点、渲染新的子树 vnode、根据新旧子树 vnode 执行 patch 逻辑
patch 中遇到组件执行 processComponent 操作， processComponent 中执行 updateComponent
```

```
const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  if (n1 == null) {
    // 挂载组件
  } else {
    updateComponent(n1, n2, parentComponent, optimized)
  }
}
const updateComponent = (n1, n2, parentComponent, optimized) => {
  const instance = (n2.component = n1.component)
  // 根据新旧子组件 vnode 判断是否需要更新子组件
  if (shouldUpdateComponent(n1, n2, parentComponent, optimized)) {
    // 新的子组件 vnode 赋值给 instance.next
    instance.next = n2
    // 子组件也可能因为数据变化被添加到更新队列里了，移除它们防止对一个子组件重复更新
    invalidateJob(instance.update)
    // 执行子组件的副作用渲染函数
    instance.update()
  } else {
    // 不需要更新，只复制属性
    n2.component = n1.component
    n2.el = n1.el
  }
}
```

```
updateComponent 中根据新旧子组件 vnode 来判断是否需要更新子组件。
shouldUpdateComponent 函数的内部，通过检测和对比组件 vnode 中的 props、chidren、dirs、transiton 等属性，来决定子组件是否需要更新
之后执行 invalidateJob（instance.update）避免子组件由于自身数据变化导致的重复更新
然后又执行了子组件的副作用渲染函数 instance.update 来主动触发子组件的更新
```

```
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  // 创建响应式的副作用渲染函数
  instance.update = effect(function componentEffect() {
    if (!instance.isMounted) {
      // 渲染组件生成子树 vnode
      const subTree = (instance.subTree = renderComponentRoot(instance))
      // 把子树 vnode 挂载到 container 中
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)
      // 保留渲染生成的子树根 DOM 节点
      initialVNode.el = subTree.el
      instance.isMounted = true
    } else {
      // 更新组件
      let { next, vnode } = instance
      // next 表示新的组件 vnode
      if (next) {
        // 更新组件 vnode 节点信息
        updateComponentPreRender(instance, next, optimized)
      } else {
        next = vnode
      }
      // 渲染新的子树 vnode
      const nextTree = renderComponentRoot(instance)
      // 缓存旧的子树 vnode
      const prevTree = instance.subTree
      // 更新子树 vnode
      instance.subTree = nextTree
      // 组件更新核心逻辑，根据新旧子树 vnode 做 patch
      patch(prevTree, nextTree,
        // 如果在 teleport 组件中父节点可能已经改变，所以容器直接找旧树 DOM 元素的父节点
        hostParentNode(prevTree.el),
        // 参考节点在 fragment 的情况可能改变，所以直接找旧树 DOM 元素的下一个节点
        getNextHostNode(prevTree),
        instance,
        parentSuspense,
        isSVG)
      // 缓存更新后的 DOM 节点
      next.el = nextTree.el
    }
  }, prodEffectOptions)
}
```

## patch diff 对比更新 元素级别

```
patch 处理普通元素时走 processElement 方法，更新元素的的时候执行 patchElement: 更新元素的 props 和更新子节点
```

```
const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, optimized) => {
  const el = (n2.el = n1.el)
  const oldProps = (n1 && n1.props) || EMPTY_OBJ
  const newProps = n2.props || EMPTY_OBJ
  // 更新 props
  patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG)
  const areChildrenSVG = isSVG && n2.type !== 'foreignObject'
  // 更新子节点
  patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG)
}
```

```
patchProps 函数就是在更新 DOM 节点的 class、style、event 以及其它的一些 DOM 属性
```

```
const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized = false) => {
  const c1 = n1 && n1.children
  const prevShapeFlag = n1 ? n1.shapeFlag : 0
  const c2 = n2.children
  const { shapeFlag } = n2
  // 子节点有 3 种可能情况：文本、数组、空
  if (shapeFlag & 8 /* TEXT_CHILDREN */) {
    if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
      // 数组 -> 文本，则删除之前的子节点
      unmountChildren(c1, parentComponent, parentSuspense)
    }
    if (c2 !== c1) {
      // 文本对比不同，则替换为新文本
      hostSetElementText(container, c2)
    }
  }
  else {
    if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
      // 之前的子节点是数组
      if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        // 新的子节点仍然是数组，则做完整地 diff
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
      else {
        // 数组 -> 空，则仅仅删除之前的子节点
        unmountChildren(c1, parentComponent, parentSuspense, true)
      }
    }
    else {
      // 之前的子节点是文本节点或者为空
      // 新的子节点是数组或者为空
      if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
        // 如果之前子节点是文本，则把它清空
        hostSetElementText(container, '')
      }
      if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        // 如果新的子节点是数组，则挂载新子节点
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
    }
  }
}
```
