---
title: Eureka
date: 2020-09-08 12:15:44
tags:
- SpringCloud
categories: 
- SpringCloud
---

Eureka[juˈriːkə]

## 简介
Eureka是Netflix服务发现的服务端与客户端，Eureka提供服务注册以及服务发现的能力，当是Eureka Server时(注册中心)，所有的客户端会向其注册，当是Eureka Client时，可以从注册中心获取对应的服务信息，或者是向Eureka Server将自己作为实例注册进去，每个Eureka不仅仅是一个服务端同时还是一个客户端。

## 注册中心
当Eureka想要成为注册中心时，必须将注册中心的服务地址指向自己，同时禁用服务检索的功能。Eureka是一个高可用的组件，它没有后端缓存，每一个实例注册之后需要向注册中心发送心跳来检测服务的可用性，注册中心不处理请求的转发，只是记录每个实例注册进来的信息。

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108211256796.png)

## 项目搭建
- 导入依赖
- 编写配置文件
- 开启这个功能 @EnableXXXXXX
- 配置类

## Eureka服务
### pom
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

    <artifactId>springcloud-eureka-7001</artifactId>


    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-eureka-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-eureka-server</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
    </dependencies>
</project>
```
### EurekaServer
```java
package cn.com.codingce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer //EnableEurekaServer    服务端启动类
public class EurekaServer {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServer.class, args);
    }
}
```

### application.yml
```yml
server:
  port: 7001

## Eureka配置
eureka:
  instance:
    hostname: localhost #Eureka服务端实例的名字
  client:
    register-with-eureka: false ## 表示是否向eureka注册中心注册自己
    fetch-registry: false ## 表示如果  false 则表示自己为注册中心
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
```

## Eureka 的自我保护模式详解
访问Eureka主页时，如果看到这样一段大红色的句子：
>EMERGENCY! EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP WHEN THEY’RE NOT. RENEWALS ARE LESSER THAN THRESHOLD AND HENCE THE INSTANCES ARE NOT BEING EXPIRED JUST TO BE SAFE.

（那么就表明着Eureka的 自我保护模式(self-preservation mode) 被启动了，当 Eureka Server 节点在短时间内丢失了过多实例的连接时（比如网络故障或频繁的启动关闭客户端），那么这个节点就会进入自我保护模式，一旦进入到该模式，Eureka server 就会保护服务注册表中的信息，不再删除服务注册表中的数据（即不会注销任何微服务），当网络故障恢复后，该 Ereaka Server 节点就会自动退出自我保护模式）

- 在自我保护模式中, EurekaServe 会保护注册表中的信息, 不再注销任何服务实例. 当他重新收到心跳数重新恢复到阈值以上时, 该EurekaServe节点就会自动推出自我保护模式. 它的哲学就是宁可保存错误的服务注册信息, 也不盲目注销任何可能健康的实例, 一句话：好死不如赖活着

- 综上, 自我保护模式中, 自我保护模式是一种应对网络异常安全保护措施, 它的架构哲学是宁可同时保留所有微服务(健康的服务和不健康的服务都会保留), 也不盲目注销任何健康的服务. 使用自我保护模式, 可以让Eureka集群更加健壮和稳定.

在SpringCloud中, 可以使用eureka.serve.enable-self-preservation = false 禁用自我保护模式
[不推荐关闭自我保护机制]


默认情况下，如果 Ereaka Server 在一段时间内没有接受到某个微服务示例的心跳，便会注销该实例（默认90秒），而一旦进入自我保护模式，那么即使你关闭了指定实例，仍然会发现该 Ereaka Server 的注册实例中会存在被关闭的实例信息，如果你对该实例做了负载均衡，那么仅关闭了其中一个实例，则通过网关调用接口api时很可能会发生如下异常：

```json
{
"timestamp": 1507707671780,
"status": 500,
"error": "Internal Server Error",
"exception": "com.netflix.zuul.exception.ZuulException",
"message": "GENERAL"
}
```

### 解决这种情况的方法主要有几种方式：

- 等待 Eureka Server 自动恢复
正常的情况下，等待网络恢复（或者没有频繁的启动与关闭实例）后，等待一段时间 Eureka Server 会自动关闭自我保护模式，但是如果它迟迟没有关闭该模式，那么便可以尝试手动关闭，如下。

- 重启 Eureka Server
通常而言，PRD 环境建议对 Eureka Server 做负载均衡，这样在依次关闭并开启 Eureka Server 后，无效的实例会被清除，并且不会对正常的使用照成影响。

- 关闭 Eureka 的自我保护模式
在yml配置文件中新增如下配置：
```yml
eureka:
    server:
        enable-self-preservation: false
        eviction-interval-timer-in-ms: 4000 ## This is not required
