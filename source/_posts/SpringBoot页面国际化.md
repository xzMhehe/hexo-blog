---
title: SpringBoot页面国际化
date: 2020-08-15 08:21:18
tags:
- SpringBoot
categories: 
- SpringBoot

---

# 页面国际化
有的时候，的网站会去涉及中英文甚至多语言的切换，这时候就需要学习国际化了！
# 准备工作
先在IDEA中统一设置properties的编码问题！
![mark](http://image.codingce.com.cn/blog/20200815/082222583.png)

编写国际化配置文件，抽取页面需要显示的国际化页面消息。

# 配置文件编写
- 在resources资源文件下新建一个i18n目录，存放国际化配置文件
- 建立一个login.properties文件，还有一个login_zh_CN.properties；发现IDEA自动识别了要做国际化操作；文件夹变了！

![mark](http://image.codingce.com.cn/blog/20200815/082324393.png)
- 可以在这上面去新建一个文件；
![mark](http://image.codingce.com.cn/blog/20200815/082405303.png)

弹出如下页面：添加一个英文的；
![mark](http://image.codingce.com.cn/blog/20200815/082453967.png)

- 接下来，编写配置，可以看到idea下面有另外一个视图；
![mark](http://image.codingce.com.cn/blog/20200815/082534870.png)

login.properties ：默认
```yaml
login.btn=登录
login.password=密码
login.remember=记住我
login.tip=请登录
login.username=用户名
```
英文：
```yaml
login.btn=Sgin in
login.password=Password
login.remember=Remember me
login.tip=please log in
login.username=UserName
```
中文：
```yaml
login.btn=登录
login.password=密码
login.remember=记住我
login.tip=请登录
login.username=用户名
```

# 配置文件生效探究
去看一下SpringBoot对国际化的自动配置！这里又涉及到一个类：MessageSourceAutoConfiguration

里面有一个方法，这里发现SpringBoot已经自动配置好了管理国际化资源文件的组件 ResourceBundleMessageSource；
```java
// 获取 properties 传递过来的值进行判断
@Bean
public MessageSource messageSource(MessageSourceProperties properties) {
    ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
    if (StringUtils.hasText(properties.getBasename())) {
        // 设置国际化文件的基础名（去掉语言国家代码的）
        messageSource.setBasenames(
            StringUtils.commaDelimitedListToStringArray(
                                       StringUtils.trimAllWhitespace(properties.getBasename())));
    }
    if (properties.getEncoding() != null) {
        messageSource.setDefaultEncoding(properties.getEncoding().name());
    }
    messageSource.setFallbackToSystemLocale(properties.isFallbackToSystemLocale());
    Duration cacheDuration = properties.getCacheDuration();
    if (cacheDuration != null) {
        messageSource.setCacheMillis(cacheDuration.toMillis());
    }
    messageSource.setAlwaysUseMessageFormat(properties.isAlwaysUseMessageFormat());
    messageSource.setUseCodeAsDefaultMessage(properties.isUseCodeAsDefaultMessage());
    return messageSource;
}
```

真实的情况是放在了i18n目录下，所以要去配置这个messages的路径；
```yaml
spring.messages.basename=i18n.login
```
# 配置页面国际化值
去页面获取国际化的值，查看Thymeleaf的文档，找到message取值操作为：#{...}。去页面测试：
![mark](http://image.codingce.com.cn/blog/20200815/082855333.png)

# 配置国际化解析
在Spring中有一个国际化的Locale （区域信息对象）；里面有一个叫做LocaleResolver （获取区域信息对象）的解析器！

去webmvc自动配置文件，寻找一下  看到SpringBoot默认配置：
```java

@Bean
@ConditionalOnMissingBean
@ConditionalOnProperty(prefix = "spring.mvc", name = "locale")
public LocaleResolver localeResolver() {
    // 容器中没有就自己配，有的话就用用户配置的
    if (this.mvcProperties.getLocaleResolver() == WebMvcProperties.LocaleResolver.FIXED) {
        return new FixedLocaleResolver(this.mvcProperties.getLocale());
    }
    // 接收头国际化分解
    AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
    localeResolver.setDefaultLocale(this.mvcProperties.getLocale());
    return localeResolver;
}
```
AcceptHeaderLocaleResolver 这个类中有一个方法
```java
public Locale resolveLocale(HttpServletRequest request) {
    Locale defaultLocale = this.getDefaultLocale();
    // 默认的就是根据请求头带来的区域信息获取Locale进行国际化
    if (defaultLocale != null && request.getHeader("Accept-Language") == null) {
        return defaultLocale;
    } else {
        Locale requestLocale = request.getLocale();
        List<Locale> supportedLocales = this.getSupportedLocales();
        if (!supportedLocales.isEmpty() && !supportedLocales.contains(requestLocale)) {
            Locale supportedLocale = this.findSupportedLocale(request, supportedLocales);
            if (supportedLocale != null) {
                return supportedLocale;
            } else {
                return defaultLocale != null ? defaultLocale : requestLocale;
            }
        } else {
            return requestLocale;
        }
    }
}
```

那假如现在想点击链接让的国际化资源生效，就需要让自己的Locale生效！

自己写一个自己的LocaleResolver，可以在链接上携带区域信息！

修改一下前端页面的跳转连接：

```html
<!-- 这里传入参数不需要使用 ？使用 （key=value）-->
<a class="btn btn-sm" th:href="@{/index.html(l='zh_CN')}">中文</a>
<a class="btn btn-sm" th:href="@{/index.html(l='en_US')}">English</a>
```

写一个处理的组件类！
```java
package cn.com.codingce.config;

import org.springframework.util.StringUtils;
import org.springframework.web.servlet.LocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

public class MyLocaleResolver implements LocaleResolver {

    //解析请求
    @Override
    public Locale resolveLocale(HttpServletRequest httpServletRequest) {
        //获取请求语言的参数链接
        String language = httpServletRequest.getParameter("l");
        Locale locale = Locale.getDefault();//如果没有就使用默认

        //如果请求的链接携带了国际化参数
        if (!StringUtils.isEmpty(language)) {
            //zh_CN
            String[] split = language.split("_");
            //国家, 地区
            locale = new Locale(split[0], split[1]);
        }
        return locale;
    }

    @Override
    public void setLocale(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Locale locale) {

    }
}
```

为了让自己的区域化信息能够生效，需要再配置一下这个组件！在自己的MvcConofig下添加bean；
```java
    //自定义的国际化组件就生效了， 只有注入才能生效
    @Bean
    public LocaleResolver localeResolver() {
        return new MyLocaleResolver();
    }
```
![mark](http://image.codingce.com.cn/blog/20200815/083255553.png)
![mark](http://image.codingce.com.cn/blog/20200815/083246025.png)












>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java