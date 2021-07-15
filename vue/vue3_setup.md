## instance / setup

- 生成组件实例以及处理 setup 方法是在首次渲染时 mountComponent 时开始的

```
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

- createComponentInstance 创建组件实例 --- 直接生成一个 instance 对象

```
function createComponentInstance () {
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    ctx: EMPTY_OBJ, data: EMPTY_OBJ, props: EMPTY_OBJ, attrs: EMPTY_OBJ, render: null, app: null, ...
  }
  // 初始化渲染上下文
  instance.ctx = { _: instance }
  // 初始化根组件指针
  instance.root = parent ? parent.root : instance
  // 初始化派发事件方法
  instance.emit = emit.bind(null, instance)
  return instance
}
```

- setupComponent 设置组件实例

  - vue3 把不同的数据模块放在了不同的属性里面（setupState/data/props/ctx），代理到实例的 ctx 中方便访问
  - 数据访问的代理设置 getCurrentInstance 可以获取当前组件实例，可以使用实例的 ctx 来获取属性数据

    - 设置和访问属性时优先级 setupState(setup 返回对象时的数据对象) > data 数据 > props 数据 > ctx 自身属性

  - 处理 setup 函数返回
    - 如果返回方法，返回结果赋值给当前实例的 render 属性
      - 如果返回的是函数，另外也有配置 render 属性渲染函数，setup 返回的渲染函数优先级较高
    - 如果返回对象，返回结果赋值给当前实例的 setupState 属性，模板来访问

```
各个模块属性代理到 组件实例 ctx 属性流程
handler: {
  get () {},
  set () {}
}

get (key) {
  let typeCache = {}
  if (setupState[key]) return setupState[key]
  else if (data[key]) return data[key]
  else if (props[key]) return props[key]
  else if (ctx[key]) return ctx[key]
}
```
