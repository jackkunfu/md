## vue2 compiler

- 把组件模板 template 转换成组件渲染函数 render

  - 渲染函数 render 用来生成当前组件的虚拟 dom vnode

- entry-runtime-with-compilier 中改写 $mount 增加渲染函数 render 相关判断处理

  - 保存原本逻辑
  - 增加 render 处理
    - 如果 !options.render, 增加 complier 把 template 字符串编译成渲染函数
  - 最终组件或者子组件执行 $mount 的时候，利用对应的 render 渲染函数生成 vnode

- createCompilerCreator(template)

  - const ast = parse(template.trim())
    - parse 解析模板字符串为 ast 抽象语法树对象
  - optimize(ast, options)
    - 优化 ast
  - generate(ast)
    - 根据新的 ast 生成代码字符串
    - 代码字符串生成 render 渲染函数

- parse(template)

  - parseHTML(template)

- optimize

- generate
