---
title: SpringCloud Config 分布式配置
date: 2020-09-27 13:36:26
tags:
- SpringCloud
categories: 
- SpringCloud
---
配置文件与代码解耦
# 简介
在分布式系统中，由于服务数量巨多，为了方便服务配置文件统一管理，实时更新，所以需要分布式配置中心组件。市面上开源的配置中心有很多，BAT每家都出过，360的QConf、淘宝的diamond、百度的disconf都是解决这类问题。国外也有很多开源的配置中心Apache的Apache Commons Configuration、owner、cfg4j等等。在Spring Cloud中，有分布式配置中心组件spring cloud config ，它支持配置服务放在配置服务的内存中（即本地），也支持放在远程Git仓库中。在spring cloud config 组件中，分两个角色，一是config server，二是config client。

# 一个配置中心提供的核心功能
- 提供服务端和客户端支持
- 集中管理各环境的配置文件
- 配置文件修改之后，可以快速的生效
- 可以进行版本管理
- 支持大的并发查询
- 支持各种语言

Spring Cloud Config可以完美的支持以上所有的需求。

Spring Cloud Config项目是一个解决分布式系统的配置管理方案。它包含了Client和Server两个部分，server提供配置文件的存储、以接口的形式将配置文件的内容提供出去，client通过接口获取数据、并依据此数据初始化自己的应用。Spring cloud使用git或svn存放配置文件，默认情况下使用git，我们先以git为例做一套示例。

# 实现
## 服务端
### 项目截图
![mark](http://image.codingce.com.cn/blog/20200927/172155524.png)

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

    <artifactId>springcloud-config-server-3344</artifactId>


    <dependencies>

        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-config-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
            <version>2.1.1.RELEASE</version>
        </dependency>

        <!--spring-boot-starter-web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--actuator完善监控信息-->
        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-actuator -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!--eureka-->
<!--        <dependency>-->
<!--            <groupId>org.springframework.cloud</groupId>-->
<!--            <artifactId>spring-cloud-starter-eureka</artifactId>-->
<!--            <version>1.4.6.RELEASE</version>-->
<!--        </dependency>-->


    </dependencies>
</project>
```

### gitee创建仓库
![mark](http://image.codingce.com.cn/blog/20200927/172302627.png)

### application
```yml
# 开发步骤  导入配置, 编写依赖
server:
  port: 3344

spring:
  application:
    name: springcloud-config-server
    # 连接远程仓库
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/codingce/springcloud-config.git  # 是https的, 不是git

# 通过config-server 可以连接到git 访问其中的资源以及配置  http://localhost:3344/application-dev.yml   http://localhost:3344/application/dev/master
# config-server服务端        gitee地址：https://gitee.com/codingce/springcloud-config.git
```

### 启动项Config_Server_3344
```java
package cn.com.codingce.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer 开启注解
public class Config_Server_3344 {
    public static void main(String[] args) {
        SpringApplication.run(Config_Server_3344.class, args);
    }
}

```

## 客户端
![mark](http://image.codingce.com.cn/blog/20200927/172639378.png)
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

    <artifactId>springcloud-config-client-3355</artifactId>


    <dependencies>

        <!--spring-boot-starter-web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--actuator完善监控信息-->
        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-actuator -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-config -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
            <version>2.1.1.RELEASE</version>
        </dependency>

    </dependencies>
</project>
```
### application.yml
```yml
# 用户级别的配置
spring:
  application:
    name: springcloud-config-client-3355
```
### bootstrap.yml
```yml
# 项目系统级别的配置
spring:
  cloud:
    config:
      uri: http://localhost:3344    # 注意： 必须先启动   3344项目   本地项目 导包 spring-cloud-starter-eureka-server 不然会走 8080
      name: config-client # 需要从git上读取的资源名称, 不需要后缀   
      profile: test
      label: master
```

### ConfigClientController
```java
package cn.com.codingce.springcloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConfigClientController {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${eureka.client.service-url.defaultZone}")
    private String eurekaServer;

    @Value("${server.port}")
    private String port;

    @RequestMapping()
    public String getConfig() {
        return "applicationName:" + applicationName +
                "eurekaServer" + eurekaServer +
                "port" + port;
    }

}
```

项目地址: https://github.com/xzMhehe/codingce-java