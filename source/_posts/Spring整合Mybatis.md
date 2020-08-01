---
title: Spring整合Mybatis
date: 2020-08-01 09:23:33
tags:
- Spring
- MyBatis
categories:
- Spring
thumbnail: https://s1.ax1x.com/2020/07/28/aEexPJ.gif
---
# 整合Mybatis
- 导入相关jar宝
    - junit
    - mybatis
    - mysql数据库
    - spring相关的
    - aop织入
    - mybatis-spring 【new】
    ```xml
        <dependencies>
        <!--mybatis-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
        </dependency>
        <!--mysql驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.16</version>
        </dependency>

        <!--Spring操作数据库的话还需要一个spring-jdbc-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.1.9.RELEASE</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.aspectj/aspectjweaver -->
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.8.13</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.2</version>
        </dependency>


    </dependencies>

    <!--在build中配置resources, 来防止我们资源导出失败的问题-->
    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
    ```
- 编写配置文件
- 测试

# 回忆Mybatis（他认识你你不认识他）
- 编写实体类
- 编写核心配置文件
- 编写接口
- 编写Mapper.xml
- 测试

