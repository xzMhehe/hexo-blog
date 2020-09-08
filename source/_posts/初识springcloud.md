---
title: 初识springcloud
date: 2020-09-02 13:28:39
tags:
- SpringCloud
categories: 
- SpringCloud
---

Spring Cloud 是一套完整的微服务解决方案，基于 Spring Boot 框架，准确的说，它不是一个框架，而是一个大的容器，它将市面上较好的微服务框架集成进来，从而简化了开发者的代码量。


# Spring Cloud 是什么？
Spring Cloud 是一系列框架的有序集合，它利用 Spring Boot 的开发便利性简化了分布式系统的开发，比如服务发现、服务网关、服务路由、链路追踪等。Spring Cloud 并不重复造轮子，而是将市面上开发得比较好的模块集成进去，进行封装，从而减少了各模块的开发成本。换句话说：Spring Cloud 提供了构建分布式系统所需的“全家桶”。

# Spring Cloud 现状
目前，国内使用 Spring Cloud 技术的公司并不多见，不是因为 Spring Cloud 不好，主要原因有以下几点：
- Spring Cloud 中文文档较少，出现问题网上没有太多的解决方案。
- 国内创业型公司技术老大大多是阿里系员工，而阿里系多采用 Dubbo 来构建微服务架构。
- 大型公司基本都有自己的分布式解决方案，而中小型公司的架构很多用不上微服务，所以没有采用 Spring Cloud 的必要性。

但是，微服务架构是一个趋势，而 Spring Cloud 是微服务解决方案的佼佼者.

# Spring Cloud 优缺点
优点
- 集大成者，Spring Cloud 包含了微服务架构的方方面面。
- 约定优于配置，基于注解，没有配置文件。
- 轻量级组件，Spring Cloud 整合的组件大多比较轻量级，且都是各自领域的佼佼者。
- 开发简便，Spring Cloud 对各个组件进行了大量的封装，从而简化了开发。
- 开发灵活，Spring Cloud 的组件都是解耦的，开发人员可以灵活按需选择组件。

缺点
- 项目结构复杂，每一个组件或者每一个服务都需要创建一个项目。
- 部署门槛高，项目部署需要配合 Docker 等容器技术进行集群部署，而要想深入了解 Docker，学习成本高。

Spring Cloud 的优势是显而易见的。学习 Spring Cloud 是一个不错的选择。

![mark](http://image.codingce.com.cn/blog/20200902/133801032.png)




# Spring Cloud 和 Dubbo 对比
Dubbo 只是实现了服务治理，而 Spring Cloud 实现了微服务架构的方方面面，服务治理只是其中的一个方面。下面通过一张图对其进行比较：
![mark](http://image.codingce.com.cn/blog/20200902/134210366.png)

可以看出，Spring Cloud 比较全面，而 Dubbo 由于只实现了服务治理，需要集成其他模块，需要单独引入，增加了学习成本和集成成本。

