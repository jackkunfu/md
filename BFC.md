# BFC

## display: flow-root 属性是 css 新增的属性，专门用来触发 BFC，不干别的

## BFC 的两个功能：

### 父元素包裹住子元素

### 兄弟元素之间划清界限

## 哪些会生成 BFC

### 根元素

### float 属性不为 none

### position 为 absolute 或 fixed

### display 为 inline-block, table-cell, table-caption, flex, inline-flex

### overflow 不为 visible

## 父级包括不了子集

### 浮动

### 子集宽高大于父级

## margin 合并影响

### 父级和第一个子集同时设置 margin-top 父级顶部和子级顶部在一起，没有相差子级得 margin-top 的高度

#### bfc 布局参照都是上一个 bfc 的底部 可以通过改变参照实现 子集 margin-top 的空间展示

##### 可以给父级增加 border-top 子集的 margin-top 就会以父级为参照展示 margin-top 空间

##### 父级使用 padding-top
