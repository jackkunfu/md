# 获取元素距离顶部距离

## offsetTop

### 元素存在 transform (translate) 时计算会不太准确，不包括位移距离

### offsetParent 指与位置有关的上级元素

```
// 获取dom元素相对于父级的距离
let top = dom.offSetTop
// 循环获取到顶部的具体
let offParent = dom.offsetParent
top += offParent.offSetTop
while(offParent = offParent.offsetParent){
  top += offParent.offSetTop
}
```

## getBoundingClientRect() // 获取元素相对于当前视图窗口的距离

### 元素存在 transform (translate) 时计算也可以准确计算

```
let top = dom.getBoundingClientRect().top // 获取元素相对于当前视图窗口顶部的距离

top += window.scrollY // 获取元素相对于当前文档顶部的距离
```

# scrollIntoView

## dom.scrollIntoView() // dom 滚动到窗口顶部

# offsetHeight/clientHeight

## 元素的 offsetHeight 是一种元素 CSS 高度的衡量标准，包括元素的边框、内边距和元素的水平滚动条（如果存在且渲染的话），不包含:before 或:after 等伪类元素的高度。

## clientHeight：包含内边距，但不包括水平滚动条、边框和外边距。

## clientHeight 可以通过 height + padding - 水平滚动条高度 (如果存在)来计算.

## 所以可以这样说: clientHeight+滚动条高度+边框 = offsetHeight
