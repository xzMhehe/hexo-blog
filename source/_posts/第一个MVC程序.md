---
title: 第一个MVC程序
date: 2020-08-02 10:39:36
tags:
- SpringMVC
categories: 
- SpringMVC
---

# 配置版

- 新建一个Moudle ， springmvc-02-hello ， 添加web的支持！
- 确定导入了SpringMVC 的依赖！
- 配置web.xml  ， 注册DispatcherServlet

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--1.注册DispatcherServlet-->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!--关联一个springmvc的配置文件:【servlet-name】-servlet.xml-->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc-servlet.xml</param-value>
        </init-param>
        <!--启动级别-1-->
        <load-on-startup>1</load-on-startup>
    </servlet>

    <!--/ 匹配所有的请求；（不包括.jsp）-->
    <!--/* 匹配所有的请求；（包括.jsp）-->
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

- 编写SpringMVC 的 配置文件！名称：springmvc-servlet.xml  : [servletname]-servlet.xml
说明，这里的名称要求是按照官方来的
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--添加 处理映射器-->
    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>


    <!--添加 处理器适配器-->
    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>


    <!--添加 视图解析器-->
    <!--视图解析器:DispatcherServlet给他的ModelAndView-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" id="InternalResourceViewResolver">
        <!--前缀-->
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <!--后缀-->
        <property name="suffix" value=".jsp"/>
    </bean>


    <!--Handler-->
    <bean id="/hello" class="cn.com.codingce.controller.HelloController"/>

</beans>
```
- 添加 处理映射器
```xml
<bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
```
- 添加 处理器适配器
```xml
<bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>
```

- 添加 视图解析器
```xml
<!--视图解析器:DispatcherServlet给他的ModelAndView-->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" id="InternalResourceViewResolver">
   <!--前缀-->
   <property name="prefix" value="/WEB-INF/jsp/"/>
   <!--后缀-->
   <property name="suffix" value=".jsp"/>
</bean>
```

- 编写我们要操作业务Controller ，要么实现Controller接口，要么增加注解；需要返回一个ModelAndView，装数据，封视图；
```java
package cn.com.codingce.controller;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//注意：这里我们先导入Controller接口
//编写我们要操作业务Controller ，要么实现Controller接口，要么增加注解；需要返回一个ModelAndView，装数据，封视图；
public class HelloController implements Controller {

    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //ModelAndView 模型和视图
        ModelAndView mv = new ModelAndView();

        //封装对象，放在ModelAndView中。Model
        mv.addObject("msg","HelloSpringMVC!");
        //封装要跳转的视图，放在ModelAndView中
        mv.setViewName("hello"); //类似于项目一: /WEB-INF/jsp/hello.jsp
        return mv;
    }

}
```
- 将自己的类交给SpringIOC容器，注册bean
```xml

<!--Handler-->
<bean id="/hello" class="com.kuang.controller.HelloController"/>
```

- 写要跳转的jsp页面，显示ModelandView存放的数据，以及我们的正常页面；
```java
<%--
  Created by IntelliJ IDEA.
  User: xzMa
  Date: 2020/8/2
  Time: 11:34
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
${msg}
</body>
</html>
```

配置Tomcat 启动测试！
![mark](http://image.codingce.com.cn/blog/20200803/093738025.png)

## 可能遇到的问题：访问出现404，排查步骤：
- 查看控制台输出，看一下是不是缺少了什么jar包。
- 如果jar包存在，显示无法输出，就在IDEA的项目发布中，添加lib依赖！
![mark](http://image.codingce.com.cn/blog/20200803/093957878.png)
- 重启Tomcat 即可解决！
![mark](http://image.codingce.com.cn/blog/20200803/094023357.png)

# 注解版
- 新建一个Moudle，springmvc-03-hello-annotation 。添加web支持！
- 由于Maven可能存在资源过滤的问题，我们将配置完善

