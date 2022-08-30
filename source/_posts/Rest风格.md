---
title: ES的Rest风格
date: 2021-01-17 19:43:35
tags:
- Elasticsearch
categories:     
- Elasticsearch
---


## 什么是REST
REST是一种软件架构风格，或者说是一种规范，其强调HTTP应当以资源为中心，并且规范了URI的风格；规范了HTTP请求动作（GET/PUT/POST/DELETE/HEAD/OPTIONS）的使用，具有对应的语义。
核心概念包括：



|method|url地址| 描述 |
| - | - | - |
| PUT | localhost:9200/索引名称/类型名称/文档id | 创建文档(指定文档 id)|
| POST | localhost:9200/索引名称/类型名称 | 创建文档(随机文档 id)|
| POST | localhost:9200/索引名称/类型名称/文档id/_update | 修改文档|
| DELETE | localhost:9200/索引名称/类型名称/文档id | 删除文档|
| GET | localhost:9200/索引名称/类型名称/文档id | 查询文档通过文档 id |
| POST | localhost:9200/索引名称/类型名称/_search | 查询所有数据 |


## 基础测试

### 创建一个索引

>PUT    /索引名/~类型名~/文档 id
{
    请求体    
}

```json
PUT /test1/type1/1
{
  "name":"后端码匠",
  "age":12
}
```

返回结果
```json
#! Deprecation: [types removal] Specifying types in document index requests is deprecated, use the typeless endpoints instead (/{index}/_doc/{id}, /{index}/_doc, or /{index}/_create/{id}).
{
  "_index" : "test1",
  "_type" : "type1",
  "_id" : "1",
  "_version" : 2,
  "result" : "updated",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 1,
  "_primary_term" : 1
}
```

### 数据类型
```bash
（1）字符串类型： text, keyword
（2）数字类型：long, integer, short, byte, double, float, half_float, scaled_float
（3）日期：date
（4）日期 纳秒：date_nanos
（5）布尔型：boolean
（6）二进制类型 Binary：binary
（7）Range: integer_range, float_range, long_range, double_range, date_range
```

### 创建具体的索引规则
```json
PUT /test2
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      }, 
      "age": {
        "type": "long"
      },
      "birthday": {
        "type": "date"
      }
    }
  }
}
```

返回结果
```json
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "test2"
}
```

### GET 获取具体信息
获取这个规则, 可以通过 GET 获取具体信息
```json
GET test2
```

返回结果
```json
{
  "test2" : {
    "aliases" : { },
    "mappings" : {
      "properties" : {
        "age" : {
          "type" : "long"
        },
        "birthday" : {
          "type" : "date"
        },
        "name" : {
          "type" : "text"
        }
      }
    },
    "settings" : {
      "index" : {
        "routing" : {
          "allocation" : {
            "include" : {
              "_tier_preference" : "data_content"
            }
          }
        },
        "number_of_shards" : "1",
        "provided_name" : "test2",
        "creation_date" : "1610936976952",
        "number_of_replicas" : "1",
        "uuid" : "qqzV0yIqR7CqT_liFewR4Q",
        "version" : {
          "created" : "7100199"
        }
      }
    }
  }
}
```

### 查看默认的信息

```json
PUT /test3/_doc/1
{
  "name": "后端码匠",
  "age": 18,
  "birth": "1997-01-25" 
}
```

返回结果
```json
{
  "_index" : "test3",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```

```json
GET test3
```

```json
{
  "test3" : {
    "aliases" : { },
    "mappings" : {
      "properties" : {
        "age" : {
          "type" : "long"
        },
        "birth" : {
          "type" : "date"
        },
        "name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
      }
    },
    "settings" : {
      "index" : {
        "routing" : {
          "allocation" : {
            "include" : {
              "_tier_preference" : "data_content"
            }
          }
        },
        "number_of_shards" : "1",
        "provided_name" : "test3",
        "creation_date" : "1610937747174",
        "number_of_replicas" : "1",
        "uuid" : "Hok1PejKSByKuW6ozyQpEA",
        "version" : {
          "created" : "7100199"
        }
      }
    }
  }
}
```

如果自己的文档没有指定, 那么es就会给我们默认配置字段类型

### 其他命令

获取 es 当前的信息
```bash
GET _cat/indices?v
```
返回结果
```js
health status index                           uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   test2                           qqzV0yIqR7CqT_liFewR4Q   1   1          0            0       208b           208b
yellow open   test3                           Hok1PejKSByKuW6ozyQpEA   1   1          1            0      4.3kb          4.3kb
green  open   .apm-custom-link                A-jNeoZWTDKtQqpf_Kqqog   1   0          0            0       208b           208b
yellow open   xinze                           Gn2y36z2Tpq2jvxBhM0ogg   5   1          0            0        1kb            1kb
green  open   .kibana_task_manager_1          STLFw_63S6a_t5HBC5fW9w   1   0          5          157    153.5kb        153.5kb
green  open   .apm-agent-configuration        bZJ-56bwQFKQekHd5GFdgQ   1   0          0            0       208b           208b
green  open   .kibana-event-log-7.10.1-000001 HUjThpyTQMeJr-QSwMXNLQ   1   0          3            0     16.4kb         16.4kb
green  open   .kibana_2                       hJZflBGSSkqIgWWX_15Ofg   1   0         48           69      4.2mb          4.2mb
yellow open   test1                           a8pjIRrfTsqtTmaAaXRZKg   5   1          1            1      6.2kb          6.2kb
green  open   .kibana_1                       Gi93gw00SzSFVN5dQxrLig   1   0          1            0      5.1kb          5.1kb
green  open   .tasks                          UDpsMCO1SyasUGAJTqxFgw   1   0          1            0      6.9kb          6.9kb
```

修改索引
依旧使用 `PUT` 然后覆盖
```json
POST /test3/_doc/1/_update
{
    "name": "后端码匠关注就对了"
}
```


删除索引
```bash
DELETE test1
```











>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java
