---
title: Redis入门
date: 2020-10-24 21:42:06
tags:
- Redis
categories: 
- Redis
---
# Redis是什么
Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。从2010年3月15日起，Redis的开发工作由VMware主持。从2013年5月开始，Redis的开发由Pivotal赞助。

# Redis能干嘛
- 内存存储、持久化、内存中是断电即失、所以说持久化很重要(rdb    aof)
- 效率高、可以用于告诉缓存
- 发布订阅系统
- 地图信息分析
- 计时器、计数器（浏览量）
- ......


## 特性
- 多样化数据
- 持久化数据
- 集群
- 事务
- ......

## 学习中需要的东西
- 全栈自学社区公众号
- 官网：https://redis.io
- 中文网：http:www.redis.cn/

# 安装

## Windows安装
- 下载安装包：github

![](http://image.codingce.com.cn/blog/20201026/204618992.png)

- 开启Redis 双击运行即可

![](http://image.codingce.com.cn/blog/20201026/204808621.png)

默认端口6379

- 使用Redis连接Redis

![](http://image.codingce.com.cn/blog/20201026/205204586.png)

ping  测试连接
set 基本值   set基本值   key value
get key   get name

Windows 下使用虽然简单  但是Redis 推荐我们使用Linux去开发使用


## Linux安装
- 基本环境安装  
yum install gcc-c++

![](http://image.codingce.com.cn/blog/20201026/220947147.png)

- Redis默认安装路径   usr  local  bin 

![](http://image.codingce.com.cn/blog/20201026/221151800.png)

- 将redis 配置文件  cp /usr/redis/redis-5.0.7/redis.confg mconfig  

- redis默认不是后台启动的 修改配置文件

![](http://image.codingce.com.cn/blog/20201027/110937586.png)

- 启动redis服务 redis-server /usr/local/bin/mconfig/redis.conf

通过指定的配置文件启动

![](http://image.codingce.com.cn/blog/20201027/111615003.png)

- 使用redis-cli -p 6379  连接测试

![](http://image.codingce.com.cn/blog/20201027/111827863.png)

![](http://image.codingce.com.cn/blog/20201027/112209503.png)

- 如何关闭服务呢   shutdown

![](http://image.codingce.com.cn/blog/20201027/112457599.png)

# 测试性能
redis-benchmark 是一个压力测试工具！
官方自带工具
redis-benchmark命令参数
https://www.runoob.com/redis/redis-benchmarks.html
![](http://image.codingce.com.cn/blog/20201027/120851047.png)

我们来简单测试下：
测试：100并发   100000个请求  redis-benchmark -h localhost -p 6379 -c 100 -n 100000

![](http://image.codingce.com.cn/blog/20201027/121417328.png)

如何查看这个分析呢

![](http://image.codingce.com.cn/blog/20201027/122241553.png)

其他类似

# 基础知识
redis默认有16个数据库
![](http://image.codingce.com.cn/blog/20201027/122546783.png)

DBSIZE 

```sql
127.0.0.1:6379> DBSIZE
(integer) 5
127.0.0.1:6379> select 3    # 切换数据库
OK
127.0.0.1:6379[3]> DBSIZE   # 查看大小
(integer) 0
127.0.0.1:6379[3]> 

127.0.0.1:6379> keys *      # 查看所有的*
1) "myset:__rand_int__"
2) "mylist"
3) "name"
4) "counter:__rand_int__"
5) "key:__rand_int__"
127.0.0.1:6379> 


127.0.0.1:6379[5]> set name mxz
OK
127.0.0.1:6379[5]> keys *
1) "name"
127.0.0.1:6379[5]> flushdb   # 清除当前数据库数据
OK
127.0.0.1:6379[5]> keys *
(empty list or set)
127.0.0.1:6379[5]> EXISTS name1 # 判断当前key是否存在

127.0.0.1:6379[5]> move name 1 # 移除当前的key

127.0.0.1:6379[5]>  FLUSHALL   # 清除全部数据

127.0.0.1:6379> EXPIRE name 10
(integer) 1
127.0.0.1:6379> ttl name
127.0.0.1:6379> get name
(nil)


127.0.0.1:6379> type name    # 查看当前类型
string
127.0.0.1:6379> 


127.0.0.1:6379[5]> EXPIRE name  # 设置key的过期时间, 单位是秒
```
http://www.redis.cn/commands.html 命令

为什么redis 的端口号是 6379？
6379在是手机按键上MERZ对应的号码，而MERZ取自意大利歌女Alessia Merz的名字。MERZ长期以来被antirez及其朋友当作愚蠢的代名词。Redis作者antirez同学在twitter上说将在下一篇博文中向大家解释为什么他选择6379作为默认端口号。而现在这篇博文出炉，在解释了Redis的LRU机制之后，向大家解释了采用6379作为默认端口的原因.

**Redis是单线程的**
基于内存操作, CPU不是Redis性能瓶颈, Redis 的瓶颈根据机器的内存和网络带宽, 既然可以使用单线程来实现, 就使用单线程了. 所以就是用了单线程


Redis是c语言写的, 官方提供的数据为  100000 + 的QPS  完全不比同样key-value的Memecache差

**Redis为什么单线程还这么快？**
- 误区1：高性能的服务器一定是多线程的？

- 误区2：多线程（CPU）一定比单线程的 效率高？

核心：Redis是将所有的数据全部放在内存中, 所以说使用单线程去操作的效率就是最高的,多线程（CPU上下文会切换：耗时的操作） 对于内存系统来说, 如果没有上下文切换效率就是最高的！多次读写在同一个CPU上的, 在内存情况下, 这个就是最佳的方案！


**五大数据类型**
官方文档
![](http://image.codingce.com.cn/blog/20201027/142008848.png)
Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据结构，如 字符串（strings）， 散列（hashes）， 列表（lists）， 集合（sets）， 有序集合（sorted sets） 与范围查询， bitmaps， hyperloglogs 和 地理空间（geospatial） 索引半径查询。 Redis 内置了 复制（replication），LUA脚本（Lua scripting）， LRU驱动事件（LRU eviction），事务（transactions） 和不同级别的 磁盘持久化（persistence）， 并通过 Redis哨兵（Sentinel）和自动 分区（Cluster）提供高可用性（high availability）。

EXISTS name 判断这个key是否存在

Redis-Key
String
List
Set
Hash
Zset

**三种特殊数据类型**
geospatial
hyperloglog
bitmaps

# String（字符串）

```sql
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]> DBSIZE
(integer) 0
127.0.0.1:6379[1]> set key1 value1
OK
127.0.0.1:6379[1]> get key1
"value1"
127.0.0.1:6379[1]> EXISTS key1
(integer) 1
127.0.0.1:6379[1]> APPEND key1 "hello"      # 追加字符串, 如果当前key不存在, 就相当于set key
(integer) 11
127.0.0.1:6379[1]> get key1
"value1hello"
127.0.0.1:6379[1]> STRLEN key1              # 获取字符串长度
(integer) 11
127.0.0.1:6379[1]> APPEND key1 "hello"
(integer) 16
127.0.0.1:6379[1]> STRLEN key1
(integer) 16
127.0.0.1:6379[1]> 

#########################################################################
# i++
# 步长 i+=


127.0.0.1:6379[1]> set views  0     # 初始浏览量为0
OK
127.0.0.1:6379[1]> get views
"0"
127.0.0.1:6379[1]> incr views       # 自加1
(integer) 1
127.0.0.1:6379[1]> incr views
(integer) 2
127.0.0.1:6379[1]> incr views
(integer) 3
127.0.0.1:6379[1]> incr views
(integer) 4
127.0.0.1:6379[1]> incr views
(integer) 5
127.0.0.1:6379[1]> get views
"5"
127.0.0.1:6379[1]> decr views       # 自减1
(integer) 4
127.0.0.1:6379[1]> get views
"4"
127.0.0.1:6379[1]> INCRBY views 10  # 自加  系数
(integer) 14
127.0.0.1:6379[1]> INCRBY views 10
(integer) 24
127.0.0.1:6379[1]> DECRBY views 10  # 自减  系数
(integer) 14
127.0.0.1:6379[1]> 

###########################################################################

127.0.0.1:6379> GETRANGE key1 0 3   # 获取字符串[0, 3]
"hell"
127.0.0.1:6379> GETRANGE key1 0 -1  # 获取全部字符串  和get key 是一样的
"hello.xzm"
127.0.0.1:6379> 


###########################################################################
# 替换指定位置开始的字符串

127.0.0.1:6379> set key3 hahahahhaha
OK
127.0.0.1:6379> get key3
"hahahahhaha"
127.0.0.1:6379> SETRANGE key3 1 heheheh
(integer) 11
127.0.0.1:6379> get key3
"hhehehehaha"
127.0.0.1:6379> 


###########################################################################
# setex(set with expire)    # 设置过期时间
# setnx(set if not exist)   # 不存在设置    （分布式锁中会常常使用）


127.0.0.1:6379> setex key4 30 "hello"  # 设置key4 的值为hello   30秒后过期
127.0.0.1:6379> get key4
"hello"
127.0.0.1:6379> setnx mykey "redis"   # 如果mykey不存在, 创建mykey
(integer) 1
127.0.0.1:6379> keys *
1) "key1"
2) "key2"
3) "mykey"
4) "name"
5) "key3"
127.0.0.1:6379> ttl key4
(integer) -2
127.0.0.1:6379> setnx mykey "MongoDB"  # 如果mykey存在, 则创建失败
(integer) 0
127.0.0.1:6379> get mykey
"redis"
127.0.0.1:6379> 

###########################################################################
mset k1 v1 k2 v2 k3 v3  # 同时设置多个值
mget k1 k2 k3           # 同时获取多个值

127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> keys *
(empty list or set)
127.0.0.1:6379> mset k1 v1 k2 v2 k3 v3
OK
127.0.0.1:6379> keys *
1) "k3"
2) "k1"
3) "k2"
127.0.0.1:6379> mget k1 k2 k3
1) "v1"
2) "v2"
3) "v3"
127.0.0.1:6379> msetnx k1 v1 k2 v2 k4 v4    # msetnx 是一个原子性操作   要么一起成功    要么一起失败
(integer) 0
127.0.0.1:6379> get k3 
"v3"
127.0.0.1:6379> get k4
(nil)
127.0.0.1:6379> 


```

