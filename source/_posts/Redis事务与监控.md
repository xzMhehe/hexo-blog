---
title: Redis事务与监控
date: 2021-01-07 19:42:09
tags:
- Redis
categories: 
- Redis
---

## 事务

- Redis单条命令是保证原子性的,但是事务不保证原子性的     
- Redis事务没有隔离级别的概念   
- 所有的命命令在事务中, 并没有直接被执行, 只有发起执行命令的时候才会被执行   

Redis 事务的本质：  一组命令的集合  一个事务中的所有命令都会被序列化, 在事务执行过程中, 会按照顺序执行   
一次性 顺序性 排他性   执行一系列的命令

```bash
----- 队列set set set 执行-----
```

Redis的事务:
- 开启事务(multi)
- 命令入队(......)
- 执行事务(exec)

### 正常执行事务
```bash
127.0.0.1:6379> multi           # 开启事务
OK
# 命令入队
127.0.0.1:6379> set k1 v1
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
127.0.0.1:6379> get k2
QUEUED
127.0.0.1:6379> set k3 v3
QUEUED
# 执行事务
127.0.0.1:6379> exec
1) OK
2) OK
3) "v2"
4) OK
127.0.0.1:6379> 
```

### 放弃事务
```bash
127.0.0.1:6379> multi           # 开启事务
OK
127.0.0.1:6379> set k4 v4
QUEUED
127.0.0.1:6379> discard         # 取消事务
OK
127.0.0.1:6379> get k4          # 事务队列中的命令都不会执行
(nil)
```


### 编译型异常
(代码有错误 命令有错误)   
事务中的所有命令都不会被执行

```bash
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set k1 v1
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
127.0.0.1:6379> set  k3 v3
QUEUED
127.0.0.1:6379> getset k3       # 错误的命令
(error) ERR wrong number of arguments for 'getset' command
127.0.0.1:6379> set k4 v4
QUEUED
127.0.0.1:6379> set k5 v5
QUEUED
127.0.0.1:6379> exec            # 执行的时候报错
(error) EXECABORT Transaction discarded because of previous errors.
127.0.0.1:6379> get k5          # 所有的命令都不会被执行
(nil)
127.0.0.1:6379>   
```

### 运行时异常
如果事务队列中存在语法性错误, 那么执行命令的时候, 其他命令是可以正常执行的, 错误命令抛出异常

```bash
127.0.0.1:6379> set k1 "v1"
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> incr k1         # 会在执行的时候失败
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
127.0.0.1:6379> set k3 v3
QUEUED
127.0.0.1:6379> get k3
QUEUED
127.0.0.1:6379> exec            # 虽然第一条命令报错了, 但是依旧正常执行成功了
1) (error) ERR value is not an integer or out of range
2) OK
3) OK
4) "v3"
127.0.0.1:6379>  
```

## 监控  Watch

**悲观锁**    
- 很悲观, 认为什么时候都会出现问题, 无论做什么都会加锁.


**乐观锁**    
- 很乐观, 认为什么时候都不会出现问题, 所以不会加锁.  更新数据的时候去判断一下, 在此期间是否有人修改过这个数据
- 获取version
- 更新时比较version
- Watch本省就是个乐观锁

### Redis监视测试
正常执行成功
```bash
127.0.0.1:6379> set money 100
OK
127.0.0.1:6379> set out 0
OK
127.0.0.1:6379> watch money     # 监视money对象
OK
127.0.0.1:6379> multi           # 事务正常结束, 数据期间没有发生变动, 这个时候就正常执行成功
OK
127.0.0.1:6379> decrby money 20
QUEUED
127.0.0.1:6379> incrby out 20
QUEUED
127.0.0.1:6379> exec
1) (integer) 80
2) (integer) 20
127.0.0.1:6379> 
```

测试多线程修改值, 监视失败, 使用watch可以当作redis乐观锁操作    

线程一

```bash
127.0.0.1:6379> watch money     # 监视money
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> decrby money 10
QUEUED
127.0.0.1:6379> incrby out 10
QUEUED
127.0.0.1:6379> exec            # 执行事务之前在, 另外一个线程, 修改了我们的值, 就会导致事务执行失败. 
(nil)
127.0.0.1:6379>  
```

线程二   

```bash
127.0.0.1:6379> get money
"80"
127.0.0.1:6379> set money 1000
OK
127.0.0.1:6379>
```

解决方案

```bash
127.0.0.1:6379> unwatch             # 如果发现事务执行失败, 就先解锁
OK
127.0.0.1:6379> watch money         # 获取新的值, 再次监视, select version
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> decrby money 1
QUEUED
127.0.0.1:6379> incrby money 1
QUEUED
127.0.0.1:6379> exec                # 比对监视的值是否发生变化, 如果没有变化, 执行成功, 如果执行失败, 那么就继续 先解锁 -》 获取新值再次监视......
1) (integer) 999
2) (integer) 1000
127.0.0.1:6379>          
```


