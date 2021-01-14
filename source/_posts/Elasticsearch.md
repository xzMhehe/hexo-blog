---
title: Elasticsearch
date: 2021-01-13 13:11:09
tags:
- Elasticsearch
categories: 
- Elasticsearch

---

## 聊聊Doug Cutting
Doug Cutting，Hadoop语言和Lucene工具包的创始人


###  个人经历
1985 年，Cutting 毕业于美国斯坦福大学。在大学时代的头两年，Cutting 学习了诸如物理、地理等常规课程，所以说他并不是一开始就决心投身 IT 行业的，因为学费的压力，Cutting 开始意识到，自己必须学习一些更加实用、有趣的技能。这样，一方面可以帮助自己还清贷款，另一方面，也是为自己未来的生活做打算。因为斯坦福大学座落在 IT 行业的“圣地”硅谷，所以学习软件对年轻人来说是再自然不过的事情了。

Cutting 的第一份工作是在 Xerox 做实习生，Xerox 当时的激光扫描仪上运行着三个不同的操作系统，其中的一个操作系统还没有屏幕保护程序。因此，Cutting 就开始为这套系统开发屏幕保护程序。由于这套程序是基于系统底层开发的，所以其他同事可以给这个程序添加不同的主题。这份工作给了Cutting 一定的满足感，也是他最早的“平台”级的作品。

可以说，Xerox 对 Cutting 后来研究搜索技术起到了决定性的影响，除了短暂的在苏格兰工作的经历外，Cutting 事业的起步阶段大部分都是在 Xerox 度过的，这段时间让他在搜索技术的知识上有了很大提高。他花了四年的时间搞研发，这四年中，他阅读了大量的论文，同时，自己也发表了很多论文，用 Cutting 自己的话说——“我的研究生是在 Xerox 读的。”


尽管 Xerox 让 Cutting 积累了不少技术知识，但他却认为，自己当时搞的这些研究只是纸上谈兵，没有人试验过这些理论的可实践性。于是，他决定勇敢地迈出这一步，让搜索技术可以为更多人所用。1997 年底，Cutting 开始以每周两天的时间投入，在家里试着用 Java 把这个想法变成现实，不久之后，Lucene 诞生了。作为第一个提供全文文本搜索的开源函数库，Lucene 的伟大自不必多言。

之后，Cutting 再接再厉，在 Lucene 的基础上将开源的思想继续深化。2004 年，Cutting 和同为程序员出身的 Mike Cafarella 决定开发一款可以代替当时的主流搜索产品的开源搜索引擎，这个项目被命名为 Nutch。在此之前，Cutting 所在的公司 Architext（其主要产品为 Excite 搜索引擎）因没有顶住互联网经济泡沫的冲击而破产，那时的 Cutting 正处在 Freelancer 的生涯中，所以他希望自己的项目能通过一种低开销的方式来构建网页中的大量算法。幸运的是，Google 这时正好发布了一项研究报告，报告中介绍了两款 Google 为支持自家的搜索引擎而开发的软件平台。这两个平台一个是 GFS（Google File System），用于存储不同设备所产生的海量数据；另一个是 MapReduce，它运行在 GFS 之上，负责分布式大规模数据。基于这两个平台，Cutting 最引人瞩目的作品——Hadoop 诞生了。谈到 Google 对他们的“帮助”，Cutting 说：“我们开始设想用 4~5 台电脑来实现这个项目，但在实际运行中牵涉了大量繁琐的步骤需要靠人工来完成。Google 的平台让这些步骤得以自动化，为我们实现整体框架打下了良好的基础。”

说起 Google，Cutting 也是它成长的见证人之一，这里有一段鲜为人知的故事。早在 Cutting 供职于 Architext 期间，有两个年轻人曾去拜访这家公司，并向他们兜售自己的搜索技术，但当时他们的 Demo 只检索出几百万条网页，Excite 的工程师们觉得他们的技术太小儿科，于是就在心里鄙视一番，把他们给送走了。但故事并未到此结束，这两个年轻人回去之后痛定思痛，决定自己创业。于是，他们开了一家自己的搜索公司，取名为 Google。这两个年轻人就是 Larry Page 和 Sergey Brin。在 Cutting 看来，Google 的成功主要取决于，反向排序之后再存储的设计和对自己技术的自信。

