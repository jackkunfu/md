<!-- - ## 最初跟组件实例化执行 $mount 挂载跟组件 -->

# vue2 patch.js

- ## 子组件挂载流程

  - vm.$mount()
    - mountComponent
      - updateComponent
        - vm.\_update(vm.\_render())

- vnode hooks

  - const hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

- createPatchFunction: core/vdom/patch.js

  - const cbs = { create: [], update: []}

    - 存储 /web/runtime/modules 下的各个属性的操作的对象
      - attrs.js/class.js/dom-props.js/events.js/style.js/transition.js
        - 都是 return 一个对象 包括 hooks 里的某几个 key 对应的执行方法
          ```
          例子：class.js
          export default {
            create: updateClass, update: updateClass
          }
          ```
      - 循环把所有 modules 里的对应的属性统一 push 到 cbs 对象对应的数组中
    - 后续一些操作 invokeDestroyHook / invokeCreateHook / invokeDestroyHook
      - 是找到 cbs 中对应的钩子函数，循环对应的数组执行
      - 达到触发各个 modules 中各自的创建或者更新函数执行来更新各种属性

  - return function patch() {}

- nodeOps: 常见操作 dom apis

  - web/runtime/node-ops.js
    - createElement: document.createElement
    - 等等

- patch

  - 如果不存在新的 Vnode 执行销毁钩子
    - invokeDestroyHook (vnode)
      - 触发实例内部 destroy 钩子 vnode.data.destroy(vnode)
      - for 循环 vnode.children, 每个子集递归执行销毁钩子 invokeDestroyHook(child)
  - 如果不存在旧的 Vnode 执行 createElm 创建
  - 如果存在 Vnode 并且 sameVnode(oldVnode, vnode) 执行 patchVnode(oldVnode, vnode)
    - sameVnode - key 相等 、tag 相等 、data 相等是同一对象 ...

- patchVnode(oldVnode, vnode)

  - oldVnode === vnode
    - 直接 return 不做任何处理，直接复用
  - 触发执行实例内部 prepatch 钩子
    - vnode.data.prepatch() ??? 是否正确
      - 执行 updateChildComponent
        - 这是干啥???
  - 触发执行组件 update 钩子
    - vnode.data.update()
  - 处理文本节点变更
    - node.setTextContent()
  - 处理新老 vnode 的子集 children： oldVnode.children / vnode.children
    - 新老 vnode 子节点 children 都存在的时候执行 updateChildren 进行 diff 比对更新
      - updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
  - 还干了啥???

- updateChildren diff

  - 准备两组 两个指针 分别指向 vode 的 children 和 oldVnode 的 children
  - 头头 / 尾尾 / 头尾 / 尾头
    - sameVnode 判断 如果一致 递归调用 patchVnode 比较更新
  - 最后判断是否有 key，如果有 key 在剩余的 oldVnode 中找到相同 key 的 vnode
    - sameVnode 判断 如果一致 递归调用 patchVnode 比较更新
  - 不存在 key 或者 !sameVnode 不一致 进行 createElm 直接创建替换
  - 指针变化 循环以上操作 直到某一组指针的头大于尾巴结束 while 循环
  - 判断两个子集是否为空，不为空的做以下处理
    - 新的 vnode 的 chileren 指针之间还有数据 createElm 直接创建追加操作
    - 旧的 oldVnode 的 children 指针之间还有数据 直接删除对应的所有老节点

- createElm

  - 如果可以 createComponent(vnode) 返回 true
    - 直接 return 处理组件的创建挂载
  - 创建对应标签的 dom 节点
    - vnode.elm = nodeOps.createElement(tag, vnode)
  - createChildren 处理子集创建挂载
    - 循环 vnode.children, 递归调用 createElm(child) 把子集挂载到 vnode.elm 上
  - invokeCreateHooks 触发组件 created 钩子
  - 创建的 dom 节点插入到父元素 dom 上去
    - insert(parentElm, vnode.elm, refElm);
      - if (!ismounted) 触发组件 mounted 钩子

- createComponent
  - 触发实例内部 init 钩子
    - vnode.data.hooks.init()
      - 调用 createComponentInstanceForVnode 生成组件实例
        - const child = createComponentInstanceForVnode
      - 挂载实例
        - child.$mount()
          - 生成当前组件实例的 watcher，绑定的当前的 \_update(\_render())
          -
