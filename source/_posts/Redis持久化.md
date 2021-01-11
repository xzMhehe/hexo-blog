---
title: Redis持久化
date: 2021-01-11 10:55:39
tags:
- Redis
categories: 
- Redis
---

## Redis持久化
面试和工作, 持久化都是重点

Redis 是内存数据库, 如果不将内存中的数据存入到磁盘, 那么服务器进程退出, 服务器中的数据库状态也会消失, 所以 Redis 提供了持久化功能.

 RDB（Redis DataBase）
## 什么是 RDB

![](https://image.codingce.com.cn/rdb.png)


在指定的时间间隔内将内存中的数据集快照写入磁盘, 也就是 Snapshot 快照, 它回复时是将快照文件直接读到内存里.   

Redis 会单独创建 ( fork ) 一个子进程进行持久化, 会先将数据写入到一个临时文件中, 待持久化过程结束了, 再用这个临时文件替换上次持久化好的文件, 整个过程中, 主进程是不进行任何 IO 操作的. 这就确保了极高的性能. 如果要进行大规模的数据恢复, 且对于数据恢复的完整性不是非常敏感, 那 RDB 方式要比 AOF 方式更加的高效. RDB 的缺点是最后一次持久化的数据可能丢失. 我们默认的就是 RDB , 一般情况下不需要修改这个配置

rdb 保存的文件时 dump.rdb 都是在我们的配置文件中快照中进行配置的.

## 触发机制
- save 的规则满足的情况下, 会触发 rdb 规则
- 执行了 flushall 命令 也会出发 rdb 规则
- 退出redis 也会产生 rdb 文件

备份就会自动生成一个 dump.rdb 

## 如何恢复 rdb 文件
- 只需要将 rdb 文件放在我们的 redis 启动目录就可以, redis 启动的时候自动检查 dump.rdb 文件, 恢复其中的数据
- 查看需要存在的位置
```bash
config get dir
"dir"
"/usr/local/bin"        # 如果在这个目录不存在 dump.rdb 文件, 启动就会恢复其中的数据
```


优点： 
- 适合大规模的数据恢复
- 对数据完整性不高

缺点： 
- 需要一定的时间间隔进程操作, 入果 redis 意外宕机了这个最后一次修改数据就没有了
- fork 进程的时候, 会占用一定的内容空间




## AOF(Append Only File)

## 什么是 AOF

AOF 保存的是 appendonly.aof 文件

![](https://image.codingce.com.cn/aof.png)

以日志的形式来记录每个写操作, 将 Redis 执行过的所有指令记录下来(读操作不记录), 只许追加文件但不可以改写文件, redis 启动之初会读取文件重新构建数据, 换言之, redis 重启的话就跟据日志文件的内容从前到后执行一次以完成数据恢复工作.

默认是不开启的, 我们需要手动配置

```bash
appendonly  no
```

如果这个 aof 文件有错误 (做了更改), 这时候 redis 是启动不起来的, 我们需要修复这个 aof 文件

redis 给我们提供了一个工具, `redis-check-aof`  --fix

如果文件正常的话, 重启就可以直接恢复了

```bash
# appendonly no           # 默认是不开启 aof 模式的, 默认使用的是 rdb 方式持久化, 在大部分所有情况下, rdb 完全够用
# appendfilename "appendonly.aof"         # 持久化的文件的名字          
# appendfsync everysec          # 每秒执行一次  sync 可能会丢失 1s 的数据
# appendfsync no            # 不执行 sync 这个时候操作系统自己同步数据 速度最快
# appendfsync always        # 每次修改都会 sync 消耗性能
```

优点：
- 每一次修改都同步, 文件完整性会更好
- 每秒同步一次, 可能会丢失一秒的数据
- 从不同步, 效率是最高的

缺点
- 先对于数据文件来说, aof 远远大于 rdb, 修复的速度也比 rdb 慢
- aof 运行效率也要比 rdb 慢, 所以我们 redis 默认配置就是 rdb 持久化

## 持久化总结
如果你只希望你的数据在服务器运行的时候存在，可以不使用任何的持久化方式。

一般建议同时开启两种持久化方式。AOF进行数据的持久化，确保数据不会丢失太多，而RDB更适合用于备份数据库，留着一个做万一的手段。

性能建议：

因为RDB文件只用做后备用途，建议只在slave上持久化RDB文件，而且只要在15分钟备份一次就够了，只保留900 1这条规则。

1.如果Enalbe AOF,好处是在最恶劣情况下也只会丢失不超过两秒数据，启动脚本较简单只load自己的AOF文件就可以了。

代价：1、带来了持续的IO；代价2、AOF rewrite的最后将rewrite过程中产生的新数据写到新文件造成的阻塞几乎是不可避免的。

只要硬盘许可，应该尽量减少AOF rewrite的频率，AOF重写的基础大小默认值64M太小了，可以设到5G以上。默认超过原大小100%大小时重写可以改到适当的数值。

2.如果不Enable AOF,仅靠Master-Slave Replication 实现高可用性也可以。能省掉一大笔IO也减少了rewrite时带来的系统波动。代价是如果Master/Slave同时宕掉，会丢失10几分钟的数据，启动脚本也要比较两个Master/Slave中的RDB文件，载入较新的那个。新浪微博就选用了这种架构。




>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java