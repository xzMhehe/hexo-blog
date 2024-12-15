---
title: 【OpenFeign】OpenFeign 简介和使用以及对比 Feign
date: 2024-12-14 14:46:53
tags:
- SpringCloud
categories: 
- SpringCloud
---
# 一、简介
官网：https://spring.io/projects/spring-cloud-openfeign

文档：https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/

配置：https://docs.spring.io/spring-cloud-openfeign/docs/current/reference/html/appendix.html

OpenFeign是一个显示声明式的WebService客户端。使用OpenFeign能让编写Web Service客户端更加简单。使用时只需定义服务接口，然后在上面添加注解。OpenFeign也支持可拔插式的编码和解码器。spring cloud对feign进行了封装，使其支持MVC注解和HttpMessageConverts。和eureka（服务注册中心）和ribbon组合可以实现负载均衡。在Spring Cloud中使用OpenFeign，可以做到使用HTTP请求访问远程服务，就像调用本地方法一样的，开发者完全感知不到这是在调用远程方法，更感知不到在访问HTTP请求，非常的方便。

OpenFeign 具有负载均衡功能，其可以对指定的微服务采用负载均衡方式进行消费、访问。之前老版本 Spring Cloud 所集成的 OpenFeign 默认采用了 Ribbon 负载均衡器。但由于Netflix 已不再维护 Ribbon，所以从 Spring Cloud 2021.x 开始集成的 OpenFeign 中已彻底丢弃Ribbon，而是采用 Spring Cloud 自行研发的 Spring Cloud Loadbalancer 作为负载均衡器。

# 二、使用
环境：

>JDK：17
Spring Boot：3.3.4


## 创建父工程

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>cn.com.codingce</groupId>
    <artifactId>open-feign-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>open-feign-demo</name>
    <packaging>pom</packaging>
    <description>open-feign-demo 后端码匠</description>

    <modules>
        <module>order-client</module>
        <module>order-service</module>
    </modules>

    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.3</spring-cloud.version>
        <spring-cloud-alibaba.version>2023.0.1.2</spring-cloud-alibaba.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

## 创建order-service模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>cn.com.codingce</groupId>
        <artifactId>open-feign-demo</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>order-service</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>order-service</name>
    <description>order-service 后端码匠</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

</project>
```

配置 application.yml

```yml
spring:
  application:
    name: order-service
  cloud:
    nacos:
      discovery:
        username: nacos
        password: nacos
        server-addr: localhost:8848
server:
  port: 8091
```

配置启动类，启动Nacos注入
```java
package cn.com.codingce.orderservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author Will
 */
@SpringBootApplication
@EnableDiscoveryClient
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

}
```

添加Order类，用来测试
```java
package cn.com.codingce.orderservice.entity;

import lombok.Data;

/**
 * @author Will
 */
@Data
public class Order {
    private Integer id;
    private String orderNo;
    private String productName;
}
```


添加OrderController控制器

```java
package cn.com.codingce.orderservice.controller;

import cn.com.codingce.orderservice.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Will
 */
@RestController
@RequestMapping("/order")
@Slf4j
public class OrderController {

    /**
     * 方便后面的负载均衡测试
     */
    @Value("${server.port}")
    public int port;

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable("id") Integer id) {
        Order order = new Order();
        order.setOrderNo("20241214");
        order.setProductName("商品名称 端口：" + port);
        order.setId(1);
        log.info("服务端");
        return order;
    }

}
```


## 创建order-client模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>cn.com.codingce</groupId>
        <artifactId>open-feign-demo</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>order-client</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>order-client</name>
    <description>order-client 后端码匠</description>
    
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <dependencies>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>

        <!-- 使用openfeign 必须引入loadbalancer -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-loadbalancer</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

</project>
```

配置 application.yml
```yml
spring:
  application:
    name: order-client
  cloud:
    openfeign:
      # Gzip压缩设置
      compression:
        request:
          enabled: true
          min-request-size: 2048
          mime-types: [ "text/xml", "application/xml", "application/json" ]
        response:
          enabled: true
      # 超时配置
      client:
        config:
          default: # 全局设置
            # 连接超时：client连接上service的时间阈值，起决定作用的是网络状况
            connect-timeout: 200
            # 读超时：client发出请求到接收到service的响应这段时间阈值，起决定作用的是service的业务逻辑
            read-timeout: 200
          order-service: # 局部配置
            connect-timeout: 2000
            read-timeout: 2000
    nacos:
      discovery:
        username: nacos
        password: nacos
        server-addr: localhost:8848

server:
  port: 8090

```

配置启动类，启动FeignClient和Nacos

```java
package cn.com.codingce.orderclient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @author Will
 */
@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class OrderClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderClientApplication.class, args);
    }

}
```


添加Order类，用来测试

```java
package cn.com.codingce.orderclient.entity;

import lombok.Data;

/**
 * @author Will
 */
@Data
public class Order {
    private Integer id;
    private String orderNo;
    private String productName;
}
```

