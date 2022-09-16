---
title: 快速上手Spring
date: 2020-07-20 08:56:32
tags:
- Spring
categories:
- Spring

thumbnail: https://s1.ax1x.com/2020/07/28/aEZ67F.gif
---
## 导入Jar包
注 : spring 需要导入commons-logging进行日志记录 . 我们利用maven,他会自动下载对应的依赖项 .
```xml
<dependency>
   <groupId>org.springframework</groupId>
   <artifactId>spring-webmvc</artifactId>
   <version>5.1.10.RELEASE</version>
</dependency>
```
## 编写代码

- 编写一个Hello实体类

```java
public class Hello {

    private String name;

    public Hello() {
    }

    public Hello(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Hello{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

- 编写我们的spring文件,这里我们命名为beans.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--使用Spring来创建对象, 在Spring中这些都称为Bean
        类型  变量名 = new 类型()
        Hello hello = new Hello();

        id = 变量名
        class = new 的对象
        property 相当于给对象中的属性设置一个值
        根据set方法注入
    -->

    <bean id="hello" class="cn.com.codingce.pojo.Hello">
        <property name="name" value="Spring"/>
    </bean>

</beans>
```

- 测试

```java
public class MyTest {
    public static void main(String[] args) {
        //获取Spring上下文对象
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        //我们的对象现在都在Spring中管理了, 我们要使用, 直接去里面取出来
        Hello hello = (Hello)context.getBean("hello");
        System.out.println(hello.toString());
    }
}
```

## 思考
- Hello 对象是谁创建的 ?  【hello 对象是由Spring创建的Hello 对象的属性是怎么设置的 ?  hello 对象的属性是由Spring容器设置的
- 这个过程就叫控制反转 :
    - 控制 : 谁来控制对象的创建,传统应用程序的对象是由程序本身控制创建的,使用Spring后,对象是由Spring来创建的
    - 反转 : 程序本身不创建对象,而变成被动的接收对象 .
- 依赖注入 : 就是利用set方法来进行注入的.
- IOC是一种编程思想，由主动的编程变成被动的接收
- 可以通过newClassPathXmlApplicationContext去浏览一下底层源码

## 修改案例一
在案例一中， 新增一个Spring配置文件beans.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--使用Spring来创建对象, 在Spring中这些都称为Bean
        类型  变量名 = new 类型()
        Hello hello = new Hello();

        id = 变量名
        class = new 的对象
        property 相当于给对象中的属性设置一个值
        根据set方法注入
    -->

    <bean id="mysqlImpl" class="cn.com.codingce.dao.UserDaoMysqlImpl" />
    <bean id="oracleImpl" class="cn.com.codingce.dao.UserDaoOracleImpl" />
    <bean id="UserServiceImpl" class="cn.com.codingce.service.UserServiceImpl">
        <!--ref 引用Spring容器中创建好的对象
            value: 具体的值基本数据类型
            -->
        <property name="userDao" ref="mysqlImpl"/>
    </bean>
</beans>
```

测试
```java
public class MyTest {
//    public static void main(String[] args) {
//        //用户实际调用的是业务层, dao层他们不需要接触
//        UserService userService = new UserServiceImpl();
//        ((UserServiceImpl)userService).setUserDao(new UserDaoMysqlImpl());
//        userService.getUser();
//    }

    public static void main(String[] args) {
        //获取ApplicationContext  拿到Spring的容器
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");

        //容器在手 需要什么就直接get
        UserServiceImpl userServiceImpl = (UserServiceImpl) context.getBean("UserServiceImpl");

        userServiceImpl.getUser();

    }
}
```

到了现在,我们彻底不用再程序中去改动了,要实现不同的操作,只需要在xml配置文件中进行修改,所谓的IoC,一句话搞定:对象由Spring 来创建,管理,装配!


## IOC创建对象方式(构造器)
### 通过无参构造方法来创建

- User.java

```java
public class User {

    private String name;

    public User() {
        System.out.println("走的无参");
    }

    public User(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

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

- beans.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="cn.com.codingce.pojo.User">
        <property name="name" value="掌上编程"/>
    </bean>
</beans>
```

- 测试类

```java
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        User user = (User) context.getBean("user");
        System.out.println(user.toString());
    }
```

结果可以发现，在调用toString方法之前，User对象已经通过无参构造初始化了!

### 通过有参构造方法来创建
- 下标赋值

```xml
    <!--第一种下标赋值-->
    <bean id="user" class="cn.com.codingce.pojo.User">
        <constructor-arg index="0" value="掌上编程"/>
    </bean>
```
 
- 参数类型

```xml
    <!--第二种参数类型 不建议使用 假设两个参数都是String-->
    <bean id="user" class="cn.com.codingce.pojo.User">
        <constructor-arg type="java.lang.String" value="掌上编程"/>
    </bean>
```

### 参数名来设置
```xml
    <!--第三种通过参数名来设置-->
    <bean id="user" class="cn.com.codingce.pojo.User">
        <constructor-arg name="name" value="掌上编程"/>
    </bean>
```
结论：在配置文件加载的时候。其中管理的对象都已经初始化了！



>文章已上传gitee: https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java