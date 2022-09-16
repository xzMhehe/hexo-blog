---
title: Web开发静态资源处理|thymeleaf模板引擎
date: 2020-08-13 14:52:13
pin: false
toc: false
icons: []
tags: [SpringBoot]
categories: [SpringBoot]
keywords: [SpringBoot]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200930573.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200930573.png
description: SpringBoot
---

## Web开发探究
### 简介
**使用SpringBoot的步骤:**

- 创建一个SpringBoot应用，选择需要的模块，SpringBoot就会默认将的需要的模块自动配置好

- 手动在配置文件中配置部分配置项目就可以运行起来了

- 专注编写业务代码，不需要考虑以前那样一大堆的配置了。

比如SpringBoot到底帮配置了什么？能不能修改？能修改哪些配置？能不能扩展？



- 向容器中自动配置组件 ：*** Autoconfiguration

- 自动配置类，封装配置文件的内容：***Properties

## 静态资源处理
### 静态资源映射规则
这个静态资源映射规则：
SpringBoot中，SpringMVC的web配置都在 WebMvcAutoConfiguration 这个配置类里面；
可以去看看 WebMvcAutoConfigurationAdapter 中有很多配置方法；
有一个方法：addResourceHandlers 添加资源处理

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    if (!this.resourceProperties.isAddMappings()) {
        // 已禁用默认资源处理
        logger.debug("Default resource handling disabled");
        return;
    }
    // 缓存控制
    Duration cachePeriod = this.resourceProperties.getCache().getPeriod();
    CacheControl cacheControl = this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl();
    // webjars 配置
    if (!registry.hasMappingForPattern("/webjars/**")) {
        customizeResourceHandlerRegistration(registry.addResourceHandler("/webjars/**")
                                             .addResourceLocations("classpath:/META-INF/resources/webjars/")
                                             .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));
    }
    // 静态资源配置
    String staticPathPattern = this.mvcProperties.getStaticPathPattern();
    if (!registry.hasMappingForPattern(staticPathPattern)) {
        customizeResourceHandlerRegistration(registry.addResourceHandler(staticPathPattern)
                                             .addResourceLocations(getResourceLocations(this.resourceProperties.getStaticLocations()))
                                             .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));
    }
}
```
读一下源代码：比如所有的 /webjars/** ， 都需要去 classpath:/META-INF/resources/webjars/ 找对应的资源；

### 什么是webjars 呢？
Webjars本质就是以jar包的方式引入的静态资源 ， 以前要导入一个静态资源文件，直接导入即可。
使用SpringBoot需要使用Webjars，可以去搜索一下：
网站：https://www.webjars.org 
要使用jQuery，只要要引入jQuery对应版本的pom依赖即可！

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.4.1</version>
</dependency>
```
![mark](http://image.codingce.com.cn/blog/20200813/150032310.png)

访问：只要是静态资源，SpringBoot就会去对应的路径寻找资源，这里访问：http://localhost:8080/webjars/jquery/3.4.1/jquery.js
![mark](http://image.codingce.com.cn/blog/20200813/150128770.png)

### 第二种静态资源映射规则
项目中要是使用自己的静态资源该怎么导入呢？看下一行代码；

去找staticPathPattern发现第二种映射规则 ：/** , 访问当前的项目任意资源，它会去找 resourceProperties 这个类，可以点进去看一下分析：

```java
// 进入方法
public String[] getStaticLocations() {
    return this.staticLocations;
}
// 找到对应的值
private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;
// 找到路径
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { 
    "classpath:/META-INF/resources/",
  "classpath:/resources/", 
    "classpath:/static/", 
    "classpath:/public/" 
};
```

ResourceProperties 可以设置和静态资源有关的参数；这里面指向了它会去寻找资源的文件夹，即上面数组的内容。

所以得出结论，以下四个目录存放的静态资源可以被识别：

```java
"classpath:/META-INF/resources/"
"classpath:/resources/"
"classpath:/static/"
"classpath:/public/"
```

### 自定义静态资源路径
也可以自己通过配置文件来指定一下，哪些文件夹是需要放静态资源文件的，在application.properties中配置；

```yaml
spring.resources.static-locations=classpath:/coding/,classpath:/kuang/
```

一旦自己定义了静态文件夹的路径，原来的自动配置就都会失效了！

## 首页处理
就是的首页
```java
@Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext,
                                                           FormattingConversionService mvcConversionService,
                                                           ResourceUrlProvider mvcResourceUrlProvider) {
    WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
        new TemplateAvailabilityProviders(applicationContext), applicationContext, getWelcomePage(), // getWelcomePage 获得欢迎页
        this.mvcProperties.getStaticPathPattern());
    welcomePageHandlerMapping.setInterceptors(getInterceptors(mvcConversionService, mvcResourceUrlProvider));
    return welcomePageHandlerMapping;
}
```

点进去继续看
```java
private Optional<Resource> getWelcomePage() {
    String[] locations = getResourceLocations(this.resourceProperties.getStaticLocations());
    // ::是java8 中新引入的运算符
    // Class::function的时候function是属于Class的，应该是静态方法。
    // this::function的funtion是属于这个对象的。
    // 简而言之，就是一种语法糖而已，是一种简写
    return Arrays.stream(locations).map(this::getIndexHtml).filter(this::isReadable).findFirst();
}
// 欢迎页就是一个location下的的 index.html 而已
private Resource getIndexHtml(String location) {
    return this.resourceLoader.getResource(location + "index.html");
}
```

欢迎页，静态资源文件夹下的所有 index.html 页面；被 /** 映射。
比如访问  http://localhost:8080/ ，就会找静态资源文件夹下的 index.html
新建一个 index.html ，在上面的3个目录中任意一个；然后访问测试  http://localhost:8080/  看结果

## Thymeleaf

### 模板引擎
前端交给页面，是html页面。如果是以前开发，需要把他们转成jsp页面，jsp好处就是当查出一些数据转发到JSP页面以后，可以用jsp轻松实现数据的显示，及交互等。

jsp支持非常强大的功能，包括能写Java代码，但是呢，现在的这种情况，SpringBoot这个项目首先是以jar的方式，不是war，像第二，用的还是嵌入式的Tomcat，所以呢，他现在默认是不支持jsp的。

那不支持jsp，如果直接用纯静态页面的方式，那给开发会带来非常大的麻烦，那怎么办呢？

SpringBoot推荐你可以来使用模板引擎：

模板引擎，其实大家听到很多，其实jsp就是一个模板引擎，还有用的比较多的freemarker，包括SpringBoot给推荐的Thymeleaf，模板引擎有非常多，但再多的模板引擎，他们的思想都是一样的，什么样一个思想呢来看一下这张图：

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200931400.png)

模板引擎的作用就是来写一个页面模板，比如有些值呢，是动态的，写一些表达式。而这些值，从哪来呢，就是在后台封装一些数据。然后把这个模板和这个数据交给模板引擎，模板引擎按照这个数据帮你把这表达式解析、填充到指定的位置，然后把这个数据最终生成一个想要的内容给写出去，这就是这个模板引擎，不管是jsp还是其他模板引擎，都是这个思想。只不过，就是说不同模板引擎之间，他们可能这个语法有点不一样。其他的就不介绍了，主要来介绍一下SpringBoot给推荐的Thymeleaf模板引擎，这模板引擎呢，是一个高级语言的模板引擎，他的这个语法更简单。而且，功能更强大。

### 引入Thymeleaf
怎么引入呢，对于springboot来说，什么事情不都是一个start的事情嘛，去在项目中引入一下.三个网址：
- Thymeleaf 官网：https://www.thymeleaf.org/

- Thymeleaf 在Github 的主页：https://github.com/thymeleaf/thymeleaf

- Spring官方文档：找到对应的版本https://docs.spring.io/spring-boot/docs/2.2.5.RELEASE/reference/htmlsingle/#using-boot-starter 

找到对应的pom依赖：可以适当点进源码看下本来的包！

```xml
<!--thymeleaf-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

Maven会自动下载jar包，可以去看下下载的东西；

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200931612.png)

### Thymeleaf分析
首先得按照SpringBoot的自动配置原理看一下这个Thymeleaf的自动配置规则，在按照那个规则，进行使用。
去找一下Thymeleaf的自动配置类：ThymeleafProperties

```java
@ConfigurationProperties(
    prefix = "spring.thymeleaf"
)
public class ThymeleafProperties {
    private static final Charset DEFAULT_ENCODING;
    public static final String DEFAULT_PREFIX = "classpath:/templates/";
    public static final String DEFAULT_SUFFIX = ".html";
    private boolean checkTemplate = true;
    private boolean checkTemplateLocation = true;
    private String prefix = "classpath:/templates/";
    private String suffix = ".html";
    private String mode = "HTML";
    private Charset encoding;
}
```

可以在其中看到默认的前缀和后缀！

只需要把的html页面放在类路径下的templates下，thymeleaf就可以帮自动渲染了。

使用thymeleaf什么都不需要配置，只需要将他放在指定的文件夹下即可！

### 测试
编写一个IndexController

```java
package cn.com.codingce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

//在templates目录下的所有页面, 只能通过controller来跳转
//这个需要模板引擎的支持 thymelaf
@Controller
public class IndexController {

    @GetMapping("/index")
    public String index() {
        return "index";
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }

}
```

- 编写一个测试页面  test.html 放在 templates 目录下
- 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h1>test</h1>
</body>
</html>
```

### Thymeleaf 语法学习
要学习语法，还是参考官网文档最为准确，找到对应的版本看一下；

Thymeleaf 官网：https://www.thymeleaf.org/ ， 简单看一下官网！去下载Thymeleaf的官方文档！

做个最简单的练习 ：需要查出一些数据，在页面中展示

- 修改测试请求，增加数据传输；

```java
    @GetMapping("/test2")
    public String test1(Model model){
        //存入数据
        model.addAttribute("msg","Hello,Thymeleaf");
        //classpath:/templates/test.html
        return "test2";
    }
```
- 要使用thymeleaf，需要在html文件中导入命名空间的约束，方便提示,可以去官方文档的#3中看一下命名空间拿来过来：

```yaml
xmlns:th="http://www.thymeleaf.org"
```

- 编写下前端页面

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>掌上编程</title>
</head>
<body>
<h1>测试页面</h1>

<!--th:text就是将div中的内容设置为它指定的值，和之前学习的Vue一样-->
<div th:text="${msg}"></div>
</body>
</html>
```

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200932294.png)

-可以使用任意的 th:attr 来替换Html中原生属性的值！
![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200932089.png)

- 能写哪些表达式呢？

```yaml

Simple expressions:（表达式语法）
Variable Expressions: ${...}：获取变量值；OGNL；
    1）、获取对象的属性、调用方法
    2）、使用内置的基本对象：#18
         #ctx : the context object.
         #vars: the context variables.
         #locale : the context locale.
         #request : (only in Web Contexts) the HttpServletRequest object.
         #response : (only in Web Contexts) the HttpServletResponse object.
         #session : (only in Web Contexts) the HttpSession object.
         #servletContext : (only in Web Contexts) the ServletContext object.

    3）、内置的一些工具对象：
　　　　　　#execInfo : information about the template being processed.
　　　　　　#uris : methods for escaping parts of URLs/URIs
　　　　　　#conversions : methods for executing the configured conversion service (if any).
　　　　　　#dates : methods for java.util.Date objects: formatting, component extraction, etc.
　　　　　　#calendars : analogous to #dates , but for java.util.Calendar objects.
　　　　　　#numbers : methods for formatting numeric objects.
　　　　　　#strings : methods for String objects: contains, startsWith, prepending/appending, etc.
　　　　　　#objects : methods for objects in general.
　　　　　　#bools : methods for boolean evaluation.
　　　　　　#arrays : methods for arrays.
　　　　　　#lists : methods for lists.
　　　　　　#sets : methods for sets.
　　　　　　#maps : methods for maps.
　　　　　　#aggregates : methods for creating aggregates on arrays or collections.
==================================================================================

  Selection Variable Expressions: *{...}：选择表达式：和${}在功能上是一样；
  Message Expressions: #{...}：获取国际化内容
  Link URL Expressions: @{...}：定义URL；
  Fragment Expressions: ~{...}：片段引用表达式

Literals（字面量）
      Text literals: 'one text' , 'Another one!' ,…
      Number literals: 0 , 34 , 3.0 , 12.3 ,…
      Boolean literals: true , false
      Null literal: null
      Literal tokens: one , sometext , main ,…
      
Text operations:（文本操作）
    String concatenation: +
    Literal substitutions: |The name is ${name}|
    
Arithmetic operations:（数学运算）
    Binary operators: + , - , * , / , %
    Minus sign (unary operator): -
    
Boolean operations:（布尔运算）
    Binary operators: and , or
    Boolean negation (unary operator): ! , not
    
Comparisons and equality:（比较运算）
    Comparators: > , < , >= , <= ( gt , lt , ge , le )
    Equality operators: == , != ( eq , ne )
    
Conditional operators:条件运算（三元运算符）
    If-then: (if) ? (then)
    If-then-else: (if) ? (then) : (else)
    Default: (value) ?: (defaultvalue)
    
Special tokens:
    No-Operation: _
```


**练习测试：**

- 编写一个Controller

```java
    @GetMapping("/test3")
    public String test3(Model model){
        //存入数据
        model.addAttribute("msg","<h1>Hello,Thymeleaf</h1>");
        //classpath:/templates/test.html

        model.addAttribute("users", Arrays.asList("掌上编程", "xzM", "TianRuan"));
        return "test3";
    }
```

- 测试页面取出数据

```html
<!DOCTYPE html>
<html lang="en">
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<div th:text="${msg}"></div>
<div th:utext="${msg}"></div>

<div th:each="user : ${users}" th:text="${user}"></div>
<br/>
第二种
<br/>
<div th:each="user : ${users}">[[${user}]]</div>
</body>
</html>
```

看完语法，很多样式，即使现在学习了，也会忘记，所以在学习过程中，需要使用什么，根据官方文档来查询，才是最重要的，要熟练使用官方文档！



>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java