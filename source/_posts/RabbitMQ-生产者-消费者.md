---
title: RabbitMQ-生产者|消费者
date: 2021-01-22 12:37:58
tags:
- RabbitMQ
categories: 
- RabbitMQ
---

## RabbitMQ 的第一个程序


### 搭建环境
### java client

生产者和消费者都属于客户端, rabbitMQ的java客户端如下

![](https://image.codingce.com.cn/20210122133351.png)


### 创建 maven 工程
```xml
<dependency>
  <groupId>com.rabbitmq</groupId>
  <artifactId>amqp-client</artifactId>
  <version>5.10.0</version>
</dependency>
```

### AMQP协议的回顾
![](https://image.codingce.com.cn/20210122134305.png)


### RabbitMQ支持的消息模型
![](https://image.codingce.com.cn/20210122134344.png)

![](https://image.codingce.com.cn/20210122134404.png)


### 第一种模型(直连)
![](https://image.codingce.com.cn/20210122134435.png)

在上图的模型中，有以下概念：

- P：生产者，也就是要发送消息的程序
- C：消费者：消息的接受者，会一直等待消息到来。
- queue：消息队列，图中红色部分。类似一个邮箱，可以缓存消息；生产者向其中投递消息，消费者从其中取出消息。

#### 开发生产者
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

#### 开发消费者
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
#### 工具类
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




### 第二种模型(work quene)

`Work queues`，也被称为（`Task queues`），任务模型。当消息处理比较耗时的时候，可能生产消息的速度会远远大于消息的消费速度。长此以往，消息就会堆积越来越多，无法及时处理。此时就可以使用work 模型：**让多个消费者绑定到一个队列，共同消费队列中的消息**。队列中的消息一旦消费，就会消失，因此任务是不会被重复执行的。

![](https://image.codingce.com.cn/20210122164054.png)

角色：

- P：生产者：任务的发布者
- C1：消费者-1，领取任务并且完成任务，假设完成速度较慢
- C2：消费者-2：领取任务并完成任务，假设完成速度快


#### 开发生产者
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

#### 开发消费者-1
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

#### 开发消费者-2
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


#### 测试结果
![](https://image.codingce.com.cn/20210122164257.png)

![](https://image.codingce.com.cn/20210122164437.png)


`总结:默认情况下，RabbitMQ将按顺序将每个消息发送给下一个使用者。平均而言，每个消费者都会收到相同数量的消息。这种分发消息的方式称为循环。`

#### 消息自动确认机制
>Doing a task can take a few seconds. You may wonder what happens if one of the consumers starts a long task and dies with it only partly done. With our current code, once RabbitMQ delivers a message to the consumer it immediately marks it for deletion. In this case, if you kill a worker we will lose the message it was just processing. We'll also lose all the messages that were dispatched to this particular worker but were not yet handled.

>But we don't want to lose any tasks. If a worker dies, we'd like the task to be delivered to another worker.


##### 消费者3
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


##### 消费者4
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




### 第三种模型(fanout) 
`fanout 扇出 也称为广播`

![](https://image.codingce.com.cn/20210123133218.png)

在广播模式下，消息发送流程是这样的：

-  可以有多个消费者
-  每个**消费者有自己的queue**（队列）
-  每个**队列都要绑定到Exchange**（交换机）
-  **生产者发送的消息，只能发送到交换机**，交换机来决定要发给哪个队列，生产者无法决定。
-  交换机把消息发送给绑定过的所有队列
-  队列的消费者都能拿到消息。实现一条消息被多个消费者消费



#### 开发开发生产者
```java
/**
 * 生产者
 * <p>
 * 任务模型 fanout
 *
 * @author mxz
 */
@Component
public class Provider {

    public static void main(String[] args) throws IOException, TimeoutException {
        Connection connection = RabbitMQUtils.getConnection();
        Channel channel = connection.createChannel();


        // 将通道声明指定交换机  参数1 交换机名称   参数2 代表交换机类型 fanout 广播类型
        channel.exchangeDeclare("logs", "fanout");

        // 发送消息
        channel.basicPublish("logs", "", null, "fanout type message".getBytes());

        // 关闭资源
        RabbitMQUtils.closeConnectionAndChannel(channel, connection);

    }
}
```

#### 开发消费者

- 消费者 1

```java
/**
 * 消费者 1
 * <p>
 * 任务模型 fanout
 *
 * @author mxz
 */
public class CustomerOne {

    public static void main(String[] args) throws IOException {

        Connection connection = RabbitMQUtils.getConnection();

        Channel channel = connection.createChannel();

        // 通道绑定交换机
        channel.exchangeDeclare("logs", "fanout");

        // 临时队列
        String queue = channel.queueDeclare().getQueue();

        // 绑定交换机队列
        channel.queueBind(queue, "logs", "");

        // 消费消息
        channel.basicConsume(queue, true, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者1 " + new String(body));
            }
        });
    }

}
```

- 消费者 2

```java
/**
 * 消费者 2
 * <p>
 * 任务模型 fanout
 *
 * @author mxz
 */
public class CustomerTwo {

    public static void main(String[] args) throws IOException {

        Connection connection = RabbitMQUtils.getConnection();

        Channel channel = connection.createChannel();

        // 通道绑定交换机
        channel.exchangeDeclare("logs", "fanout");

        // 临时队列
        String queue = channel.queueDeclare().getQueue();

        // 绑定交换机队列
        channel.queueBind(queue, "logs", "");

        // 消费消息
        channel.basicConsume(queue, true, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者2 " + new String(body));
            }
        });

    }

}
```

- 消费者 3

```java
/**
 * 消费者 3
 * <p>
 * 任务模型 fanout
 *
 * @author mxz
 */
public class CustomerThree {

    public static void main(String[] args) throws IOException {

        Connection connection = RabbitMQUtils.getConnection();

        Channel channel = connection.createChannel();

        // 通道绑定交换机
        channel.exchangeDeclare("logs", "fanout");

        // 临时队列
        String queue = channel.queueDeclare().getQueue();

        // 绑定交换机队列
        channel.queueBind(queue, "logs", "");

        // 消费消息
        channel.basicConsume(queue, true, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者3 " + new String(body));
            }
        });

    }

}
```

#### 测试结果

![](https://image.codingce.com.cn/20210123140015.png)

![](https://image.codingce.com.cn/20210123140037.png)

![](https://image.codingce.com.cn/20210123140052.png)

### 第四种模型(Routing)
#### Routing 之订阅模型-Direct(直连)
`在Fanout模式中，一条消息，会被所有订阅的队列都消费。但是，在某些场景下，我们希望不同的消息被不同的队列消费。这时就要用到Direct类型的Exchange。`

 在Direct模型下：

- 队列与交换机的绑定，不能是任意绑定了，而是要指定一个`RoutingKey`（路由key）
- 消息的发送方在 向 Exchange发送消息时，也必须指定消息的 `RoutingKey`。
- Exchange不再把消息交给每一个绑定的队列，而是根据消息的`Routing Key`进行判断，只有队列的`Routingkey`与消息的 `Routing key`完全一致，才会接收到消息


流程:

![](https://image.codingce.com.cn/20210123140137.png)

图解：

- P：生产者，向Exchange发送消息，发送消息时，会指定一个routing key。
- X：Exchange（交换机），接收生产者的消息，然后把消息递交给 与routing key完全匹配的队列
- C1：消费者，其所在队列指定了需要routing key 为 error 的消息
- C2：消费者，其所在队列指定了需要routing key 为 info、error、warning 的消息


##### 开发生产者

```java
/**
 * @author mxz
 */
public class Provider {
    public static void main(String[] args) throws IOException {

        Connection connection = RabbitMQUtils.getConnection();

        Channel channel = connection.createChannel();

        // 通过通道声明交换机   参数1 交换机名称  参数2 路由模式
        channel.exchangeDeclare("logs_direct", "direct");

        // 发送消息
        String routingKey = "error";

        channel.basicPublish("logs_direct", routingKey, null, ("这是 direct 模式发布基于 route_key [" + routingKey + "]").getBytes());

        // 关闭资源
        RabbitMQUtils.closeConnectionAndChannel(channel, connection);
    }
}
```



##### 开发消费者

- 消费者1

```java
/**
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

        // 创建一个临时队列
        String queue = channel.queueDeclare().getQueue();

        // 基于 route_key 绑定队列交换机
        channel.queueBind(queue, "logs_direct", "error");

        // 消费消息
        channel.basicConsume(queue, true, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者1： " + new String(body));
            }
        });

//        channel.close();
//        connection.close();
    }

}
```

- 消费者2

```java
/**
 * 消费者 2
 *
 * @author mxz
 */
@Component
public class CustomerTwo {
    public static void main(String[] args) throws IOException, TimeoutException {
        Connection connection = RabbitMQUtils.getConnection();

        Channel channel = connection.createChannel();

        // 声明交换机
        channel.exchangeDeclare("logs_direct", "direct");

        // 创建一个临时队列
        String queue = channel.queueDeclare().getQueue();

        // 临时队列和绑定交换机
        channel.queueBind(queue, "logs_direct", "info");
        channel.queueBind(queue, "logs_direct", "error");
        channel.queueBind(queue, "logs_direct", "warning");

        // 消费消息
        channel.basicConsume(queue, true, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者2：" + new String(body));
            }
        });
    }

}
```


#### Routing 之订阅模型-Topic
`Topic`类型的`Exchange`与`Direct`相比，都是可以根据`RoutingKey`把消息路由到不同的队列。只不过`Topic`类型`Exchange`可以让队列在绑定`Routing key` 的时候使用通配符！这种模型`Routingkey` 一般都是由一个或多个单词组成，多个单词之间以”.”分割，例如： `item.insert`


![](https://image.codingce.com.cn/20210123153215.png)

```markdown
## 统配符
		* (star) can substitute for exactly one word.    匹配不多不少恰好1个词
		## (hash) can substitute for zero or more words.  匹配一个或多个词
## 如:
		audit.##    匹配audit.irs.corporate或者 audit.irs 等
    audit.*   只能匹配 audit.irs
```

##### 开发生产者

```java
/**
 * 生产者
 * <p>
 *
 * @author mxz
 */
@Component
public class Provider {

    public static void main(String[] args) throws IOException, TimeoutException {
        Connection connection = RabbitMQUtils.getConnection();
        Channel channel = connection.createChannel();


        // 声明交换机以及交换机类型
        channel.exchangeDeclare("topics", "topic");


        // 路由key
        String routeKey = "user.save";

        channel.basicPublish("topics", routeKey, null, ("这里是 topic 动态路由模型, routeKey:[" + routeKey + "]").getBytes());

        // 关闭资源
        RabbitMQUtils.closeConnectionAndChannel(channel, connection);
    }
}
```

##### 开发消费者

- 消费者

```java
/**
 * @author mxz
 */
public class CustomerOne {

    public static void main(String[] args) throws IOException {
        Connection connection = RabbitMQUtils.getConnection();

        Channel channel = connection.createChannel();

        // 声明交换机以及交换机类型
        channel.exchangeDeclare("topics", "topic");

        // 创建一个临时队列
        String queue = channel.queueDeclare().getQueue();

        // 绑定队列和交换机  动态通配符  route key
        channel.queueBind(queue, "topics", "user.*");

        // 消费消息
        channel.basicConsume(queue, true, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者1：" + new String(body));
            }
        });

    }

}
```

- 消费者

```java
/**
 * @author mxz
 */
public class CustomerTwo {

    public static void main(String[] args) throws IOException {
        Connection connection = RabbitMQUtils.getConnection();

        Channel channel = connection.createChannel();

        // 声明交换机以及交换机类型
        channel.exchangeDeclare("topics", "topic");

        // 创建一个临时队列
        String queue = channel.queueDeclare().getQueue();

        // 绑定队列和交换机  动态通配符  route key
        channel.queueBind(queue, "topics", "user.#");

        // 消费消息
        channel.basicConsume(queue, true, new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                System.out.println("消费者2：" + new String(body));
            }
        });

    }

}
```








>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址github: https://github.com/xzMhehe/codingce-java
