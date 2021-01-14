---
title: ES、Kibana 的安装
date: 2021-01-13 16:18:41
tags:
- Elasticsearch
categories: 
- Elasticsearch
---

## ES安装
环境： jdk1.8 +

>下载：https://www.elastic.co/cn/downloads/elasticsearch
>https://www.elastic.co/cn/downloads/kibana
>https://www.elastic.co/cn/downloads/logstash
>https://elasticsearch.cn/download/ 



## 文件夹讲解
```bsah
bin     启动文件
config  配置文件
    log4g2  日志配置文件
    jvm.options     java 虚拟机相关配置
    elasticsearch.yml       elasticsearch 的配置文件        默认端口 9200
lib     相关 jar 包
modules     功能模块
plgins      插件
```

## 启动
bin 目录下  elasticsearch.bat

```bash
s=true, -XX:-OmitStackTraceInFastThrow, -Dio.netty.noUnsafe=true, -Dio.netty.noKeySetOptimization=true, -Dio.netty.recycler.maxCapacityPerThread=0, -Dio.netty.allocator.numDirectArenas=0, -Dlog4j.shutdownHookEnabled=false, -Dlog4j2.disable.jmx=true, -Djava.locale.providers=SPI,JRE, -Xms1g, -Xmx1g, -XX:+UseConcMarkSweepGC, -XX:CMSInitiatingOccupancyFraction=75, -XX:+UseCMSInitiatingOccupancyOnly, -Djava.io.tmpdir=C:\Users\mxz\AppData\Local\Temp\elasticsearch, -XX:+HeapDumpOnOutOfMemoryError, -XX:HeapDumpPath=data, -XX:ErrorFile=logs/hs_err_pid%p.log, -XX:+PrintGCDetails, -XX:+PrintGCDateStamps, -XX:+PrintTenuringDistribution, -XX:+PrintGCApplicationStoppedTime, -Xloggc:logs/gc.log, -XX:+UseGCLogFileRotation, -XX:NumberOfGCLogFiles=32, -XX:GCLogFileSize=64m, -XX:MaxDirectMemorySize=536870912, -Delasticsearch, -Des.path.home=D:\develop\elasticsearch-7.10.1, -Des.path.conf=D:\develop\elasticsearch-7.10.1\config, -Des.distribution.flavor=default, -Des.distribution.type=zip, -Des.bundled_jdk=true]
[2021-01-14T10:45:37,310][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [aggs-matrix-stats]
[2021-01-14T10:45:37,311][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [analysis-common]
[2021-01-14T10:45:37,312][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [constant-keyword]
[2021-01-14T10:45:37,313][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [flattened]
[2021-01-14T10:45:37,315][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [frozen-indices]
[2021-01-14T10:45:37,316][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [ingest-common]
[2021-01-14T10:45:37,316][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [ingest-geoip]
[2021-01-14T10:45:37,316][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [ingest-user-agent]
[2021-01-14T10:45:37,317][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [kibana]
[2021-01-14T10:45:37,318][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [lang-expression]
[2021-01-14T10:45:37,318][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [lang-mustache]
[2021-01-14T10:45:37,319][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [lang-painless]
[2021-01-14T10:45:37,319][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [mapper-extras]
[2021-01-14T10:45:37,320][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [mapper-version]
[2021-01-14T10:45:37,322][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [parent-join]
[2021-01-14T10:45:37,323][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [percolator]
[2021-01-14T10:45:37,323][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [rank-eval]
[2021-01-14T10:45:37,324][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [reindex]
[2021-01-14T10:45:37,324][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [repositories-metering-api]
[2021-01-14T10:45:37,325][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [repository-url]
[2021-01-14T10:45:37,325][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [search-business-rules]
[2021-01-14T10:45:37,326][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [searchable-snapshots]
[2021-01-14T10:45:37,326][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [spatial]
[2021-01-14T10:45:37,327][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [transform]
[2021-01-14T10:45:37,327][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [transport-netty4]
[2021-01-14T10:45:37,329][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [unsigned-long]
[2021-01-14T10:45:37,332][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [vectors]
[2021-01-14T10:45:37,333][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [wildcard]
[2021-01-14T10:45:37,334][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-analytics]
[2021-01-14T10:45:37,335][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-async]
[2021-01-14T10:45:37,336][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-async-search]
[2021-01-14T10:45:37,338][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-autoscaling]
[2021-01-14T10:45:37,338][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-ccr]
[2021-01-14T10:45:37,339][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-core]
[2021-01-14T10:45:37,339][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-data-streams]
[2021-01-14T10:45:37,340][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-deprecation]
[2021-01-14T10:45:37,340][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-enrich]
[2021-01-14T10:45:37,341][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-eql]
[2021-01-14T10:45:37,343][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-graph]
[2021-01-14T10:45:37,343][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-identity-provider]
[2021-01-14T10:45:37,344][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-ilm]
[2021-01-14T10:45:37,344][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-logstash]
[2021-01-14T10:45:37,345][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-ml]
[2021-01-14T10:45:37,347][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-monitoring]
[2021-01-14T10:45:37,348][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-ql]
[2021-01-14T10:45:37,349][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-rollup]
[2021-01-14T10:45:37,349][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-security]
[2021-01-14T10:45:37,350][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-sql]
[2021-01-14T10:45:37,351][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-stack]
[2021-01-14T10:45:37,352][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-voting-only-node]
[2021-01-14T10:45:37,352][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] loaded module [x-pack-watcher]
[2021-01-14T10:45:37,353][INFO ][o.e.p.PluginsService     ] [DESKTOP-GMI8GKQ] no plugins loaded
[2021-01-14T10:45:38,355][INFO ][o.e.e.NodeEnvironment    ] [DESKTOP-GMI8GKQ] using [1] data paths, mounts [[Other (D:)]], net usable_space [67.7gb], net total_space [223.5gb], types [NTFS]
[2021-01-14T10:45:38,357][INFO ][o.e.e.NodeEnvironment    ] [DESKTOP-GMI8GKQ] heap size [990.7mb], compressed ordinary object pointers [true]
[2021-01-14T10:45:39,319][INFO ][o.e.n.Node               ] [DESKTOP-GMI8GKQ] node name [DESKTOP-GMI8GKQ], node ID [l9QI6GPERM--zFeLCz22PA], cluster name [elasticsearch], roles [transform, master, remote_cluster_client, data, ml, data_content, data_hot, data_warm, data_cold, ingest]
[2021-01-14T10:45:45,449][INFO ][o.e.x.m.p.l.CppLogMessageHandler] [DESKTOP-GMI8GKQ] [controller/4644] [Main.cc@114] controller (64 bit): Version 7.10.1 (Build 11e1ac84105757) Copyright (c) 2020 Elasticsearch BV
[2021-01-14T10:45:46,320][INFO ][o.e.x.s.a.s.FileRolesStore] [DESKTOP-GMI8GKQ] parsed [0] roles from file [D:\develop\elasticsearch-7.10.1\config\roles.yml]
[2021-01-14T10:45:48,191][INFO ][o.e.t.NettyAllocator     ] [DESKTOP-GMI8GKQ] creating NettyAllocator with the following configs: [name=unpooled, suggested_max_allocation_size=1mb, factors={es.unsafe.use_unpooled_allocator=null, g1gc_enabled=false, g1gc_region_size=0b, heap_size=990.7mb}]
[2021-01-14T10:45:48,298][INFO ][o.e.d.DiscoveryModule    ] [DESKTOP-GMI8GKQ] using discovery type [zen] and seed hosts providers [settings]
[2021-01-14T10:45:49,133][WARN ][o.e.g.DanglingIndicesState] [DESKTOP-GMI8GKQ] gateway.auto_import_dangling_indices is disabled, dangling indices will not be automatically detected or imported and must be managed manually
[2021-01-14T10:45:49,982][INFO ][o.e.n.Node               ] [DESKTOP-GMI8GKQ] initialized
[2021-01-14T10:45:49,983][INFO ][o.e.n.Node               ] [DESKTOP-GMI8GKQ] starting ...
[2021-01-14T10:45:51,766][INFO ][o.e.t.TransportService   ] [DESKTOP-GMI8GKQ] publish_address {127.0.0.1:9300}, bound_addresses {127.0.0.1:9300}, {[::1]:9300}
[2021-01-14T10:45:55,609][WARN ][o.e.b.BootstrapChecks    ] [DESKTOP-GMI8GKQ] the default discovery settings are unsuitable for production use; at least one of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_master_nodes] must be configured
[2021-01-14T10:45:55,633][INFO ][o.e.c.c.ClusterBootstrapService] [DESKTOP-GMI8GKQ] no discovery configuration found, will perform best-effort cluster bootstrapping after [3s] unless existing master is discovered
[2021-01-14T10:45:58,652][INFO ][o.e.c.c.Coordinator      ] [DESKTOP-GMI8GKQ] setting initial configuration to VotingConfiguration{l9QI6GPERM--zFeLCz22PA}
[2021-01-14T10:45:58,921][INFO ][o.e.c.s.MasterService    ] [DESKTOP-GMI8GKQ] elected-as-master ([1] nodes joined)[{DESKTOP-GMI8GKQ}{l9QI6GPERM--zFeLCz22PA}{Byj7n_tjSD-QtmteenBccQ}{127.0.0.1}{127.0.0.1:9300}{cdhilmrstw}{ml.machine_memory=8371810304, xpack.installed=true, transform.node=true, ml.max_open_jobs=20} elect leader, _BECOME_MASTER_TASK_, _FINISH_ELECTION_], term: 1, version: 1, delta: master node changed {previous [], current [{DESKTOP-GMI8GKQ}{l9QI6GPERM--zFeLCz22PA}{Byj7n_tjSD-QtmteenBccQ}{127.0.0.1}{127.0.0.1:9300}{cdhilmrstw}{ml.machine_memory=8371810304, xpack.installed=true, transform.node=true, ml.max_open_jobs=20}]}
[2021-01-14T10:45:59,019][INFO ][o.e.c.c.CoordinationState] [DESKTOP-GMI8GKQ] cluster UUID set to [6NOP0Q0eREKjcEqRpwHvgg]
[2021-01-14T10:45:59,075][INFO ][o.e.c.s.ClusterApplierService] [DESKTOP-GMI8GKQ] master node changed {previous [], current [{DESKTOP-GMI8GKQ}{l9QI6GPERM--zFeLCz22PA}{Byj7n_tjSD-QtmteenBccQ}{127.0.0.1}{127.0.0.1:9300}{cdhilmrstw}{ml.machine_memory=8371810304, xpack.installed=true, transform.node=true, ml.max_open_jobs=20}]}, term: 1, version: 1, reason: Publication{term=1, version=1}
[2021-01-14T10:45:59,149][INFO ][o.e.x.c.t.IndexTemplateRegistry] [DESKTOP-GMI8GKQ] adding legacy template [.ml-anomalies-] for [ml], because it doesn't exist
[2021-01-14T10:45:59,150][INFO ][o.e.x.c.t.IndexTemplateRegistry] [DESKTOP-GMI8GKQ] adding legacy template [.ml-state] for [ml], because it doesn't exist
[2021-01-14T10:45:59,152][INFO ][o.e.x.c.t.IndexTemplateRegistry] [DESKTOP-GMI8GKQ] adding legacy template [.ml-config] for [ml], because it doesn't exist
[2021-01-14T10:45:59,153][INFO ][o.e.x.c.t.IndexTemplateRegistry] [DESKTOP-GMI8GKQ] adding legacy template [.ml-inference-000003] for [ml], because it doesn't exist
[2021-01-14T10:45:59,181][INFO ][o.e.x.c.t.IndexTemplateRegistry] [DESKTOP-GMI8GKQ] adding legacy template [.ml-meta] for [ml], because it doesn't exist
[2021-01-14T10:45:59,183][INFO ][o.e.x.c.t.IndexTemplateRegistry] [DESKTOP-GMI8GKQ] adding legacy template [.ml-notifications-000001] for [ml], because it doesn't exist
[2021-01-14T10:45:59,185][INFO ][o.e.x.c.t.IndexTemplateRegistry] [DESKTOP-GMI8GKQ] adding legacy template [.ml-stats] for [ml], because it doesn't exist
[2021-01-14T10:45:59,319][INFO ][o.e.g.GatewayService     ] [DESKTOP-GMI8GKQ] recovered [0] indices into cluster_state
[2021-01-14T10:45:59,931][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.ml-anomalies-] for index patterns [.ml-anomalies-*]
[2021-01-14T10:46:00,268][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.ml-config] for index patterns [.ml-config]
[2021-01-14T10:46:00,376][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.ml-state] for index patterns [.ml-state*]
[2021-01-14T10:46:00,567][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.ml-inference-000003] for index patterns [.ml-inference-000003]
[2021-01-14T10:46:00,677][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.ml-meta] for index patterns [.ml-meta]
[2021-01-14T10:46:00,791][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.ml-notifications-000001] for index patterns [.ml-notifications-000001]
[2021-01-14T10:46:00,875][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.ml-stats] for index patterns [.ml-stats-*]
[2021-01-14T10:46:00,925][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding component template [metrics-settings]
[2021-01-14T10:46:01,009][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding component template [synthetics-settings]
[2021-01-14T10:46:01,060][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding component template [synthetics-mappings]
[2021-01-14T10:46:01,109][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding component template [logs-mappings]
[2021-01-14T10:46:01,154][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding component template [metrics-mappings]
[2021-01-14T10:46:01,197][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding component template [logs-settings]
[2021-01-14T10:46:01,279][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [.watch-history-12] for index patterns [.watcher-history-12*]
[2021-01-14T10:46:01,347][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [.triggered_watches] for index patterns [.triggered_watches*]
[2021-01-14T10:46:01,362][INFO ][o.e.h.AbstractHttpServerTransport] [DESKTOP-GMI8GKQ] publish_address {127.0.0.1:9200}, bound_addresses {127.0.0.1:9200}, {[::1]:9200}
[2021-01-14T10:46:01,366][INFO ][o.e.n.Node               ] [DESKTOP-GMI8GKQ] started
[2021-01-14T10:46:01,408][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [.watches] for index patterns [.watches*]
[2021-01-14T10:46:01,452][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [ilm-history] for index patterns [ilm-history-3*]
[2021-01-14T10:46:01,496][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [.slm-history] for index patterns [.slm-history-3*]
[2021-01-14T10:46:01,541][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.monitoring-alerts-7] for index patterns [.monitoring-alerts-7]
[2021-01-14T10:46:01,602][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.monitoring-es] for index patterns [.monitoring-es-7-*]
[2021-01-14T10:46:01,649][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.monitoring-kibana] for index patterns [.monitoring-kibana-7-*]
[2021-01-14T10:46:01,701][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.monitoring-logstash] for index patterns [.monitoring-logstash-7-*]
[2021-01-14T10:46:01,748][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding template [.monitoring-beats] for index patterns [.monitoring-beats-7-*]
[2021-01-14T10:46:01,797][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [synthetics] for index patterns [synthetics-*-*]
[2021-01-14T10:46:01,843][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [metrics] for index patterns [metrics-*-*]
[2021-01-14T10:46:01,893][INFO ][o.e.c.m.MetadataIndexTemplateService] [DESKTOP-GMI8GKQ] adding index template [logs] for index patterns [logs-*-*]
[2021-01-14T10:46:01,939][INFO ][o.e.x.i.a.TransportPutLifecycleAction] [DESKTOP-GMI8GKQ] adding index lifecycle policy [ml-size-based-ilm-policy]
[2021-01-14T10:46:01,998][INFO ][o.e.x.i.a.TransportPutLifecycleAction] [DESKTOP-GMI8GKQ] adding index lifecycle policy [logs]
[2021-01-14T10:46:02,038][INFO ][o.e.x.i.a.TransportPutLifecycleAction] [DESKTOP-GMI8GKQ] adding index lifecycle policy [metrics]
[2021-01-14T10:46:02,076][INFO ][o.e.x.i.a.TransportPutLifecycleAction] [DESKTOP-GMI8GKQ] adding index lifecycle policy [synthetics]
[2021-01-14T10:46:02,118][INFO ][o.e.x.i.a.TransportPutLifecycleAction] [DESKTOP-GMI8GKQ] adding index lifecycle policy [watch-history-ilm-policy]
[2021-01-14T10:46:02,157][INFO ][o.e.x.i.a.TransportPutLifecycleAction] [DESKTOP-GMI8GKQ] adding index lifecycle policy [ilm-history-ilm-policy]
[2021-01-14T10:46:02,202][INFO ][o.e.x.i.a.TransportPutLifecycleAction] [DESKTOP-GMI8GKQ] adding index lifecycle policy [slm-history-ilm-policy]
[2021-01-14T10:46:02,387][INFO ][o.e.l.LicenseService     ] [DESKTOP-GMI8GKQ] license [2860a673-8bb3-4fd4-bbd8-2632d55645c3] mode [basic] - valid
[2021-01-14T10:46:02,390][INFO ][o.e.x.s.s.SecurityStatusChangeListener] [DESKTOP-GMI8GKQ] Active license is now [BASIC]; Security is disabled
```

