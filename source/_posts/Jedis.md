---
title: Jedis
date: 2021-01-08 10:58:52
tags:
- Redis
categories: 
- Redis
---

### Jedis
使用Java来操作Redis
>什么是Jedis 是Redis官方推荐的Java操作Redis中间件, 如果你要使用Java操作Redis, 那么就该对jedis熟悉

### 测试
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

### 常用API
- String
- List
- Set
- Hash
- Zset

#### Redis-key
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

#### String(字符串)
```java
    @Test
    void TestString() {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        System.out.println("=====增加数据=====");
        System.out.println(jedis.set("key1", "value1"));
        System.out.println(jedis.set("key2", "value2"));
        System.out.println(jedis.set("key3", "value3"));
        System.out.println("删除键key2" + jedis.del("key2"));
        System.out.println("获取键key2" + jedis.get("key2"));
        System.out.println("修改key1" + jedis.set("key1", "valueChanged"));
        System.out.println("获取key1的值" + jedis.get("key1"));
        System.out.println("在key3后面加入值" + jedis.append("key3", "end"));
        System.out.println("key3的值" + jedis.get("key3"));
        System.out.println("增加多个键值对: " + jedis.mset("key01", "value01", "key02", "value02"));
        System.out.println("获取多个键值对: " + jedis.mget("key01", "key02", "key03"));
        System.out.println("获取多个键值对: " + jedis.mget("key01", "key02", "key03", "key04"));
        System.out.println("删除多个键值对: " + jedis.del("key01", "key02"));
        System.out.println("获取多个键值对: " + jedis.mget("key01", "key02", "key03"));

        jedis.flushDB();
        System.out.println("=====新增键值对防止覆盖原先值=====");
        System.out.println(jedis.setnx("key1", "value1"));
        System.out.println(jedis.setnx("key2", "value2"));
        System.out.println(jedis.setnx("key2", "value2-new"));
        System.out.println(jedis.get("key1"));
        System.out.println(jedis.get("key2"));

        System.out.println("=====新增键值对并设置有效时间=====");
        System.out.println(jedis.setex("key3", 2, "value3"));
        System.out.println(jedis.get("key3"));
        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(jedis.get("key3"));


        System.out.println("=====获取原值, 更新为新值=====");
        System.out.println(jedis.getSet("key2", "key2GetSet"));
        System.out.println(jedis.get("key2"));

        System.out.println("获得key2的值字符串: " + jedis.getrange("key2", 2, 4));
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

2021-01-09 09:56:23.763  INFO 9088 --- [           main] cn.com.codincge.RedisApplicationTests    : Starting RedisApplicationTests using Java 1.8.0_181 on DESKTOP-GMI8GKQ with PID 9088 (started by mxz in D:\mxz_code\codingce-java\codingce-redis\redis-01-jedis)
2021-01-09 09:56:23.825  INFO 9088 --- [           main] cn.com.codincge.RedisApplicationTests    : No active profile set, falling back to default profiles: default
2021-01-09 09:56:25.462  INFO 9088 --- [           main] cn.com.codincge.RedisApplicationTests    : Started RedisApplicationTests in 2.349 seconds (JVM running for 5.252)

=====增加数据=====
OK
OK
OK
删除键key21
获取键key2null
修改key1OK
获取key1的值valueChanged
在key3后面加入值9
key3的值value3end
增加多个键值对: OK
获取多个键值对: [value01, value02, null]
获取多个键值对: [value01, value02, null, null]
删除多个键值对: 2
获取多个键值对: [null, null, null]
=====新增键值对防止覆盖原先值=====
1
1
0
value1
value2
=====新增键值对并设置有效时间=====
OK
value3
null
=====获取原值, 更新为新值=====
value2
key2GetSet
获得key2的值字符串: y2G
```

