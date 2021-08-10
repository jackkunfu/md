# XSS - 跨站脚本攻击

```
简单来说，就是攻击者想办法将可执行的代码注入页面
分为持久性和非持久性。持久性就是攻击的代码被存入了数据库，会导致大量用户网页被攻击
  input 框中写入<script>alert(1)</script>，如果前后端没有防御，被存入数据库，每个打开该页面的用户都会被攻击。
```

## 防御

```
1. 转义字符
2. 内容安全策略: CSP (Content Security Policy)
  CSP 本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击
  通常可以通过两种方式来开启 CSP：
    设置 HTTP Header 中的 Content-Security-Policy
    设置 meta 标签的方式 <meta http-equiv=“Content-Security-Policy”>
3. 防止 cookie 被修改，服务端设置 cookie 时，设置属性 httpOnly: true
  设置 httpOnly：true 表示只有 http 协议可以获取 cookie, 通过 js 脚本是读不到该cookie的
```

# CSRF（Cross-site request forgery）：跨站请求伪造, 盗用了你的身份，以你的名义发送恶意请求

```
攻击者构造出一个后端请求地址，诱导用户点击或者通过某些途径自动发起请求。如果用户是在登录状态下的话，后端就以为是用户在操作，从而进行相应的逻辑
form 发起的 POST 请求并不受到浏览器同源策略的限制，因此可以任意地使用其他域的 Cookie 向其他域发送 POST 请求，形成 CSRF 攻击, <script>、<img>、<iframe>、<link>等标签都可以跨域加载资源，而不受同源策略的限制
同源策略
  影响“源”的因素有：host（域名或者 IP 地址）、子域名、端口、协议
  对浏览器来说，DOM、Cookie、XMLHttpRequest 会受到同源策略的限制
  cookie 同源策略会自动带上

假如用户正在登陆银行网页，同时登陆了攻击者的网页，并且银行网页未对 csrf 攻击进行防护。攻击者就可以在网页放一个表单，该表单提交 src 为http://www.bank.com/api/transfer，body为count=1000&to=Tom。倘若是session+cookie，用户打开网页的时候就已经转给Tom1000元了.因为。在 get/post 请求的瞬间，cookie 会被浏览器自动添加到请求头中
```

```
使用 token， 不会被自动带上， 使攻击不能通过服务器过滤
Cookie 设置 SameSite （影响其他域请求验证）
步骤:
  1.登录受信任网站 A，并在本地生成 Cookie。
  2.在不退出登录 A 的情况下，访问危险网站 B。
exmaple:
  正常登录 A 网站 cookie 还在浏览器中 （未正常退出）
  访问了危险网站 B，危险网站中 （可以访问加载外部资源的方法）使用 img，video 标签的 src 属性 设置为请求 A 网站中的某个接口www.A.com/Transfer?toBankId=11&money=1000/XX
  如果某个请求时 get 操作，并且 cookie 自动带过去，A 网站当成合法请求处理，造成信息变更，如果时可操作转账的操作就会有资金的流失
  应对：
    更新操作不用 get 请求
    使用 token 验证用户信息，不使用 cookie 方式验证
```
