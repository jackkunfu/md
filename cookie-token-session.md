# http 是一个无状态协议

## 这一次请求和上一次请求是没有任何关系的，互不认识的，没有关联的。这种无状态的的好处是快速。坏处是假如我们想要把 www.xxx.com/a 和 www.xxx.com/b 关联起来，必须使用某些手段和工具

# cookie + session

## 服务端 接受请求 建立一个会话 seession 返回

## Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]

## 相同的 domain 域中 客户端请求 自动请求头中带有 cookie: value 过去

## cookie 限制，个数：最多 20 个，有的最多 50 个， 大小：4K（4096 字节）左右

## 客户端请求会自动带上 cookie

## 现在大多都是 Session + Cookie，只用 session 或者 cookie 在理论上都可以保持会话状态。可是实际中因为多种原因，一般不会单独使用

## 用 session 只需要在客户端保存一个 id，实际上大量数据都是保存在服务端。如果全部用 cookie，数据量大的时候客户端是没有那么多空间

## 如果只用 cookie 不用 session，那么账户信息全部保存在客户端，一旦被劫持，全部信息都会泄露。并且客户端数据量变大，网络传输的数据量也会变大

# token - uid+time+sign[+固定参数] 是一种服务端无状态的认证方式， 无状态就是服务端并不会保存身份认证相关的数据

## uid: 用户唯一身份标识 time: 当前时间的时间戳 sign: 签名, 使用 hash/encrypt 压缩成定长的十六进制字符串，以防止第三方恶意拼接 固定参数(可选): 将一些常用的固定参数加入到 token 中是为了避免重复查库

## 用户登录，成功后服务器返回 Token 给客户端。

## 客户端收到数据后保存在客户端

## 客户端再次访问服务器，不会自动带上 token，须将 token 放入 请求头 headers 中

## 服务器端采用 filter 过滤器校验。校验成功则返回请求数据，校验失败则返回错误码

## token 可以抵抗 csrf，cookie+session 不行

## JWT (JSON WEB TOKEN)

### 客户端登陆传递信息给服务端，服务端收到后把用户信息加密（token）传给客户端

### 客户端将 token 存放于 localStroage 等容器中

### 客户端每次访问都传递 token，服务端解密 token，就知道这个用户是谁了

### 通过 cpu 加解密，服务端就不需要存储 session 占用存储空间，就很好的解决负载均衡多服务器的问题了

## 分布式集群中使用

### 分布式集群中负载均衡，多服务器的情况下 session 存于某个服务器内存和硬盘中 不是共享的 不好确认当前用户的登录状态，可以将 session 存在一个服务器中解决

### 当一个用户第一次访问被负载均衡代理到后端服务器 A 并登录后，服务器 A 上保留了用户的登录信息；当用户再次发送请求时，根据负载均衡策略可能被代理到后端不同的服务器，例如服务器 B，由于这台服务器 B 没有用户的登录信息，所以导致用户需要重新登录

### 解决方案： https://blog.51cto.com/zhibeiwang/1965018

### Session 保持 - 带上服务器信息 固定到这个服务器处理

#### 每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，达到了 Session 保持的方法。

#### 会话保持看似解决了 Session 同步的问题，但是却带来的一些其它方面的问题：

#### 负载不均衡了：由于使用了 Session 保持，很显然就无法保证负载绝对的均衡。

#### 没有彻底解决问题：如果后端有服务器宕机，那么这台服务器的 Session 丢失，被分配到这台服务请求的用户还是需要重新登录

### Session 复制 （session 复制到其他节点）

### Session 共享 redis 服务器

# token 安全 不需要 session 占用服务器资源 分布式支持方便 不受客户端禁用 cookie 的影响 更好的支持多端支持 rest api

# session 存储于服务器，可以理解为一个状态列表，拥有一个唯一识别符号 sessionId，通常存放于 cookie 中。服务器收到 cookie 后解析出 sessionId，再去 session 列表中查找，才能找到相应 session。依赖 cookie

# cookie 类似一个令牌，装有 sessionId，存储在客户端，浏览器通常会自动添加。

# token 也类似一个令牌，无状态，用户信息都被加密到 token 中，服务器收到 token 后解密就可知道是哪个用户。需要开发者手动添加。

# jwt 只是一个跨域认证的方案

## cookie 设置相关属性
```
Secure：标记为 Secure 的 Cookie 只应通过被HTTPS协议加密过的请求发送给服务端，保护 Cookie 在浏览器和 Web 服务器间的传输过程中不被窃取和篡改
HTTPOnly：设置 HTTPOnly 属性可以防止客户端脚本通过 document.cookie 等方式访问 Cookie，有助于避免 XSS 攻击。
SameSite：SameSite 属性可以让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。
  Strict 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致。
  Lax 允许部分第三方请求携带 Cookie
  None 无论是否跨站都会发送 Cookie
Expires：设置 Cookie 的过期时间
Max-Age：设置在 Cookie 失效之前需要经过的秒数， Expires 和 Max-Age 都存在，Max-Age 优先级更高。
```

## cookie 缺点
```
大小较小（一般4K）、安全性不高（csrf,xss攻击等）、增加请求大小（服务端生成，传输到客户端，每次请求都会带上）
```