#### List(列表)
```java
    @Test
    void TestList() {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.flushDB();

        System.out.println("=====添加一个List=====");
        jedis.lpush("collections", "ArrayList", "Vector", "Stack", "HashMap", "WeakHashMap", "LinkedHashMap");
        jedis.lpush("collections", "HashSet");
        jedis.lpush("collections", "TreeSet");
        jedis.lpush("collections", "TreeMap");
        System.out.println("collections的内容" + jedis.lrange("collections", 0, -1));// -1代表倒数
        System.out.println("collections区间 0-3 的元素: " + jedis.lrange("collections", 2, 3));

        System.out.println("===========================================");
        // 删除列表指定的值, 第二个参数为删除的个数(有重复时), 后add进去的值先被删, 类似于出栈
        System.out.println("删除指定元素个数: " + jedis.lrem("collectionws", 2, "HashMap"));
        System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1));
        System.out.println("删除下表0-3区间之外的元素: " + jedis.ltrim("collections", 0, 3));
        System.out.println("collections内容: " + jedis.lrange("collections", 0, -1));
        System.out.println("collections列表出栈(左端): " + jedis.lpop("collections"));
        System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1));
        System.out.println("collections添加元素, 从列表右端, 与lpush相对应: " + jedis.rpush("collections", "test"));
        System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1));
        System.out.println("collections列表出栈(右端): " + jedis.rpop("collections"));
        System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1));
        System.out.println("collections指定下标 1 的内容: " + jedis.lset("collections", 1, "FLinkedHashMap"));
        System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1));

        System.out.println("===========================================");
        System.out.println("collections的长度: " + jedis.llen("collections"));
        System.out.println("获取collections下标为 2 的元素" + jedis.lindex("collections", 2));
        System.out.println("===========================================");
        jedis.lpush("sortedList", "3", "6", "2", "4", "5", "7", "9");
        System.out.println("sortedList排序前: " + jedis.lrange("sortedList", 0, -1));
        System.out.println(jedis.sort("sortedList"));
        System.out.println("sortedList排序后：" + jedis.lrange("sortedList", 0, -1));
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

2021-01-09 10:43:37.900  INFO 12624 --- [           main] cn.com.codincge.RedisApplicationTests    : Starting RedisApplicationTests using Java 1.8.0_181 on DESKTOP-GMI8GKQ with PID 12624 (started by mxz in D:\mxz_code\codingce-java\codingce-redis\redis-01-jedis)
2021-01-09 10:43:37.900  INFO 12624 --- [           main] cn.com.codincge.RedisApplicationTests    : No active profile set, falling back to default profiles: default
2021-01-09 10:43:38.572  INFO 12624 --- [           main] cn.com.codincge.RedisApplicationTests    : Started RedisApplicationTests in 0.997 seconds (JVM running for 2.26)

=====添加一个List=====
collections的内容[TreeMap, TreeSet, HashSet, LinkedHashMap, WeakHashMap, HashMap, Stack, Vector, ArrayList]
collections区间 0-3 的元素: [HashSet, LinkedHashMap]
===========================================
删除指定元素个数: 0
collections的内容: [TreeMap, TreeSet, HashSet, LinkedHashMap, WeakHashMap, HashMap, Stack, Vector, ArrayList]
删除下表0-3区间之外的元素: OK
collections内容: [TreeMap, TreeSet, HashSet, LinkedHashMap]
collections列表出栈(左端): TreeMap
collections的内容: [TreeSet, HashSet, LinkedHashMap]
collections添加元素, 从列表右端, 与lpush相对应: 4
collections的内容: [TreeSet, HashSet, LinkedHashMap, test]
collections列表出栈(右端): test
collections的内容: [TreeSet, HashSet, LinkedHashMap]
collections指定下标 1 的内容: OK
collections的内容: [TreeSet, FLinkedHashMap, LinkedHashMap]
===========================================
collections的长度: 3
获取collections下标为 2 的元素LinkedHashMap
===========================================
sortedList排序前: [9, 7, 5, 4, 2, 6, 3]
[2, 3, 4, 5, 6, 7, 9]
sortedList排序后：[9, 7, 5, 4, 2, 6, 3]

```

