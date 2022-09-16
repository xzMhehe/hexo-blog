---
title: shiro
date: 2020-08-18 14:47:51
tags:
- SpringBoot
categories: 
- SpringBoot

thumbnail: https://s1.ax1x.com/2020/08/20/dJw9De.md.jpg
---

## 什么是shiro
Apache Shiro是一个强大且易用的Java安全框架,执行身份验证、授权、密码和会话管理。使用Shiro的易于理解的API,您可以快速、轻松地获得任何应用程序,从最小的移动应用程序到最大的网络和企业应用程序。

### 主要功能
![mark](http://image.codingce.com.cn/blog/20200818/150317377.png)
三个核心组件：Subject, SecurityManager 和 Realms.
- Subject：即“当前操作用户”。但是，在Shiro中，Subject这一概念并不仅仅指人，也可以是第三方进程、后台帐户（Daemon Account）或其他类似事物。它仅仅意味着“当前跟软件交互的东西”。Subject代表了当前用户的安全操作，SecurityManager则管理所有用户的安全操作。

- SecurityManager：它是Shiro框架的核心，典型的Facade模式，Shiro通过SecurityManager来管理内部组件实例，并通过它来提供安全管理的各种服务。

- Realm： Realm充当了Shiro与应用安全数据间的“桥梁”或者“连接器”。也就是说，当对用户执行认证（登录）和授权（访问控制）验证时，Shiro会从应用配置的Realm中查找用户及其权限信息。从这个意义上讲，Realm实质上是一个安全相关的DAO：它封装了数据源的连接细节，并在需要时将相关数据提供给Shiro。当配置Shiro时，你必须至少指定一个Realm，用于认证和（或）授权。配置多个Realm是可以的，但是至少需要一个。

Shiro内置了可以连接大量安全数据源（又名目录）的Realm，如LDAP、关系数据库（JDBC）、类似INI的文本配置资源以及属性文件等。如果缺省的Realm不能满足需求，你还可以插入代表自定义数据源的自己的Realm实现。

![mark](http://image.codingce.com.cn/blog/20200818/150350014.png)

### 使用步骤
- 首先去github下载shiro项目
https://github.com/apache/shiro

进入项目打开samples文件夹
分析quickstart项目

- 新建项目springboot-08-shiro
编写log4j.properties
```yaml
log4j.rootLogger=INFO, stdout

log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m %n

## General Apache libraries
log4j.logger.org.apache=WARN

## Spring
log4j.logger.org.springframework=WARN

## Default Shiro logging
log4j.logger.org.apache.shiro=INFO

## Disable verbose logging
log4j.logger.org.apache.shiro.util.ThreadContext=WARN
log4j.logger.org.apache.shiro.cache.ehcache.EhCache=WARN
```

shiro.ini
```yaml
[users]
## user 'root' with password 'secret' and the 'admin' role
root = secret, admin
## user 'guest' with the password 'guest' and the 'guest' role
guest = guest, guest
## user 'presidentskroob' with password '12345' ("That's the same combination on
## my luggage!!!" ;)), and role 'president'
presidentskroob = 12345, president
## user 'darkhelmet' with password 'ludicrousspeed' and roles 'darklord' and 'schwartz'
darkhelmet = ludicrousspeed, darklord, schwartz
## user 'lonestarr' with password 'vespa' and roles 'goodguy' and 'schwartz'
lonestarr = vespa, goodguy, schwartz

## -----------------------------------------------------------------------------
## Roles with assigned permissions
## 
## Each line conforms to the format defined in the
## org.apache.shiro.realm.text.TextConfigurationRealm#setRoleDefinitions JavaDoc
## -----------------------------------------------------------------------------
[roles]
## 'admin' role has all permissions, indicated by the wildcard '*'
admin = *
## The 'schwartz' role can do anything (*) with any lightsaber:
schwartz = lightsaber:*
## The 'goodguy' role is allowed to 'drive' (action) the winnebago (type) with
## license plate 'eagle5' (instance specific id)
goodguy = winnebago:drive:eagle5
```


Quickstart.java
官方的例子，里面存在过时的类
```java
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.ini.IniSecurityManagerFactory;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.lang.util.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Simple Quickstart application showing how to use Shiro's API.
 *
 * @since 0.9 RC2
 */
public class Quickstart {

    private static final transient Logger log = LoggerFactory.getLogger(Quickstart.class);


    public static void main(String[] args) {

        // The easiest way to create a Shiro SecurityManager with configured
        // realms, users, roles and permissions is to use the simple INI config.
        // We'll do that by using a factory that can ingest a .ini file and
        // return a SecurityManager instance:

        // Use the shiro.ini file at the root of the classpath
        // (file: and url: prefixes load from files and urls respectively):
        Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
        SecurityManager securityManager = factory.getInstance();

        // for this simple example quickstart, make the SecurityManager
        // accessible as a JVM singleton.  Most applications wouldn't do this
        // and instead rely on their container configuration or web.xml for
        // webapps.  That is outside the scope of this simple quickstart, so
        // we'll just do the bare minimum so you can continue to get a feel
        // for things.
        SecurityUtils.setSecurityManager(securityManager);

        // Now that a simple Shiro environment is set up, let's see what you can do:

        // get the currently executing user:
        Subject currentUser = SecurityUtils.getSubject();

        // Do some stuff with a Session (no need for a web or EJB container!!!)
        Session session = currentUser.getSession();
        session.setAttribute("someKey", "aValue");
        String value = (String) session.getAttribute("someKey");
        if (value.equals("aValue")) {
            log.info("Retrieved the correct value! [" + value + "]");
        }

        // let's login the current user so we can check against roles and permissions:
        if (!currentUser.isAuthenticated()) {
            UsernamePasswordToken token = new UsernamePasswordToken("lonestarr", "vespa");
            token.setRememberMe(true);
            try {
                currentUser.login(token);
            } catch (UnknownAccountException uae) {
                log.info("There is no user with username of " + token.getPrincipal());
            } catch (IncorrectCredentialsException ice) {
                log.info("Password for account " + token.getPrincipal() + " was incorrect!");
            } catch (LockedAccountException lae) {
                log.info("The account for username " + token.getPrincipal() + " is locked.  " +
                        "Please contact your administrator to unlock it.");
            }
            // ... catch more exceptions here (maybe custom ones specific to your application?
            catch (AuthenticationException ae) {
                //unexpected condition?  error?
            }
        }

        //say who they are:
        //print their identifying principal (in this case, a username):
        log.info("User [" + currentUser.getPrincipal() + "] logged in successfully.");

        //test a role:
        if (currentUser.hasRole("schwartz")) {
            log.info("May the Schwartz be with you!");
        } else {
            log.info("Hello, mere mortal.");
        }

        //test a typed permission (not instance-level)
        if (currentUser.isPermitted("lightsaber:wield")) {
            log.info("You may use a lightsaber ring.  Use it wisely.");
        } else {
            log.info("Sorry, lightsaber rings are for schwartz masters only.");
        }

        //a (very powerful) Instance Level permission:
        if (currentUser.isPermitted("winnebago:drive:eagle5")) {
            log.info("You are permitted to 'drive' the winnebago with license plate (id) 'eagle5'.  " +
                    "Here are the keys - have fun!");
        } else {
            log.info("Sorry, you aren't allowed to drive the 'eagle5' winnebago!");
        }

        //all done - log out!
        currentUser.logout();

        System.exit(0);
    }
}
```



## SpringBoot整合Shiro
### 认证
#### 导包
```xml
<dependencies>
        <!--shiro
        Subject 用户
        SecurityManager 管理所有用户
        Realm   连接数据
        -->
        <!--shiro整合Spring的包-->
        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-spring</artifactId>
            <version>1.3.2</version>

        </dependency>

        <!--thymeleaf-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
```

#### 编写shiro配置类ShiroConfig
```java
package cn.com.codingce.config;

import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.LinkedHashMap;

@Configuration
public class ShiroConfig {

    //ShiroFilterFactroyBean    第三步
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager webSecurityManager) {
        ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
        //设置安全管理器
        bean.setSecurityManager(webSecurityManager);
        //添加shiro 的内置过滤器
        /**
         * anno 无需认证就可以访问
         * authc: 必须认证才能访问
         * user:    必须拥有记住我功能才能使用
         * perms:    拥有对某个资源的权限才能访问
         * role:    拥有某个角色权限才能访问
         * //        filterMap.put("/user/add", "authc");
         * //        filterMap.put("/user/update", "authc");        支持通配符  /user/*
         */
        HashMap<String, String> filterMap = new LinkedHashMap<>();
        filterMap.put("/user/*", "authc");

        //设置登录的请求
        bean.setLoginUrl("/toLogin");

        bean.setFilterChainDefinitionMap(filterMap);
        return bean;
    }

    //DafaultWebSecurityManager 第二步
    @Bean(name = "securityManager")
    public DefaultWebSecurityManager getDefaultWebSecurityManager(@Qualifier("userRealm") UserRealm userRealm) {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        //关联UserRealm
        securityManager.setRealm(userRealm);
        return securityManager;

    }

    //创建realm对象,    需要自定义   这是第一步       ||    @Bean(name = "UserRealm")   互联  @Qualifier("userRealm")   与方法名一致  前面的@Bean就不用写name属性
    @Bean
    public UserRealm userRealm() {
        return new UserRealm();
    }

}
```

#### Realm
```java
package cn.com.codingce.config;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

//自定义的Realm
public class UserRealm extends AuthorizingRealm {

    //授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        System.out.println("执行了授权");
        return null;
    }

    //认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        System.out.println("执行了认证");
        //用户名，密码
        String name = "root";
        String password = "123";

         UsernamePasswordToken userToken= (UsernamePasswordToken)authenticationToken;
         if (!userToken.getUsername().equals(name)) {
             return null;   //UnknownAccountException
         }

         //密码认证
        return new SimpleAuthenticationInfo("", password, "");

    }
}
```

#### 前端页面
login.html
```html
<!DOCTYPE html>
<html lang="en"
      xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h1>登录</h1>
<p th:text="${msg}" style="color: red"></p>
<form th:action="@{/login}">
    <p>用户名:<input type="text" name="username" placeholder="请输入用户名"></p>
    <p>密码:<input type="text" name="password" placeholder="请输入密码"></p>
    <input type="submit" value="登录">
</form>

</body>
</html>
```

#### index.html
```html
<!DOCTYPE html>
<html lang="en"
      xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
<h1>首页</h1>
<p th:text="${msg}"></p>

<a th:href="@{/user/add}">add</a>
<a th:href="@{/user/update}">update</a>
</body>
</html>
```

#### MyController
```java
package cn.com.codingce.controller;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MyController {

    @RequestMapping({"/", "/index"})
    public String toIndex(Model model) {

        model.addAttribute("msg", "helloshiro");
        return "index";
    }

    @RequestMapping("/user/add")
    public String add() {
        return "/user/add";
    }

    @RequestMapping("/user/update")
    public String update() {
        return "/user/update";
    }

    @RequestMapping("/toLogin")
    public String toLogin() {
        return "login";
    }

    @RequestMapping("/login")
    public String login(String username, String password, Model model) {
        //获取当前用户
        Subject subject = SecurityUtils.getSubject();
        //封装用户的登陆数据
        UsernamePasswordToken token = new UsernamePasswordToken(username, password);
        try {
            subject.login(token);   //执行登录方法没有异常就说明ok了
            return "index";
        } catch (UnknownAccountException e) {
            //用户名不存在
            model.addAttribute("msg", "用户名不存在");
            return "login";
        } catch (IncorrectCredentialsException ice) {
            //密码错误
            model.addAttribute("msg", "密码错误");
            return "login";
        }

    }
}
```

环境搭建以及简单的认证就完成了


### 授权
#### 修改ShiroConfig
```java
@Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager webSecurityManager) {
        ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
        //设置安全管理器
        bean.setSecurityManager(webSecurityManager);
        //添加shiro 的内置过滤器
        /**
         * anno 无需认证就可以访问
         * authc: 必须认证才能访问
         * user:    必须拥有记住我功能才能使用
         * perms:    拥有对某个资源的权限才能访问
         * role:    拥有某个角色权限才能访问
         * //        filterMap.put("/user/add", "authc");
         * //        filterMap.put("/user/update", "authc");        支持通配符  /user/*
         */
        HashMap<String, String> filterMap = new LinkedHashMap<>();

        //授权            正常情况下, 没有授权回跳到未授权页面
        filterMap.put("/user/add", "perms[user:add]");
        filterMap.put("/user/update", "perms[user:update]");


        filterMap.put("/user/*", "authc");


        //设置登录的请求
        bean.setLoginUrl("/toLogin");

        //设置未经授权的请求
        bean.setUnauthorizedUrl("/noauth");

        bean.setFilterChainDefinitionMap(filterMap);
        return bean;
    }
```

#### UserRealm
```java
//自定义的Realm
public class UserRealm extends AuthorizingRealm {

    @Autowired
    private UserServiceImpl userService;

    //授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        System.out.println("执行了授权");

        //SimpleAuthorizationInfo
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.addStringPermission("user:add");


        //拿到当前登录的对象
        Subject subject = SecurityUtils.getSubject();
        User currentUser = (User) subject.getPrincipal();
        System.out.println(currentUser.toString());

        //设置当前用户的权限
        info.addStringPermission(currentUser.getPrems());

        return info;
    }

    //认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        System.out.println("执行了认证");
        //用户名，密码
        String name = "root";
        String password = "123";

         UsernamePasswordToken userToken= (UsernamePasswordToken)authenticationToken;

         //连接真实数据库
        User user = userService.queryUserByName(userToken.getUsername());
        System.out.println(user.toString());
        if (user == null) {
            return null;
        }

//        if (!userToken.getUsername().equals(name)) {
//             return null;   //UnknownAccountException
//         }

         //密码认证
//        return new SimpleAuthenticationInfo("", password, "");

        //连数据库          此处认证的user信息通过赋值第一个参数     为user  传递给认证    通过subject.getPrincipal()获取登录用户
        return new SimpleAuthenticationInfo(user, user.getPwd(), "");

    }
}

```






>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java