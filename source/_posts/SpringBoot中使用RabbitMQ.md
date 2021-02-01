---
title: SpringBoot中使用RabbitMQ
date: 2021-01-27 18:23:04
tags:
- RabbitMQ
categories: 
- RabbitMQ
---

# SpringBoot中使用RabbitMQ

## 搭建初始环境
### 引入依赖

```xml
    <!-- 引入 rabbitmq 集成依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
```

### 配置配置文件

```yml
server:
  port: 9090

spring:
  application:
    # 微服务系统有意义, 养成好习惯, 先写出来
    name: rabbitmq-02-springboot
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: codingce
    password: 123456
    virtual-host: /codingce
```

### 测试类 注入 rabbitTemplate

```java
    // 注入 rabbitTemplate
    @Autowired
    private RabbitTemplate rabbitTemplate;
```

## 消息队列RabbitMQ之五种消息模型

### 第一种直连模型使用

#### 开发生产者

```java
    /**
     * 直连
     */
    @Test
    void contextLoads() {
        rabbitTemplate.convertAndSend("hello", "hello word");
    }
```


#### 开发消费者

```java
/**
 * @author mxz
 */
@Component
@RabbitListener(queuesToDeclare = @Queue("hello"))
public class HelloCustomer {

    /**
     * @param message
     */
    @RabbitHandler
    public void receivel(String message) {
        System.out.println("message: " + message);
    }

}
```

### 第二种work模型使用

#### 开发生产者

```java
    /**
     * work
     */
    @Test
    void testWork() {
        for (int i = 0; i < 10; i++) {
            rabbitTemplate.convertAndSend("work", "work模型");
        }
    }
```


#### 开发消费者

```java
/**
 * 第二种模型 work 模型
 *
 * @author mxz
 */
@Component
public class WorkCustomer {
    /**
     * 第1个消费者
     *
     * @param message
     */
    @RabbitListener(queuesToDeclare = @Queue("work"))
    public void receivel(String message) {
        System.out.println("message1 = " + message);
    }

    /**
     * 第2个消费者
     *
     * @param message
     */
    @RabbitListener(queuesToDeclare = @Queue("work"))
    public void receivel2(String message) {
        System.out.println("message2 = " + message);
    }
}
```

### 第三种 Fanout 广播模型

#### 开发生产者

```java
    /**
     * fanout 广播
     */
    @Test
    void testFanout() {
        rabbitTemplate.convertAndSend("logs", "", "Fanout模型发送的消息");
    }
```


#### 开发消费者

```java
/**
 * fanout
 *
 * @author mxz
 */
@Component
public class FanoutCustomer {

    @RabbitListener(bindings = {
            @QueueBinding(
                    value = @Queue,  // 创建临时队列
                    exchange = @Exchange(value = "logs", type = "fanout")     // 绑定的交换机
            )
    })
    public void receivel(String message) {
        System.out.println("message1 = " + message);
    }

    @RabbitListener(bindings = {
            @QueueBinding(
                    value = @Queue,  // 创建临时队列
                    exchange = @Exchange(value = "logs", type = "fanout")     // 绑定的交换机
            )
    })
    public void receive2(String message) {
        System.out.println("message2 = " + message);
    }
}
```

### 第四种 Route 路由模型

#### 开发生产者

```java
    /**
     * route 路由
     */
    @Test
    void testRoute() {
        // exchange 交换机名称
        rabbitTemplate.convertAndSend("directs", "info", "info的key的路由消息");
    }
```


#### 开发消费者

```java
/**
 * @author mxz
 */
@Component
public class RouteCustomer {

    @RabbitListener(bindings = {
            @QueueBinding(
                    value = @Queue, // 绑定临时队列
                    exchange = @Exchange(value = "directs", type = "direct"), // 自定义交换机名称和类型
                    key = {"info", "error", "warn"}
            )
    })
    public void receivel(String message) {
        System.out.println("message1 = " + message);
    }

    @RabbitListener(bindings = {
            @QueueBinding(
                    value = @Queue, // 绑定临时队列
                    exchange = @Exchange(value = "directs", type = "direct"), // 自定义交换机名称和类型
                    key = {"error"}
            )
    })
    public void receivel2(String message) {
        System.out.println("message1 = " + message);
    }

}
```

### 第五种 Topic 订阅模型(动态路由模型)

#### 开发生产者

```java
    /**
     * topic 订阅模式 动态路由
     */
    @Test
    void testTopic() {
        rabbitTemplate.convertAndSend("topics", "user.save", "user.save 路由消息");
    }
```


#### 开发消费者

```java
/**
 * 订阅模型
 *
 * @author mxz
 */
@Component
public class TopicCustomer {

    @RabbitListener(bindings = {
            @QueueBinding(
                    value = @Queue,
                    exchange = @Exchange(type = "topic", name = "topics"),
                    key = {"user.save", "user.*"}
            )
    }
    )
    public void receivel(String message) {
        System.out.println("message1" + message);
    }

    @RabbitListener(bindings = {
            @QueueBinding(
                    value = @Queue,
                    exchange = @Exchange(type = "topic", name = "topics"),
                    key = {"produce.#", "order.#"}
            )
    }
    )
    public void receivel2(String message) {
        System.out.println("message2" + message);
    }
}
```














>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址github: https://github.com/xzMhehe/codingce-java