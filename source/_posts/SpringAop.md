---
title: AOP
date: 2020-07-23 19:18:05
tags:
- Java
- Spring
categories: 
- Java
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