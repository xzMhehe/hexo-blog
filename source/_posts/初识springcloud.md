---
title: 初识springcloud
date: 2020-09-02 13:28:39
tags:
- SpringCloud
categories: 
- SpringCloud
---

Spring Cloud 是一套完整的微服务解决方案，基于 Spring Boot 框架，准确的说，它不是一个框架，而是一个大的容器，它将市面上较好的微服务框架集成进来，从而简化了开发者的代码量。


# Spring Cloud 是什么？
Spring Cloud 是一系列框架的有序集合，它利用 Spring Boot 的开发便利性简化了分布式系统的开发，比如服务发现、服务网关、服务路由、链路追踪等。Spring Cloud 并不重复造轮子，而是将市面上开发得比较好的模块集成进去，进行封装，从而减少了各模块的开发成本。换句话说：Spring Cloud 提供了构建分布式系统所需的“全家桶”。

# Spring Cloud 现状
目前，国内使用 Spring Cloud 技术的公司并不多见，不是因为 Spring Cloud 不好，主要原因有以下几点：
- Spring Cloud 中文文档较少，出现问题网上没有太多的解决方案。
- 国内创业型公司技术老大大多是阿里系员工，而阿里系多采用 Dubbo 来构建微服务架构。
- 大型公司基本都有自己的分布式解决方案，而中小型公司的架构很多用不上微服务，所以没有采用 Spring Cloud 的必要性。

但是，微服务架构是一个趋势，而 Spring Cloud 是微服务解决方案的佼佼者.

# Spring Cloud 优缺点
优点
- 集大成者，Spring Cloud 包含了微服务架构的方方面面。
- 约定优于配置，基于注解，没有配置文件。
- 轻量级组件，Spring Cloud 整合的组件大多比较轻量级，且都是各自领域的佼佼者。
- 开发简便，Spring Cloud 对各个组件进行了大量的封装，从而简化了开发。
- 开发灵活，Spring Cloud 的组件都是解耦的，开发人员可以灵活按需选择组件。

缺点
- 项目结构复杂，每一个组件或者每一个服务都需要创建一个项目。
- 部署门槛高，项目部署需要配合 Docker 等容器技术进行集群部署，而要想深入了解 Docker，学习成本高。

Spring Cloud 的优势是显而易见的。学习 Spring Cloud 是一个不错的选择。