#### Set(集合)
```java
    @Test
    void TestSet() {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.flushDB();
        System.out.println("======向集合中添加元素(不重复)======");
        System.out.println(jedis.sadd("eleSet", "e0", "e1", "e2", "e3", "e4", "e5"));
        System.out.println(jedis.sadd("eleSet", "e6"));
        System.out.println(jedis.sadd("eleSet", "e6"));
        System.out.println("eleSet的所有元素为: " + jedis.smembers("eleSet"));
        System.out.println("删除一个元素e0" + jedis.srem("eleSet", "e0"));
        System.out.println("删除两个元素e6 e7" + jedis.srem("eleSet", "e7", "e6"));
        System.out.println("eleSet的所有元素为: " + jedis.smembers("eleSet"));
        System.out.println("随机移除集合中的一个元素: " + jedis.spop("eleSet"));
        System.out.println("随机移除集合中的一个元素: " + jedis.spop("eleSet"));
        System.out.println("eleSet的所有元素为: " + jedis.smembers("eleSet"));
        System.out.println("eleSet中包含元素的个数: " + jedis.scard("eleSet"));
        System.out.println("e3是否在eleSet中: " + jedis.sismember("eleSet", "e3"));
        System.out.println("e1是否在eleSet中: " + jedis.sismember("eleSet", "e1"));
        System.out.println("e5是否在eleSet中: " + jedis.sismember("eleSet", "e5"));
        System.out.println("========================================");
        System.out.println(jedis.sadd("eleSet1", "e0", "e1", "e2", "e3", "e4", "e5"));
        System.out.println(jedis.sadd("eleSet2", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8"));
        System.out.println("将eleSet1中删除e1并存入eleSet3中: " + jedis.smove("eleSet1", "eleSet3", "e1"));
        System.out.println("将eleSet2中删除e2并存入eleSet3中: " + jedis.smove("eleSet2", "eleSet3", "e2"));
        System.out.println("eleSet1中的元素: " + jedis.smembers("eleSet1"));
        System.out.println("eleSet2中的元素: " + jedis.smembers("eleSet2"));
        System.out.println("=====集合运算=====");
        System.out.println("eleSet1中的元素: " + jedis.smembers("eleSet1"));
        System.out.println("eleSet2中的元素: " + jedis.smembers("eleSet2"));
        System.out.println("eleSet1和eleSet2的交集" + jedis.sinter("eleSet1", "eleSet2"));
        System.out.println("eleSet1和eleSet2的并集" + jedis.sunion("eleSet1", "eleSet2"));
        System.out.println("eleSet1和eleSet2的差集" + jedis.sdiff("eleSet1", "eleSet2")); //eleSet1中有, EleSet2中没有
        jedis.sinterstore("eleSet4", "eleSet1", "eleSet2"); //求交集并将交集保存到 dstkey的集合
        System.out.println("eleSet4中的元素: " + jedis.smembers("eleSet4"));
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

2021-01-09 11:25:15.843  INFO 6516 --- [           main] cn.com.codincge.RedisApplicationTests    : Starting RedisApplicationTests using Java 1.8.0_181 on DESKTOP-GMI8GKQ with PID 6516 (started by mxz in D:\mxz_code\codingce-java\codingce-redis\redis-01-jedis)
2021-01-09 11:25:15.843  INFO 6516 --- [           main] cn.com.codincge.RedisApplicationTests    : No active profile set, falling back to default profiles: default
2021-01-09 11:25:16.718  INFO 6516 --- [           main] cn.com.codincge.RedisApplicationTests    : Started RedisApplicationTests in 1.207 seconds (JVM running for 2.739)

======向集合中添加元素(不重复)======
6
1
0
eleSet的所有元素为: [e5, e1, e0, e2, e3, e6, e4]
删除一个元素e01
删除两个元素e6 e71
eleSet的所有元素为: [e5, e1, e2, e3, e4]
随机移除集合中的一个元素: e5
随机移除集合中的一个元素: e2
eleSet的所有元素为: [e1, e3, e4]
eleSet中包含元素的个数: 3
e3是否在eleSet中: true
e1是否在eleSet中: true
e5是否在eleSet中: false
========================================
6
9
将eleSet1中删除e1并存入eleSet3中: 1
将eleSet2中删除e2并存入eleSet3中: 1
eleSet1中的元素: [e3, e5, e0, e2, e4]
eleSet2中的元素: [e1, e0, e3, e6, e4, e8, e5, e7]
=====集合运算=====
eleSet1中的元素: [e3, e5, e0, e2, e4]
eleSet2中的元素: [e1, e0, e3, e6, e4, e8, e5, e7]
eleSet1和eleSet2的交集[e3, e5, e0, e4]
eleSet1和eleSet2的并集[e7, e5, e1, e0, e8, e2, e3, e4, e6]
eleSet1和eleSet2的差集[e2]
eleSet4中的元素: [e0, e5, e4, e3]

```

