---
title: MySQL - 数据库面试题打卡第四天
date: 2021-06-22 09:59:03
tags:
  - MySQL
  - 面经
categories:
  - MySQL
keywords:
  - MySQL
description: MySQL
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210622100019.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210622100019.png
---

## 31、MySQL 中 InnoDB 支持的四种事务隔离级别名称，以及逐级之 间的区别？
SQL 标准定义的四个隔离级别为：           
1、read uncommited ：读到未提交数据         
2、read committed：脏读，不可重复读      
3、repeatable read：可重读          
4、serializable ：串行事物            

## 32、CHAR 和 VARCHAR 的区别？
1. CHAR 和 VARCHAR 类型在`存储`和`检索方面`有所不同

2. CHAR 列长度固定为创建表时声明的长度，长度值范围是 1 到 255 当 CHAR值被存储时，它们被用空格填充到特定长度，检索 CHAR 值时需删除尾随空格。

## 33、主键和候选键有什么区别？
表格的每一行都由主键唯一标识,一个表只有一个主键。             
主键也是候选键。按照惯例，候选键可以被指定为主键，并且可以用于任何外键 引用。

## 34、myisamchk 是用来做什么的？
它用来压缩 MyISAM 表，这减少了磁盘或内存使用。

## 35、MyISAM Static 和 MyISAM Dynamic 有什么区别？
在 MyISAM Static 上的所有字段有固定宽度。动态 MyISAM Dynamic 表将具有像 TEXT，BLOB 等字段，以适应 不同长度的数据类型。

MyISAM Static 在受损情况下更容易恢复。


## 36、如果一个表有一列定义为 TIMESTAMP，将发生什么？
每当行被更改时，时间戳字段将获取当前时间戳。

列设置为 AUTO INCREMENT 时，如果在表中达到最大值，会发生什么情况？

它会停止递增，任何进一步的插入都将产生错误，因为密钥已被使用。

怎样才能找出最后一次插入时分配了哪个自动增量？               

LAST_INSERT_ID 将返回由 Auto_increment 分配的最后一个值，并且不需要指定表名称

## 37、你怎么看到为表格定义的所有索引？
索引是通过以下方式为表格定义的：
```sql
SHOW INDEX FROM <tablename>;
```

## 38、LIKE 声明中的％和_是什么意思？
％对应于 0 个或更多字符，_只是 LIKE 语句中的一个字符

如何在 Unix 和 MySQL 时间戳之间进行转换？

UNIX_TIMESTAMP 是从 MySQL 时间戳转换为 Unix 时间戳的命令                    
FROM_UNIXTIME 是从 Unix 时间戳转换为 MySQL 时间戳的命令


## 39、列对比运算符是什么？
在 SELECT 语句的列比较中使用=，<>，<=，<，> =，>，<<，>>，<=>，AND，OR 或 LIKE 运算符。


## 40、BLOB 和 TEXT 有什么区别？
BLOB 是一个二进制对象，可以容纳可变数量的数据。TEXT 是一个不区分大小写 的 BLOB。

BLOB 和 TEXT 类型之间的唯一区别在于对 BLOB 值进行排序和比较时区分大小 写，对 TEXT 值不区分大小写。

