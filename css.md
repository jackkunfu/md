# 特点 - 三大特性：继承 优先级 层叠

```
子类元素继承父类的样式、不同类别样式的权重比较、当数量相同时，通过层叠(后者覆盖前者)的样式。
```

- 优先级

  - 同一级别中后写的会覆盖先写的样式
  - 不同级别,依次为： !important > 行内样式 > ID 选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性
  - css 选择器使用强烈建议采用低权重原则，利于充分发挥 css 的继承性，复用性，模块化、组件化。

- 逻辑像素
  - 逻辑像素长度 px = 物理像素长度 \* dpr
  - dpr 为 2 的屏幕 一个逻辑像素点占据 2 \* 2 = 4 个物理像素

# BFC

- display: flow-root 属性是 css 新增的属性，专门用来触发 BFC，不干别的

- BFC 的两个功能：

  - 父元素包裹住子元素
  - 兄弟元素之间划清界限

- 哪些会生成 BFC

  - 根元素
  - float 属性不为 none
  - position 为 absolute 或 fixed
  - display 为 inline-block, table-cell, table-caption, flex, inline-flex
  - overflow 不为 visible

- 形成问题

  - 同一 BFC 区域中的区块之间会发生 margin 重叠
    - 给 margin 重叠的区域都触发 BFC，即可不重叠
    - 不同 BFC 区域是独立的渲染空间
  - 浮动 float 属性不为 none 的元素，非 BFC 区域的父级包括不了子集为浮动的元素
    - 计算 BFC 的高度时，浮动元素也参与计算
    - 给父级元素设置属性触发 BFC 即可包括浮动元素的高度

- margin 合并影响

  - 父级和第一个子集同时设置 margin-top 父级顶部和子级顶部在一起，没有相差子级得 margin-top 的高度
  - bfc 布局参照都是上一个 bfc 的底部 可以通过改变参照实现 子集 margin-top 的空间展示
  - 可以给父级增加 border-top 子集的 margin-top 就会以父级为参照展示 margin-top 空间
  - 父级使用 padding-top

- 语义化标签

  - section / article ...
  - 强 SEO 需求（搜索引擎会通过语义化标签增强文章的 SEO 搜索）
  - 需要支持屏幕阅读器（屏幕阅读器是根据标签理解语义和段落的）
  - 视觉呈现重要程度较低的程序(色彩搭配、 元素构成、文字排版应用、留白技巧等方面的要求比较低)
  - 作用：
    - 便于机器和人类阅读
    - 便于搜索引擎搜索
    - 自然语境的补充
    - 结构化文档的分级
    - 支持屏读软件
    - 根据屏幕可以自动生成目录

- 元素隐藏
  - display:none/visibility:hidden/opacity:0
  - 三者区别：
    - display:none 不占据空间会引发回流+重绘 visibility:hidden/opacity:0 依然占据空间，只会触发重绘
    - opacity:0 事件依然有效 display:none / visibility:hidden 事件无效
    - visibility:hidden 子集元素可以继承，子集元素可以更改本身 visibility:visible 使子集自身展示 display:none/opacity:0 子集无法继承，无法设置使子集本身展示
    - ？ transition 动画改变 display 无效 改变 opacity/visibility 有效 ？