访问 `http://localhost:9200/`

## 安装可视化界面 es head 插件
- 下载地址： https://github.com/mobz/elasticsearch-head/tree/master

- 启动
>Running with built in server
git clone git://github.com/mobz/elasticsearch-head.git
cd elasticsearch-head
npm install
npm run start
open http://localhost:9100/


- 存在跨域问题在 es配置文件配置

```bash
http.cors.enabled: true
http.cors.allow-origin: "*"
```


- 重启 ES

初学就把es当作一个数据库(可以建立索引(库), 文档(库中的数据))

![](https://image.codingce.com.cn/elhead.png)



## Kibana 的安装

### 了解ELK
ELK是三个开源软件的缩写，分别表示：Elasticsearch , Logstash, Kibana , 它们都是开源软件。新增了一个FileBeat，它是一个轻量级的日志收集处理工具(Agent)，Filebeat占用资源少，适合于在各个服务器上搜集日志后传输给Logstash，官方也推荐此工具。

Elasticsearch是个开源分布式搜索引擎，提供搜集、分析、存储数据三大功能。它的特点有：分布式，零配置，自动发现，索引自动分片，索引副本机制，restful风格接口，多数据源，自动搜索负载等。
Logstash 主要是用来日志的搜集、分析、过滤日志的工具，支持大量的数据获取方式。一般工作方式为c/s架构，client端安装在需要收集日志的主机上，server端负责将收到的各节点日志进行过滤、修改等操作在一并发往elasticsearch上去。

**Kibana** 也是一个开源和免费的工具，Kibana可以为 Logstash 和 ElasticSearch 提供的日志分析友好的 Web 界面，可以帮助汇总、分析和搜索重要数据日志。

![](https://image.codingce.com.cn/elk1.png)

### 启动
bin目录下kibana.bat
```bash
  log   [09:42:43.291] [info][plugins-service] Plugin "visTypeXy" is disabled.
  log   [09:42:43.305] [info][plugins-service] Plugin "auditTrail" is disabled.
  log   [09:42:43.370] [warning][config][deprecation] Config key [monitoring.cluster_alerts.email_notifications.email_address] will be required for email notifications to work in 8.0."
  log   [09:42:43.675] [info][plugins-system] Setting up [96] plugins: [taskManager,licensing,globalSearch,globalSearchProviders,code,usageCollection,xpackLegacy,telemetryCollectionManager,telemetry,telemetryCollectionXpack,kibanaUsageCollection,securityOss,newsfeed,mapsLegacy,kibanaLegacy,translations,share,legacyExport,embeddable,uiActionsEnhanced,expressions,data,home,observability,cloud,console,consoleExtensions,apmOss,searchprofiler,painlessLab,grokdebugger,management,indexPatternManagement,advancedSettings,fileUpload,savedObjects,dashboard,visualizations,visTypeVega,visTypeTimelion,timelion,features,upgradeAssistant,security,snapshotRestore,enterpriseSearch,encryptedSavedObjects,ingestManager,indexManagement,remoteClusters,crossClusterReplication,indexLifecycleManagement,dashboardMode,beatsManagement,transform,ingestPipelines,maps,licenseManagement,graph,dataEnhanced,visTypeTable,visTypeMarkdown,tileMap,regionMap,inputControlVis,visualize,esUiShared,charts,lens,visTypeVislib,visTypeTimeseries,rollup,visTypeTagcloud,visTypeMetric,watcher,discover,discoverEnhanced,savedObjectsManagement,spaces,reporting,lists,eventLog,actions,case,alerts,stackAlerts,triggersActionsUi,ml,securitySolution,infra,monitoring,logstash,apm,uptime,bfetch,canvas]
  log   [09:42:43.978] [warning][config][plugins][security] Generating a random key for xpack.security.encryptionKey. To prevent sessions from being invalidated on restart, please set xpack.security.encryptionKey in kibana.yml
  log   [09:42:43.978] [warning][config][plugins][security] Session cookies will be transmitted over insecure connections. This is not recommended.
  log   [09:42:44.033] [warning][config][encryptedSavedObjects][plugins] Generating a random key for xpack.encryptedSavedObjects.encryptionKey. To be able to decrypt encrypted saved objects attributes after restart, please set xpack.encryptedSavedObjects.encryptionKey in kibana.yml
  log   [09:42:44.044] [warning][ingestManager][plugins] Fleet APIs are disabled due to the Encrypted Saved Objects plugin using an ephemeral encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in kibana.yml.
  log   [09:42:44.178] [warning][config][plugins][reporting] Generating a random key for xpack.reporting.encryptionKey. To prevent sessions from being invalidated on restart, please set xpack.reporting.encryptionKey in kibana.yml
  log   [09:42:44.182] [info][config][plugins][reporting] Chromium sandbox provides an additional layer of protection, and is supported for Win32 OS. Automatically enabling Chromium sandbox.
  log   [09:42:44.200] [warning][actions][actions][plugins] APIs are disabled due to the Encrypted Saved Objects plugin using an ephemeral encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in kibana.yml.
  log   [09:42:44.310] [warning][alerting][alerts][plugins][plugins] APIs are disabled due to the Encrypted Saved Objects plugin using an ephemeral encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in kibana.yml.
  log   [09:42:44.474] [info][monitoring][monitoring][plugins] config sourced from: production cluster
  log   [09:42:44.738] [info][savedobjects-service] Waiting until all Elasticsearch nodes are compatible with Kibana before starting saved objects migrations...
  log   [09:42:45.409] [info][savedobjects-service] Starting saved objects migrations
  log   [09:42:45.491] [info][savedobjects-service] Creating index .kibana_task_manager_1.
  log   [09:42:45.659] [info][savedobjects-service] Creating index .kibana_1.
  log   [09:42:48.662] [info][savedobjects-service] Pointing alias .kibana_task_manager to .kibana_task_manager_1.
  log   [09:42:48.832] [info][savedobjects-service] Pointing alias .kibana to .kibana_1.
  log   [09:42:49.107] [info][savedobjects-service] Finished in 3616ms.
  log   [09:42:49.257] [info][savedobjects-service] Finished in 3768ms.
  log   [09:42:49.320] [info][plugins-system] Starting [96] plugins: [taskManager,licensing,globalSearch,globalSearchProviders,code,usageCollection,xpackLegacy,telemetryCollectionManager,telemetry,telemetryCollectionXpack,kibanaUsageCollection,securityOss,newsfeed,mapsLegacy,kibanaLegacy,translations,share,legacyExport,embeddable,uiActionsEnhanced,expressions,data,home,observability,cloud,console,consoleExtensions,apmOss,searchprofiler,painlessLab,grokdebugger,management,indexPatternManagement,advancedSettings,fileUpload,savedObjects,dashboard,visualizations,visTypeVega,visTypeTimelion,timelion,features,upgradeAssistant,security,snapshotRestore,enterpriseSearch,encryptedSavedObjects,ingestManager,indexManagement,remoteClusters,crossClusterReplication,indexLifecycleManagement,dashboardMode,beatsManagement,transform,ingestPipelines,maps,licenseManagement,graph,dataEnhanced,visTypeTable,visTypeMarkdown,tileMap,regionMap,inputControlVis,visualize,esUiShared,charts,lens,visTypeVislib,visTypeTimeseries,rollup,visTypeTagcloud,visTypeMetric,watcher,discover,discoverEnhanced,savedObjectsManagement,spaces,reporting,lists,eventLog,actions,case,alerts,stackAlerts,triggersActionsUi,ml,securitySolution,infra,monitoring,logstash,apm,uptime,bfetch,canvas]
  log   [09:42:49.323] [info][plugins][taskManager][taskManager] TaskManager is identified by the Kibana UUID: ab014865-546b-4ecf-a02d-f37e7c733238
  log   [09:42:49.645] [info][crossClusterReplication][plugins] Your basic license does not support crossClusterReplication. Please upgrade your license.
  log   [09:42:49.659] [info][plugins][watcher] Your basic license does not support watcher. Please upgrade your license.
  log   [09:42:49.664] [info][kibana-monitoring][monitoring][monitoring][plugins] Starting monitoring stats collection
  log   [09:42:51.493] [info][listening] Server running at http://localhost:5601
  log   [09:42:53.130] [info][server][Kibana][http] http server running at http://localhost:5601

```
>http://localhost:5601/

### 需要的可以汉化
D:\develop\kibana-7.10.1-windows-x86_64\config\kibana.yml
```bash
i18n.locale: "zh-CN"
```



















>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java