---
title: IK分词器详解
date: 2021-01-15 19:00:30
tags:
- Elasticsearch
categories: 
- Elasticsearch
---


## IK分词器插件

## 什么是 IK 分词器
分词:即把一段中文或者别的划分成一个个的关键字,我们在搜索时候会把自己的信息进行分词,会把数据库中或者索引库中的数据进行分词,然后进行一个匹配操作,默认的中文分词器是将每个字看成一个词,比如"我爱技术"会被分为"我","爱","技","术",这显然不符合要求,所以我们需要安装中文分词器IK来解决这个问题

IK提供了两个分词算法:ik_smart和ik_max_word

其中ik_smart为最少切分,ik_max_word为最细粒度划分

## 下载安装
同样下载不说直接安装.记得版本相同

解压缩后拷贝到ElasticSearch的plugins文件夹下

ik 目录

重启ES

之前是没有插件加载的

可以清晰的看到加载了 analysis-ik

也可以通过ES自带的工具查看 命令行执行 ElasticSearch-plugin list

## 进入Kibana测试

先测试 ik_smart

最少划分
```json
GET _analyze
{
  "analyzer": "ik_smart"
  , "text": "天津理工大学"
}
```
返回结果
```json
{
  "tokens" : [
    {
      "token" : "天津",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "理工大学",
      "start_offset" : 2,
      "end_offset" : 6,
      "type" : "CN_WORD",
      "position" : 1
    }
  ]
}

```




最细粒度划分
```json
GET _analyze
{
  "analyzer": "ik_max_word"
  , "text": "天津理工大学"
}
```
返回结果
```json
{
  "tokens" : [
    {
      "token" : "天津",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "理工大学",
      "start_offset" : 2,
      "end_offset" : 6,
      "type" : "CN_WORD",
      "position" : 1
    },
    {
      "token" : "理工大",
      "start_offset" : 2,
      "end_offset" : 5,
      "type" : "CN_WORD",
      "position" : 2
    },
    {
      "token" : "理工",
      "start_offset" : 2,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 3
    },
    {
      "token" : "工大",
      "start_offset" : 3,
      "end_offset" : 5,
      "type" : "CN_WORD",
      "position" : 4
    },
    {
      "token" : "大学",
      "start_offset" : 4,
      "end_offset" : 6,
      "type" : "CN_WORD",
      "position" : 5
    }
  ]
}
```



若发现结果没有区别, 而且他不认为 查询的词 比如 `鑫泽` 是一个词, 这就是一个问题,则么办呢?

这种自己需要的词,需要自己加到字典中

## IK分词器增加自己的配置
我们找到IK的配置文件, 位于ik/config/IKAnalyzer.cfg.xml

IKAnalyzer.cfg.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
	<comment>IK Analyzer 扩展配置</comment>
	<!--用户可以在这里配置自己的扩展字典 -->
	<entry key="ext_dict"></entry>
	 <!--用户可以在这里配置自己的扩展停止词字典-->
	<entry key="ext_stopwords"></entry>
	<!--用户可以在这里配置远程扩展字典 -->
	<!-- <entry key="remote_ext_dict">words_location</entry> -->
	<!--用户可以在这里配置远程扩展停止词字典-->
	<!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

修改后的IKAnalyzer.cfg.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
	<comment>IK Analyzer 扩展配置</comment>
	<!--用户可以在这里配置自己的扩展字典 -->
	<entry key="ext_dict">xinze.dic</entry>
	 <!--用户可以在这里配置自己的扩展停止词字典-->
	<entry key="ext_stopwords"></entry>
	<!--用户可以在这里配置远程扩展字典 -->
	<!-- <entry key="remote_ext_dict">words_location</entry> -->
	<!--用户可以在这里配置远程扩展停止词字典-->
	<!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

xinze.dic

```bash
鑫泽
```





测试
```json
GET _analyze
{
  "analyzer": "ik_smart"
  , "text": "超级喜欢鑫泽"
}
```

结果
```json
{
  "tokens" : [
    {
      "token" : "超级",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "喜欢",
      "start_offset" : 2,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 1
    },
    {
      "token" : "鑫泽",
      "start_offset" : 4,
      "end_offset" : 6,
      "type" : "CN_WORD",
      "position" : 2
    }
  ]
}
```







>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java