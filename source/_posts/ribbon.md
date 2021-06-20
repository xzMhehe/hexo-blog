---
title: Ribbon
date: 2020-09-11 16:42:45
tags:
- SpringCloud
categories: 
- SpringCloud
---

Ribbon [ˈrɪbən]

# Ribbon是什么
- Spring Cloud Ribbon是一个基于HTTP和TCP的 **客户端 负载均衡** 工具 
简单的说，Ribbon是Netflix发布的开源项目，主要功能是提供客户端的软件负载均衡算法，将Netflix的中间层服务连接在一起。Ribbon客户端组件提供一系列完善的配置项如连接超时，重试等。简单的说，就是在配置文件中列出Load Balancer（简称LB）后面所有的机器，Ribbon会自动的帮助你基于某种规则（如简单轮询，随机连接等）去连接这些机器。我们也很容易使用Ribbon实现自定义的负载均衡算法。

- 它基于Netflix Ribbon实现。通过Spring Cloud的封装，可以让我们轻松地将面向服务的REST模版请求自动转换成客户端负载均衡的服务调用。Spring Cloud Ribbon虽然只是一个工具类框架，它不像服务注册中心、配置中心、API网关那样需要独立部署，但是它几乎存在于每一个Spring Cloud构建的微服务和基础设施中。因为微服务间的调用，API网关的请求转发等内容，实际上都是通过Ribbon来实现的，包括后续我们将要介绍的Feign，它也是基于Ribbon实现的工具。所以，对Spring Cloud Ribbon的理解和使用，对于我们使用Spring Cloud来构建微服务非常重要。

- 面试造飞机, 工作拧螺丝

![mark](http://image.codingce.com.cn/blog/20200911/165621236.png)

# Ribbon能干嘛
- LB（负载均衡 LB，即负载均衡(Load Balance)，在微服务或分布式集群中经常用的一种应用。 
- **负载均衡简单的说就是将用户的请求平摊的分配到多个服务上，从而达到系统的HA。**
- 常见的负载均衡有软件Nginx，LVS，硬件 F5等。 
- 相应的在中间件，例如：dubbo和SpringCloud中均给我们提供了负载均衡，SpringCloud的负载均衡算法可以自定义。
- 负载均衡的简单分类
    - 集中式LB **即在服务的消费方和提供方之间使用独立的LB设施** (可以是硬件，如F5, 也可以是软件，如nginx), 由该设施负责把访问请求通过某种策略转发至服务的提供方；
    - 将LB逻辑集成到消费方，消费方从服务注册中心获知有哪些地址可用，然后自己再从这些地址中选择出一个合适的服务器。Ribbon就属于进程内LB，它只是一个类库，集成于消费方进程，消费方通过它来获取到服务提供方的地址。

注意： **Ribbon就属于进程内LB** ，它只是一个类库，集成于消费方进程，消费方通过它来 **获取到服务提供方的地址** 。

![mark](http://image.codingce.com.cn/blog/20200911/203942398.png)

# 具体操作
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

    <artifactId>springcloud-consumer-dept</artifactId>

    <dependencies>
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
## ConfigBean
```java
package cn.com.codingce.springcloud.config;

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
}

```

## DeptConsumerController
```java
package cn.com.codingce.springcloud.controller;

import cn.com.codingce.pojo.Dept;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class DeptConsumerController {

    // 理解消费者, 不应该有service层
    //RestFul风格
    //(url, 实体: Map classs<T> responseType)

    @Autowired
    private RestTemplate restTemplate;  //提供多种便捷访问远程http服务的方法

    //原 private static final String REST_URL_PREFIX = "http://localhost:8001";
    // Ribbon 我们这里是地址   因该是一个变量   通过服务来访问
    private static final String REST_URL_PREFIX = "http://SPRINGCLOUD-PROVIDER-DEPT";


    @RequestMapping("/consumer/dept/add")
    public boolean add(Dept dept) {
        return restTemplate.postForObject(REST_URL_PREFIX + "/dept/add", dept, Boolean.class);
    }

    //http://localhost:8001/dept/list
    @RequestMapping("/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Long id) {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/get/" + id, Dept.class );
    }

    @RequestMapping("/consumer/dept/list")
    public List<Dept> list() {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/list" , List.class );
    }

}
```

## 自定义负载均衡
![mark](http://image.codingce.com.cn/blog/20200912/094757534.png)

![mark](http://image.codingce.com.cn/blog/20200912/094939263.png)


**注意一点: 自定义类 单独拿出来 该类不能被@ComponentScan扫描到**
项目截图
![mark](http://image.codingce.com.cn/blog/20200912/095308699.png)

### 自定义CodingCeRandomRule
```java
package cn.com.codingce.myrule;

import com.netflix.client.config.IClientConfig;
import com.netflix.loadbalancer.AbstractLoadBalancerRule;
import com.netflix.loadbalancer.ILoadBalancer;
import com.netflix.loadbalancer.Server;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 该类不能被@ComponentScan扫描到
 * @author xzMa
 */
public class CodingCeRandomRule extends AbstractLoadBalancerRule {

    //自定义 每个服务, 访问5次, 换下一个服务(3个)

    //total = 0 默认=0 如果=5 我们指向下一个服务点

    private int total = 0;  //被调用的次数
    private int currentIndex = 0;   //当前是谁在提供服务


    public CodingCeRandomRule() {}

//    @SuppressWarnings({"RCN_REDUNDANT_NULLCHECK_OF_NULL_VALUE"})
    public Server choose(ILoadBalancer lb, Object key) {
        if (lb == null) {
            return null;
        } else {
            Server server = null;

            while(server == null) {
                //线程中断
                if (Thread.interrupted()) {
                    return null;
                }

                List<Server> upList = lb.getReachableServers(); //获得活着的服务
                List<Server> allList = lb.getAllServers();  //获得全部服务
                int serverCount = allList.size();
                if (serverCount == 0) {
                    return null;
                }


                //int index = this.chooseRandomInt(serverCount);  //生成区间随机数
                //server = (Server)upList.get(index); //从活着的服务, 随机获取一个

                //===================================================================
                if (total < 5) {
                    server = upList.get(currentIndex);
                    total++;
                } else {
                    total = 0;
                    currentIndex++;
                    //判断当前数量是否大于活着的数量
                    if(currentIndex > upList.size()) {
                        currentIndex = 0;
                    }
                    server = upList.get(currentIndex);  //从活着的服务中, 获取指定指定的服务进行操作
                }

                if (server == null) {
                    Thread.yield();
                } else {
                    if (server.isAlive()) {
                        return server;
                    }
                    server = null;
                    Thread.yield();
                }
            }

            return server;
        }
    }

    protected int chooseRandomInt(int serverCount) {
        return ThreadLocalRandom.current().nextInt(serverCount);
    }

    @Override
    public Server choose(Object key) {
        return this.choose(this.getLoadBalancer(), key);
    }

    @Override
    public void initWithNiwsConfig(IClientConfig clientConfig) {
    }
}
```

### CodingCeRule
```java
package cn.com.codingce.myrule;

import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.RandomRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CodingCeRule {

    @Bean
    public IRule myRule() {
        return new CodingCeRandomRule();
        //默认是轮询 现在我们定义为 CodingCeRandomRule
        // 本次自定义   频繁操作 会出现 500 错误 继续自定义写RetryRule
    }

}
```

项目地址: https://github.com/xzMhehe/codingce-java