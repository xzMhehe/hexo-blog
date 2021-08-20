---
title: yaml配置注入
date: 2020-08-10 19:24:41
pin: false
toc: false
icons: []
tags: [SpringBoot]
categories: [SpringBoot]
keywords: [SpringBoot]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200926053.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200926053.png
description: SpringBoot
---
# yaml语法学习
## 配置文件
SpringBoot使用一个全局的配置文件 ， 配置文件名称是固定的

- application.properties
    - 语法结构 ：key=value

application.yml

语法结构 ：key：空格 value

配置文件的作用 ：修改SpringBoot自动配置的默认值，因为SpringBoot在底层都给我们自动配置好了；

比如可以在配置文件中修改Tomcat 默认启动的端口号

```yaml
server.port=8081
```

## yaml概述
YAML是 "YAML Ain't a Markup Language" （YAML不是一种标记语言）的递归缩写。在开发的这种语言时，YAML 的意思其实是："Yet Another Markup Language"（仍是一种标记语言）

这种语言以数据作为中心，而不是以标记语言为重点！

以前的配置文件，大多数都是使用xml来配置；比如一个简单的端口配置，我们来对比下yaml和xml

传统xml配置：

```xml
<server>
    <port>8081<port>
</server>
```

yaml配置：

```yaml
server：
  prot: 8080
```

## yaml基础语法
说明：语法要求严格！

- 空格不能省略

- 以缩进来控制层级关系，只要是左边对齐的一列数据都是同一个层级的。

- 属性和值的大小写都是十分敏感的.

字面量：普通的值  [ 数字，布尔值，字符串  ]
字面量直接写在后面就可以 ， 字符串默认不用加上双引号或者单引号；

```yaml
k: v
```

注意：

- “ ” 双引号，不会转义字符串里面的特殊字符 ， 特殊字符会作为本身想表示的意思；比如 ：name: "codingce \n M"   输出 codingce  换行   M

- '' 单引号，会转义特殊字符 ， 特殊字符最终会变成和普通字符一样输出比如 ：name: codingce \n M   输出 codingce  \n   M

**对象、Map（键值对）**
```yaml
#对象、Map格式
k: 
    v1:
    v2:
```
在下一行来写对象的属性和值得关系，注意缩进；比如：
```yaml
student:
    name: zhangshangbiancheng
    age: 3
```

行内写法
```yaml
student: {name: zhangshangbiancheng, age: 3}
```

数组（ List、set ）
用 - 值表示数组中的一个元素,比如：
```yaml
pets:
 - cat
 - dog
 - pig
```

行内写法
```yaml
pets: [cat,dog,pig]
```

修改SpringBoot的默认端口号

配置文件中添加，端口号的参数，就可以切换端口；
```yaml
server:
  port: 8082
```

# 注入配置文件

yaml文件更强大的地方在于，他可以给我们的实体类直接注入匹配值！
## yaml注入配置文件
- 在springboot项目中的resources目录下新建一个文件 application.yml
- 编写一个实体类 Dog；
```java
package cn.com.codingce.pojo;

import org.springframework.stereotype.Component;

@Component
public class dag {
    private String name;
    private Integer age;

    public dag() {
    }

    public dag(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "dag{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

- 思考，我们原来是如何给bean注入属性值的！@Value，给狗狗类测试一下：

```java
@Component //注册bean
public class Dog {
    @Value("阿黄")
    private String name;
    @Value("18")
    private Integer age;
}
```

- 在SpringBoot的测试类下注入狗狗输出一下；

```java
@SpringBootTest
class DemoApplicationTests {

    @Autowired //将狗狗自动注入进来
    Dog dog;

    @Test
    public void contextLoads() {
        System.out.println(dog); //打印看下狗狗对象
    }

}
```
结果成功输出，@Value注入成功.

- 在编写一个复杂一点的实体类：Person 类

```java
package cn.com.codingce.pojo;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Component //注册bean到容器中
public class Person {
    private String name;
    private Integer age;
    private Boolean happy;
    private Date birth;
    private Map<String,Object> maps;
    private List<Object> lists;
    private Dog dog;