添加 OrderServiceApi，用来定义Feign接口
```java
package cn.com.codingce.orderclient.controller.feign;

import cn.com.codingce.orderclient.entity.Order;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * @author Will
 */
@FeignClient(value = "order-service", path = "order")
public interface OrderServiceApi {

    @GetMapping("/{id}")
    Order getOrderById(@PathVariable("id") Integer id);

}
```

添加OrderController用来测试

```java
package cn.com.codingce.orderclient.controller;

import cn.com.codingce.orderclient.controller.feign.OrderServiceApi;
import cn.com.codingce.orderclient.entity.Order;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Will
 */
@RestController
@RequestMapping("/order")
@Slf4j
public class OrderController {

    @Resource
    private OrderServiceApi orderService;

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable("id") Integer id) {
        log.info("客户端");
        return orderService.getOrderById(id);
    }
}
```

## 效果

Nacos

![](https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/gf/20241214151010.png)


测试

```bash
curl --request GET \
  --url http://localhost:8090/order/8 \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'User-Agent: PostmanRuntime-ApipostRuntime/1.1.0'
```

返回值
```json
{
	"id": 1,
	"orderNo": "20241214",
	"productName": "商品名称 端口：8091"
}
```


## 配置说明
### 超时配置

```yml
client:
    config:
        default: # 全局设置
        # 连接超时：client连接上service的时间阈值，起决定作用的是网络状况
        connect-timeout: 200
        # 读超时：client发出请求到接收到service的响应这段时间阈值，起决定作用的是service的业务逻辑
        read-timeout: 200
```



**局部超时配置**

在全局设置的基础之上，若想单独对某些微服务单独设置超时时间，只需要将前面配置中的 default 修改为微服务名称即可。局部设置的优先级要高于全局设置的。
```yml
client:
    config:
        default: # 全局设置
        # 连接超时：client连接上service的时间阈值，起决定作用的是网络状况
        connect-timeout: 200
        # 读超时：client发出请求到接收到service的响应这段时间阈值，起决定作用的是service的业务逻辑
        read-timeout: 200
        order-service: # 局部配置
        connect-timeout: 2000
        read-timeout: 2000
```
### Gzip压缩设置
OpenFeign 可对请求与响应进行压缩设置
```yml
cloud:
    openfeign:
        # Gzip压缩设置
        compression:
        request:
            enabled: true
            min-request-size: 2048
            mime-types: [ "text/xml", "application/xml", "application/json" ]
        response:
            enabled: true
```

## 负载均衡

OpenFeign 的负载均衡器 Ribbon 默认采用的是轮询算法
更换负载均衡策略

工程启动三个实例，它们的端口号分别为8091、8092与8093

![](https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/gf/20241214151454.png)

```bash
-Dserver.port=8093 -Xms64m -Xmx64m
```


![](https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/gf/20241214151629.png)


![](https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/gf/20241214151654.png)

指定负载均衡策略

```java
package cn.com.codingce.orderclient.config;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClients;
import org.springframework.cloud.loadbalancer.core.RandomLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ReactorLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.cloud.loadbalancer.support.LoadBalancerClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * @author Will
 */
@Configuration
@LoadBalancerClients(defaultConfiguration = OpenFeignConfig.class)
public class OpenFeignConfig {

    @Bean
    public ReactorLoadBalancer<ServiceInstance> loadBalancer(Environment e, LoadBalancerClientFactory factory) {
        // 获取负载均衡客户端名称，即提供者服务名称
        String name = e.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        // 从所有service实例中指定名称的实例列表中随机选择一个实例
        // 参数1：获取指定名称的所有service实例列表
        // 参数2：指定要获取的service服务名称
        return new RandomLoadBalancer(factory.getLazyProvider(name, ServiceInstanceListSupplier.class), name);
    }

}
```


## 对比Feign
Feign 的远程调用底层实现技术默认采用的是 JDK 的 URLConnection，同时还支持HttpClient 与 OkHttp。由于 JDK 的 URLConnection 不支持连接池，通信效率很低，所以生产中是不会使用该默认实现的。

Spring Cloud OpenFeign 中直接将默认实现变为了 HttpClient，同时也支持OkHttp。用户可根据业务需求选择要使用的远程调用底层实现技术。

在 spring.cloud.openfeign.httpclient 下有大量 HttpClient 的相关属性设置。其中可以发现spring.cloud.openfeign.httpclient.enabled 默认为 true。 在 spring.cloud.openfeign.okhttp.enabled 默认值为 false，表明默认没有启动 OkHttp。

>从Spring Cloud OpenFeign 4开始，不再支持Feign Apache HttpClient 4。我们建议使用Apache HttpClient 5。


```yml
spring:
  cloud:
    openfeign:
      httpclient:
        hc5:
          enabled: true
```


