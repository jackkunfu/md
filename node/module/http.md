- http.METHODS
  - 列出了所有支持的 HTTP 方法数组
    ```
      [
        'ACL', 'BIND', 'CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LINK', 'LOCK', 'M-SEARCH', 'MERGE', 'MKACTIVITY', 'MKCALENDAR', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS',
        'PATCH', 'POST', 'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'REBIND', 'REPORT', 'SEARCH', 'SUBSCRIBE', 'TRACE', 'UNBIND', 'UNLINK', 'UNLOCK', 'UNSUBSCRIBE'
      ]
    ```

- http.STATUS_CODES
  - 列出了所有的 HTTP 状态代码及其描述的对象
    ```
      {
        '100': 'Continue', '101': 'Switching Protocols','102': 'Processing',
        '200': 'OK', '201': 'Created','202': 'Accepted','203': 'Non-Authoritative Information','204': 'No Content','205': 'Reset Content','206': 'Partial Content','207': 'Multi-Status','208': 'Already Reported','226': 'IM Used',
        '300': 'Multiple Choices', '301': 'Moved Permanently','302': 'Found','303': 'See Other','304': 'Not Modified','305': 'Use Proxy','307': 'Temporary Redirect','308': 'Permanent Redirect',
        '400': 'Bad Request', '401': 'Unauthorized','402': 'Payment Required','403': 'Forbidden','404': 'Not Found','405': 'Method Not Allowed','406': 'Not Acceptable','407': 'Proxy Authentication Required','408': 'Request Timeout','409': 'Conflict','410': 'Gone','411': 'Length Required','412': 'Precondition Failed','413': 'Payload Too Large','414': 'URI Too Long','415': 'Unsupported Media Type','416': 'Range Not Satisfiable','417': 'Expectation Failed','418': 'I\'m a teapot','421': 'Misdirected Request','422': 'Unprocessable Entity','423': 'Locked','424': 'Failed Dependency','425': 'Unordered Collection','426': 'Upgrade Required','428': 'Precondition Required','429': 'Too Many Requests','431': 'Request Header Fields Too Large','451': 'Unavailable For Legal Reasons',
        '500': 'Internal Server Error', '501': 'Not Implemented','502': 'Bad Gateway','503': 'Service Unavailable','504': 'Gateway Timeout','505': 'HTTP Version Not Supported','506': 'Variant Also Negotiates','507': 'Insufficient Storage','508': 'Loop Detected','509': 'Bandwidth Limit Exceeded','510': 'Not Extended','511': 'Network Authentication Required'
      }
    ```

- http.globalAgent
  - Agent 对象的全局实例，该实例是 http.Agent 类的实例
  - 管理 HTTP 客户端连接的持久性和复用，它是 Node.js HTTP 网络的关键组件
  - 更多查看 http.Agent

- http.createServer()
  - http.Server 类的新实例

- http.request()
  - 发送 HTTP 请求到服务器，并创建 http.ClientRequest 类的实例

- http.get()
  - 类似于 http.request()，但会自动地设置 HTTP 方法为 GET，并自动地调用 req.end()

- http.Agent
  - 该对象会确保对服务器的每个请求进行排队并且单个 socket 被复用
  - 还维护一个 socket 池。 出于性能原因，这是关键

- http.ClientRequest
  - 当 http.request() 或 http.get() 被调用时，会创建 http.ClientRequest 对象
  - 当响应被接收时，则会使用响应（http.IncomingMessage 实例作为参数）来调用 res
  - 返回的响应数据可以通过以下两种方式读取：
    - 可以调用 rea.read() 方法
    - 在 response 事件处理函数中，res.on('data')，可以为 data 事件设置事件监听器，以便可以监听流入的数据

- http.Server
  - 当使用 http.createServer() 创建新的服务器时，通常会实例化并返回此类
  - 实例方法
    - close() 停止服务器不再接受新的连接
    - listen() 启动 HTTP 服务器并监听连接

- http.ServerResponse
  - 由 http.Server 创建，并作为第二个参数传给它触发的 request 事件
    ```
      const server = http.createServer((req, res) => {
        //res 是一个 http.ServerResponse 对象。
      })
    ```
  - 在事件处理函数中总是会调用的方法是 end()，它会关闭响应，当消息完成时则服务器可以将其发送给客户端，必须在每个响应上调用它
  - res.writeHead()
    - 该方法接受 statusCode 作为第一个参数，可选的状态消息和消息头对象，将它们发送给客户端
  - res.statusCode
  - res.statusMessage

- http.IncomingMessage
  - http.IncomingMessage 对象可通过以下方式创建：
    - http.Server，当监听 request 事件时
    - http.ClientRequest，当监听 response 事件时
  - 使用 statusCode 和 statusMessage 方法来访问状态。
  - 使用 headers 方法或 rawHeaders 来访问消息头。
  - 使用 method 方法来访问 HTTP 方法。
  - 使用 httpVersion 方法来访问 HTTP 版本。
  - 使用 url 方法来访问 URL。
  - 使用 socket 方法来访问底层的 socket。
  - http.IncomingMessage 实现了可读流接口，因此数据可以使用流访问。
