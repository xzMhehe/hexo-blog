---
title: SpringBoot问题总结
date: 2020-08-14 16:55:36
tags:
- SpringBoot
categories: 
- SpringBoot
---

## Spring Boot 2.x 增加拦截器后静态资源文件404无法访问
### 问题描述
---
Spring Boot 2.2.0 增加自定义拦截器后发现静态资源都没法访问，报 404 错误。

网上找了几个方案比如修改资源文件路径由 /** 改为 /static/** 然后添加到排除列表，我的项目没效果。

最后发现是配置拦截器的方式不一样造成的，注意以下两个细节：
### 配置拦截器的几种方式
---
在 spring boot2.x 中已经不推荐再使用 WebMvcConfigurationAdapter，官方声明已过时。

所以要继承 WebMvcConfigurationSupport 或者实现 WebMvcConfigurer（注意这两种有区别造成资源文件被拦截）
```java
//方式①
implements WebMvcConfigurer 
//不会覆盖@EnableAutoConfiguration关于WebMvcAutoConfiguration的配置

//方式②
@EnableWebMvc
implements WebMvcConfigurer 
//会覆盖@EnableAutoConfiguration关于WebMvcAutoConfiguration的配置

//方式③
extends WebMvcConfigurationSupport 
//会覆盖@EnableAutoConfiguration关于WebMvcAutoConfiguration的配置

//方式④
extends DelegatingWebMvcConfiguration 
//会覆盖@EnableAutoConfiguration关于WebMvcAutoConfiguration的配置
```

注意上面的几种拦截实现方式，只有第①种implements WebMvcConfigurer默认不会覆盖 @EnableAutoConfiguration 关于 WebMvcAutoConfiguration 的配置，这种话我看不懂，但发现下面几种都覆盖了会造成资源文件就无法访问。若被覆盖了，可自己再实现 addResourceHandlers() 即可。

### 解决方案
---
#### 方案一（推荐）
注意这里没有 @EnableWebMvc 注解
```
@Configuration
public class MyWebMvcConfigurer implements WebMvcConfigurer {

    @Bean
    public AuthInterceptor authInterceptor() {
        return new AuthInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor())
                .addPathPatterns("/**") //拦截所有请求
                .excludePathPatterns("/static/**"); //排除静态资源（注意默认的静态资源路径是/**）
    }
}
```

#### 方案二
如果用了 @EnableWebMvc 注解的话，必须重写 addResourceHandlers() 方法
```java
@Configuration
@EnableWebMvc
public class MyWebMvcConfigurer implements WebMvcConfigurer {

    @Bean
    public AuthInterceptor authInterceptor() {
        return new AuthInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor())
                .addPathPatterns("/**") //拦截所有请求
                .excludePathPatterns("/static/**"); //排除静态资源（注意默认的静态资源路径是/**）
    }
    
    /**
     * SpringBoot 2.x 要重写该方法，不然 css、js、image 等静态资源路径无法访问
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/META-INF/resources/")
                .addResourceLocations("classpath:/resources/")
                .addResourceLocations("classpath:/static/")
                .addResourceLocations("classpath:/public/");
    }
}
```
#### 方案三
如题是继承 WebMvcConfigurationSupport 类，那么需要和方案二一样必须重写 addResourceHandlers() 方法。
```java
@Configuration
public class WebMvcConfigurer extends WebMvcConfigurationSupport {

    @Bean
    public AuthInterceptor authInterceptor() {
        return new AuthInterceptor();
    }

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor())
                .addPathPatterns("/**") //拦截所有请求
                .excludePathPatterns("/static/**"); //排除静态资源（注意默认的静态资源路径是/**）
        super.addInterceptors(registry);
    }

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/META-INF/resources/")
                .addResourceLocations("classpath:/resources/")
                .addResourceLocations("classpath:/static/")
                .addResourceLocations("classpath:/public/");
        super.addResourceHandlers(registry);
    }
}
```


>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java