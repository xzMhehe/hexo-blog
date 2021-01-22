---
title: RabbitMQ-生产者|消费者
date: 2021-01-22 12:37:58
tags:
- RabbitMQ
categories: 
- RabbitMQ
---

# RabbitMQ 的第一个程序


## 搭建环境
## java client

生产者和消费者都属于客户端, rabbitMQ的java客户端如下

![](https://image.codingce.com.cn/20210122133351.png)


## 创建 maven 工程
```xml
<dependency>
  <groupId>com.rabbitmq</groupId>
  <artifactId>amqp-client</artifactId>
  <version>5.10.0</version>
</dependency>
```

## AMQP协议的回顾
![](https://image.codingce.com.cn/20210122134305.png)


## RabbitMQ支持的消息模型
![](https://image.codingce.com.cn/20210122134344.png)

![](https://image.codingce.com.cn/20210122134404.png)


## 第一种模型(直连)
![](https://image.codingce.com.cn/20210122134435.png)

在上图的模型中，有以下概念：

- P：生产者，也就是要发送消息的程序
- C：消费者：消息的接受者，会一直等待消息到来。
- queue：消息队列，图中红色部分。类似一个邮箱，可以缓存消息；生产者向其中投递消息，消费者从其中取出消息。

### 开发生产者
```java
/**
 * 生产者
 * <p>
 * 直连模式
 *
 * @author mxz
 */
@Component
public class Provider {

    public static void main(String[] args) throws IOException, TimeoutException {

        // 获取连接对象
        Connection connection = RabbitMQUtils.getConnection();
        // 获取连接中通道
        Channel channel = connection.createChannel();

        // 通道绑定消息队列
        // 参数1 队列的名称, 如果不存在则自动创建
        // 参数2 用来定义队列是否需要持久化, true 持久化队列(mq关闭时, 会存到磁盘中) false 不持久化(关闭即失)
        // 参数3 exclusive 是否独占队列   true 独占队列  false 不独占
        // 参数4 autoDelete 是否在消费后自动删除队列  true 自动删除   false 不删除
        // 参数5 额外的附加参数
        channel.queueDeclare("hello", false, false, false, null);

        // 发布消息

        // 参数1 交换机名称
        // 参数2 队列名称
        // 参数3 传递消息额外设置
        // 参数4 消息的具体内容
        channel.basicPublish("", "hello", null, "hello rabbitMQ".getBytes());

        RabbitMQUtils.closeConnectionAndChannel(channel, connection);
    }
}
  ```

### 开发消费者
```java
/**
 * 消费者
 *
 * @author mxz
 */
@Component
public class Customer {
    public static void main(String[] args) throws IOException, TimeoutException {

        // 获取连接对象
        Connection connection = RabbitMQUtils.getConnection();

        // 创建通道
        Channel channel = connection.createChannel();

        // 通道绑定对象
        channel.queueDeclare("hello", false, false, false, null);

        // 消费消息
        // 参数1 消息队列的消息, 队列名称
        // 参数2 开启消息的确认机制
        // 参数3 消息时的回调接口
        channel.basicConsume("hello", true, new DefaultConsumer(channel) {
            // 最后一个参数 消息队列中取出的消息
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("new String(body)" + new String(body));
            }
        });

//        channel.close();
//        connection.close();
    }

}
```
### 工具类
```java
/**
 * @author mxz
 */
public class RabbitMQUtils {

    private static ConnectionFactory connectionFactory;

    // 重量级资源  类加载执行一次(即可)
    static {
        // 创建连接 mq 的连接工厂
        connectionFactory = new ConnectionFactory();
        // 设置 rabbitmq 主机
        connectionFactory.setHost("127.0.0.1");
        // 设置端口号
        connectionFactory.setPort(5672);
        // 设置连接哪个虚拟主机
        connectionFactory.setVirtualHost("/codingce");
        // 设置访问虚拟主机用户名密码
        connectionFactory.setUsername("codingce");
        connectionFactory.setPassword("123456");
    }

    /**
     * 定义提供连接对象的方法
     *
     * @return
     */
    public static Connection getConnection() {
        try {
            return connectionFactory.newConnection();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }


    /**
     * 关闭通道和关闭连接工具方法
     *
     * @param connection
     * @param channel
     */
    public static void closeConnectionAndChannel(Channel channel, Connection connection) {
        try {
            // 先关 channel
            if (channel != null)
                channel.close();
            if (connection != null)
                connection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```




## 第二种模型(work quene)

`Work queues`，也被称为（`Task queues`），任务模型。当消息处理比较耗时的时候，可能生产消息的速度会远远大于消息的消费速度。长此以往，消息就会堆积越来越多，无法及时处理。此时就可以使用work 模型：**让多个消费者绑定到一个队列，共同消费队列中的消息**。队列中的消息一旦消费，就会消失，因此任务是不会被重复执行的。

![](https://image.codingce.com.cn/20210122164054.png)

角色：

- P：生产者：任务的发布者
- C1：消费者-1，领取任务并且完成任务，假设完成速度较慢
- C2：消费者-2：领取任务并完成任务，假设完成速度快


### 开发生产者
```java
/**
 * 生产者
 * <p>
 * 任务模型 work quenue
 *
 * @author mxz
 */
@Component
public class Provider {

    public static void main(String[] args) throws IOException, TimeoutException {
        Connection connection = RabbitMQUtils.getConnection();
        Channel channel = connection.createChannel();

        // 通过通道声明队列
        channel.queueDeclare("work", true, false, false, null);

        for (int i = 0; i < 10; i++) {
            // 生产消息
            channel.basicPublish("", "work", null, (" " + i + "work quenue").getBytes());
        }

        // 关闭资源
        RabbitMQUtils.closeConnectionAndChannel(channel, connection);

    }
}
```

### 开发消费者-1
```java
/**
 * 自动确认消费 autoAck true 12搭配测试
 * <p>
 * 消费者 1
 *
 * @author mxz
 */
@Component
public class CustomerOne {
    public static void main(String[] args) throws IOException, TimeoutException {

        // 获取连接对象
        Connection connection = RabbitMQUtils.getConnection();

        // 创建通道
        Channel channel = connection.createChannel();

        // 通道绑定对象
        channel.queueDeclare("work", true, false, false, null);

        // 消费消息
        // 参数1 消息队列的消息, 队列名称
        // 参数2 开启消息的确认机制
        // 参数3 消息时的回调接口
        channel.basicConsume("work", true, new DefaultConsumer(channel) {
            // 最后一个参数 消息队列中取出的消息
            // 默认分配是平均的
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者-1" + new String(body));
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

//        channel.close();
//        connection.close();
    }

}
```

### 开发消费者-2
```java
/**
 * 自动确认消费 autoAck true 12搭配测试
 * <p>
 * 消费者 2
 *
 * @author mxz
 */
@Component
public class CustomerTwo {
    public static void main(String[] args) throws IOException {

        // 获取连接对象
        Connection connection = RabbitMQUtils.getConnection();

        // 创建通道
        Channel channel = connection.createChannel();

        // 通道绑定对象
        channel.queueDeclare("work", true, false, false, null);

        channel.basicConsume("work", true, new DefaultConsumer(channel) {
            // 最后一个参数 消息队列中取出的消息
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者-1" + new String(body));
            }
        });

//        channel.close();
//        connection.close();
    }

}
```


### 测试结果
![](https://image.codingce.com.cn/20210122164257.png)

![](https://image.codingce.com.cn/20210122164437.png)


`总结:默认情况下，RabbitMQ将按顺序将每个消息发送给下一个使用者。平均而言，每个消费者都会收到相同数量的消息。这种分发消息的方式称为循环。`

### 消息自动确认机制
>Doing a task can take a few seconds. You may wonder what happens if one of the consumers starts a long task and dies with it only partly done. With our current code, once RabbitMQ delivers a message to the consumer it immediately marks it for deletion. In this case, if you kill a worker we will lose the message it was just processing. We'll also lose all the messages that were dispatched to this particular worker but were not yet handled.

>But we don't want to lose any tasks. If a worker dies, we'd like the task to be delivered to another worker.


#### 消费者3
```java
/**
 * 能者多劳  34 搭配测试
 * <p>
 * 消费者 3
 *
 * @author mxz
 */
@Component
public class CustomerThree {
    public static void main(String[] args) throws IOException, TimeoutException {

        // 获取连接对象
        Connection connection = RabbitMQUtils.getConnection();

        // 创建通道
        Channel channel = connection.createChannel();

        // 每一次只能消费一个消息
        channel.basicQos(1);
        // 通道绑定对象
        channel.queueDeclare("work", true, false, false, null);

        // 参数1 队列名称 参数2(autoAck) 消息自动确认 true 消费者自动向 rabbitMQ 确认消息消费  false 不会自动确认消息
        // 若出现消费者宕机情况 消费者三可以进行消费
        channel.basicConsume("work", false, new DefaultConsumer(channel) {
            // 最后一个参数 消息队列中取出的消息
            // 默认分配是平均的
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者-1" + new String(body));
                // 手动确认 参数1 确认队列中
                channel.basicAck(envelope.getDeliveryTag(), false);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

//        channel.close();
//        connection.close();
    }

}
```


#### 消费者4
```java
/**
 * 能者多劳  34 搭配测试
 * <p>
 * 消费者 4
 *
 * @author mxz
 */
@Component
public class CustomerFour {
    public static void main(String[] args) throws IOException {

        // 获取连接对象
        Connection connection = RabbitMQUtils.getConnection();

        // 创建通道
        Channel channel = connection.createChannel();

        // 每一次只能消费一个消息
        channel.basicQos(1);

        // 通道绑定对象
        channel.queueDeclare("work", true, false, false, null);

        channel.basicConsume("work", false, new DefaultConsumer(channel) {
            // 最后一个参数 消息队列中取出的消息
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者-1" + new String(body));

                // 手动确认 参数1 手动确认
                channel.basicAck(envelope.getDeliveryTag(), false);
            }
        });

//        channel.close();
//        connection.close();
    }

}
```


















>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址github: https://github.com/xzMhehe/codingce-java
