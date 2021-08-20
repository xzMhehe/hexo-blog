---
title: Spring配置
date: 2020-07-21 08:31:41
pin: false
toc: false
icons: []
tags: [Spring]
categories: [Spring]
keywords: [Spring]
headimg: https://s1.ax1x.com/2020/07/28/aEe2b8.gif
thumbnail: https://s1.ax1x.com/2020/07/28/aEe2b8.gif
description: Spring
---

# Spring配置
## 别名

```xml
    <!--别名,别名区分大小写, 我们也可以使用别名获取到这个对象-->
    <alias name="user" alias="aliasUser"/>
```

```java
public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        User user = (User) context.getBean("aliasUser");
        System.out.println(user.toString());
    }
```

## Bean配置

```xml
    <!--
        id: bean 唯一标识符, 也就是相当于我们学的对象名
        class: bean对象所对应的类型
        name: 也是别名, 而且name更高级 可以取多个别名name="user2, u2" name="user2"
    -->
    <bean id="userT" class="cn.com.codingce.pojo.User" name="user2, u2">
        <property name="name" value="掌上开源"/>
    </bean>
```

```java
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        User user = (User) context.getBean("u2");
        System.out.println(user.toString());
    }
```

## import
这个import, 一般用于团队开发使用, 它可以将多个配置文件, 导入合并为一个
假设现在项目有多个人开发, 这三个人复制不同的类开发, 不同的类需要注册在不同的bean中, 我们可以利用import将所有人的beans.xml合并为一个总的, 使用的时候直接使用总的

- 张三

- 李四

- 王五

- applicationContext.xml

```xml
    <import resource="beans.xml"/>
    <import resource="beans2.xml"/>
    <import resource="beans3.xml"/>
```

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200848644.png)


>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java