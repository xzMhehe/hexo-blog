---
title: RESTful调用和 RPC调用有什么区别
pin: false
toc: false
icons: []
tags:
  - 笔试
categories:
  - 笔试
keywords:
  - 笔试
description: 美团笔试题系列2021
abbrlink: cc3bd09
date: 2021-04-21 21:37:22
headimg:
thumbnail:
---

## 题目描述
RESTful调用和 RPC调用有什么区别？
如果让你设计一个RPC服务治理框架你会设计那些模块？
是否了解过Service Mesh，如果了解Service Mesh是用来解决什么问题的？

## 回答
### 第一问 RESTful调用和 RPC调用有什么区别？
- 1、RESTful是一种软件架构风格，用于约束客户端和服务器交互，满足这些约束条件和原则的应用程序或设计就是 RESTful。比如HTTP协议使用同一个URL地址，通过GET，POST，PUT，DELETE等方式实现查询、提交、删除数据。RPC是远程过程调用，是用于解决分布式系统服务间调用的一种方式。RPC采用客户端与服务端模式，双方通过约定的接口（常见为通过IDL定义或者是代码定义）以类似本地方法调用的方式来进行交互，客户端根据约定传输调用函数+参数给服务端（一般是网络传输TCP/UDP），服务端处理完按照约定将返回值返回给客户端。

- 重点为RESTful HTTP的约束风格，RPC调用模型。

### 第二问 如果让你设计一个RPC服务治理框架你会设计那些模块？

- 1、可分为两大部分RPC + 服务治理
RPC部分 = IDL  +客户端/服务端实现层  +协议层 +数据传输层
服务治理 =服务管理（注册中心） +服务监控 +服务容灾 +服务鉴权

### 第三问 是否了解过Service Mesh，如果了解Service Mesh是用来解决什么问题的？
- 2、 Service Mesh为了解决传统微服务框架"胖客户端"方式，引入的如下问题：
与业务无关的服务治理逻辑与业务代码强耦合，框架、SDK的升级与业务代码强绑定，多语言的胖客户端支持起来性价比极低。