---
title: AOP
date: 2020-07-23 19:18:05
tags:
- Spring
categories:
- Spring


thumbnail: https://s1.ax1x.com/2020/07/28/aEexPJ.gif
---

# 代理模式
为什么要学习代理模式，因为AOP的底层机制就是动态代理！
代理模式：
- 静态代理

- 动态代理

学习aop之前 , 我们要先了解一下代理模式！

## 静态代理
静态代理角色分析
- 抽象角色 : 一般使用接口或者抽象类来实现
- 真实角色 : 被代理的角色
- 代理角色 : 代理真实角色 ; 代理真实角色后 , 一般会做一些附属的操作 .
- 客户  :  使用代理角色来进行一些操作 .


## 动态代理
- 动态代理的角色和静态代理的一样 .
- 动态代理的代理类是动态生成的 . 静态代理的代理类是我们提前写好的
- 动态代理分为两类 : 一类是基于接口动态代理 , 一类是基于类的动态代理
- 基于接口的动态代理----JDK动态代理
- 基于类的动态代理--cglib
- 现在用的比较多的是 javasist 来生成动态代理 . 百度一下javasist
- 我们这里使用JDK的原生代码来实现，其余的道理都是一样的！、
- JDK的动态代理需要了解两个类
- 核心 : InvocationHandler     和     Proxy   ， 打开JDK帮助文档看看
- 【InvocationHandler：调用处理程序】
![mark](http://image.codingce.com.cn/blog/20200729/083308753.png)



### 动态代理的好处
静态代理有的它都有，静态代理没有的，它也有！
- 可以使得我们的真实角色更加纯粹 . 不再去关注一些公共的事情 .
- 公共的业务由代理来完成 . 实现了业务的分工 ,
- 公共业务发生扩展时变得更加集中和方便 .
- 一个动态代理 , 一般代理某一类业务
- 一个动态代理可以代理多个类，代理的是接口！

### 代码
- 接口
```java
/**
 * @author xzMa
 * 租房
 */
public interface Rent {

    public void rent();

}
```

- 真实角色
```java
/**
 * @author xzMa
 * 房东
 *
 */
public class Host implements Rent {
    public void rent() {
        System.out.println("房东要出租房子");
    }
}
```
- 代理角色
```java
public class Proxy implements Rent {

    private Host host;

    public Proxy() {
    }

    public Proxy(Host host) {
        this.host = host;
    }


    public void rent() {
        seeHourse();
        host.rent();
        fare();
    }

    //看房
    public void seeHourse() {
        System.out.println("中介带你看房");
    }

    //合同
    public void heTong() {
        System.out.println("签租赁合同");
    }

    //中介费
    public void fare() {
        System.out.println("收中介费");
    }

}
```
- 客户端访问代理角色
```java
public class Client {

     public static void main(String[] args) {
        Host host = new Host();
        host.rent();
        //代理模式 中介帮房东租房子 但是呢 代理一般都有一些附属操作
         Proxy proxy = new Proxy(host);
         proxy.rent();

     }

}
```

### 缺点
- 一个真实角色就会产生一个代理角色, 代码量就会翻倍 开发效率会变低


## 静态代理详解

```java
public interface UserService {

    public void add();
    public void delete();
    public void update();
    public void query();
}
```

```java
//真实对象
public class UserServiceImpl implements UserService {
    public void add() {
        System.out.println("使用了add方法");
        System.out.println("添加了一个用户");
    }

    public void delete() {
        System.out.println("删除了用户");
    }

    public void update() {
        System.out.println("修改了一个用户");
    }

    public void query() {
        System.out.println("查询一个用户");
    }

    //1 改动原有的业务代码, 在公司中是大忌
}
```

```java
public class UserServiceProxy implements UserService {

    private UserServiceImpl userService;

    public void setUserService(UserServiceImpl userService) {
        this.userService = userService;
    }

    public void add() {
        log("add");
        userService.add();
    }

    public void delete() {
        log("delete");
        userService.delete();
    }

    public void update() {
        log("update");
        userService.update();
    }

    public void query() {
        log("query");
        userService.query();
    }


    //日志方法
    public void log(String msg) {
        System.out.println("[Debug]使用了" + msg + "方法");
    }
}
```

```java
    public static void main(String args[]) {

        UserServiceImpl userService = new UserServiceImpl();
        UserServiceProxy proxy = new UserServiceProxy();

        proxy.setUserService(userService);
        proxy.add();



    }
```

## 动态代理
- 动态代理和静态代理角色一样
- 动态代理的代理类是动态生成的, 不是我们直接写好的
- 动态代理分为两大类: 基于接口的动态代理, 基于类的动态代理
    - 基于接口-JDK动态代理
    - 基于类: cglib
    - java字节码实现: javasist

需要了解两个类: Proxy InvocationHandler




- ProxyInvocationHandler类
```java
//等会我们会用这个类, 自动生成代理类
public class ProxyInvocationHandler implements InvocationHandler {

    //被代理的接口
    public Rent rent;

    public Rent getRent() {
        return rent;
    }

    public void setRent(Rent rent) {
        this.rent = rent;
    }

    ////生成代理类
    public Object getProxy() {
        return Proxy.newProxyInstance(this.getClass().getClassLoader(), rent.getClass().getInterfaces(), this);
    }

    //处理代理的实例, 并返回结果
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //动态代理的本质, 就是使用反射机制来实现
        seeHourse();
        Object result = method.invoke(rent, args);
        return result;
    }

    //看房
    public void seeHourse() {
        System.out.println("中介带你看房");
    }

    //合同
    public void heTong() {
        System.out.println("签租赁合同");
    }

    //中介费
    public void fare() {
        System.out.println("收中介费");
    }
}
```

- Rent
```java
/**
 * @author xzMa
 * 租房
 */
public interface Rent {

    public void rent();

}
```

- Host
```java
/**
 * @author xzMa
 * 房东
 *
 */
public class Host implements Rent {
    public void rent() {
        System.out.println("房东要出租房子");
    }
}
```

- Client
```java
public class Client {
    public static void main(String[] args) {
        //真实角色
        Host host = new Host();

        //代理角色
        ProxyInvocationHandler pih = new ProxyInvocationHandler();
        //通过调用程序处理角色来处理我们要调用的接口对象
        pih.setRent(host);

        Rent proxy = (Rent) pih.getProxy();//这里的proxy就是动态生成的, 我们并没有写
        proxy.rent();

    }

}
```

**继续优化使其成为公共的**
```java
//等会我们会用这个类, 自动生成代理类
public class ProxyInvocationHandler implements InvocationHandler {

    //被代理的接口
    public Object target;

    public Object getTarget() {
        return target;
    }

    public void setTarget(Object target) {
        this.target = target;
    }

    ////生成代理类
    public Object getProxy() {
        return Proxy.newProxyInstance(this.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    //处理代理的实例, 并返回结果
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //动态代理的本质, 就是使用反射机制来实现
        log(method.getName());
        Object result = method.invoke(target, args);
        return result;
    }

    public void log(String msg) {
        System.out.println("执行了"+ msg +"方法");
    }

}
```

- Client
```java
public class Client {
    public static void main(String[] args) {
        //真实角色
        UserServiceImpl userService = new UserServiceImpl();

        //代理角色 不存在
        ProxyInvocationHandler pih = new ProxyInvocationHandler();

        pih.setTarget(userService); //设置要代理的对象
        //动态生成代理类
        UserService proxy = (UserService) pih.getProxy();
        proxy.add();

    }
}
```

### 动态代理的好处
- 可以使得我们的真实角色更加纯粹 . 不再去关注一些公共的事情 .
- 公共的业务由代理来完成 . 实现了业务的分工 ,
- 公共业务发生扩展时变得更加集中和方便 .
- 一个动态代理是一个接口, 一般就是对应的一类业务
- 一个动态代理可以代理多个类，只要是实现了一个接口即可

# 什么是AOP
进入重点
什么是AOP
AOP（Aspect Oriented Programming）意为：面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。AOP是OOP的延续，是软件开发中的一个热点，也是Spring框架中的一个重要内容，是函数式编程的一种衍生范型。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。
![mark](http://image.codingce.com.cn/blog/20200731/095353004.png)

# Aop在Spring中的作用
提供声明式事务；允许用户自定义切面
以下名词需要了解下：

- 横切关注点：跨越应用程序多个模块的方法或功能。即是，与我们业务逻辑无关的，但是我们需要关注的部分，就是横切关注点。如日志 , 安全 , 缓存 , 事务等等 ....
- 切面（ASPECT）：横切关注点 被模块化 的特殊对象。即，它是一个类。
- 通知（Advice）：切面必须要完成的工作。即，它是类中的一个方法。
- 目标（Target）：被通知对象。
- 代理（Proxy）：向目标对象应用通知之后创建的对象。
- 切入点（PointCut）：切面通知 执行的 “地点”的定义。
- 连接点（JointPoint）：与切入点匹配的执行点。

![mark](http://image.codingce.com.cn/blog/20200731/095822859.png)
SpringAOP中，通过Advice定义横切逻辑，Spring中支持5种类型的Advice:
![mark](http://image.codingce.com.cn/blog/20200731/095855041.png)
即 Aop 在 不改变原有代码的情况下 , 去增加新的功能 .

# 使用Spring实现Aop
重点】使用AOP织入，需要导入一个依赖包！

```xml
<!-- https://mvnrepository.com/artifact/org.aspectj/aspectjweaver -->
<dependency>
   <groupId>org.aspectj</groupId>
   <artifactId>aspectjweaver</artifactId>
   <version>1.9.4</version>
</dependency>
```

## 第一种方式

通过 Spring API 实现
首先编写我们的业务接口和实现类

### log类
```java
public class AfterLog implements AfterReturningAdvice {
    //returnValue 返回值
    public void afterReturning(Object returnValue, Method method, Object[] objects, Object o1) throws Throwable {
        System.out.println("执行了" + method.getName() + "返回结果为" + returnValue);
    }
}

public class Log implements MethodBeforeAdvice {

    //method: 要执行的目标对象的方法
    //objects：参数
    //target：目标对象
    public void before(Method method, Object[] objects, Object target) throws Throwable {
        System.out.println(target.getClass().getName() + "的" + method.getName() + "被执行了");
    }

}
```

### UserService
```java
public interface UserService {
    public void add();
    public void delete();
    public void update();
    public void select();
}
```

### UserServiceImpl
```java
public class UserServiceImpl implements UserService {
    public void add() {
        System.out.println("增加了一个用户");
    }

    public void delete() {
        System.out.println("删除了一个用户");
    }

    public void update() {
        System.out.println("修改了一个用户");
    }

    public void select() {
        System.out.println("查询了一个用户");
    }
}
```

### bean
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

    <!--指定要扫描的宝, 这个包下的注解就会生效-->
    <context:component-scan base-package="cn.com.codingce"/>
    <!--开启注解的支持-->
    <context:annotation-config/>

    <!--注册bean-->
    <bean id="userService" class="cn.com.codingce.service.UserServiceImpl"/>
    <bean id="log" class="cn.com.codingce.log.Log"/>
    <bean id="afterLog" class="cn.com.codingce.log.AfterLog"/>

    <!--方式一: 使用Spring API接口-->
    <!--配置aop: 需要导入aop的约束-->
    <aop:config>
        <!--切入点：expression：表达式 execution(要执行的位置)-->
        <aop:pointcut id="pointcut" expression="execution(* cn.com.codingce.service.UserServiceImpl.*(..))"/>
        <!--执行环绕增加!-->
        <aop:advisor advice-ref="log"  pointcut-ref="pointcut"/>
        <aop:advisor advice-ref="afterLog"  pointcut-ref="pointcut"/>

    </aop:config>

</beans>
```

## 第二种
自定义实现AOP【主要切面定义】
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

    <!--指定要扫描的宝, 这个包下的注解就会生效-->
    <context:component-scan base-package="cn.com.codingce"/>
    <!--开启注解的支持-->
    <context:annotation-config/>

    <!--注册bean-->
    <bean id="userService" class="cn.com.codingce.service.UserServiceImpl"/>
    <bean id="log" class="cn.com.codingce.log.Log"/>
    <bean id="afterLog" class="cn.com.codingce.log.AfterLog"/>

    <!--方式一: 使用Spring API接口-->
    <!--配置aop: 需要导入aop的约束-->
<!--    <aop:config>-->
<!--        &lt;!&ndash;切入点：expression：表达式 execution(要执行的位置)&ndash;&gt;-->
<!--        <aop:pointcut id="pointcut" expression="execution(* cn.com.codingce.service.UserServiceImpl.*(..))"/>-->
<!--        &lt;!&ndash;执行环绕增加!&ndash;&gt;-->
<!--        <aop:advisor advice-ref="log"  pointcut-ref="pointcut"/>-->
<!--        <aop:advisor advice-ref="afterLog"  pointcut-ref="pointcut"/>-->

<!--    </aop:config>-->

    <!--方式二： 自定义类-->
    <bean id="diy" class="cn.com.codingce.diy.DiyPointCut"/>

    <aop:config>
        <!--自定义切面, ref引用的类-->
        <aop:aspect ref="diy">
            <!--切入点-->
            <aop:pointcut id="point" expression="execution(* cn.com.codingce.service.UserServiceImpl.*(..))"/>
            <!--通知-->
            <aop:before method="before" pointcut-ref="point"/>
            <aop:after method="after" pointcut-ref="point"/>
        </aop:aspect>
    </aop:config>

</beans>
```


```java
    @Test
    public void Test() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        //动态代理是接口
        UserService userService = context.getBean("userService", UserService.class);
        userService.add();
    }

```

## 第三种注解实现

- AnnotationPointCut
```java
//使用注解方式实现AOP
@Aspect //标注这个类是一个切面
public class AnnotationPointCut {

    @Before("execution(* cn.com.codingce.service.UserServiceImpl.*(..))")
    public void before() {
        System.out.println("==============方法执行前===============");
    }

    @After("execution(* cn.com.codingce.service.UserServiceImpl.*(..))")
    public void after() {
        System.out.println("===============方法执行后===============");
    }

    //在环绕增强中，我们可以定一个参数, 代表我们要处理切入的点
    @Around("execution(* cn.com.codingce.service.UserServiceImpl.*(..))")
    public void around(ProceedingJoinPoint jp) throws Throwable {
        System.out.println("环绕前");

        //执行方法
        Object proceed = jp.proceed();
        System.out.println("环绕后");

        Signature signature = jp.getSignature();//获得签名
        System.out.println("signature" + signature);
    }
}
```
- XML
```xml
    <!--方式三-->
    <bean id="annotationpointcut" class="cn.com.codingce.diy.AnnotationPointCut"/>
    <!--开启注解   JDK(默认  proxy-target-class="false")    cglib  (proxy-target-class="true")  当然结果没有任何区别-->
<!--    <aop:aspectj-autoproxy proxy-target-class="false"/>    -->
    <aop:aspectj-autoproxy proxy-target-class="false"/>
```












>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java