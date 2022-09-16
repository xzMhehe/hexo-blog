---
title: ES核心概念
date: 2021-01-15 15:40:47
tags:
- Elasticsearch
categories: 
- Elasticsearch
---
### ES核心概念
ES中:集群,节点,索引,类型,文档,分片,映射都是什么?

ElasticSearch是面向文档的,关系型数据库和ElasticSearch客观的对比!

| Relation DB | Elasticsearch |
| - | - |
|数据库(database)|索引(indices)|
|表(table)|types|
|行(row)|documents|
|字段(columns)| fields |

elasticsearch(集群)中可以包含多个索引(数据库), 每个索引中可以包含多个类型(表), 每个类型下又包含多个文档(行), 每个文档中又包含多个字段(列)


### 物理设计

ElasticSearch在后台把每个索引划分成多个分片,每片分片可以在集群中的不同服务器之间迁移

### 逻辑设计

一个索引类型中,包含多个文档,例如说文档1,文档2,当我们索引一篇文档时,可以通过这样一个顺序找到它:

索引 -> 类型 -> 文档ID

通过这个组合我们就能所引导某个具体的文档

注意:ID不必是整数,实际上他是个字符串



### 文档

之前说ElasticSearch是面向文档的,那么就意味着索引和搜索数据的最小单位是文档,ElasticSearch中,文档有几个重要属性:   

- 自我包含,一篇文档同时包含字段和对应的值,也就是同时包含Key:value   
- 可以是层次型的,一个文档中包含子文档,复杂的逻辑实体就是你这么来的   
- 灵活的结构 ,文档不依赖预先定义的模式,我们知道关系型数据库中,要先提前定义字段才能使用,在ElasticSearch中,对于字段是非常灵活的有时候,有时候我们可以忽略该字段,或者动态添加一个新字段

尽管我们可以随意的新增和忽略某个字段,但是每个字段的类型非常重要,比如一个年龄字段类型,可以是字符串也可以是整型,因为ElasticSearch会保存字段和类型之间的映射及其他的设置,这种映射具体到每个映射的每种类型,这也是为什么在ElasticSearch中,类型有时候也称为映射类型   

### 类型

类型是文档的逻辑容器,就像关系型数据库一样,表格是行的容器,类型中对于字段的定义成为映射,比如name映射为字符串类型,我们说文档是无模式的,他们不需要拥有映射中所定义的所有字段,比如新增一个字段,那么ElasticSearch是则么做的呢?

ElasticSearch会自动的将新字段加入映射,但是这个字段的不确定他是什么类型,ElasticSearch就开始猜,如果这个值是16,那么ElasticSearch会认为它是整形,但是ElasticSearch也可能猜不对,所以最安全的方式就是提前定义好所需要的映射,这点跟关系型数据库殊途同归了,先定义好字段,然后再使用,别瞎整

### 索引
(就是数据库)

索引是映射类型的容器,ElasticSearch中的索引是一个非常的强大的文档集合,索引存储了映射类型的字段和其他设置,然后他们被存储到了各个分片上,我们来研究下分片是如何工作的

#### 物理设计:节点和分片 如何工作

一个集群至少有一个节点,而一个节点就是一个ElasticSearch进程节点可以有多个索引默认的,如果你创建索引,那么索引会至少有5个分片(primary shard ,又称为主分片)构成的,每一个主分片会有一个副本(replica shard,又称为复制分片)


![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108211257490.png)

上图是一个有3个节点的集群,可以看到主分片和对应的复制分片都不会在同一个节点内,这样有利于某个节点挂掉了,数据也不至于丢失,实际上一个分片就是一个Lucene索引,一个包含倒排索引的文件目录,倒排索引的结构使得ElasticSearch在不扫描全部文档的情况下,就可以告诉你那些文档包含特定的关键字,不过额,倒排索引是啥?


### 倒排索引

ElasticSearch使用的是一种称为倒排索引的结构,采用Lucene倒排索引作为底层,这种结构适用于快速的全文检索,一个索引由文档中所有不重复的列表构成,对于每一个词,都包含他的文档列表,

列如现在有两个文档,每个文档包含如下内容
![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108211257831.png)

 为了创建倒排索引,我们首先要将每个文档拆分成独立的词(或称为词条或者tokens),然后创建一个不包含所有补充度的词条的排序列表,然后列出每个词出现在那个文档

| term | doc_1 | doc_1 |
| - | - | - |
|Study|√|×|
|To|×|×|
|every|√|√|
|forever|√|√|
|day|√|√|
|study|×|√|
|good|√|√|
|every|√|√|
|to|√|×|
|up|√|√|

 现在,我们视图搜索 to forever,只需要查看包含每个词条的文档
| term | doc_1（权重高） | doc_1（权重低） |
| - | - | - |
|Study|√|×|
|To|×|×|
|every|√|√|
|forever|√|√|
|day|√|√|
|study|×|√|
|good|√|√|
|every|√|√|
|to|√|×|
|up|√|√|

通过二维表的命中,来决定搜索的结果和权重的高低

两个文档都匹配,但是第一个文档比第二个文档的匹配程度更高,如果没有别的条件,现在这个刘昂个包含关键字的文档都将返回

在来看一个示例,比如我们通过博客标题来搜索博客文章,那么倒排索引列表就是这样的一个是结构


<table>
	<tr>
	    <th colspan="2">博客文章(原始数据)</th>
	    <th colspan="2">索引列表</th>
	</tr >
	<tr >
	    <td>博客标题ID</td>
	    <td>标签</td>
	    <td>标签</td>
        <td>博客标题ID</td>
	</tr>
    <tr >
	    <td>1</td>
	    <td>python</td>
	    <td>python</td>
        <td>1, 2, 3</td>
	</tr>
    <tr >
	    <td>2</td>
	    <td>python</td>
	    <td>linux</td>
        <td>3, 4</td>
	</tr>
    <tr >
	    <td>3</td>
	    <td>linux, python</td>
	    <td>&nbsp;</td>
	    <td>&nbsp;</td>
	</tr>
    <tr >
	    <td>4</td>
	    <td>linux</td>
	    <td>&nbsp;</td>
        <td>&nbsp;</td>
	</tr>

</table>

如果要搜索含有python标签的文章,那相对于查找所有原始数据而言,查找倒排索引后的数据将会快的多,只需要查看标签这一栏,然后获取相关的文章ID即可,完全过滤到无关的数据,来提高检索的效率

#### ElasticSearch的索引和Lucene的索引对比    
在ElasticSearch中,索引这个词被频繁使用,这就是术语的使用,在ElasticSearch中,索引被分为多个分片,每份分片是一个Lucene的索引,所以一个ElasticSearch索引是由多个Lucene的索引组成的,这没啥好说的,因为ElasticSearch是使用,Lucene作为底层的封装,如无特指,说起索引都是指ElasticSearch的索引




>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java