- 导出模块
  - module.exports
  - exports
  - 初始化 module.exports === exports
  - 默认导出的是一个空对象

- module.exports
  - 可以增加默认导出对象的属性
    - module.exports.xx = xxxx
  - 可以改变导出其他对象或基本类型数据
    - module.exports = { xx: xxxx }
    - module.exports = xxx

- exports
  - 指向默认的导出对象
  - 可以给默认导出对象增加属性
    - exports.xx = xxx
  - 直接赋值别的值，指向别的内存地址，不影响默认导出的值
    - exports = null // 最终导出的仍是默认导出的对象

- module.exports 和 exports 同时使用
  - 如果 module.exports 指向新的内存地址
    - exports 的属性操作无效，无法影响新的内存地址数据
    - export 重新赋值
      - 只要不指向 module.exports 指向的对象，都无法影响新的导出对象，无效
  - 如果 module.exports 只是增加属性，不改变默认导出对象指向
    - module.exports 和 exports 同时影响默认导出对象


