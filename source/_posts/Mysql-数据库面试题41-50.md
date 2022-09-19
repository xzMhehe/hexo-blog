---
title: Mysql - 数据库面试题打卡第五天
date: 2021-06-23 10:04:20
tags:
  - MySQL
  - 面经
categories:
  - MySQL
keywords:
  - MySQL
description: MySQL
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210625092152.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210625092152.png
---
## 41、MySQL_fetch_array 和 MySQL_fetch_object 的区别是什 么？
以下是 MySQL_fetch_array 和 MySQL_fetch_object 的区别：         
MySQL_fetch_array（） – 将结果行作为关联数组或来自数据库的常规数组返回。        
MySQL_fetch_object – 从数据库返回结果行作为对象。           

## 42、MyISAM 表格将在哪里存储，并且还提供其存储格式？
每个 MyISAM 表格以三种格式存储在磁盘上：          
“.frm”文件存储表定义          
数据文件具有“.MYD”（MYData）扩展名         
索引文件具有“.MYI”（MYIndex）扩展名           

## 43、MySQL 如何优化 DISTINCT？
DISTINCT 在所有列上转换为 GROUP BY，并与 ORDER BY 子句结合使用。 
```sql
SELECT DISTINCT t1.a FROM t1, t2 where t1.a=t2.a;
```

## 44、如何显示前 10 行？
在 MySQL 中，使用以下代码查询显示前 10 行：

```sql
SELECT
	* 
FROM
	user_info 
	LIMIT 0,
	10
```

## 45、可以使用多少列创建索引？
任何标准表最多可以创建 16 个索引列 。

## 46、NOW（）和 CURRENT_DATE（）有什么区别？
NOW（）命令用于显示当前年份，月份，日期，小时，分钟和秒。 

CURRENT_DATE（）仅显示当前年份，月份和日期。

## 47、什么是非标准字符串类型？
1、TINYTEXT         
2、TEXT         
3、MEDIUMTEXT       
4、LONGTEXT        

## 48、什么是通用 SQL 函数？
1、CONCAT(A, B) – 连接两个字符串值以创建单个字符串输出。通常用于将两个或多个字段合并为一个字段。             
2、FORMAT(X, D)- 格式化数字 X 到 D 有效数字。             
3、CURRDATE(), CURRTIME()- 返回当前日期或时间。             
4、NOW（） – 将当前日期和时间作为一个值返回。             
5、MONTH（），DAY（），YEAR（），WEEK（），WEEKDAY（） – 从日期值中提取给定数据。 6、HOUR（），MINUTE（），SECOND（） – 从时间值中提取给定数据。             
7、DATEDIFF（A，B） – 确定两个日期之间的差异，通常用于计算年龄             
8、SUBTIMES（A，B） – 确定两次之间的差异。             
9、FROMDAYS（INT） – 将整数天数转换为日期值             

## 49、MySQL 支持事务吗？
在缺省模式下，MySQL 是 autocommit 模式的，所有的数据库更新操作都会即时提交，所以在缺省情 况下，MySQL 是不支持事务的。
但是如果你的 MySQL 表类型是使用 InnoDB Tables 或 BDB tables 的话，你的MySQL 就可以使用事务 处理,使用 SET AUTOCOMMIT=0 就可以使 MySQL 允许在非 autocommit 模式，在非autocommit 模式下，你必须使用 COMMIT 来提交你的更改，或者用 ROLLBACK来回滚你的更改。


## 50、MySQL 里记录货币用什么字段类型好
NUMERIC 和 DECIMAL 类型被 MySQL 实现为同样的类型，这在 SQL92 标准允许。他们被用于保存值，该值的准确精度是极其重要的值，例如与金钱有关的数据。当声明一个类是这些类型之一时，精度 和规模的能被(并且通常是)指定。
例如：

在这个例子中，9(precision)代表将被用于存储值的总的小数位数，而 2(scale)代表将被用于存储小数点 后的位数。因此，在这种情况下，能被存储在 salary 列中的值的范围是从-9999999.99 到 9999999.99。

```sql
salary DECIMAL(9,2)
```

在这个例子中，9(precision)代表将被用于存储值的总的小数位数，而 2(scale)代表将被用于存储小数点 后的位数。因此，在这种情况下，能被存储在 salary 列中的值的范围是从-9999999.99 到 9999999.99。








