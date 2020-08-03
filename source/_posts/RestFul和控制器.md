---
title: RestFul和控制器
date: 2020-08-03 15:28:46
tags:
- SpringMVC
categories: 
- SpringMVC

---

# RestFul和控制器

## 控制器Controller
- 控制器复杂提供访问应用程序的行为，通常通过接口定义或注解定义两种方法实现。
- 控制器负责解析用户的请求并将其转换为一个模型。
- 在Spring MVC中一个控制器类可以包含多个方法
- 在Spring MVC中，对于Controller的配置方式有很多种

## 实现Controller接口
Controller是一个接口，在org.springframework.web.servlet.mvc包下，接口中只有一个方法；
```java
//实现该接口的类获得控制器功能
public interface Controller {
   //处理请求且返回一个模型与视图对象
   ModelAndView handleRequest(HttpServletRequest var1, HttpServletResponse var2) throws Exception;
}
```
## 测试
- 新建一个Moudle，springmvc-04-controller 。将刚才的03 拷贝一份, 我们进行操作！
    - 删掉HelloController
    - mvc的配置文件只留下 视图解析器！

- 编写一个Controller类，ControllerTest1
```java
package cn.com.codingce.controller;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 只要实现了Controller接口的类, 说明这就是一个控制器
 * @author xzMa
 */
public class ControllerTest1 implements Controller {
    public ModelAndView handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg", "实现接口方式");
        mv.setViewName("test");

        return mv;
    }
}

```

- 编写完毕后，去Spring配置文件中注册请求的bean；name对应请求路径，class对应处理请求的类
```xml
<bean name="/t1" class="com.kuang.controller.ControllerTest1"/>
```
- 编写前端test.jsp，注意在WEB-INF/jsp目录下编写，对应我们的视图解析器
```java
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
   <title>Kuangshen</title>
</head>
<body>
${msg}
</body>
</html>
```
- 配置Tomcat运行测试
### 说明：
- 实现接口Controller定义控制器是较老的办法
- 缺点是：一个控制器中只有一个方法，如果要多个方法则需要定义多个Controller；定义的方式比较麻烦；

## 使用注解@Controller
- @Controller注解类型用于声明Spring类的实例是一个控制器（在讲IOC时还提到了另外3个注解）；
- Spring可以使用扫描机制来找到应用程序中所有基于注解的控制器类，为了保证Spring能找到你的控制器，需要在配置文件中声明组件扫描。

```xml
<!-- 自动扫描指定的包，下面所有注解类交给IOC容器管理 -->
<context:component-scan base-package="com.kuang.controller"/>
```
- 增加一个ControllerTest2类，使用注解实现；
```java
package cn.com.codingce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ControllerTest2 {

    @RequestMapping("/t2")
    public String test1(Model model) {
        model.addAttribute("msg", "注解实现");
        return "test";
    }

}
```
**可以发现，我们的两个请求都可以指向一个视图，但是页面结果的结果是不一样的，从这里可以看出视图是被复用的，而控制器与视图之间是弱偶合关系。**

**注解方式是平时使用的最多的方式！**

## RequestMapping
@RequestMapping

- @RequestMapping注解用于映射url到控制器类或一个特定的处理程序方法。可用于类或方法上。用于类上，表示类中的所有响应请求的方法都是以该地址作为父路径。
- 为了测试结论更加准确，我们可以加上一个项目名测试 myweb
- 只注解在方法上面
```java
@Controller
public class TestController {
   @RequestMapping("/h1")
   public String test(){
       return "test";
  }
}
```
访问路径：http://localhost:8080 / 项目名 / h1

- 同时注解类与方法

```java
@Controller
@RequestMapping("/admin")
public class TestController {
   @RequestMapping("/h1")
   public String test(){
       return "test";
  }
}
```
访问路径：http://localhost:8080 / 项目名/ admin /h1  , 需要先指定类的路径再指定方法的路径；