#### Hash(哈希)
```java
    @Test
    void TestHash() {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.flushDB();
        Map<String, String> map = new HashMap<>();
        map.put("key1", "value1");
        map.put("key2", "value2");
        map.put("key3", "value3");
        map.put("key4", "value4");
        //添加名称为hash(key) 的hash元素
        jedis.hmset("hash", map);
        //向名称为hash的hash中添加key为key5, value为value5的元素
        jedis.hset("hash", "key5", "value5");
        System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"));
        System.out.println("散列hash的所有的键为: " + jedis.hkeys("hash")); //return Set<String>
        System.out.println("散列hash的所有的值为: " + jedis.hvals("hash")); //return List<String>
        System.out.println("将key6保存的值加上一个整数, 如果key6不存在则添加key6: " + jedis.hincrBy("hash", "key6", 1));
        System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"));
        System.out.println("将key6保存的值加上一个整数, 如果key6不存在则添加key6: " + jedis.hincrByFloat("hash", "key6", 1.0));
        System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"));
        System.out.println("删除一个或多个键值对: " + jedis.hdel("hash", "key2"));
        System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"));
        System.out.println("散列hash的所有键值对个数: " + jedis.hlen("hash"));
        System.out.println("判断散列hash中是否存在key2: " + jedis.hexists("hash", "key2"));
        System.out.println("判断散列hash中是否存在key3: " + jedis.hexists("hash", "key3"));
        System.out.println("获取hash中的值: " + jedis.hmget("hash", "key3"));
        System.out.println("获取hash中的值: " + jedis.hmget("hash", "key3", "key4"));
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

2021-01-09 13:27:34.237  INFO 11788 --- [           main] cn.com.codincge.RedisApplicationTests    : Starting RedisApplicationTests using Java 1.8.0_181 on DESKTOP-GMI8GKQ with PID 11788 (started by mxz in D:\mxz_code\codingce-java\codingce-redis\redis-01-jedis)
2021-01-09 13:27:34.242  INFO 11788 --- [           main] cn.com.codincge.RedisApplicationTests    : No active profile set, falling back to default profiles: default
2021-01-09 13:27:35.059  INFO 11788 --- [           main] cn.com.codincge.RedisApplicationTests    : Started RedisApplicationTests in 1.276 seconds (JVM running for 3.17)

散列hash的所有键值对为: {key1=value1, key2=value2, key5=value5, key3=value3, key4=value4}
散列hash的所有的键为: [key1, key2, key5, key3, key4]
散列hash的所有的值为: [value1, value3, value4, value2, value5]
将key6保存的值加上一个整数, 如果key6不存在则添加key6: 1
散列hash的所有键值对为: {key1=value1, key2=value2, key5=value5, key6=1, key3=value3, key4=value4}
将key6保存的值加上一个整数, 如果key6不存在则添加key6: 2.0
散列hash的所有键值对为: {key1=value1, key2=value2, key5=value5, key6=2, key3=value3, key4=value4}
删除一个或多个键值对: 1
散列hash的所有键值对为: {key1=value1, key5=value5, key6=2, key3=value3, key4=value4}
散列hash的所有键值对个数: 5
判断散列hash中是否存在key2: false
判断散列hash中是否存在key3: true
获取hash中的值: [value3]
获取hash中的值: [value3, value4]


Process finished with exit code 0
```



>项目地址 https://github.com/xzMhehe/codingce-java