![mark](http://image.codingce.com.cn/blog/20200902/133801032.png)




# Spring Cloud 和 Dubbo 对比
Dubbo 只是实现了服务治理，而 Spring Cloud 实现了微服务架构的方方面面，服务治理只是其中的一个方面。下面通过一张图对其进行比较：
![mark](http://image.codingce.com.cn/blog/20200902/134210366.png)

可以看出，Spring Cloud 比较全面，而 Dubbo 由于只实现了服务治理，需要集成其他模块，需要单独引入，增加了学习成本和集成成本。

# 项目结构
![mark](http://image.codingce.com.cn/blog/20200908/121907787.png)

## 总包
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.4.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>cn.com.codingce</groupId>
    <artifactId>springcloud</artifactId>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <module>springcloud-api</module>
        <module>springcloud-provider-dept</module>
        <module>springcloud-consumer-dept</module>
    </modules>

    <!--打包方式-->
    <packaging>pom</packaging>

    <!--统一配置 版本号-->
    <properties>
        <junit.version>4.12</junit.version>
        <lombok.version>1.16.10</lombok.version>
        <mysql.version>8.0.11</mysql.version>
        <druid.version>1.1.10</druid.version>
        <logbackcore.version>1.2.3</logbackcore.version>
    </properties>

    <dependencyManagement>
        <dependencies>

            <!-- springcloud的依赖 -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Greenwich.SR1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!--springboot依赖-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <scope>2.1.4.RELEASE</scope>
            </dependency>

            <!--连接数据库-->
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
            </dependency>

            <!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>druid</artifactId>
                <version>${druid.version}</version>
            </dependency>

            <!-- https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter -->
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>1.3.2</version>
            </dependency>

            <!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-core -->
            <dependency>
                <groupId>ch.qos.logback</groupId>
                <artifactId>logback-core</artifactId>
                <version>1.2.3</version>
            </dependency>

            <!-- https://mvnrepository.com/artifact/junit/junit -->
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>${junit.version}</version>
            </dependency>

            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </dependency>

            <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-devtools -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-devtools</artifactId>
                <version>2.2.2.RELEASE</version>
            </dependency>

            <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-jetty -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-jetty</artifactId>
                <version>2.0.1.RELEASE</version>
            </dependency>

            <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
                <version>2.0.1.RELEASE</version>
            </dependency>

            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-devtools</artifactId>
                <version>2.1.4.RELEASE</version>
            </dependency>

        </dependencies>
    </dependencyManagement>


</project>
```

## 实体类
### pom
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>cn.com.codingce</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>springcloud-api</artifactId>

    <dependencies>
        <!--当前module自己需要的依赖, 如果父依赖中已经配置了版本-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <!--junit-->
<!--        <dependency>-->
<!--            <groupId>junit</groupId>-->
<!--            <artifactId>junit</artifactId>-->
<!--        </dependency>-->

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
        </dependency>

    </dependencies>
</project>
```
### Dept
```java
package cn.com.codingce.pojo;

import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * @author xzMa
 * Dept实体类 orm  类表关系映射
 */
@Accessors  //链式写法
public class Dept implements Serializable {
    private Long deptno;
    private String dname;
    private String db_source;

    /**
     * Dept dept = new Dept();
     * dept.setDeptNo("").setDeptyName().....  都行
     */

    public Dept() {
    }

    public Dept(Long deptno, String dname, String db_source) {
        this.deptno = deptno;
        this.dname = dname;
        this.db_source = db_source;
    }


    public Long getDeptno() {
        return deptno;
    }

    public void setDeptno(Long deptno) {
        this.deptno = deptno;
    }

    public String getDname() {
        return dname;
    }

    public void setDname(String dname) {
        this.dname = dname;
    }

    public String getDb_source() {
        return db_source;
    }

    public void setDb_source(String db_source) {
        this.db_source = db_source;
    }

    @Override
    public String toString() {
        return "Dept{" +
                "deptno=" + deptno +
                ", dname='" + dname + '\'' +
                ", db_source='" + db_source + '\'' +
                '}';
    }
}
```

## 服务端
### pom
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>cn.com.codingce</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>springcloud-provider-dept</artifactId>

    <dependencies>
        <!--我们需要拿到实体类, 所以要配置api -module-->
        <dependency>
            <groupId>cn.com.codingce</groupId>
            <artifactId>springcloud-api</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <!--junit-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-core -->
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
        </dependency>

        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-test</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

<!--        &lt;!&ndash;jetty&ndash;&gt;-->
<!--        &lt;!&ndash; https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-jetty &ndash;&gt;-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jetty</artifactId>
        </dependency>

        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
    </dependencies>
</project>
```
### Controller
```java
package cn.com.codingce.controller;

import cn.com.codingce.pojo.Dept;
import cn.com.codingce.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author xzMa
 *
 * 提供RestFul服务
 */
@RestController
public class DeptController {

    @Resource
    private DeptService deptService;

    @PostMapping("/dept/add")
    public boolean addDept(Dept dept) {
        return deptService.addDept(dept);
    }

    @GetMapping("/dept/get/{id}")
    public Dept queryBuId(@PathVariable("id") Long id) {
        return deptService.queryById(id);
    }

    @GetMapping("/dept/list")
    public List<Dept> queryAll() {
        return deptService.queryAll();
    }

}
```

### DAO (mapper)
```java
package cn.com.codingce.dao;

import cn.com.codingce.pojo.Dept;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface DeptDao {

    public boolean addDept(Dept dept);

    public Dept queryById(Long id);

    public List<Dept> queryAll();

}
```

### Mapper.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="cn.com.codingce.dao.DeptDao">

    <insert id="addDept" parameterType="Dept">
        insert into dept(dname, db_source) values (#{dname}, DATABASE())
    </insert>
    
    <select id="queryById" parameterType="Long" resultType="Dept">
        select * from dept where deptno = #{deptno}
    </select>

    <select id="queryAll" resultType="Dept">
        select * from dept
    </select>

</mapper>
```

### Service接口
```java
package cn.com.codingce.service;

import cn.com.codingce.pojo.Dept;

import java.util.List;

public interface DeptService {
    public boolean addDept(Dept dept);

    public Dept queryById(Long id);

    public List<Dept> queryAll();
}
```

### Service实现类
```java
package cn.com.codingce.service;

import cn.com.codingce.dao.DeptDao;
import cn.com.codingce.pojo.Dept;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class DeptServiceImpl implements DeptService {

    @Resource
    private DeptDao deptDao;

    @Override
    public boolean addDept(Dept dept) {
        return deptDao.addDept(dept);
    }

    @Override
    public Dept queryById(Long id) {
        return deptDao.queryById(id);
    }

    @Override
    public List<Dept> queryAll() {
        return deptDao.queryAll();
    }
}
```

### mybatis-config.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!--核心配置文件-->
<configuration>
    <!--开启二级缓存-->
    <settings>
        <setting name="cacheEnabled" value="true"/>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
</configuration>
```

### application.yml
```yml
server:
  port: 8001

#mybatis配置
mybatis:
  type-aliases-package: cn.com.codingce.pojo
  config-location: classpath:mybatis/mybatis-config.xml
  mapper-locations: classpath:mybatis/mapper/*.xml
#  configuration:
#    map-underscore-to-camel-case: true

# spring配置
spring:
  application:
    name: springcloud-provider-dept
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource # 数据源 德鲁伊
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://cdb-q9atzwrq.bj.tencentcdb.com:10167/db01?useSSL=true
    username: root
    password: 123456
```

## 客户端
### pom
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>cn.com.codingce</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>springcloud-consumer-dept</artifactId>

    <dependencies>
        <!--我们需要拿到实体类, 所以要配置api -module-->
        <dependency>
            <groupId>cn.com.codingce</groupId>
            <artifactId>springcloud-api</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>

        <!--热部署工具-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```
### 配置文件
```java
package cn.com.codingce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ConfigBean {   //configuration -- spring applicationContext.xml

    @Bean
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

}
```

### Controller
```java
package cn.com.codingce.controller;

import cn.com.codingce.pojo.Dept;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class DeptConsumerController {

    // 理解消费者, 不应该有service层
    //RestFul风格
    //(url, 实体: Map classs<T> responseType)

    @Autowired
    private RestTemplate restTemplate;  //提供多种便捷访问远程http服务的方法

    private static final String REST_URL_PREFIX = "http://localhost:8001";


    @RequestMapping("/consumer/dept/add")
    public boolean add(Dept dept) {
        return restTemplate.postForObject(REST_URL_PREFIX + "/dept/add", dept, Boolean.class);
    }

    //http://localhost:8001/dept/list
    @RequestMapping("/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Long id) {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/get/" + id, Dept.class );
    }

    @RequestMapping("/consumer/dept/list")
    public List<Dept> list() {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/list" , List.class );
    }

}
```

### application.yml
```yml
server:
  port: 80
```

>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java