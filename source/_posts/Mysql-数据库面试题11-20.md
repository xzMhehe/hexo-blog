---
title: MySQL - 数据库面试题打卡第二天
date: 2021-06-20 14:14:05
tags:
  - MySQL
  - 面经
categories:
  - MySQL
keywords:
  - MySQL
description: MySQL
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210625092259.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210625092259.png
---

## 11、第一范式(1st NF － 列都是不可再分)
第一范式的目标是确保每列的原子性:如果每列都是不可再分的最小数据单元（也称为最小的原子单 元），则满足第一范式（1NF）

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/1nf.png)

## 12、第二范式(2nd NF－ 每个表只描述一件事情)
首先满足第一范式，并且表中非主键列不存在对主键的部分依赖。 第二范式要求每个表只描述一件事 情。

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/2nf.png)

## 13、第三范式(3rd NF－ 不存在对非主键列的传递依赖)
第三范式定义是，满足第二范式，并且表中的列不存在对非主键列的传递依赖。 除了主键订单编号外， 顾客姓名依赖于非主键顾客编号。

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/3nf.png)

## 14、数据库是事务
事务(TRANSACTION)是作为单个逻辑工作单元执行的一系列操作， 这些操作作为一个整体一起向系统 提交，要么都执行、要么都不执行 。 事务是一个不可分割的工作逻辑单元事务必须具备以下四个属 性，简称 ACID 属性：

原子性（Atomicity）
1. 事务是一个完整的操作。事务的各步操作是不可分的（原子的）；`要么都执行，要么都不执行`。

一致性（Consistency）
1. `当事务完成时`，`数据必须处于一致状态`。

隔离性（Isolation）
1. 对数据进行修改的所有并发事务是彼此隔离的， 这表明`事务必须是独立的`，它不应以任何方式依赖于或影响其他事务。

永久性（Durability）
1. 事务完成后，`它对数据库的修改被永久保持`，事务日志能够保持事务的永久性

## 15、SQL优化

1、`查询语句中不要使用select *`        
2、尽量减少子查询，`使用关联查询（left join,right join,inner join）替代`         
3、减少使用IN或者NOT IN ,使用`exists`，`not exists`或者`关联查询语句`替代  
```sql
SELECT column_name(s)
FROM table_name
WHERE EXISTS
(SELECT column_name FROM table_name WHERE condition);
```       
4、or 的查询尽量用 union或者union all 代替(在确认没有重复数据或者不用剔除重复数据时，union all会更好)         
5、应尽量避免在 where 子句中使用!=或<>操作符，否则将引擎放弃使用索引而进行全表扫描。         
6、应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫 描，如： select id from t where num is null 可以在num上设置默认值0，确保表中num列没有null 值，然后这样查询： select id from t where num=0      

## 16、简单说一说drop、delete与truncate的区别
SQL中的drop、delete、truncate都表示删除，但是三者有一些差别         
delete和truncate只删除表的数据不删除表的结构         
速度,一般来说: drop> truncate >delete         
delete语句是dml,这个操作会放到rollback segement中,事务提交之后才生效;         
如果有相应的trigger,执行的时候将被触发. truncate,drop是ddl, 操作立即生效,原数据不放到 rollbacksegment中,不能回滚. 操作不触发trigger   

## 17、什么是视图
视图是一种虚拟的表，具有和物理表相同的功能。可以对视图进行增，改，查，操作，试图通常是有一 个表或者多个表的行或列的子集。对视图的修改不影响基本表。它使得我们获取数据更容易，相比多表 查询

## 18、什么是内联接、左外联接、右外联接？
内联接（Inner Join）：匹配2张表中相关联的记录。          
左外联接（Left Outer Join）：除了匹配2张表中相关联的记录外，还会匹配左表中剩余的记录，右表 中未匹配到的字段用NULL表示。         
右外联接（Right Outer Join）：除了匹配2张表中相关联的记录外，还会匹配右表中剩余的记录，左表 中未匹配到的字段用NULL表示。在判定左表和右表时，要根据表名出现在Outer Join的左右位置关系     

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/join.png)

