---
title: Redis发布订阅
date: 2021-01-11 14:08:31
tags:
- Redis
categories: 
- Redis
---


## Redis 发布订阅


Redis 发布订阅(pub/sub) 是一种消息通信模式: 发布者(pub) 发送消息, 订阅者(sub) 就收消息

Redis 客户端可以订阅任意数量的值

订阅/发布消息图

第一个： 消息发送者 第二个： 频道  第三个 消息接收者
![](https://image.codingce.com.cn/redis-cli.png)

下图展示了频道 channel1 ， 以及订阅这个频道的三个客户端 —— client2 、 client5 和 client1 之间的关系：
![](https://www.runoob.com/wp-content/uploads/2014/11/pubsub1.png)
当有新消息通过 PUBLISH 命令发送给频道 channel1 时， 这个消息就会被发送给订阅它的三个客户端：

![](https://www.runoob.com/wp-content/uploads/2014/11/pubsub2.png)


## 命令
>1	PSUBSCRIBE pattern [pattern ...]
订阅一个或多个符合给定模式的频道。
2	PUBSUB subcommand [argument [argument ...]]
查看订阅与发布系统状态。
3	PUBLISH channel message
将信息发送到指定的频道。
4	PUNSUBSCRIBE [pattern [pattern ...]]
退订所有给定模式的频道。
5	SUBSCRIBE channel [channel ...]
订阅给定的一个或多个频道的信息。
6	UNSUBSCRIBE [channel [channel ...]]
指退订给定的频道。

## 测试

- 接收者
```bash
127.0.0.1:6379> SUBSCRIBE mxz       # 订阅一个频道  mxz
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "mxz"
3) (integer) 1
```
接收消息
```bash
1) "message"
2) "mxz"
3) "Test first"
```

- 发送者
```bash
127.0.0.1:6379> PUBLISH mxz "Test first"
(integer) 1
127.0.0.1:6379> 
```


## 使用场景
- 实时消息系统
- 实时聊天
- 订阅, 关注系统

稍微复杂的场景我们就会使用消息中间件 MQ()

>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java