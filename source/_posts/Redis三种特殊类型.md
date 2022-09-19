---
title: Redis三种特殊类型
date: 2021-01-06 09:48:18
tags:
- Redis
categories: 
- Redis
---

Redis三种特殊类型

## 三种特殊数据类型

### geospatial 地理位置
朋友的定位, 附近的人, 打车的距离计算   
Redis的Geo在Redis3.2版本就推出了.这个功能可以推算地理位置信息, 两地之间的距离, 方圆几里的人
首先需要一个城市经度纬度查询工具 自行百度搜索

只有六个命令
>相关命令   
GEOADD   
GEODIST   
GEOHASH  
GEOPOS   
GEORADIUS   
GEORADIUSBYMEMBER   


#### getadd
添加地理位置   
规则:两级无法添加, 我们一般会下载城市数据, 直接通过java程序一次性导入   
参数key 值(纬度、经度、名称)   

具体的限制，由EPSG:900913 / EPSG:3785 / OSGEO:41001 规定如下：   
有效的经度从-180度到180度。   
有效的纬度从-85.05112878度到85.05112878度。   
当坐标位置超出上述指定范围时，该命令将会返回一个错误。   
(error) ERR invalid longitude,latitude pair 39.900000,116.400000

GEOADD
```sql
127.0.0.1:6379> GEOADD china:city 116.40 39.90 beijing
(integer) 1
127.0.0.1:6379> geoadd china:city 121.47 31.23 shanghai
(integer) 1
127.0.0.1:6379> geoadd china:city 106.50 29.53 chongqing
(integer) 1
127.0.0.1:6379> geoadd china:city 114.05 22.52 shenzhen
(integer) 1
127.0.0.1:6379> geoadd china:city 120.16 30.24 hangzhou 108.96 34.26 xian
(integer) 2
127.0.0.1:6379>
```

#### GEOPOS
获取当前位置定位: 一定是一个坐标值!
```sql
127.0.0.1:6379> geopos china:city beijing   ## 获取指定城市的经度纬度
1) 1) "116.39999896287918"
   2) "39.900000091670925"
127.0.0.1:6379> geopos china:city beijing chongqing     ## 获取指定城市的经度纬度
1) 1) "116.39999896287918"
   2) "39.900000091670925"
2) 1) "106.49999767541885"
   2) "29.529999579006592"
127.0.0.1:6379> 
```

#### GEODIST
获取当前位置定位: 一定是一个坐标值!
```sql
127.0.0.1:6379> geopos china:city beijing   ## 获取指定城市的经度纬度
1) 1) "116.39999896287918"
   2) "39.900000091670925"
127.0.0.1:6379> geopos china:city beijing chongqing     ## 获取指定城市的经度纬度
1) 1) "116.39999896287918"
   2) "39.900000091670925"
2) 1) "106.49999767541885"
   2) "29.529999579006592"
127.0.0.1:6379> 
```

#### GEODIST
两人之间的距离    
返回两个给定位置之间的距离。   
如果两个位置之间的其中一个不存在， 那么命令返回空值。   
指定单位的参数 unit 必须是以下单位的其中一个：   

- m 表示单位为米。
- km 表示单位为千米。
- mi 表示单位为英里。
- ft 表示单位为英尺。

```sql
127.0.0.1:6379> GEODIST china:city beijing shanghai
"1067378.7564"
127.0.0.1:6379> GEODIST china:city beijing shanghai km
"1067.3788"
127.0.0.1:6379> GEODIST china:city beijing chongqing
"1464070.8051"
127.0.0.1:6379>                                                                                                       
```

#### GEORADIUS
附近的人(获取所有附近的人的地址, 定位! )通过半径来查询   
以给定的经纬度为中心， 返回键包含的位置元素当中， 与中心的距离不超过给定最大距离的所有位置元素。
范围可以使用以下其中一个单位：   

- m 表示单位为米。
- km 表示单位为千米。
- mi 表示单位为英里。
- ft 表示单位为英尺。

所有数据都应该录入: china:city  才会让结果更加的准确

```sql
127.0.0.1:6379> georadius china:city 110 30 1500 km     ## 获取 110 30 这个经纬度为中心  寻找方圆1000km 内的城市
1) "chongqing"
2) "xian"
3) "shenzhen"
4) "hangzhou"
5) "shanghai"
6) "beijing"
127.0.0.1:6379>georadius china:city 110 30 150 km withdist          ## 显示到中间距离的位置
127.0.0.1:6379> georadius china:city 110 30 150 km withcoord        ## 显示他人的定位信息   
127.0.0.1:6379> georadius china:city 110 30 150 km withdist withcoord count 2       ## 筛选指定的结果
(empty list or set)
127.0.0.1:6379>                                                                                                 
```

