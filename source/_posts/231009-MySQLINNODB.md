---
title: 【MySQL】information_schema.INNODB_TRX
date: 2023-10-09 14:27:41
tags:
  - MySQL
  - 面经
categories:
  - MySQL
keywords:
  - MySQL
description: MySQL
headimg: https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/mo/20231009143126.png
thumbnail: https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/mo/20231009143126.png
---

## 简介
在日常管理数据库的过程中，有时需要查询MySQL数据库是否正在有正在执行的事务，便于排查业务问题。MySQL的系统库表有数据维护对应的信息，就在information_schema库中的INNODB_TRX表，包含事务中是否存在锁，事务开启时间，事务执行的语句等等。

## 查询正在执行的事务
```sql
SELECT * FROM information_schema.innodb_trx;
```
## 详细字段说明

<table><thead><tr><th>字段</th><th>可取值</th><th>说明</th></tr></thead><tbody><tr><td>TRX_ID</td><td></td><td>事务ID：具有唯一性，这些ID不是为只读和非锁定的事务创建的。</td></tr><tr><td>TRX_WEIGHT</td><td></td><td>事务权重：衡量更改的行数和锁的行数，在死锁的时候，引擎会优先回滚低权重的事务。更改了非事务表的事务被认为比其他事务重，无论更改和锁定的行数是多少。</td></tr><tr><td>TRX_STATE</td><td> 
<ul><li>RUNNING</li><li>LOCK WAIT</li><li>ROLLING BACK</li><li>COMMITTING </li><li><ul></ul> 
</li></ul></td><td>事务执行状态</td></tr><tr><td>TRX_STARTED</td><td></td><td>事务开始时间，格式如：2022-11-23 10:18:38</td></tr><tr><td>TRX_REQUESTED_LOCK_ID</td><td></td><td>锁等待ID，可以join上对应<code>INNODB_LOCKS</code> 表的id</td></tr><tr><td>TRX_WAIT_STARTED</td><td></td><td>锁等待的开始时间</td></tr><tr><td>TRX_MYSQL_THREAD_ID</td><td></td><td>MySQL 的线程ID，可以join上对应的 <code>PROCESSLIST</code>表数据</td></tr><tr><td>TRX_QUERY</td><td></td><td>事务过程执行的SQL语句</td></tr><tr><td>TRX_OPERATION_STATE</td><td></td><td>事务当前的状态</td></tr><tr><td>TRX_TABLES_IN_USE</td><td></td><td>事务过程中使用到的表数量</td></tr><tr><td>TRX_TABLES_LOCKED</td><td></td><td>事务过程中被锁的表数量</td></tr><tr><td>TRX_LOCK_STRUCTS</td><td></td><td>事务保留的所数量</td></tr><tr><td>TRX_LOCK_MEMORY_BYTES</td><td></td><td>锁用到的内存大小</td></tr><tr><td>TRX_ROWS_LOCKED</td><td></td><td>事务锁定的近似行数，该值可能包括物理上存在但对事务不可见的删除标记行。</td></tr><tr><td>TRX_ROWS_MODIFIED</td><td></td><td>事务过程中更改或插入的行数</td></tr><tr><td>TRX_CONCURRENCY_TICKETS</td><td></td><td>事务并发票数，由系统变量<code>innodb_concurrency_tickets</code>设置</td></tr><tr><td>TRX_ISOLATION_LEVEL</td><td> 
<ul><li>READ-UNCOMMITTED</li><li>READ-COMMITTED</li><li>REPEATABLE-READ</li><li>SERIALIZABLE</li></ul></td><td>事务隔离级别</td></tr><tr><td>TRX_UNIQUE_CHECKS</td><td>1或0</td><td>是否打开唯一性检查的标识，加载大量数据时关闭</td></tr><tr><td>TRX_FOREIGN_KEY_CHECKS</td><td>1或0</td><td>是否打开外键检查的标识，加载大量数据时关闭</td></tr><tr><td>TRX_LAST_FOREIGN_KEY_ERROR</td><td></td><td>最后一次的外键错误信息</td></tr><tr><td>TRX_ADAPTIVE_HASH_LATCHED</td><td></td><td>自适应哈希索引是否被当前事务锁定， <code>innodb_adaptive_hash_index_parts</code>设置</td></tr><tr><td>TRX_ADAPTIVE_HASH_TIMEOUT</td><td></td><td>是立即放弃自适应哈希索引的搜索锁占有，还是在来自MySQL的调用中保留它。</td></tr><tr><td>TRX_IS_READ_ONLY</td><td></td><td>1表示只读</td></tr><tr><td>TRX_AUTOCOMMIT_NON_LOCKING</td><td></td><td>1表示：没使用<code>FOR UPDATE</code> 或 <code>LOCK IN SHARED MODE</code>的SELECT语句</td></tr></tbody></table>


