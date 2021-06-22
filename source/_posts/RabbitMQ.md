---
title: MQ的引言不同MQ的特点
date: 2021-01-21 16:08:32
tags:
- RabbitMQ
categories: 
- RabbitMQ
---

![](https://image.codingce.com.cn/aa.jpg)


## MQ引言
### 什么是MQ
MQ（Message Queue）消息队列，是基础数据结构中“先进先出”的一种数据结构。一般用来解决应用解耦，异步消息，流量削峰等问题，实现高性能，高可用，可伸缩和最终一致性架构。
通过典型的`生产者`和`消费者`模型, 生产者不断向消息队列中生产消息, 消费者不断从队列中获取消息. 因为消息的生产和消费都是异步的, 而且只关心消息的发送和接受, 没有业务逻辑的侵入, 轻松的实现系统间解耦. 别名 `消息中间件` 通过利用高可用的消息传递机制进行平台的数据交流, 并基于数据通信来进行分布式系统的集成.

### MQ有哪些
ActiveMQ、RabbitMQ、RocketMQ、Kafka

### 不同MQ的特点
- ActiveMQ    
>单机吞吐量：万级   
　　topic数量都吞吐量的影响：  
　　时效性：ms级    
　　可用性：高，基于主从架构实现高可用性   
　　消息可靠性：有较低的概率丢失数据
　　功能支持：MQ领域的功能极其完备    
　　总结：    
　　　　非常成熟，功能强大，在早些年业内大量的公司以及项目中都有应用      
　　　　偶尔会有较低概率丢失消息     
　　　　现在社区以及国内应用都越来越少，官方社区现在对ActiveMQ 5.x维护越来越少，几个月才发布一个版本       
　　　　主要是基于解耦和异步来用的，较少在大规模吞吐的场景中使用    
 


- RabbitMQ
>单机吞吐量：万级     
　　topic数量都吞吐量的影响：   
　　时效性：微秒级，延时低是一大特点。    
　　可用性：高，基于主从架构实现高可用性     
　　消息可靠性：       
　　功能支持：基于erlang开发，所以并发能力很强，性能极其好，延时很低     
　　总结：　　   
　　　　erlang语言开发，性能极其好，延时很低；     
　　　　吞吐量到万级，MQ功能比较完备      
　　　　开源提供的管理界面非常棒，用起来很好用     
　　　　社区相对比较活跃，几乎每个月都发布几个版本分      
　　　　在国内一些互联网公司近几年用rabbitmq也比较多一些   但是问题也是显而易见的，RabbitMQ确实吞吐量会低一些，这是因为他做的实现机制比较重。      
　　　　erlang开发，很难去看懂源码，基本职能依赖于开源社区的快速维护和修复bug。     

　　　　rabbitmq集群动态扩展会很麻烦，不过这个我觉得还好。其实主要是erlang语言本身带来的问题。很难读源码，很难定制和掌控。



- RocketMQ
>单机吞吐量：十万级     
　　topic数量都吞吐量的影响：topic可以达到几百，几千个的级别，吞吐量会有较小幅度的下降。可支持大量topic是一大优势。     
　　时效性：ms级     
　　可用性：非常高，分布式架构      
　　消息可靠性：经过参数优化配置，消息可以做到0丢失    
　　功能支持：MQ功能较为完善，还是分布式的，扩展性好       
　　总结：      
　　　　接口简单易用，可以做到大规模吞吐，性能也非常好，分布式扩展也很方便，社区维护还可以，可靠性和可用性都是ok的，还可以支撑大规模的topic数量，支持复杂MQ业务场景        
　　　　而且一个很大的优势在于，源码是java，我们可以自己阅读源码，定制自己公司的MQ，可以掌控        
　　　　社区活跃度相对较为一般，不过也还可以，文档相对来说简单一些，然后接口这块不是按照标准JMS规范走的有些系统要迁移需要修改大量代码       



- Kafka
>单机吞吐量：十万级，最大的优点，就是吞吐量高。        
　　topic数量都吞吐量的影响：topic从几十个到几百个的时候，吞吐量会大幅度下降。所以在同等机器下，kafka尽量保证topic数量不要过多。如果要支撑大规模topic，需要增加更多的机器资源       
　　时效性：ms级      
　　可用性：非常高，kafka是分布式的，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用      
　　消息可靠性：经过参数优化配置，消息可以做到0丢失             
　　功能支持：功能较为简单，主要支持简单的MQ功能，在大数据领域的实时计算以及日志采集被大规模使用           
　　总结：             
　　　　kafka的特点其实很明显，就是仅仅提供较少的核心功能，但是提供超高的吞吐量，ms级的延迟，极高的可用性以及可靠性，而且分布式可以任意扩展                 
　　　　同时kafka最好是支撑较少的topic数量即可，保证其超高吞吐量                
　　　　kafka唯一的一点劣势是有可能消息重复消费，那么对数据准确性会造成极其轻微的影响，在大数据领域中以及日志采集中，这点轻微影响可以忽略             







>RabbitMQ 比 Kafaka可靠, Kafka 更适合IO高吞吐的处理, 一般用在大数据日志处理或对实时性(少量延迟), 可靠性(少量丢失数据), 要求稍低的场景使用, 比如ELK日志收集

## RabbitMQ引言
RabbitMQ是实现了高级消息队列协议（`AMQP`）的开源消息代理软件（亦称面向消息的中间件）。RabbitMQ服务器是用Erlang语言编写的，而集群和故障转移是构建在开放电信平台框架上的。所有主要的编程语言均有与代理接口通讯的客户端库。


- rabbitmq 官网：https://www.rabbitmq.com/
- erlang 环境 https://www.erlang.org/downloads           https://github.com/erlang/otp/releases

|RabbitMQ version|Minimum required Erlang/OTP|Maximum supported Erlang/OTP|
| - | - | - |
|3.8.10、3.8.9| 22.3 | 23.x |

- AMQP协议
AMQP（advanced message queuing protocol）`在2003年时被提出，最早用于解决金融领不同平台之间的消息传递交互问题。顾名思义，AMQP是一种协议，更准确的说是一种binary wire-level protocol（链接协议）。这是其和JMS的本质差别，AMQP不从API层进行限定，而是直接定义网络交换的数据格式。这使得实现了AMQP的provider天然性就是跨平台的。以下是AMQP协议模型:
![](https://image.codingce.com.cn/20210122111115.png)

## 安装
### Windows 安装
- 安装 erlang环境
- 配置 erlang环境变量
- 安装 rabbitmq

#### 使用
sbin 目录下
- RabbitMQ Service-install 安装服务
- RabbitMQ Service-remove 删除服务
- RabbitMQ Service-start 启动
- RabbitMQ Service-stop 启动


#### 访问 RabbitMQ 主页
在`sbin`目录启动控制台, 输入以下命令
```bash
rabbitmq-plugins.bat enable rabbitmq_management
```

通过 http://localhost:15672 访问

>默认账号密码: guest|guest


注意一点：当卸载重新安装的时候会出现 RabbitMQ 服务注册失败, 此时需要进入注册表 清理erlang 搜索 RabbitMQ ErlSrv, 对应的项全部删除


### Linux 安装
- 1.将rabbitmq安装包上传到linux系统中
	erlang-22.0.7-1.el7.x86_64.rpm
	rabbitmq-server-3.7.18-1.el7.noarch.rpm

- 2.安装Erlang依赖包
	rpm -ivh erlang-22.0.7-1.el7.x86_64.rpm

- 3.安装RabbitMQ安装包(需要联网)
	yum install -y rabbitmq-server-3.7.18-1.el7.noarch.rpm
		注意:默认安装完成后配置文件模板在:/usr/share/doc/rabbitmq-server-3.7.18/rabbitmq.config.example目录中,需要	
				将配置文件复制到/etc/rabbitmq/目录中,并修改名称为rabbitmq.config
- 4.复制配置文件
	cp /usr/share/doc/rabbitmq-server-3.7.18/rabbitmq.config.example /etc/rabbitmq/rabbitmq.config

- 5.查看配置文件位置
	ls /etc/rabbitmq/rabbitmq.config

- 6.修改配置文件(参见下图:)
	vim /etc/rabbitmq/rabbitmq.config

![](https://image.codingce.com.cn/20210122111442.png)


将上图中配置文件中红色部分去掉`%%`,以及最后的`,`逗号 修改为下图:
![](https://image.codingce.com.cn/20210122111518.png)

- 7.执行如下命令,启动rabbitmq中的插件管理
	rabbitmq-plugins enable rabbitmq_management
	
	出现如下说明:
		Enabling plugins on node rabbit@localhost:
    rabbitmq_management
    The following plugins have been configured:
      rabbitmq_management
      rabbitmq_management_agent
      rabbitmq_web_dispatch
    Applying plugin configuration to rabbit@localhost...
    The following plugins have been enabled:
      rabbitmq_management
      rabbitmq_management_agent
      rabbitmq_web_dispatch

    set 3 plugins.
    Offline change; changes will take effect at broker restart.

- 8.启动RabbitMQ的服务
	systemctl start rabbitmq-server
	systemctl restart rabbitmq-server
	systemctl stop rabbitmq-server
	

- 9.查看服务状态(见下图:)
	systemctl status rabbitmq-server
  ● rabbitmq-server.service - RabbitMQ broker
     Loaded: loaded (/usr/lib/systemd/system/rabbitmq-server.service; disabled; vendor preset: disabled)
     Active: active (running) since 三 2019-09-25 22:26:35 CST; 7s ago
   Main PID: 2904 (beam.smp)
     Status: "Initialized"
     CGroup: /system.slice/rabbitmq-server.service
             ├─2904 /usr/lib64/erlang/erts-10.4.4/bin/beam.smp -W w -A 64 -MBas ageffcbf -MHas ageffcbf -
             MBlmbcs...
             ├─3220 erl_child_setup 32768
             ├─3243 inet_gethost 4
             └─3244 inet_gethost 4
      .........

![](https://image.codingce.com.cn/20210122111606.png)

- 10.关闭防火墙服务
	systemctl disable firewalld
    Removed symlink /etc/systemd/system/multi-user.target.wants/firewalld.service.
    Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.
	systemctl stop firewalld   

也可以放开15672端口

- 11.访问web管理界面
	http://10.15.0.8:15672/



![](https://image.codingce.com.cn/20210122111701.png)


>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java