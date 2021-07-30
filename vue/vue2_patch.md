<!-- - ## 最初跟组件实例化执行 $mount 挂载跟组件 -->

# vue2 patch.js

- ## 子组件挂载流程

  - vm.$mount()

    - mountComponent

      - updateComponent

        - vm.\_update(vm.\_render())

          - \_render

            - options.render.call(vm, createElement) 生成 vnode
              - 根据组件的 tempalte render 方法，初始化渲染生成 vnode
              - createElement 即是常用的 h 函数
            - createElement: \_render 中的 createElement 方法
              - 内部执行的是 \_createElement 方法

          - \_update
            - patch(vnode)

- \_createElement

  - return new Vnode()
  - createComponent：\_render 中的 createComponent 方法
    - 如果是自定义组件 触发 createComponent 生成组件 vnode
    - 注册一些组件 vnode 钩子
      ```
        const componentVNodeHooks = {
          init() {
            const child = (vnode.componentInstance = createComponentInstanceForVnode(
              vnode,
              activeInstance
            ));
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
          },
          prepatch() {
            updateChildComponent()
          },
          insert() {
            if (!mounted) callHook('mounted')
          },
          destroy() {}
        }
      ```
    - return vnode

- modules hooks

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
      - 触发 vnode destroy 钩子 vnode.data.destroy(vnode)
      - 循环触发各个模块 module 中的 destroy 属性方法
      - 递归触发子组件的上面两个步骤
        - for 循环 vnode.children, 每个子集递归执行销毁钩子 invokeDestroyHook(child)
  - 如果不存在旧的 Vnode 执行 createElm 创建
  - patcVnode 处理新旧 vnode 的 children
    - 如果存在 Vnode 并且 sameVnode(oldVnode, vnode)
      - sameVnode - key 相等 、tag 相等 、data 相等是同一对象 ...

- patchVnode(oldVnode, vnode)

  - oldVnode === vnode
    - 直接 return 不做任何处理，直接复用
  - 触发执行 vnode prepatch 钩子
    - vnode.data.prepatch() ??? 是否正确
      - 执行 updateChildComponent
        - 这是干啥???
  - 触发 update 钩子
    - 循环触发各个 module 中的 update 方法，变更各个属性数据
    - 触发 vnode 中的 update: vnode.data.update()
  - 处理文本节点变更
    - node.setTextContent()
  - 处理新老 vnode 的子集 children 数组： oldVnode.children / vnode.children
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
  - invokeCreateHooks 各个模块中的 create 对应的方法创建各个 module
  - 创建的 dom 节点插入到父元素 dom 上去
    - insert(parentElm, vnode.elm, refElm);
      - nodeOps.insertBefore
      - nodeOps.appendChild

- patch 中的 createComponent 方法
  - 触发实例内部 init 钩子
    - vnode.data.hooks.init()
      - 调用 createComponentInstanceForVnode 生成组件实例
        - const child = createComponentInstanceForVnode
      - 挂载实例
        - child.$mount()
          - 生成当前组件实例的 watcher，绑定的当前的 \_update(\_render())
          - 最终又递归执行子组件的 patch
