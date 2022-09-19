---
title: ElasticSearch和solr的区别
date: 2021-01-13 14:58:12
pin: false
toc: false
icons: []
tags: [Elasticsearch]
categories: [Elasticsearch]
keywords: [Elasticsearch]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200907050.jpg
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200907050.jpg
description: Elasticsearch
---

### Elasticsearch 和 solr 的区别


#### Elasticsearch 简介
Elasticsearch是一个开源（Apache 2许可证），是一个基于Apache Lucene库构建的RESTful搜索引擎。

Elasticsearch是在Solr之后几年推出的。它提供了一个分布式，多租户能力的全文搜索引擎，具有HTTP Web界面（REST）和无架构JSON文档。Elasticsearch的官方客户端库提供Java，Groovy，PHP，Ruby，Perl，Python，.NET和Javascript。

分布式搜索引擎包括可以划分为分片的索引，并且每个分片可以具有多个副本。每个Elasticsearch节点都可以有一个或多个分片，其引擎也可以充当协调器，将操作委派给正确的分片。

Elasticsearch可通过近实时搜索进行扩展。其主要功能之一是多​​租户。

主要功能列表包括：
- 分布式搜索

- 多租户

- 分析搜索

- 分组和聚合

#### solr 简介
Apache Solr是一个基于名为Lucene的Java库构建的开源搜索平台。它以用户友好的方式提供Apache Lucene的搜索功能。作为一个行业参与者近十年，它是一个成熟的产品，拥有强大而广泛的用户社区。它提供分布式索引，复制，负载平衡查询以及自动故障转移和恢复。如果它被正确部署然后管理得好，它就能够成为一个高度可靠，可扩展且容错的搜索引擎。很多互联网巨头，如Netflix，eBay，Instagram和亚马逊（CloudSearch）都使用Solr，因为它能够索引和搜索多个站点。

主要功能列表包括：

- 全文搜索

- 突出

- 分面搜索

- 实时索引

- 动态群集

- 数据库集成

- NoSQL功能和丰富的文档处理（例如Word和PDF文件）


#### Luncene 简介
Lucene 是一个基于 Java 的全文信息检索工具包，它不是一个完整的搜索应用程序，而是为你的应用程序提供索引和搜索功能。Lucene 目前是 Apache Jakarta 家族中的一个开源项目。也是目前最为流行的基于 Java 开源全文检索工具包。


### Elasticsearch和Solr比较
![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200908973.png)


![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200908564.png)


![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200908340.png)

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200908323.png)


### Elasticsearch 与 Solr 的比较总结

- 二者安装都很简单；

- Solr 利用 Zookeeper 进行分布式管理，而 Elasticsearch 自身带有分布式协调管理功能;

- Solr 支持更多格式的数据，而 Elasticsearch 仅支持json文件格式；

- Solr 官方提供的功能更多，而 Elasticsearch 本身更注重于核心功能，高级功能多有第三方插件提供；

- Solr 在传统的搜索应用中表现好于 Elasticsearch，但在处理实时搜索应用时效率明显低于 Elasticsearch。

- Solr 是传统搜索应用的有力解决方案，但 Elasticsearch 更适用于新兴的实时搜索应用。


>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java