出于对时间成本的考虑，在从 Architext 离职四年后，Cutting 决定结束这段 Freelancer 的生涯，找一家靠谱的公司，进一步完善 Hadoop 的性能。他先后面试了几家公司，其中也包括 IBM，但 IBM 似乎对他的早期项目 Lucene 更感兴趣，至于 Hadoop 则不置可否。就在此时，Cutting 接受了当时 Yahoo! 搜索项目负责人 Raymie Stata 的邀请，于 2006 年正式加入 Yahoo!。在 Yahoo!，有一支一百人的团队帮助他完善 Hadoop 项目，这期间开发工作进行得卓有成效。 不久之后，Yahoo! 就宣布，将其旗下的搜索业务的架构迁移到 Hadoop 上来。两年后，Yahoo! 便基于 Hadoop 启动了第一个应用项目 “webmap”——一个用来计算网页间链接关系的算法。Cutting 的时任上司（后为 Hortonworks CEO）Eric Baldeschwieler 曾说：“在相同的硬件环境下，基于 Hadoop 的 webmap 的反应速度是之前系统的 33 倍。”

虽然 Hadoop 的表现惊艳，但在当时并非所有公司都有条件使用，与此同时，用户需求却在日益增加。有些大公司（如银行、电信公司、大型零售商等）只关注于产品，却不想在技术工程和咨询服务上过多投入，它们需要一个可以帮助其解决问题的平台，这就是 Cutting 后来跳槽到 Cloudera 的初衷。从某种程度上说，Cloudera 就是这么一个为那些在咨询和技术上有需求的公司提供服务的平台。它的客户大多来自于传统行业，希望通过 Hadoop 来处理之前只能被直接抛弃的大规模数据。现在，除了这些传统行业之外，Yahoo!、Facebook、eBay、LinkedIn 等公司都在使用 Hadoop，用 Cuttin话说，他们的团队被“无形之中扩大了”。

就是这样，一个原本不打算成就it事业的人在误打误撞之后凭借自己的天赋成就了自己的一片天地。


## Lucence 和 ElasticSearch 关系
ElasticSearch 是基于 Lucence 做了一些封装和加强

## ElasticSearch 概述

Elasticsearch 是一个分布式的开源搜索和分析引擎，适用于所有类型的数据，包括文本、数字、地理空间、结构化和非结构化数据。

Elasticsearch 是一个分布式的 RESTful 风格的搜索和数据分析引擎。
- 查询 ： Elasticsearch 允许执行和合并多种类型的搜索 — 结构化、非结构化、地理位置、度量指标 — 搜索方式随心而变。
- 分析 ： 找到与查询最匹配的十个文档是一回事。但是如果面对的是十亿行日志，又该如何解读呢？Elasticsearch 聚合让您能够从大处着眼，探索数据的趋势和模式。
- 速度 ： Elasticsearch 很快。真的，真的很快。
- 可扩展性 ： 可以在笔记本电脑上运行。 也可以在承载了 PB 级数据的成百上千台服务器上运行。
- 弹性 ： Elasticsearch 运行在一个分布式的环境中，从设计之初就考虑到了这一点。
- 灵活性 ： 具备多个案例场景。数字、文本、地理位置、结构化、非结构化。所有的数据类型都欢迎。
- HADOOP & SPARK ： Elasticsearch + Hadoop

由于Elasticsearch的功能强大和使用简单，维基百科、卫报、Stack Overflow、GitHub等都纷纷采用它来做搜索。现在，Elasticsearch已成为全文搜索领域的主流软件之一。

## 职位

职位描述   
1、计算机相关专业毕业，本科学历，5年以上开发经验；
2、精通整套 `ES/logstash/kibana` 框架原理，并有搭建和调优的能力
3、熟练掌握 Java 编程语言，3年以上大日志分析及监控项目开发经验；
4、对hadoop、spark组件有一定使用经验
5、熟悉kafka redis等相关技术
6、熟悉业界主流日志系统架构；
7、熟悉linux，有Shell编程经验；



>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java