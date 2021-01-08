---
title: Jedis
date: 2021-01-08 10:58:52
tags:
- Redis
categories: 
- Redis
---

## Jedis
使用Java来操作Redis
>什么是Jedis 是Redis官方推荐的Java操作Redis中间件, 如果你要使用Java操作Redis, 那么就该对jedis熟悉

## 测试
- 导入对应的依赖
```xml
    <!-- 导入jedisd的包 -->
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>3.2.0</version>
    </dependency>

    <!-- fastjson -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.62</version>
    </dependency>
```

- 编码测试
    - 连接数据库
    - 操作命令
    - 断开连接
```java
    @Test
    void TestPing() {
        //1 new Jedis 对象即可
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        //jedis 所有的命令就是他的基本命令, 就是对象的方法
        System.out.println(jedis.ping());;
    }
```

输出
PONG

## 常用API
- String
- List
- Set
- Hash
- Zset

```java
    @Test
    void TestKey() {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        System.out.println("清空数据" + jedis.flushDB());
        System.out.println("判断某个键是否存在: " + jedis.exists("username"));
        System.out.println("新增'<username, mxz>的键值对'" + jedis.set("username", "mxz"));
        System.out.println("新增'<password, mxz>的键值对'" + jedis.set("password", "mxz"));
        System.out.println("系统中所有的键值对如下: ");
        Set<String> keys = jedis.keys("*");
        System.out.println(keys);

        System.out.println("删除键password: " + jedis.del("password"));
        System.out.println("判断键password是否存在: " + jedis.exists("password"));
        System.out.println("查看键username所存储值的类型: " + jedis.type("username"));
        System.out.println("随机返回key空间的一个: " + jedis.randomKey());
        System.out.println("重命名key: " + jedis.rename("username", "name"));
        System.out.println("按索引查询: " + jedis.select(0));
        System.out.println("删除当前选择数据库的所有的key: " + jedis.flushDB());
        System.out.println("返回当前数据库中key的数目: " + jedis.dbSize());
        System.out.println("删除所有数据库中的所有的key: " + jedis.flushAll());
    }
```

输出
```bash
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.4.1)

2021-01-08 19:28:31.602  INFO 7492 --- [           main] cn.com.codincge.RedisApplicationTests    : Starting RedisApplicationTests using Java 1.8.0_181 on DESKTOP-GMI8GKQ with PID 7492 (started by mxz in D:\mxz_code\codingce-java\codingce-redis\redis-01-jedis)
2021-01-08 19:28:31.608  INFO 7492 --- [           main] cn.com.codincge.RedisApplicationTests    : No active profile set, falling back to default profiles: default
2021-01-08 19:28:32.290  INFO 7492 --- [           main] cn.com.codincge.RedisApplicationTests    : Started RedisApplicationTests in 1.133 seconds (JVM running for 3.804)

清空数据OK
判断某个键是否存在: false
新增'<username, mxz>的键值对'OK
新增'<password, mxz>的键值对'OK
系统中所有的键值对如下: 
[password, username]
删除键password: 1
判断键password是否存在: false
查看键username所存储值的类型: string
随机返回key空间的一个: username
重命名key: OK
按索引查询: OK
删除当前选择数据库的所有的key: OK
返回当前数据库中key的数目: 0
删除所有数据库中的所有的key: OK
```