# 案例
## 表结构
```bash
MySQL [myhr]> desc city;         
+--------------+--------------+------+-----+---------+-------+
| Field        | Type         | Null | Key | Default | Extra |
+--------------+--------------+------+-----+---------+-------+
| city_code    | varchar(255) | NO   | PRI | NULL    |       |
| city_name    | varchar(255) | YES  |     | NULL    |       |
| parent_code  | varchar(255) | YES  | MUL | NULL    |       |
| key_cities   | varchar(255) | YES  |     | NULL    |       |
| abbreviation | varchar(255) | YES  |     | NULL    |       |
| city_level   | varchar(255) | YES  |     | NULL    |       |
+--------------+--------------+------+-----+---------+-------+
```

## 数据
```sql

MySQL [myhr]> select * from city limit 10;
+-----------+--------------+-------------+------------+--------------+------------+
| city_code | city_name    | parent_code | key_cities | abbreviation | city_level |
+-----------+--------------+-------------+------------+--------------+------------+
| 110000    | 北京市       | 0           | NULL       | NULL         | NULL       |
| 110100    | 北京市       | 110000      | NULL       | NULL         | NULL       |
| 110101    | 东城区       | 110100      | NULL       | NULL         | NULL       |
| 110102    | 西城区       | 110100      | NULL       | NULL         | NULL       |
| 110105    | 朝阳区       | 110100      | NULL       | NULL         | NULL       |
| 110106    | 丰台区       | 110100      | NULL       | NULL         | NULL       |
| 110107    | 石景山区     | 110100      | NULL       | NULL         | NULL       |
| 110108    | 海淀区       | 110100      | NULL       | NULL         | NULL       |
| 110109    | 门头沟区     | 110100      | NULL       | NULL         | NULL       |
| 110111    | 房山区       | 110100      | NULL       | NULL         | NULL       |
+-----------+--------------+-------------+------------+--------------+------------+
```

## 查看事务
```bash
MySQL [(none)]> SELECT * FROM information_schema.innodb_trx;
*************************** 1. row ***************************
                    trx_id: 22018017
                 trx_state: LOCK WAIT
               trx_started: 2022-11-23 12:43:48
     trx_requested_lock_id: 22018017:1028:5:2
          trx_wait_started: 2022-11-23 12:43:48
                trx_weight: 2
       trx_mysql_thread_id: 1635
                 trx_query: update city set city_level=12  where city_code=110100
       trx_operation_state: starting index read
         trx_tables_in_use: 1
         trx_tables_locked: 1
          trx_lock_structs: 2
     trx_lock_memory_bytes: 1136
           trx_rows_locked: 1
         trx_rows_modified: 0
   trx_concurrency_tickets: 0
       trx_isolation_level: REPEATABLE READ
         trx_unique_checks: 1
    trx_foreign_key_checks: 1
trx_last_foreign_key_error: NULL
 trx_adaptive_hash_latched: 0
 trx_adaptive_hash_timeout: 0
          trx_is_read_only: 0
trx_autocommit_non_locking: 0
*************************** 2. row ***************************
                    trx_id: 22017539
                 trx_state: RUNNING
               trx_started: 2022-11-23 12:42:23
     trx_requested_lock_id: NULL
          trx_wait_started: NULL
                trx_weight: 14
       trx_mysql_thread_id: 1633
                 trx_query: NULL
       trx_operation_state: NULL
         trx_tables_in_use: 0
         trx_tables_locked: 1
          trx_lock_structs: 13
     trx_lock_memory_bytes: 1136
           trx_rows_locked: 3686
         trx_rows_modified: 1
   trx_concurrency_tickets: 0
       trx_isolation_level: REPEATABLE READ
         trx_unique_checks: 1
    trx_foreign_key_checks: 1
trx_last_foreign_key_error: NULL
 trx_adaptive_hash_latched: 0
 trx_adaptive_hash_timeout: 0
          trx_is_read_only: 0
trx_autocommit_non_locking: 0
2 rows in set (0.00 sec)
```


