---
title: hystrix
date: 2020-09-13 14:50:42
tags:
- SpringCloud
categories: 
- SpringCloud
---

hystrix[hɪst'rɪks]

# 分布式系统面临的问题
复杂分布式系统结构中的应用程序有数十个依赖关系, 每个依赖关系在某些时候将不可避免的失败

# 服务雪崩
多个服务之间调用的时候, 微服务A调用微服务B和微服务C, 微服务B和微服务C有调用其它的微服务, 这就是所谓的“扇出”, 如果扇出的链路上某个微服务的调用响应时间过长或者不可用, 对微服务A的调用就会占用越来越多的系统资源, 进而引起系统崩溃, 所谓的"雪崩效应"

对于高流量的应用来说, 单一的后端依赖可能会导致所有服务器上的资源都在几秒之内饱和. 比失败更糟糕的是, 这些程序还可能导致服务间的延迟增加, 备份队列, 线程和其系统资源紧张, 导致整个系统发生更多的级联故障, 这些都表示需要对故障和延迟进行隔离和管理, 以便单个依赖关系的失败, 不能取消整个应用程序或系统.

我们需要 '弃车保帅'

# 什么是Hystrix
在分布式系统，我们一定会依赖各种服务，那么这些个服务一定会出现失败的情况，Hystrix就是这样的一个工具，它通过提供了逻辑上延时和错误容忍的解决力来协助我们完成分布式系统的交互。Hystrix 通过分离服务的调用点，阻止错误在各个系统的传播，并且提供了错误回调机制，这一系列的措施提高了系统的整体服务弹性。

官网原话
>Netflix has created a library called Hystrix that implements the circuit breaker pattern. In a microservice architecture it is common to have multiple layers of service calls.

"断路器"本身就是一种开关装置, 当某个服务单元发生故障后, 通过断路器的故障监控(类似熔断保险丝), **向调用方法返回一个服务预期的, 可处理的备选响应(FallBack), 而不是长时间等待或者调用方法无法处理的异常, 这样就可以保障了服务调用方法的线程不会被长时间** , 不必要的占用, 从而避免了故障在分布式系统中的蔓延, 乃至雪崩.

# Hystrix能干嘛
- 服务降级
- 服务熔断
- 服务限流
- 接近实时监控
- ...

在微服务架构中，我们将业务拆分成一个个的服务，服务与服务之间可以相互调用（RPC百科: RPC是远程过程调用（Remote Procedure Call）的缩写形式。）。为了保证其高可用，单个服务又必须集群部署。由于网络原因或者自身的原因，服务并不能保证服务的100%可用，如果单个服务出现问题，调用这个服务就会出现网络延迟，此时若有大量的网络涌入，会形成任务累计，导致服务瘫痪，甚至导致服务“雪崩”。为了解决这个问题，就出现断路器模型。

![mark](http://image.codingce.com.cn/blog/20200913/182113465.png)



# Hystrix服务熔断
**熔断机制是对应雪崩效应的一种微服务链路保护机制**

当扇出的链路的某个微服务不可用或者响应时间太长时, 会进行服务的降级, 进而熔断该节点微服务的调用, 快速返回错误信息. 当检测到该节点微服务调用相应正常后恢复调用链路. 在SpringCloud框架里熔断机制通过Hystrix实现. Hystrix会监控微服务间调用的状况. 当失败的调用到一定阈值, 缺省是5秒内20次调用失败就会启用熔断机制. 熔断机制的注解是 @HystixCommand

服务熔断在服务端进行编辑。

## 服务熔断简单实现
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

    <artifactId>springcloud-provider-dept-hystrix-8001</artifactId>

    <dependencies>

        <!--主要是增加这个注解hystrix-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-hystrix</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--EUREKA-->
        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-eureka -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-eureka</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <!--完善监控信息-->
        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-actuator -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!--我们需要拿到实体类, 所以要配置api -module-->
        <dependency>
            <groupId>cn.com.codingce</groupId>
            <artifactId>springcloud-api</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <!--junit-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-core -->
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
        </dependency>

        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-test</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--        &lt;!&ndash;jetty&ndash;&gt;-->
        <!--        &lt;!&ndash; https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-jetty &ndash;&gt;-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jetty</artifactId>
        </dependency>

        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
    </dependencies>
</project>
```


### DeptController
```java
package cn.com.codingce.springcloud.controller;

import cn.com.codingce.springcloud.pojo.Dept;
import cn.com.codingce.springcloud.service.DeptClientService;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author xzMa
 *
 * 提供RestFul服务
 */
@RestController
public class DeptController {

    @Resource
    private DeptClientService deptService;

    //获取一些配置的信息
    @Resource
    private DiscoveryClient client;

    @PostMapping("/dept/add")
    public boolean addDept(Dept dept) {
        return deptService.addDept(dept);
    }

    @GetMapping("/dept/get/{id}")
    public Dept queryBuId(@PathVariable("id") Long id) {
        return deptService.queryById(id);
    }

    @GetMapping("/dept/list")
    public List<Dept> queryAll() {
        return deptService.queryAll();
    }

    //注册进来的微服务, 获取一些消息
    @GetMapping("/dept/discovery")
    public Object discovery() {
        //获取微服务列表的清单
        List<String> services = client.getServices();
        System.out.println("discovery=>" + services);
        //得到一个具体的服务信息, 通过微服务id, applicationName
        List<ServiceInstance> instances = client.getInstances("SPRINGCLOUD-PROVIDER-DEPT");
        for (ServiceInstance instance : instances) {
            System.out.println(instance.getHost() + "\t" +
                    instance.getPort() + "\t" +
                    instance.getUri() + "\t" +
                    instance.getServiceId());
        }

        return this.client;
    }

}
```

### 启动项
```java
package cn.com.codingce.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * @author xzMa
 * 启动类
 *
 * Eureka客户端
 */
@SpringBootApplication
@EnableEurekaClient //开启Eureka 在服务启动后, 自动注册到Eureka中
@EnableDiscoveryClient  //服务发现
@EnableCircuitBreaker
public class DeptProvider_Hystrix_8001 {
    public static void main(String[] args) {
        SpringApplication.run(DeptProvider_Hystrix_8001.class, args);
    }
}
```

# Hystrix服务降级
## 什么是服务降级？
当服务器压力剧增的情况下，根据实际业务情况及流量，对一些服务和页面有策略的不处理或换种简单的方式处理，从而释放服务器资源以保证核心交易正常运作或高效运作。

如果还是不理解，那么可以举个例子：假如目前有很多人想要给我付钱，但我的服务器除了正在运行支付的服务之外，还有一些其它的服务在运行，比如搜索、定时任务和详情等等。然而这些不重要的服务就占用了JVM的不少内存与CPU资源，为了能把钱都收下来（钱才是目标），我设计了一个动态开关，把这些不重要的服务直接在最外层拒掉，这样处理后的后端处理收钱的服务就有更多的资源来收钱了（收钱速度更快了），这就是一个简单的服务降级的使用场景。

服务降级是在客户端进行编辑。

![](http://image.codingce.com.cn/blog/20200923/160116283.png)

## 使用场景
服务降级主要用于什么场景呢？当整个微服务架构整体的负载超出了预设的上限阈值或即将到来的流量预计将会超过预设的阈值时，为了保证重要或基本的服务能正常运行，我们可以将一些 不重要 或 不紧急 的服务或任务进行服务的 延迟使用 或 暂停使用。

## 简单实现
### 创建工厂DeptClientServiceFallbackFactory
客户端
```java
package cn.com.codingce.springcloud.service;

import cn.com.codingce.springcloud.pojo.Dept;
import feign.hystrix.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 服务降级
 * @author xzMa
 */
@Component
public class DeptClientServiceFallbackFactory implements FallbackFactory {

    @Override
    public DeptClientService create(Throwable throwable) {
        return new DeptClientService(){

            @Override
            public Dept queryById(Long id) {
                Dept dept = new Dept();
                dept.setDeptno(id);
                dept.setDname("id" + "=>" + "没有对应的信息, 客户端提供了降级信息, 这个服务现在已关闭");
                dept.setDb_source("没有数据源");
                return dept;
            }

            @Override
            public List<Dept> queryAll() {
                Dept dept = new Dept();
                dept.setDeptno((long) 10);
                dept.setDname("id" + "=>" + "没有对应的信息, 客户端提供了降级信息, 这个服务现在已关闭");
                dept.setDb_source("没有数据源");
                List<Dept> deptList = new ArrayList<>();
                deptList.add(dept);
                return deptList;
            }

            @Override
            public boolean addDept(Dept dept) {
                return false;
            }
        };
    }
}
```


### DeptClientService接口
@FeignClient(value = "SPRINGCLOUD-PROVIDER-DEPT", fallbackFactory = DeptClientServiceFallbackFactory.class)
```java
package cn.com.codingce.springcloud.service;

import cn.com.codingce.springcloud.pojo.Dept;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

/**
 * @author xzMa
 *
 * feign（面向接口编程）    练习  在实体类项目 创建service包  并创建 DeptClientService接口
 *
 *
 * 调用微服务两种方式 1 微服务名字 ribbon   2 接口和注解 feign
 *
 *
 * 只需要 接口和注解
 *
 * 注解
 */
@Component
//@FeignClient(value = "SPRINGCLOUD-PROVIDER-DEPT")  原   下面配合服务降级写法
@FeignClient(value = "SPRINGCLOUD-PROVIDER-DEPT", fallbackFactory = DeptClientServiceFallbackFactory.class)
public interface DeptClientService {

    //接口

    @GetMapping("/dept/get/{id}")
    public Dept queryById(@PathVariable("id") Long id);

    @GetMapping("/dept/list")
    public List<Dept> queryAll();

    @PostMapping("/dept/add")
    public boolean addDept(Dept dept);

}
```

### 总结：
- 服务熔断: 服务端~ 某个服务超时或者异常, 引起熔断~ 保险丝

- 服务降级： 客户端~ 从整体网站请求负载考虑~ 当某个服务熔断或者关闭后,  服务将不再调用, 此时在客户但我们可以准备 一个FallbackFactory, 返回一个默认的值(缺省值), 整体的服务水平下降了~ , 好歹能够使用


![mark](http://image.codingce.com.cn/blog/20200926/141954963.png)







>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java