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
  - emitter.addListener()
    - emitter.on() 的别名
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
  - emitter.prependOnceListener()
  - emitter.removeAllListeners()
  - emitter.removeListener()