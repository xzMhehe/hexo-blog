---
title: 初始SpringCloud
date: 2020-09-01 22:53:56
tags:
- SpringCloud
categories: 
- SpringCloud
---

# 微服务架构的4个核心问题
- 服务很多, 客户端该怎么访问?
- 这么多服务, 服务之间
- 这么多服务, 如何治理
- 服务挂了怎么办

# 解决方案
SpringCloud生态 SpringBoot

- SpringCloud NetFlix   一站式解决方案  
api网关 zuul组件
Feign ---HttpClinet ---Http通信方式同步阻塞
服务注册与发现: Eureka
熔断机制: Hystrix

- Apache Dubbo Zookeeper    半自动需要整合别人的
api网关 没有 找第三方组件, 或者自己实现
Dubbo 
Zookeeper
没有借助 Hystrix

Dubbo 这个方案并不完善~
- SpringCloud Alibaba   一站式解决方案  更简单

新概念  服务网格~Serve Mesh
istio

万变不离其宗
- API网关
- HTTP RPC
- 注册和发现
- 熔断机制

网络不可靠! 


常见面试题
- 什么是微服务
- 微服务之间是如何建立通信的
- SpringCloud和Dubbp有哪些区别
- SpringCloud和SpringBoot请谈谈你对他们呢得理解
- 什么服务熔断? 什么是服务降级
- 微服务得优缺点是什么? 说下你在项目开发中遇到的坑
- 你所知道的微服务技术有哪些? 列举一二
- eureka和zookeeper都可以实现提供服务注册与发现功能, 请说明两个的区别?

