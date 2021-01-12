---
title: Redis主从复制
date: 2021-01-11 15:15:27
tags:
- Redis
categories: 
- Redis
---

## Redis 主从复制

## 概念
主从复制，是指将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为主节点(master)，后者称为从节点(slave)； **数据的复制是单向的，只能由主节点到从节点**。

默认情况下，每台Redis服务器都是主节点；且一个主节点可以有多个从节点(或没有从节点)，但一个从节点只能有一个主节点。

## 主从复制的作用
主从复制的作用主要包括：

- 数据冗余：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式。
- 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复；实际上是一种服务的冗余。
- 负载均衡：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务（即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量。
- 高可用基石：除了上述作用以外，主从复制还是哨兵和集群能够实施的基础，因此说主从复制是Redis高可用的基础。

一般来说, 要将 Redis 运用于工程中, 只使用一台 Redis 是万万不能的(宕机)
- 主从结构下, 单个 Redis 服务器会发生单点故障, 并且一台服务器需要处理所有的请求负载, 压力较大
- 从容量上看, 单个 Redis 服务器内存容量有限, 就算一台Redsi 服务器的内存容量为 256G , 也不能将所有的内存用作 Redis 存储内存, 一般来说， **单台Redis最大使用内存不因该超过20G**

电商网站上的2商品, 一般都是一次上传, 无数次浏览, 专业术语 多读少写

![](https://image.codingce.com.cn/rzhucong.png)

主从复制, 读写分离, 80% 的情况下都是在进行读操作, 减缓服务器压力, 架构中经常使用, 一主二从



## 环境配置
只配置从库, 不用配置主库    
查看一些信息
```bash
127.0.0.1:6379> info replication            # 查看当前库信息
# Replication
role:master                                 # 角色 master
connected_slaves:0                          # 没有从机
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379>
```


复制三个配置文件, 然后修改对应的信息
- 端口
- pid名字
- 日志名字
- dump.rdb名字

redis-server redis.windows.conf      
Linux类同

>redis-cli -p 6379
>redis-cli -p 6380
>redis-cli -p 6381

## 一主二从
默认情况下, 每台redis 服务器都是主节点; 我们一般情况下只用配置从机就可

```bash
127.0.0.1:6380> SLAVEOF 127.0.0.1 6379          # 端口 6380 认准 127.0.0.1 6379 为主
OK
127.0.0.1:6380> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:7
master_sync_in_progress:0
slave_repl_offset:15
slave_priority:100
slave_read_only:1
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6380> 
```

主机测试
```bash
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=127.0.0.1,port=6380,state=online,offset=169,lag=0
slave1:ip=127.0.0.1,port=6381,state=online,offset=169,lag=0
master_repl_offset:169
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:2
repl_backlog_histlen:168
127.0.0.1:6379>  
```




命令行的配置仅仅是暂时的, 需要永久的话可以在redis配置文件中进行修改

## 细节
主机可以写, 从机不能写, 从机只能读

测试: 主机断开连接, 从机依旧连接到主机, 但是没有写操作, 这时候主机如果回来了, 从机依旧可以获取到主机所写的信息


如果使用命令行, 来配置的主从, 这个时候如果重启了, 那么从机就会变成主机, 只要变成从机, 立马就会从主机中获取值

## 复制原理
### 全量同步
Redis全量复制一般发生在Slave初始化阶段，这时Slave需要将Master上的所有数据都复制一份。具体步骤如下： 
-  从服务器连接主服务器，发送SYNC命令； 
-  主服务器接收到SYNC命名后，开始执行BGSAVE命令生成RDB文件并使用缓冲区记录此后执行的所有写命令； 
-  主服务器BGSAVE执行完后，向所有从服务器发送快照文件，并在发送期间继续记录被执行的写命令； 
-  从服务器收到快照文件后丢弃所有旧数据，载入收到的快照； 
-  主服务器快照发送完毕后开始向从服务器发送缓冲区中的写命令； 
-  从服务器完成对快照的载入，开始接收命令请求，并执行来自主服务器缓冲区的写命令；

**而slave服务在接受到数据文件后, 将其存到内存中**

[![sJQEGj.png](https://s3.ax1x.com/2021/01/12/sJQEGj.png)](https://imgchr.com/i/sJQEGj)

完成上面几个步骤后就完成了从服务器数据初始化的所有操作，从服务器此时可以接收来自用户的读请求.

### 增量同步
Redis增量复制是指Slave初始化后开始正常工作时主服务器发生的写操作同步到从服务器的过程.
增量复制的过程主要是主服务器每执行一个写命令就会向从服务器发送相同的写命令，从服务器接收并执行收到的写命令.

**Master继续将新的所有收集到的修改命名依次传给slave, 完成同步**


### Redis主从同步策略
主从刚刚连接的时候，进行全量同步；全同步结束后，进行增量同步。当然，如果有需要，slave 在任何时候都可以发起全量同步。redis 策略是，无论如何，首先会尝试进行增量同步，如不成功，要求从机进行全量同步.


## 层层链路
上一个master 连接下一个slave

[![sJl878.png](https://s3.ax1x.com/2021/01/12/sJl878.png)](https://imgchr.com/i/sJl878)

此时也可以完成主从复制, 但是80端口的依旧仅仅可以读（不能写）


### 如果没有主
这个时候 80 能不能变成老大

手动配置
```bash
SLAVEOF no one     # 使自己变成主机
```

此时80就为老大      

>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java