## 19、并发事务带来哪些问题?
在典型的应用程序中，多个事务并发运行，经常会操作相同的数据来完成各自的任务（多个用户对同一 数据进行操作）。并发虽然是必须的，但可能会导致以下的问题。

脏读（Dirty read）: 当一个事务正在访问数据并且对数据进行了修改，而这种修改还没有提交到数据库中，这时另外一个事务也访问了这个数据，然后使用了这个数据。因为这个数据`是还没有提交的数据`，那么另外一个事务读到的这个数据是“脏数据”，依据“脏数据”所做的操作可能是不正确的。

丢失修改（Lost to modify）: 指在一个事务读取一个数据时，另外一个事务也访问了该数据，那么在 第一个事务中修改了这个数据后，第二个事务也修改了这个数据。这样第一个事务内的修改结果就被丢 失，因此称为丢失修。 例如：`事务1读取某表中的数据A=20，事务2也读取A=20，事务1修改A=A-1， 事务2也修改A=A-1，最终结果A=19，事务1的修改被丢失`。

不可重复读（Unrepeatable read）: 指在一个事务内多次读同一数据。在这个事务还没有结束时，另 一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个 事务两次读取的数据可能不太一样。这就发生了在一个事务内两次读到的数据是不一样的情况，因此称 为不可重复读。

幻读（Phantom read）: 幻读与不可重复读类似。它发生在一个事务（T1）读取了几行数据，接着另 一个并发事务（T2）插入了一些数据时。在随后的查询中，第一个事务（T1）就会发现多了一些原本不 存在的记录，就好像发生了幻觉一样，所以称为幻读。

`不可重复读`和`幻读`区别：                       
`不可重复读`的重点是修改比如多次读取一条记录发现其中某些列的值被`修改`，`幻读`的重点在于`新增`或者`删除`比如多次读取一条记录发现`记录增多`或`减少`了

## 20、事务隔离级别有哪些?MySQL的默认隔离级别是?
SQL 标准定义了四个隔离级别：

READ-UNCOMMITTED(读取未提交)： `最低`的隔离级别，允许读取尚未提交的数据变更，可能会导致 `脏读`、`幻读`或`不可重复读`。

READ-COMMITTED(读取已提交)： 允许读取并发事务已经提交的数据，`可以阻止脏读`，但是`幻读`或`不可重复读仍有可能发生`。

REPEATABLE-READ(可重复读)： 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，`可以阻止脏读`和`不可重复读`，但`幻读`仍有`可能发生`

SERIALIZABLE(可串行化)： 最高的隔离级别，`完全服从ACID的隔离级别`。所有的事务依次逐个执行， 这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/mysqlgl.png)

MySQL `InnoDB` 存储引擎的`默认`支持的隔离级别是 `REPEATABLE-READ（可重复读）`。我们可以通过 SELECT @@tx_isolation; 命令来查看

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/isola.png)

这里需要注意的是：与 SQL 标准不同的地方在于 InnoDB 存储引擎在 REPEATABLE-READ（可重读）事务隔离级别下使用的是`Next-Key Lock` 锁算法，因此可以避免幻读的产生，这与其他数据库系统(如SQL Server) 是不同的。所以说InnoDB 存储引擎的默认支持的隔离级别是 `REPEATABLE-READ（可重读）`

已经可以完全保证事务的隔离性要求，即达到了 SQL标准的 SERIALIZABLE(可串行化) 隔离级别。因为 隔离级别越低，事务请求的锁越少，所以大部分数据库系统的隔离级别都是 READCOMMITTED(读取提 交内容) ，但是你要知道的是`InnoDB 存储引擎``默认`使用 `REPEAaTABLE READ（可重读`） `并不会有任何性能损失`

InnoDB 存储引擎在`分布式事务`的情况下一般会用到 `SERIALIZABLE(可串行化)` 隔离级别。


