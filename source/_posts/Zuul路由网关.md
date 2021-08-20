---
title: Zuul路由网关
date: 2020-09-25 08:39:07
pin: false
toc: false
icons: []
tags: [SpringCloud]
categories: [SpringCloud]
keywords: [SpringCloud]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200921079.jpg
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200921079.jpg
description: SpringCloud
---
# zuul是什么
![](https://camo.githubusercontent.com/f091703491ae368dab9314065b31eab0fc3246ab/68747470733a2f2f692e696d6775722e636f6d2f6d52536f7345702e706e67)
zuul 是netflix开源的一个API Gateway 服务器, 本质上是一个web servlet应用。
Zuul 在云平台上提供动态路由，监控，弹性，安全等边缘服务的框架。Zuul 相当于是设备和 Netflix 流应用的 Web 网站后端所有请求的前门。
zuul的例子可以参考 netflix 在github上的 simple webapp，可以按照netflix 在github wiki 上文档说明来进行使用。

https://github.com/Netflix/zuul/wiki

注意: Zuul服务最终还是会注册到Eureka
提供: 代理 + 路由 + 过滤 三大功能!

![](http://image.codingce.com.cn/blog/20200925/084657361.png)


zuul的核心是一系列的filters, 其作用类比Servlet框架的Filter，或者AOP。zuul把请求路由到用户处理逻辑的过程中，这些filter参与一些过滤处理，比如Authentication，Load Shedding等

![](http://image.codingce.com.cn/blog/20200926/142349524.png)

# zuul 能做什么

Zuul可以通过加载动态过滤机制，从而实现以下各项功能(路由、过滤)：
- 验证与安全保障: 识别面向各类资源的验证要求并拒绝那些与要求不符的请求。
- 审查与监控: 在边缘位置追踪有意义数据及统计结果，从而为我们带来准确的生产状态结论。
- 动态路由: 以动态方式根据需要将请求路由至不同后端集群处。
- 压力测试: 逐渐增加指向集群的负载流量，从而计算性能水平。
- 负载分配: 为每一种负载类型分配对应容量，并弃用超出限定值的请求。
- 静态响应处理: 在边缘位置直接建立部分响应，从而避免其流入内部集群。
- 多区域弹性: 跨越AWS区域进行请求路由，旨在实现ELB使用多样化并保证边缘位置与使用者尽可能接近。




# 过滤器的生命周期

![](https://imgkr2.cn-bj.ufileos.com/9f2bd698-f897-4801-8e1c-e8aa5c29b3c2.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=KzhanZPLIVzv5sz%252BAbRldoMoMgE%253D&Expires=1601351961)


# zuul组件
- zuul-core--zuul核心库，包含编译和执行过滤器的核心功能。
- zuul-simple-webapp--zuul Web应用程序示例，展示了如何使用zuul-core构建应用程序。
- zuul-netflix--lib包，将其他NetflixOSS组件添加到Zuul中，例如使用功能区进去路由请求处理。
- zuul-netflix-webapp--webapp，它将zuul-core和zuul-netflix封装成一个简易的webapp工程包。

# 搭建一个注册Eureka中心的Web服务
## 项目截图
![mark](http://image.codingce.com.cn/blog/20200927/132344573.png)
## pom
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>cn.com.codingce</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>springcloud-zuul-9527</artifactId>

    <dependencies>
        <!--Zuul-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zuul</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--Hystrix依赖-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-hystrix</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>
        <!--Hystrix监控-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-hystrix-dashboard</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--我们需要拿到实体类, 所以要配置api -module-->
        <dependency>
            <groupId>cn.com.codingce</groupId>
            <artifactId>springcloud-api</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--Ribbon-->
        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-ribbon -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-ribbon</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--Eureka  客户端-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-eureka</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>
    </dependencies>
</project>
```

## application.yml配置
```yml
server:
  port: 9527
spring:
  application:
    name: springcloud-zuul


eureka:
  client:
    service-url:
      defaultZone: http://eureka7002.com:7002/eureka/, http://eureka7003.com:7003/eureka/, http://eureka7001.com:7001/eureka/   # 这里必须与服务端一致
  instance:
    instance-id: zuul9527.com
    prefer-ip-address: true

# info 配置
info:
  app.name: codingce-springcloud
  cpmany.name: i.codingce.com.cn
  author: xzMhehe

# 路由网关配置  我们需要设置原路径不能访问, 仅可使用Zuul路由网关配置的  路径    (已在 win10 hosts  里面配置 127.0.0.1	www.codingce.com)
zuul:
  routes:
    mydept.serviceId: springcloud-provider-dept
    mydept.path: /mydept/**
  ignored-services: springcloud-provider-dept # 不能在使用这个路径访问了  ignored-services: "*" 隐藏全部的真实的项目
  prefix: /mxz  # 设置公共的前缀       可有可无  原 http://www.codingce.com:9527/mydept/dept/list    加了之后 http://www.codingce.com:9527/mxz/mydept/dept/list
```


## 启动项ZuulApplication_9527
```java
package cn.com.codingce.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy    //一般用代理 @EnableZuulProxy
public class ZuulApplication_9527 {
    public static void main(String[] args) {
        SpringApplication.run(ZuulApplication_9527.class, args);
    }
}
```

## 运行界面
### 服务端
![mark](http://image.codingce.com.cn/blog/20200927/132717824.png)
### Eureka界面
![mark](http://image.codingce.com.cn/blog/20200927/132946755.png)
### 配置Zuul路由网关后
![mark](http://image.codingce.com.cn/blog/20200927/133029481.png)




>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java