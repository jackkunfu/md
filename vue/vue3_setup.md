## instance / setup

```
生成组件实例以及处理 setup 方法是在首次渲染时 mountComponent 时开始的

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
createComponentInstance 创建组件实例  ---  直接生成一个 instance 对象

function createComponentInstance () {
  return {
    ctx: null, render: null, app: null
  }
}

```

```
setupComponent 设置组件实例
  数据访问的代理设置 getCurrentInstance 可以获取当前组件实例，可以使用实例的 ctx 来获取属性数据
    不同模块数据 setupState  data  props  ctx 代理到 instance.ctx 上便于访问

  处理 setup 函数返回
    如果返回方法，返回结果赋值给当前实例的 render 属性
      如果返回的是函数，另外也有配置 render 属性渲染函数，setup 返回的渲染函数优先级较高
    如果返回对象，返回结果赋值给当前实例的 setupState 属性

```

```
vue3 组件实例 ctx 对象  /   setup 函数中的 setupContext 上下文对象
```
