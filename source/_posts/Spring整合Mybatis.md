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
- 导入相关jar包
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

```java
public class User {

    private int id;
    private String name;
    private String pwd;
    }
```

- 编写核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!--核心配置文件-->
<configuration>
    <!--引入外部配置文件-->
    <properties resource="db.properties" />

    <!--标准日志工厂-->
    <settings>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>

    <!--别名   类就不用写长的包名了-->
    <typeAliases>
        <package name="cn.com.codingce.pojo"/>
    </typeAliases>

    <!--下面有两个配置, 默认是id=development  &amp;代表and(非&)-->
    <environments default="test">
        <environment id="test">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>


    <mappers>
        <mapper class="cn.com.codingce.mapper.UserMapper"/>
    </mappers>
</configuration>
```

- 编写接口

```java
package cn.com.codingce.mapper;

import cn.com.codingce.pojo.User;

import java.util.List;

public interface UserMapper {

    public List<User> selectUser();

}

```

- 编写Mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="cn.com.codingce.mapper.UserMapper">
    <select id="selectUser" resultType="user">
        select * from user;
    </select>
</mapper>

```

- 测试

```java
    @Test
    public void test1() throws IOException {
        String resources = "mybatis-config.xml";
        InputStream in = Resources.getResourceAsStream(resources);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(in);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<User> userList = mapper.selectUser();
        for (User user : userList) {
            System.out.println(user);
        }
    }
```

# Mybatis-Spring

- 编写数据源

```xml
    <!--
        遇到的问题以及解决方案
        https://blog.csdn.net/weixin_43874301/article/details/107732178
    -->

    <!--DateSource:使用Spring的数据源替换Mybatis的配置  c3p0 dbcp druid
        我们这里使用Spring提供的JDBC org.springframework.jdbc.datasource
    -->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://cdb-q9atzwrq.bj.tencentcdb.com:10167/mybatis?useSSL=true"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>
```

- sqlSessionFactory

```xml
    <!--sqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!--绑定Mybatis配置文件-->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <property name="mapperLocations" value="classpath:cn/com/codingce/mapper/*.xml"/>
    </bean>
```

- sqlSessionTemplate

```xml
    <!--SqlSessionTemplate 这就是我们使用的sqlSession-->
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <!--只能使用构造器注入sqlSessionFactory, 因为它没有set方法-->
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>
```

- 需要给接口添加实现类【】

```java
public class UserMapperImpl implements UserMapper {

    //我们所有操作, 都使用sqlSession来执行, 在原来, 现在都是用SqlSessionTemplate
    private SqlSessionTemplate sqlSession;

    public void setSqlSession(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }

    public List<User> selectUser() {
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<User> userList = mapper.selectUser();
        return userList;
    }
}
```

- 将自己的实现类，注入到Spring中

```xml
    <bean id="userMapper" class="cn.com.codingce.mapper.UserMapperImpl">
        <property name="sqlSession" ref="sqlSession"/>
    </bean>
```

- 测试使用即可

```java
    @Test
    public void test1() throws IOException {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        UserMapper userMapper = context.getBean("userMapper", UserMapper.class);
        for (User user : userMapper.selectUser()) {
            System.out.println(user);
        }
    }
```



>文章已上传gitee: https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java