```

## 对比Zookeeper
回顾CAP原则
RDBMS(Mysql、Oracle、sqlServer) ==>ACID
NoSQL(redis、 mongdb)==>CAP

### ACID是什么
- A(Atomicity)原子性：事务里面的所有操作，要么全部做完，要么都不做，只要有一个失败，整个事务都失败，需要回滚
- C(Consistency)一致性：以转账案例为例，假设有五个账户，每个账户余额是100元，那么五个账户总额是500元，如果在这个5个账户之间同时发生多个转账，无论并发多少个，比如在A与B账户之间转账5元，在C与D账户之间转账10元，在B与E之间转账15元，五个账户总额也应该还是500元，这就是保护性和不变性
- I(Isolation)隔离性：并发的事务之间互不影响
- D(Durability)持久性：事务一旦提交，数据将永久保存在数据库上　　

### CAP是什么
- C(Consistency)强一致性
- A(Availability)可用性
- P(Partition tolerance) 分区容错性

CAP的三进二 CA AP CP

CAP理论核心
- 一个分布式系统不可能同时很好的满足一致性、可用性和分区容错性三个要求
- 根据CAP原理, 将NOSQL数据库分成了满足CA原则， 满足CP原则满足AP原则三大类
    - CA：单点集群, 满足一致性, 可用性的系统, 通常可扩展性差
    - CP: 满足一致性, 分区容错性的系统, 通常性能不是特别高
    - AP：满足可用性，分区容错性的系统，通常可能对一致性要求低一点

作为服务注册中心, Eureka比Zookeeper好在哪里
著名的CAP理论指出, 一个分布式系统不可能同时满足C(一致性)A(可用性)P(容错性)
由于分区容错性P在分布式系统中是必须要保证的, 因此我们只能在A和C之前进行权衡
- Zookeeper保证的是CP
- Eureka保证的是AP


#### Zookeeper保证的是CP
当向注册中心查询服务列表时，我们可以容忍注册中心返回的是几分钟以前的信息，但不能就收服务直接 down 掉不可用。也就是说服务注册的可用性要高于一致性
当时 zk 会出现这么一个情况，当 mastr 节点因网络故障和其他节点失去联系时，剩余节点会重新进行选举。问题在于，选举时间比较长，30s~120s，且选举期间，整个 zk 是不可用的。这就导致了在选举期间，注册服务的瘫痪。在云部署的环境下，因网络问题使 zk 集群时区 master 节点是交大概率会发生的事情，虽然服务能够最终恢复，但是漫长的选举时间导致的注册服务长期不可用是不能容忍的。
#### Eureka保证的是AP
Eureka 明白这一点，因此在设计时，就优先保证可用性. **Eureka 各个节点是平等的** ，几个节点挂掉不会影响正常工作，只要有一台 Eureka 存在，就可以保证注册服务可用（保证可用性），只不过查到的信息可能不是最新的（不保证强一致性）。除此之外，Eureka 还有一种自我保护机制，如果在 15 分钟内超过 85% 的节点没有正常的心跳，那么 Eureka 就会认为客户端与注册中心出现了故障，此时会出现以下几种情况：
- Eureka 不再从注册列表中移出因长时间没收到心跳而应该过期的服务
- Eureka 仍然能够接受新服务的注册和查询要求，但是不会被同步到其他节点上（即保证当前节点依然可用）
- 当网络稳定时，当前实例新的注册信息会被同步到其他节点中

结论
Eureka 可以很好的应对因网络故障导致部分节点失去联系的情况，而不会像 zookeeper 那样使整个注册服务瘫痪

## 服务注册集群搭建
### springcloud-eureka-7002
#### pom
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

    <artifactId>springcloud-eureka-7002</artifactId>

    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-eureka-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-eureka-server</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
    </dependencies>
</project>
```

#### application.yml
```yml
server:
  port: 7002

## Eureka配置
eureka:
  instance:
    hostname: eureka7002.com #Eureka服务端实例的名字
  client:
    register-with-eureka: false ## 表示是否向eureka注册中心注册自己
    fetch-registry: false ## 表示如果  false 则表示自己为注册中心
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/, http://eureka7003.com:7003/eureka/

```

#### 启动类
```java
package cn.com.codingce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer //EnableEurekaServer    服务端启动类
public class EurekaServer_7003 {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServer_7003.class, args);
    }
}
```

### springcloud-eureka-7003
#### pom
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

    <artifactId>springcloud-eureka-7003</artifactId>

    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-eureka-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-eureka-server</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
    </dependencies>
</project>
```

#### application.yml
```yml
server:
  port: 7003

## Eureka配置
server:
  port: 7003

## Eureka配置
eureka:
  instance:
    hostname: eureka7003.com #Eureka服务端实例的名字
  client:
    register-with-eureka: false ## 表示是否向eureka注册中心注册自己
    fetch-registry: false ## 表示如果  false 则表示自己为注册中心
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/, http://eureka7002.com:7002/eureka/
```

#### 启动类
```java
package cn.com.codingce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer //EnableEurekaServer    服务端启动类
public class EurekaServer_7003 {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServer_7003.class, args);
    }
}
```
