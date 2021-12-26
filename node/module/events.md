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