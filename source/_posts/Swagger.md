---
title: Swagger
date: 2020-08-20 09:13:15
tags:
- SpringBoot
categories: 
- SpringBoot

---

# 项目集成Swagger

![mark](http://image.codingce.com.cn/blog/20200820/092227572.png)

- 了解Swagger的概念及作用
- 掌握在项目中集成Swagger自动生成API文档

# Swagger简介
前后端分离
- 前端 -> 前端控制层、视图层
- 后端 -> 后端控制层、服务层、数据访问层
- 前后端通过API进行交互
- 前后端相对独立且松耦合

产生的问题
- 前后端集成，前端或者后端无法做到“及时协商，尽早解决”，最终导致问题集中爆发

解决方案
- 首先定义schema [ 计划的提纲 ]，并实时跟踪最新的API，降低集成风险

Swagger
- 号称世界上最流行的API框架
- Restful Api 文档在线自动生成器 => API 文档 与API 定义同步更新
- 直接运行，在线测试API
- 支持多种语言 （如：Java，PHP等）
- 官网：https://swagger.io/

# SpringBoot集成Swagger
SpringBoot集成Swagger => springfox，两个jar包
- Springfox-swagger2
- swagger-springmvc

**使用Swagger**

要求：jdk 1.8 + 否则swagger2无法运行

**步骤：**

- 新建一个SpringBoot-web项目

- 添加Maven依赖
```xml
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger2 -->
<dependency>
   <groupId>io.springfox</groupId>
   <artifactId>springfox-swagger2</artifactId>
   <version>2.9.2</version>
</dependency>
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger-ui -->
<dependency>
   <groupId>io.springfox</groupId>
   <artifactId>springfox-swagger-ui</artifactId>
   <version>2.9.2</version>
</dependency>
```

- 编写HelloController，测试确保运行成功！
- 要使用Swagger，需要编写一个配置类-SwaggerConfig来配置 Swagger
```java
@Configuration //配置类
@EnableSwagger2// 开启Swagger2的自动配置
public class SwaggerConfig {  
}
```

- 访问测试 ：http://localhost:8080/swagger-ui.html ，可以看到swagger的界面；
- ![mark](http://image.codingce.com.cn/blog/20200820/100957378.png)

# 配置Swagger
- Swagger实例Bean是Docket，所以通过配置Docket实例来配置Swaggger.

```java
@Bean //配置docket以配置Swagger具体参数
public Docket docket() {
   return new Docket(DocumentationType.SWAGGER_2);
}
```

- 可以通过apiInfo()属性配置文档信息
```java
//配置swaagger信息
    private ApiInfo apiInfo() {
        //作者信息
        Contact contact = new Contact("马鑫泽", "https://i.codingce.com.cn", "codingce@gmail.com");
        return new ApiInfo("掌上编程",
                "即使再小的帆也能远航",
                "1.0",
                "https://i.codingce.com.cn",
                contact,
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0",
                new ArrayList());
    }
```

- Docket 实例关联上 apiInfo()
```java
@Bean
public Docket docket() {
   return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo());
}
```

- 重启项目，访问测试 http://localhost:8080/swagger-ui.html  看下效果；
![mark](http://image.codingce.com.cn/blog/20200820/111516583.png)


# 配置扫描接口
- 构建Docket时通过select()方法配置怎么扫描接口.
```java
@Bean
public Docket docket() {
   return new Docket(DocumentationType.SWAGGER_2)
      .apiInfo(apiInfo())
      .select()// 通过.select()方法，去配置扫描接口,RequestHandlerSelectors配置如何扫描接口
      .apis(RequestHandlerSelectors.basePackage("com.kuang.swagger.controller"))
      .build();
}
```

- 重启项目测试，由于我们配置根据包的路径扫描接口，所以我们只能看到一个类
- 除了通过包路径配置扫描接口外，还可以通过配置其他方式扫描接口，这里注释一下所有的配置方式：
```java
any() // 扫描所有，项目中的所有接口都会被扫描到
none() // 不扫描接口
// 通过方法上的注解扫描，如withMethodAnnotation(GetMapping.class)只扫描get请求
withMethodAnnotation(final Class<? extends Annotation> annotation)
// 通过类上的注解扫描，如.withClassAnnotation(Controller.class)只扫描有controller注解的类中的接口
withClassAnnotation(final Class<? extends Annotation> annotation)
basePackage(final String basePackage) // 根据包路径扫描接口
```

- 除此之外，我们还可以配置接口扫描过滤：
```java
@Bean
public Docket docket() {
   return new Docket(DocumentationType.SWAGGER_2)
      .apiInfo(apiInfo())
      .select()// 通过.select()方法，去配置扫描接口,RequestHandlerSelectors配置如何扫描接口
      .apis(RequestHandlerSelectors.basePackage("com.kuang.swagger.controller"))
       // 配置如何通过path过滤,即这里只扫描请求以/kuang开头的接口
      .paths(PathSelectors.ant("/kuang/**"))
      .build();
}
```

- 这里的可选值还有
```java
any() // 任何请求都扫描
none() // 任何请求都不扫描
regex(final String pathRegex) // 通过正则表达式控制
ant(final String antPattern) // 通过ant()控制
```

# 配置Swagger开关
- 通过enable()方法配置是否启用swagger，如果是false，swagger将不能在浏览器中访问了
```java
@Bean
public Docket docket() {
   return new Docket(DocumentationType.SWAGGER_2)
      .apiInfo(apiInfo())
      .enable(false) //配置是否启用Swagger，如果是false，在浏览器将无法访问
      .select()// 通过.select()方法，去配置扫描接口,RequestHandlerSelectors配置如何扫描接口
      .apis(RequestHandlerSelectors.basePackage("com.kuang.swagger.controller"))
       // 配置如何通过path过滤,即这里只扫描请求以/kuang开头的接口
      .paths(PathSelectors.ant("/kuang/**"))
      .build();
}
```

- 如何动态配置当项目处于test、dev环境时显示swagger，处于prod时不显示？
```java
@Bean
public Docket docket(Environment environment) {
   // 设置要显示swagger的环境
   Profiles of = Profiles.of("dev", "test");
   // 判断当前是否处于该环境
   // 通过 enable() 接收此参数判断是否要显示
   boolean b = environment.acceptsProfiles(of);
   
   return new Docket(DocumentationType.SWAGGER_2)
      .apiInfo(apiInfo())
      .enable(b) //配置是否启用Swagger，如果是false，在浏览器将无法访问
      .select()// 通过.select()方法，去配置扫描接口,RequestHandlerSelectors配置如何扫描接口
      .apis(RequestHandlerSelectors.basePackage("com.kuang.swagger.controller"))
       // 配置如何通过path过滤,即这里只扫描请求以/kuang开头的接口
      .paths(PathSelectors.ant("/kuang/**"))
      .build();
}
```
- 可以在项目中增加一个dev的配置文件查看效果！


# 配置API分组