    public Person() {
    }

    public Person(String name, Integer age, Boolean happy, Date birth, Map<String, Object> maps, List<Object> lists, Dog dog) {
        this.name = name;
        this.age = age;
        this.happy = happy;
        this.birth = birth;
        this.maps = maps;
        this.lists = lists;
        this.dog = dog;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Boolean getHappy() {
        return happy;
    }

    public void setHappy(Boolean happy) {
        this.happy = happy;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public Map<String, Object> getMaps() {
        return maps;
    }

    public void setMaps(Map<String, Object> maps) {
        this.maps = maps;
    }

    public List<Object> getLists() {
        return lists;
    }

    public void setLists(List<Object> lists) {
        this.lists = lists;
    }

    public Dog getDog() {
        return dog;
    }

    public void setDog(Dog dog) {
        this.dog = dog;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", happy=" + happy +
                ", birth=" + birth +
                ", maps=" + maps +
                ", lists=" + lists +
                ", dog=" + dog +
                '}';
    }
}
```

- 使用yaml配置的方式进行注入，大家写的时候注意区别和优势，我们编写一个yaml配置！

```yaml
person:
  name: maxinze
  age: 3
  happy: false
  birth: 1998/01/01
  maps: {k1: v1,k2: v2}
  lists:
    - code
    - girl
    - music
  dog:
    name: 阿黑
    age: 1
```

- 刚才已经把person这个对象的所有值都写好了，现在来注入到类中

```java
/*
@ConfigurationProperties作用：
将配置文件中配置的每一个属性的值，映射到这个组件中；
告诉SpringBoot将本类中的所有属性和配置文件中相关的配置进行绑定
参数 prefix = “person” : 将配置文件中的person下面的所有属性一一对应
*/
@Component //注册bean
@ConfigurationProperties(prefix = "person")
public class Person {
    private String name;
    private Integer age;
    private Boolean happy;
    private Date birth;
    private Map<String,Object> maps;
    private List<Object> lists;
    private Dog dog;
}
```
IDEA 提示，springboot配置注解处理器没有找到，看文档，可以查看文档，找到一个依赖

```xml

<!-- 导入配置文件处理器，配置文件进行绑定就会有提示，需要重启 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-configuration-processor</artifactId>
  <optional>true</optional>
</dependency>
```

- 确认以上配置都OK之后，去测试类中测试一下：
```java
@SpringBootTest
class DemoApplicationTests {

    @Autowired
    Person person; //将person自动注入进来

    @Test
    public void contextLoads() {
        System.out.println(person); //打印person信息
    }

}
```

结果：所有值全部注入成功！
![mark](http://image.codingce.com.cn/blog/20200811/081607796.png)
yaml配置注入到实体类完全OK！

## 加载指定的配置文件
**@PropertySource** ：加载指定的配置文件；
**@configurationProperties**：默认从全局配置文件中获取值；

- 在resources目录下新建一个person.properties文件

```yaml
name=zhangshangbiancheng
```

- 然后在我们的代码中指定加载person.properties文件

```java
@PropertySource(value = "classpath:person.properties")
@Component //注册bean
public class Person {

    @Value("${name}")
    private String name;

    ......  
}
```

- 再次输出测试一下：指定配置文件绑定成功！

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200928749.png)

## 配置文件占位符
配置文件还可以编写占位符生成随机数
```yaml
person:
    name: maxinze${random.uuid} # 随机uuid
    age: ${random.int}  # 随机int
    happy: false
    birth: 2000/01/01
    maps: {k1: v1,k2: v2}
    lists:
      - code
      - girl
      - music
    dog:
      name: ${person.hello:other}_旺财
      age: 1
```



>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java