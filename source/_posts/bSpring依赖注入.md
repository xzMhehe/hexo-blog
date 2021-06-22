---
title: Spring依赖注入
date: 2020-07-21 09:09:11
tags:
- Spring
categories:
- Spring

thumbnail: https://s1.ax1x.com/2020/07/18/U2Mv2n.gif
---
# 依赖注入
## 构造器注入
翻看上文

## Set方式注入【重点】
- 依赖注入: Set注入
    - 依赖: bean对象的创建依赖于容器 
    - 注入: bean对象中所有属性, 由容器来注入

【环境搭建】
- 复杂类型
- 真实测试对象

```java
public class Student {

    private String name;
    private Address address;
    private String[] books;
    private List<String> hobbys;
    private Map<String, String> card;
    private Set<String> games;
    private String wife;
    private Properties info;
}

```

```xml

<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="student" class="cn.com.codingce.pojo.Student">
        <!--普通值注入-->
        <property name="name" value="掌上编程"/>
    </bean>
</beans>
```
测试类
```java
    @Test
    public void Test() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        Student student = (Student) context.getBean("student");
        System.out.println(student.getName());;
    }
```



## 拓展方式
### p 命名空间注入
```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <import resource="userBean.xml"/>

    <!--xmlns:p="http://www.springframework.org/schema/p"    p 命名空间注入 可以直接注入属性的值 property标签操作-->
    <bean id="user" class="cn.com.codingce.pojo.User" p:age="12" p:name="掌上编程">
    </bean>

    <!--xmlns:c="http://www.springframework.org/schema/c"   c命名空间, 通过构造器注入: construct-args-->
    <bean id="user2" class="cn.com.codingce.pojo.User" c:age="18" c:name="人间事Life"/>

</beans>
```

```java
    @Test
    public void Test2() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        //这样就不用强转
        User user = context.getBean("user", User.class);
        User user2 = context.getBean("user2", User.class);
        System.out.println(user.toString());
    }
```

### c命名空间
```xml
    <!--xmlns:c="http://www.springframework.org/schema/c"   c命名空间, 通过构造器注入: construct-args-->
    <bean id="user2" class="cn.com.codingce.pojo.User" c:age="18" c:name="人间事Life"/>
```

```java
    @Test
    public void Test2() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        //这样就不用强转
        User user = context.getBean("user", User.class);
        User user2 = context.getBean("user2", User.class);
        System.out.println(user2.toString());
    }
```

注意一点: p命名空间和c命名空间不能直接使用需要导入 xml约束
xmlns:p="http://www.springframework.org/schema/p"
xmlns:c="http://www.springframework.org/schema/c"


## bean的作用域

- 单例模式(Spring默认机制)
```xml
    <bean id="user2" class="cn.com.codingce.pojo.User" c:age="18" c:name="人间事Life" scope="singleton"/>
```

- 原型模式：每次从容器get的时候, 都会产生一个新对象
```xml
    <bean id="user2" class="cn.com.codingce.pojo.User" c:age="18" c:name="人间事Life" scope="prototype"/>
```

- 其余的request、session、application这些只能存在于web开发中使用到!





>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java