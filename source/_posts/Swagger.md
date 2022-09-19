---
title: Swagger
date: 2020-08-20 09:13:15
tags:
- SpringBoot
categories: 
- SpringBoot

thumbnail: https://s1.ax1x.com/2020/08/20/dJdY0H.md.jpg
---

## 项目集成Swagger

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108220958577.png)

- 了解Swagger的概念及作用
- 掌握在项目中集成Swagger自动生成API文档

## Swagger简介
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

## SpringBoot集成Swagger
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

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108220958408.png)

## 配置Swagger

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

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108221000060.png)


## 配置扫描接口
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

## 配置Swagger开关

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


## 配置API分组

- 如果没有配置分组，默认是default。通过groupName()方法即可配置分组：

```java
        return new Docket(DocumentationType.SWAGGER_2)
                //用的自己的             return new Docket(DocumentationType.SWAGGER_2); 默认
                .apiInfo(apiInfo())
                //enable    是否启动Swagger, 如果false则Swagger不能再浏览器中访问
                //.enable(false)
                .groupName("掌上编程")
                .enable(flag)
                .select()
```

- 如何配置多个分组？配置多个分组只需要配置多个docket即可：

```java
public class SwaggerConfig {

    @Bean
    public Docket docket1() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("A");
    }

    @Bean
    public Docket docket2() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("B");
    }

    @Bean
    public Docket docket3() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("C");
    }

    @Bean
    public Docket docket4() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("D");
    }

    @Bean //配置docket以配置Swagger具体参数  链式编程
    public Docket docket(Environment environment) {
        //设置要显示的Swagger环境
        Profiles profiles = Profiles.of("dev", "test");

        //获取项目环境    Environment environment.acceptsProfiles(profiles);判断是否处于自己设定的环境中
        boolean flag = environment.acceptsProfiles(profiles);


        return new Docket(DocumentationType.SWAGGER_2)
                //用的自己的             return new Docket(DocumentationType.SWAGGER_2); 默认
                .apiInfo(apiInfo())
                //enable    是否启动Swagger, 如果false则Swagger不能再浏览器中访问
                //.enable(false)
                .groupName("掌上编程")
                .enable(flag)
                .select()
                //RequestHandlerSelectors配置要扫面接口的方式
                //basePackage   指定要扫描的包      .apis(RequestHandlerSelectors.basePackage("cn.com.codingce.controller"))
                //any() 扫描全部
                //no() 都不扫描
                //withClassAnnotation   :扫描类上的注解, 参数是一个注解反射的对象
                //withMethodAnnotation  :扫描方法上的注解
                .apis(RequestHandlerSelectors.basePackage("cn.com.codingce.controller"))
                //paths() 过滤路径
                //.paths(PathSelectors.ant("/codingce/**"))
                .build();//build工厂模式
    }
```


## 常用注解
Swagger的所有注解定义在io.swagger.annotations包下

下面列一些经常用到的，未列举出来的可以另行查阅说明：
|Swagger注解|简单说明|
| --- | --- |
|@Api(tags = "xxx模块说明")|作用在模块类上|
|@ApiOperation("xxx接口说明")|作用在接口方法上|
|@ApiModel("xxxPOJO说明")|作用在模型类上：如VO、BO|
|@ApiModelProperty(value = "xxx属性说明",hidden = true)|作用在类方法和属性上，hidden设置为true可以隐藏该属性|
|@ApiParam("xxx参数说明")|作用在参数、方法和字段上，类似@ApiModelProperty|

也可以给请求的接口配置一些注释

```java
//Operation接口
@ApiOperation("Hello控制类")
@RestController
public class HelloCobtroller {

    @RequestMapping(value = "/hello")
    public String hello() {
        return "hello";
    }

    @PostMapping("/myuser")
    public User user() {
        return new User();
    }

    //Operation接口, 不是放在类上, 是方法
    @ApiOperation("Hello控制类")
    @RequestMapping(value = "/hello2")
    public String hello2() {
        return "hello";
    }

    @ApiOperation("Hello控制类")
    @RequestMapping(value = "/hello3")
    public String hello3(@ApiParam("用户名") String username) {
        return "hello" + username;
    }

}

```

## 拓展：其他皮肤

- 默认的   访问 http://localhost:8080/swagger-ui.html

```xml
<dependency>
   <groupId>io.springfox</groupId>
   <artifactId>springfox-swagger-ui</artifactId>
   <version>2.9.2</version>
</dependency>
```

- bootstrap-ui  访问 http://localhost:8080/doc.html

```xml
<!-- 引入swagger-bootstrap-ui包 /doc.html-->
<dependency>
   <groupId>com.github.xiaoymin</groupId>
   <artifactId>swagger-bootstrap-ui</artifactId>
   <version>1.9.1</version>
</dependency>
```

- Layui-ui   访问 http://localhost:8080/docs.html

```xml
<!-- 引入swagger-ui-layer包 /docs.html-->
<dependency>
   <groupId>com.github.caspar-chen</groupId>
   <artifactId>swagger-ui-layer</artifactId>
   <version>1.1.3</version>
</dependency>

```

- mg-ui   访问 http://localhost:8080/document.html

```xml
<!-- 引入swagger-ui-layer包 /document.html-->
<dependency>
   <groupId>com.zyplayer</groupId>
   <artifactId>swagger-mg-ui</artifactId>
   <version>1.0.6</version>
</dependency>
```



















>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java