#### GEORADIUSBYMEMBER
找出位于指定元素周围元素的其他元素.

```sql
127.0.0.1:6379> georadiusbymember china:city beijing 1000 km
1) "beijing"
2) "xian"
127.0.0.1:6379> 
```

#### GEOHASH 
命令返回一个或多个位置的geohash表示    
该命令将返回11个字符的Geohash字符串

```sql
## 将二维经纬度转换为一维的字符串, 如果两个字符串越接近, 那么则距离越近
127.0.0.1:6379> geohash china:city beijing chongqing
1) "wx4fbxxfke0"
2) "wm5xzrybty0"
127.0.0.1:6379>  
```

#### GEO底层实现原理
其实就是Zset 我们可以使用Zset命令来操作geo

```sql
127.0.0.1:6379> zrange china:city 0 -1
1) "chongqing"
2) "xian"
3) "shenzhen"
4) "hangzhou"
5) "shanghai"
6) "beijing"
127.0.0.1:6379>  
```

### HyperLogLogs
#### 什么是基数
基数（cardinality，也译作势），是指一个集合（这里的集合允许存在重复元素，与集合论对集合严格的定义略有不同，如不做特殊说明，本文中提到的集合均允许存在重复元素）中不同元素的个数。例如看下面的集合：

A{1, 2, 3, 4, 5, 2, 3, 9, 7}   

这个集合有9个元素，但是2和3各出现了两次，因此不重复的元素为1,2,3,4,5,9,7，所以这个集合的基数是7。

如果两个集合具有相同的基数，我们说这两个集合等势。基数和等势的概念在有限集范畴内比较直观，但是如果扩展到无限集则会比较复杂，一个无限集可能会与其真子集等势（例如整数集和偶数集是等势的）。


#### 简介
Redis 2.8.9 版本就更新了 HyperLogLogs 数据结构    
优点: 占用内存是固定的  2^64 不同的元素的技术   只需要12kb 的内存   若从内存角度比较的话 HyperLogLogs 首选   
Redis HyperLogLogs 基数统计算法   
**网页UV(一个人访问网站多次, 但是还是算作一个人)**   
传统方式 set保存用户的id 然后就可以统计set元素数量就可以作为标准判断   
这种方式保存大量的用户id就会比较麻烦 我们的目的是为了计数 而不是保存用户id   
0.81%错误率 统计UV任务 可以忽略不记的

##### 
```sql
127.0.0.1:6379> PFadd mykey a b c d e f g h i j     ## 创建第一个元素 mykey
(integer) 1
127.0.0.1:6379> pfcount mykey                       ## 统计 mykey 元素的基数数量
(integer) 10
127.0.0.1:6379> PFadd mykey2 i j k l m n o p        ## 创建第二个元素 mykey2
(integer) 1
127.0.0.1:6379> pfcount mykey2
(integer) 8
127.0.0.1:6379> pfmerge mykey3 mykey mykey2         ## 合并两组 mykey mykey2 => mykey3 并集
OK
127.0.0.1:6379> pfcount mykey3
(integer) 16
127.0.0.1:6379> 
```


如果允许容错    那么一定可以使用 HyperLogLogs    
如果不允许容错  就使用set或者自己的数据类型即可

#### Bitmaps
##### 位存储
统计用户信息(活跃 不活跃)  
登录 未登录   打卡（365打卡）       
两个状态 都可以使用Bitmaps
Bitmaps 位图 数据结构 都是操作二进制位 来进行记录   
就只有 0 和1 两个状态
##### 测试
使用bitmap来记录周一到周日的打卡   
周一 1   周二 0  周三 1     周四 0  周五 1  周六 1  周日 0

```sql
127.0.0.1:6379> setbit sign 0 1
(integer) 0
127.0.0.1:6379> setbit sign 1 0
(integer) 0
127.0.0.1:6379> setbit sign 2 1
(integer) 0
127.0.0.1:6379> setbit sign 3 0
(integer) 0
127.0.0.1:6379> setbit sign 4 1
(integer) 0
127.0.0.1:6379> setbit sign 5 1
(integer) 0
127.0.0.1:6379> setbit sign 6 0
(integer) 0
127.0.0.1:6379>   
```

查看某一天是否打卡

```sql
127.0.0.1:6379> getbit sign 5
(integer) 1
127.0.0.1:6379> getbit sign 3
(integer) 0
127.0.0.1:6379> 
```

统计操作  统计打卡的天数

```sql
127.0.0.1:6379> bitcount sign
(integer) 4
127.0.0.1:6379>    
```


参考文献来源
http://blog.codinglabs.org


