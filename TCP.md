# 三次握手

## 客户端发送请求序列号 syn 以及 随机生成一个 seq:random_seq_client

## 服务器接收到 客户端(syn seq) 信息后回复 ack = random_seq_client + 1 以及 服务端 随机生成一个 seq:random_seq_server

## 客户端接收到 服务端(ack seq) 信息后不随机生成了 回复 ack = random_seq_server + 1 以及 seq = ack

# 四次挥手

## client 发送 fin 给 server

## server 收到 fin 回复 ack 关闭连接

## server 发送 fin 给 client

## client 收到 fin 回复 ack

```
（1）客户端处于FIN_WAIT_1状态
（2）服务端收到fin，回复ack后为CLOSE_WAIT状态，发送fin后为LAST_ACK状态
（3）客户端收到fin后为FIN_WAIT_2状态，发送ack后为TIME_WAIT状态
（4）若客户端在一定时间内没有继续收到服务端的fin，则说明正确关闭连接了，否则继续发送ack，若连接关闭，则都为CLOSED状态。
```

# ssl 握手协议

```
（1）客户端发送其支持的算法列表和客户端随机数
（2）服务端返回选择的算法，服务端证书（包含服务端的公钥），服务端随机数
（3）客户端验证证书，提取公钥，生成预主密钥，用服务端公钥加密，发送给问服务端
（4）客户端和服务端用预主密钥和2个随机数计算出加密密钥和mac密钥和初始向量
（5）客户端发送一个针对所有握手信息的mac
（6）服务端发送一个针对所有握手信息的mac

使用随机数是为了预防重放攻击，防止中间人记录一次握手记录，下次通过这个记录模拟和服务端握手
最后2步发送mac是为了查看握手过程是否收到篡改
```
