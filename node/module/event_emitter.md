- events
  - 事件触发器
  ```
    const EventEmitter = require('events')
    const eventEmitter = new EventEmitter()
  ```
  - on
    - 定义事件
    - eventEmitter.on('eventName', function (data1, data2) { // 参数是传递过来的参数 })
  - emit
    - 触发事件
    - eventEmitter.emit('eventName', data1, data2)

- const EventEmitter = require('events')
- const emitter = new EventEmitter()
  - emitter
    - events 实例
  - emitter.addListener()
    - emitter.on() 的别名
    - on 或 addListener 添加监听器时，监听器会被添加到监听器队列中的最后一个，并且最后一个被调用
  - emitter.emit()
  - emitter.eventNames()
    - 返回字符串（表示在当前 EventEmitter 对象上注册的事件）数组：
  - emitter.setMaxListeners()
    - 设置可以添加到 EventEmitter 对象的监听器的最大数量（默认为 10，但可以增加或减少）
  - emitter.getMaxListeners()
    - 获取可以添加到 EventEmitter 对象的监听器的最大数量（默认为 10，但可以使用 setMaxListeners() 进行增加或减少）
  - emitter.listenerCount()
  - emitter.listeners()
  - emitter.off()
  - emitter.on()
  - emitter.once()
  - emitter.prependListener()
    - 类似 on / addListener, 使用 prependListener 增加事件到监听器队列中的的最前面
  - emitter.prependOnceListener()
  - emitter.removeAllListeners()
    - 移除所有监听特定事件的监听器
  - emitter.removeListener()
    - 移除监听器的某个特定类型的某个事件函数
      - removeListener(name, fn)