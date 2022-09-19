---
title: Feign
date: 2020-09-12 10:19:52
tags:
- SpringCloud
categories: 
- SpringCloud
---

Feign[feɪn]

## 什么是Feign？
Feign 的英文表意为“假装，伪装，变形”， 是一个http请求调用的轻量级框架，可以以Java接口注解的方式调用Http请求，而不用像Java中通过封装HTTP请求报文的方式直接调用。Feign通过处理注解，将请求模板化，当实际调用的时候，传入参数，根据参数再应用到请求上，进而转化成真正的请求，这种请求相对而言比较直观。
Feign被广泛应用在Spring Cloud 的解决方案中，是学习基于Spring Cloud 微服务架构不可或缺的重要组件。
它让微服务之间调用变得更简单了, 类似controller调用service. SpringCloud集成了Ribbon Eureka, 可以在使用Feign时提供 **负载均衡** 的客户端

只需要一个接口, 然后添加注解即可

feign主要是社区, 大家都习惯面向接口编程. 这是很多开发人员的规范. 调用微服务有两种方法
- 微服务名字(ribbon)
- 接口和注解(feign)

## Feign能干什么
- Feign旨在编写Java Http客户端变得更容易
- 前面使用Ribbon + RestTemplate时, 利用RestTemplate对Http请求的封装处理, 形成了一套模块化用法. 但是实际开发中, 由于服务的依赖的调用可能不止一处, 往往一个接口会被多处调用, 所以都会针对每一个服务自行封装一些客户端类来包装这些依赖服务的调用. 所以Feign在此基础上做了进一步封装, 由他来帮助我们定义和实现依赖服务接口的定义,  **在Feign的实现下, 我们只需要创建一个接口并使用注解的方式来配置它(类似于以前Dao接口上标注@Mapper注解, 现在是一个微服务接口上面标注一个Feign注解即可.) 即可完成对服务同提供方的接口绑定, 简化了使用SpringCloud Ribbon时, 自动封装服务调用客户端的开发量

使用feign 就是代替 RestTemplate 

## 具体实现
### 实体类项目 加入 接口(和注解)
项目结构

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108211258632.png)

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

    <artifactId>springcloud-api</artifactId>

    <dependencies>
        <!--当前module自己需要的依赖, 如果父依赖中已经配置了版本-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <!--junit-->
<!--        <dependency>-->
<!--            <groupId>junit</groupId>-->
<!--            <artifactId>junit</artifactId>-->
<!--        </dependency>-->

        <!--feign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-feign</artifactId>
            <version>1.4.6.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
        </dependency>

    </dependencies>
</project>
```

#### DeptClientService
```java
package cn.com.codingce.service;

import cn.com.codingce.pojo.Dept;
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
@FeignClient(value = "SPRINGCLOUD-PROVIDER-DEPT")
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

### 新建客户端项目(springcloud-cusumer-dept-feign)
项目结构

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108211258298.png)

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
    <description>也是用来做客户端的</description>
    <artifactId>springcloud-cusumer-dept-feign</artifactId>

    <dependencies>
        <!--feign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-feign</artifactId>
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

#### DeptConsumerController
```java
package cn.com.codingce.springcloud.controller;

import cn.com.codingce.pojo.Dept;
import cn.com.codingce.service.DeptClientService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class DeptConsumerController {

    @Resource
    private DeptClientService deptClientService = null;

    @RequestMapping("/consumer/dept/add")
    public boolean add(Dept dept) {
        return this.deptClientService.addDept(dept);
    }

    @RequestMapping("/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Long id) {
        return this.deptClientService.queryById(id);
    }

    @RequestMapping("/consumer/dept/list")
    public List<Dept> list() {
        return this.deptClientService.queryAll();
    }

}
```

#### ConfigBean(配置Ribbon)
```java
package cn.com.codingce.springcloud.config;

import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.RandomRule;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ConfigBean {   //configuration -- spring applicationContext.xml

    //配置负载均衡实现RestTemplate  @LoadBalanced
    //IRule
    //AvailabilityFilteringRule: 先会过滤掉, 跳闸, 访问故障服务器
    //RoundRobinRule    轮询
    //RandomRule    随机
    //RetryRule： 会按照轮询获取服务~ 如果服务获取失败, 则会在指定的时间内进行, 重试
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }


    @Bean
    public IRule myRule() {
        return new RandomRule();
    }

}
```


#### 启动类FeginDeptConsumer_80
```java
package cn.com.codingce.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

/**
 * @author xzMa
 * 在微服务启动的时候就能加载我们自定义的Ribbon类
 */
@SpringBootApplication
@EnableEurekaClient //Eureka 客户端
@EnableFeignClients(basePackages = {"cn.com.codingce"})
@ComponentScan("cn.com.codingce")
public class FeginDeptConsumer_80 {
    public static void main(String[] args) {
        SpringApplication.run(FeginDeptConsumer_80.class, args);
    }
}
```

#### 操作截图

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108211259873.png)

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108211259069.png)



本项目地址:
https://github.com/xzMhehe/codingce-java
开源项目地址：
https://github.com/OpenFeign/feign