---
title: Redis性能瓶颈：如何优化大key问题？
date: 2023-05-25 13:37:24
tags:
- Redis
categories: 
- Redis
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202305251340373.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202305251340373.png
---

```bash
${AnsiColor.BRIGHT_BLACK}
__________           .___.__         ___.   .__        __                 
\______   \ ____   __| _/|__| ______ \_ |__ |__| ____ |  | __ ____ ___.__.
 |       _// __ \ / __ | |  |/  ___/  | __ \|  |/ ___\|  |/ // __ <   |  |
 |    |   \  ___// /_/ | |  |\___ \   | \_\ \  / /_/  >    <\  ___/\___  |
 |____|_  /\___  >____ | |__/____  >  |___  /__\___  /|__|_ \\___  > ____|
        \/     \/     \/         \/       \/  /_____/      \/    \/\/        v1.0
${AnsiColor.BRIGHT_GREEN}
Application Version: ${application.version}${application.formatted-version}
Spring Boot Version: ${spring-boot.version}${spring-boot.formatted-version}

${AnsiColor.BLACK}
```

# Redis性能瓶颈：如何优化大key问题？

## 什么是Redis大key问题

Redis大key问题是指在Redis中出现了一个或多个非常大的key，这些key的大小超过了Redis所能处理的最大值，从而导致Redis性能下降甚至宕机的现象。通常情况下，Redis的key大小应该尽量保持在较小的范围内，因为Redis是一个基于内存的数据结构存储系统，大key会占用大量内存资源，导致Redis的性能受到严重影响。

多大的数据量才算是大key，具体取决于Redis服务器的内存大小、可用内存空间、系统负载等因素。一般来说，如果单个key的大小超过了几MB，就可能会对Redis服务器的性能产生影响，进而导致Redis大key问题的发生。

然而，实际上，Redis的性能瓶颈不仅仅取决于单个key的大小，还取决于key的总数、Redis服务器的内存使用率、CPU负载以及网络带宽等多个因素。因此，无法给出一个精确的大小界限来判断什么样的key算是大key。

在实际应用中，需要根据具体情况来评估key的大小和数量，以及Redis服务器的硬件配置和系统负载情况，从而确定一个合理的key大小范围，以避免Redis大key问题的发生。同时，也需要对数据模型进行优化，避免出现单个key过大的情况。

## Redis大key带来的影响

Redis大key会对Redis的性能和稳定性产生很大的影响，具体表现如下：

1. 内存占用：Redis是一种基于内存的数据结构存储系统，大key会占用大量的内存资源，导致Redis的内存使用率上升，进而导致Redis内存不足的错误；
2. 数据读写性能：大key会导致Redis的读写性能下降。当Redis需要读取或写入一个非常大的key时，需要占用更多的内存和CPU资源，导致Redis的响应时间变慢；
3. 服务器负载：大key会导致Redis服务器的负载增加，从而影响Redis服务器的稳定性和可靠性。当Redis需要处理大量的请求时，服务器的负载会变得非常高，可能会导致Redis服务器宕机或崩溃；
4. 数据备份和恢复：大key会对Redis的数据备份和恢复产生影响。当需要备份或恢复Redis的数据时，大key会导致备份和恢复的时间变长，可能会影响数据的完整性和可靠性。

Redis大key会对Redis的性能、稳定性、可靠性和数据备份与恢复产生不良影响，因此需要采取相应的措施来避免和解决Redis大key问题。

## 大key产生的原因

Redis大key问题产生的原因可能有多种，如以下原因：

1. 数据模型设计不合理：如果数据模型设计不合理，例如将大量数据存储在一个key中，或者使用一个大型散列表或集合存储数据，就容易导致单个key的大小过大，从而出现Redis大key问题；
2. 业务需求导致key过大：有些业务需求需要使用大型数据结构，例如使用大型字符串类型key存储数据，或者使用大型列表、集合、有序集合等数据结构类型，这些需求可能导致单个key的大小过大，从而出现Redis大key问题；
3. 数据量过大：如果Redis服务器存储的数据量过大，就容易出现单个key的大小过大的情况，从而导致Redis大key问题的发生；
4. 内存分配不均衡：如果Redis服务器的内存分配不均衡，例如某些key占用了大量内存资源，就容易导致Redis大key问题的发生。

## 怎样排查大key

### SCAN命令

通过使用Redis的SCAN命令，可以逐步遍历数据库中的所有Key。结合其它命令（如STRLEN、LLEN、SCARD、HLEN等），可以识别出大Key。SCAN命令的优势在于它可以在`不阻塞Redis实例`的情况下进行遍历。

### bigkeys参数

使用redis-cli命令客户端，连接Redis服务的时候，加上 --bigkeys 参数，可以扫描每种数据类型数量最大的key。

```bash
redis-cli -h localhost --bigkeys
```

### Redis RDB Tools工具

使用开源工具Redis RDB Tools，分析RDB文件，扫描出Redis大key。

如：输出占用内存大于2kb，排名前10的keys。

```bash
rdb --commond memory --bytes 2048 --largest 10 dump.rbd
```

## 怎么解决大key

1. 数据模型优化：对数据模型进行优化，避免将大量数据存储在一个key中，或者使用一个大型散列表或集合存储数据。可以将大型数据结构拆分成多个小型数据结构，或者使用Redis的分布式特性，将数据分散到多个节点上；
2. 数据切割：对于已经出现的大key，可以将其拆分成多个小型key，并通过Redis的管道技术批量处理这些小型key，比如对于 string 类型的大key，可以考虑拆分成多个 key - value。对于 hash 或者 list 类型，可以考虑拆分成多个 hash 或者 list。；
3. 懒删除：使用Redis的懒删除功能，当key过期后，Redis并不会立即删除该key，而是等到有读写操作时才进行删除，避免在删除大key时对Redis服务器造成过大的负担；
4. 过期时间设置：对于不需要长期保存的数据，可以设置较短的过期时间，避免数据长期占用Redis服务器的内存资源，导致大key问题的发生；
5. 持久化：可以使用Redis的RDB或AOF持久化功能，将数据保存到磁盘上，减少内存占用，提高Redis的稳定性和性能；
6. 增加硬件资源：如果Redis服务器的硬件资源不足，可以考虑增加硬件资源，例如增加内存大小或者增加Redis服务器的数量，以提高Redis的性能和稳定性；
7. 降低业务压力：如果Redis服务器承受的业务压力太大，可以采取一些措施，例如增加缓存层、优化数据库结构、进行数据缓存等，以减轻Redis服务器的压力，避免大key问题的发生；
8. 不用 Redis：Redis 对于长文本不是最优的，可考虑文档型数据库如：MongoDB 等。

