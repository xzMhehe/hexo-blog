---
title: Bean的自动装配与注解开发
date: 2020-07-22 12:13:24
pin: false
toc: false
icons: []
tags: [Spring]
categories: [Spring]
keywords: [Spring]
headimg: https://s1.ax1x.com/2020/07/18/U2Mxvq.gif
thumbnail: https://s1.ax1x.com/2020/07/18/U2Mxvq.gif
description: Spring
---

# Bean的自动装配

- 自动装配是Spring满足Bean依赖的一种方式

- Spring会在上下文自动寻找, 并且自动给bean装配属性

在Spring中有三种装配的方式

- 在xml中显示的配置

- 在Java中显示配置

- **隐式的自动配置bean【重要】**

## 测试

- 搭建环境成功 ： 一个人有两个宠物

### ByName自动装配

```xml
    <bean id="cat" class="cn.com.codingce.pojo.Cat"/>
    <bean id="dog" class="cn.com.codingce.pojo.Dog"/>
<!--
        byName：会自动在容器上下文查找, 和自己对象set方法后面的值对应的beanid
        byType：会自动在容器上下文查找, 和自己对象属性相同的beanid
    -->
    <bean id="people" class="cn.com.codingce.pojo.People" autowire="byName">
        <property name="name" value="掌上编程"/>
<!--        <property name="dog" ref="dog"/>-->
<!--        <property name="cat" ref="cat"/>-->
     </bean>
```
### ByType自动装配
```xml
    <bean id="cat" class="cn.com.codingce.pojo.Cat"/>
    <bean id="dog" class="cn.com.codingce.pojo.Dog"/>
<!--
        byName：会自动在容器上下文查找, 和自己对象set方法后面的值对应的beanid
        byType：会自动在容器上下文查找, 和自己对象属性相同的beanid
    -->
    <bean id="people" class="cn.com.codingce.pojo.People" autowire="byType">
        <property name="name" value="掌上编程"/>
<!--        <property name="dog" ref="dog"/>-->
<!--        <property name="cat" ref="cat"/>-->
     </bean>
```

### 小结 

- byName的时候, 需要保证所有bean的id唯一, 并且这个bean需要和自动注入的属性的set方法的值一致

- byType的时候, 需要保证所有class的id唯一, 并且这个bean需要和自动注入的属性的类型一样

## 使用注解实现自动装配
JDK1.5支持注解，Spring2.5就支持注解了
The introduction of annotation-based configuration raised the question of whether this approach is "better" than XML

要用注解须知

- 导入约束 context  

- 配置注解的支持<context:annotation-config/>

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd">

        <context:annoation-config/>
</beans>
```

### @Autowired
直接使用在属性上即可! 也可以在set方式上的使用
使用Autowired我们就可以不用使用Set方法了, 前提是你这个自动装配属性在IOC(Spring)容器中存在, 且符合名字byname
科普:

```java
@Nullable: 字段标记了这个注解, 说明这个字段可以为null；

```
```java

public @interface Autowired {
    boolean required() default true;
}
```

```java

public class People {

    //如果显示的定义了Autowried的required属性为false, 说明这个对象可以为Null 否则不许为空
    @Autowired
    private Cat cat;
    @Autowired
    private Dog dog;
    private String name;
}
```

如果@Autowired自动装配的环境比较复杂, 自动装配无法通过一个注解【@Autowired】完成的时候，我们可以使用@Qualifier(value="dog22")
去配合@Autowired的使用

### Resource注解
```java
public class People {
    @Resource
    private Cat cat;
    @Resource
    private Dog dog;
    private String name;
}
```

小结: 
@Resource与@Autowired的区别

- 都是用来自动装配, 都可以放在属性字段上

- @Autowired是通过byType的方式实现, 而且必须要求这个对象存在!

- @Resource默认通过byName的方式实现, 如果找不到名字, 则通过byType实现, 如果两个都找不到的情况下就报错

- 执行顺序不同:  @Autowired通过btType的方式实现。@Resource默认通过byName的方式来实现


# 使用注解开发

- bean

```java
注解说明
@Component: 组件放在类名上, 说明这个类被Spring管理了, 就是Bean
@Value: 相当于等价<property name="name" value="掌上编程" />
```

- 属性如何注入

```java
@Component
public class User {

    @Value("掌上编程")
    public String name;

}
```
- 衍生的注解

@Componment有几个衍生的注解, 我们在Web开发中, 会按照mvc三层架构分层
    - dao【@Repository】
    - service【@Service】
    - controller【@Controller】
    这四个注解功能都是一样的, 都是代表将某个类注册到Spring, 装配Bean

- 作用域

```java
@Component
@Scope("prototype")
public class User {
    @Value("掌上编程")
    public String name;

    @Value("掌上编程")
    public void setName(String name) {
        this.name = name;
    }
}
```

小结:
xml与注解

- xml更加万能, 适用于任何场合! 维护简单方便

- 注解不是自己的类使用不了, 维护相对复杂！

xml与注解最佳实践

- xml用来管理bean;

- 注解只负责完成属性的注入.

- 我们在使用过程中, 只需要注意一个问题: 必须让注解生效, 就需要开启注解的支持

```xml
    <!--指定要扫描的包, 这个包下的注解就会生效-->
    <context:component-scan base-package="cn.com.codingce"/>
    <!--开启注解的支持-->
    <context:annotation-config/>
```

# 使用Java的方式配置Spring

我们现在要完全不使用Spring的xml的配置了, 全权交给Java来做
JavaConfig是Spring的一个子项目, 在Spring4之后, 它成为了一个核心的功能.


实体类
```java
package cn.com.codingce.pojo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

//这里这个注解的意思, 就是说明这个类被Spring接管了, 注册到了容器中
@Component
public class User {
    private String name;

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Value("掌上编程")//属性注入值
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                '}';
    }
}


```
配置文件

```java
package cn.com.codingce.config;

import cn.com.codingce.pojo.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * @Configuration加上这个注解就相当于beans
 * @author xzMa
 */
//这个也会被Spring托管, 注册到容器中, 因为它本来就是个@Component, @Configuration代表一个配置类, 就和我们之前看到的beans.xml
@Configuration
@ComponentScan("cn.com.codingce.pojo")
@Import(ZeConfig2.class)
public class ZeConfig {

    //注册一个bean, 就相当于我们之前写的一个bean标签
    //这个方法的名字, 就相当于bean标签中的id属性
    //这个方法返回值, 就相当于bean标签中的class属性
    @Bean
    public User getUser() {
        return new User();//就是返回要注入到bean的对象!
    }

}

```


>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java