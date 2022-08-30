---
title: MySQL - 查询今天的数据(以及昨天、本月、上个月、今年...)
date: 2021-09-15 09:37:17
tags:
  - MySQL
  - 面经
categories:
  - MySQL
keywords:
  - MySQL
description: MySQL
abbrlink: 46cc00de
---

建表语句如下：
```sql
CREATE  TABLE  ` order ` (
   `id`  INTEGER  UNSIGNED  NOT  NULL  AUTO_INCREMENT,
   `order_name`  VARCHAR (45)  NOT  NULL ,
   `order_time` DATETIME  NOT  NULL ,
   PRIMARY  KEY  (`id`)
)
```

下面根据  order_time  字段来查询各个时间段内的所有记录。

1，查询当天（今天）的数据
```sql
SELECT  *  FROM  ` order `  WHERE  TO_DAYS(order_time) = TO_DAYS(NOW())
```

2，查询昨天的数据
```sql
SELECT  *  FROM  ` order `  WHERE  TO_DAYS(NOW()) - TO_DAYS(order_time) = 1
```

3，查询最近7天的数据（包括今天一共7天）
```sql
SELECT  *  FROM  ` order `  where  DATE_SUB(CURDATE(), INTERVAL 7  DAY ) <  date (order_time)
```


4，查询最近30天的数据（包括今天一共30天）
```sql
SELECT  *  FROM  ` order `  where  DATE_SUB(CURDATE(), INTERVAL 30  DAY ) <  date (order_time)
```


5，查询当月（本月）的数据
```sql
SELECT  *  FROM  ` order `  WHERE  DATE_FORMAT(order_time,  '%Y%m' ) = DATE_FORMAT(CURDATE(),  '%Y%m' )
```

6，查询上个月的数据
```sql
SELECT  *  FROM  ` order `  WHERE  PERIOD_DIFF(DATE_FORMAT(NOW(), '%Y%m' ), DATE_FORMAT(order_time, '%Y%m' )) =1
```

7，查询本季度的数据
```sql
SELECT  *  FROM  ` order `  WHERE  QUARTER(order_time)=QUARTER(NOW())
```

8，查询上季度的数据
```sql
SELECT  *  FROM  ` order `  WHERE  QUARTER(order_time)=QUARTER(DATE_SUB(NOW(),INTERVAL 1 QUARTER))
```

9，查询当年（今年）的数据
```sql
SELECT  *  FROM  ` order `  WHERE  YEAR (order_time)= YEAR (NOW())
```

10，查询去年的数据
```sql
SELECT  *  FROM  ` order `  WHERE  YEAR (order_time)= YEAR (DATE_SUB(NOW(),INTERVAL 1  YEAR ))
```