---
title: Java-反射面试指北
date: 2021-07-03 18:25:16
tags:
  - Java
  - 面经
categories:
  - Java
keywords:
  - Java
description: Java
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210703173402.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210703173402.png
---

## 1、除了使用new创建对象之外，还可以用什么方法创建对象？
使用Java反射可以创建对象!


## 2、Java反射创建对象效率高还是通过new创建对象的效率高？
通过new创建对象的效率比较高。通过反射时，先找查找类资源，使用类加载器创建，过程比较繁琐， 所以效率较低


## 3、java反射的作用
反射机制是在`运行时`，`对于任意一个类`，`都能够知道这个类的所有属性和方法`；`对于任意个对象`，`都能够调用它的任意一个方法`。在java中，只要给定类的名字，就可以通过反射机制来获得类的所有信息。

这种动态获取的信息以及动态调用对象的方法的功能称为Java语言的反射机制。


## 4、哪里会用到反射机制？

jdbc就是典型的反射

```java
Class.forName('com.mysql.jdbc.Driver.class');//加载MySQL的驱动类
```

这就是反射。如hibernate，struts等框架使用反射实现的。


## 5、反射的实现方式：
第一步：获取Class对象，有4中方法： 

1）Class.forName(“类的路径”)； 

2）类名.class 

3）对象名.getClass() 

4）基本类型的包装类，可以调用包装类的Type属性来获得该包装类的Class对象


## 6、实现Java反射的类：
1）Class：表示正在运行的Java应用程序中的类和接口 注意： 所有获取对象的信息都需要Class类来实现。 

2）Field：提供有关类和接口的属性信息，以及对它的动态访问权限。 

3）Constructor：提供关于类的单个构造方法的信息以及它的访问权限 

4）Method：提供类或接口中某个方法的信息


## 7、反射机制的优缺点：
**优点**：             
1）能够运行时动态获取类的实例，提高灵活性； 

2）与动态编译结合 

**缺点**：         
1）使用反射性能较低，需要解析字节码，将内存中的对象进行解析。 

**解决方案** ：        
1、通过setAccessible(true)关闭JDK的安全检查来提升反射速度； 

2、多次创建一个类的实例时，有缓存会快很多 

3、ReflflectASM工具类，通过字节码生成的方式加快反射速度 

2）相对不安全，破坏了封装性（因为通过反射可以获得私有方法和属性）



## 8、Java 反射 API
反射 API 用来生成 JVM 中的类、接口或则对象的信息。

1. Class 类：反射的核心类，可以获取类的属性，方法等信息。

2. Field 类：Java.lang.reflec 包中的类，表示类的成员变量，可以用来获取和设置类之中的属性 值。

1. Method 类： Java.lang.reflec 包中的类，表示类的方法，它可以用来获取类中的方法信息或 者执行方法。

1. Constructor 类： Java.lang.reflec 包中的类，表示类的构造方法。


## 9、反射使用步骤（获取 Class 对象、调用对象方法）
1. 获取想要操作的类的 Class 对象，他是反射的核心，通过 Class 对象我们可以任意调用类的方法。

2. 调用 Class 类中的方法，既就是反射的使用阶段。

3. 使用反射 API 来操作这些信息。


## 10、反射案例
**英雄类**
```java
@Date
public class Hero {
    public String name;
    public float hp;
    public int damage;
    private int id;
}
```

操作
```java
/**
 * @author mxz
 */
public class TestReflection {
    public static void main(String[] args) {
        try {
            Class hClass = Class.forName("cn.com.codingce.reflection.Hero");
            // 获取映射方法
            Method setName = hClass.getMethod("setName", String.class);
            Method getName = hClass.getMethod("getName");
            Method setId = hClass.getMethod("setId", int.class);
            Method getId = hClass.getMethod("getId");


            // 通过 Constructor 对象的 newInstance() 方法
            // 根据 Class 对象实例获取 Constructor 对象   (通过反射创建类对象)
            Constructor heroConstructor = hClass.getConstructor();

            // 使用 Constructor 对象的 newInstance 方法获取反射类对象
            Object o = heroConstructor.newInstance();


            // 通过 Class 对象的 newInstance() 方法 (通过反射创建类对象)
            Hero hero = (Hero) hClass.newInstance();

            setName.invoke(o, "后端码匠");
            setName.invoke(hero, "欢迎关注");
            setId.invoke(hero, 16);


            System.out.println("反射实现: " + getName.invoke(o));
            System.out.println("反射实现: " + getName.invoke(hero));
            System.out.println("反射实现: " + getId.invoke(hero));
            System.out.println("传统: " + hero.getName());


            // 通过反射创建类对象
            Class clz = Hero.class;
            // 我们通过 Class 对象的 getFields() 方法可以获取 Class 类的属性，但无法获取私有属性
            Field[] fields = clz.getFields();
            for (Field field : fields) {
                System.out.println(field.getName());
            }

            // 而如果使用 Class 对象的 getDeclaredFields() 方法则可以获取包括私有属性在内的所有属性
            System.out.println("getDeclaredFields()所有属性");
            Field[] fields2 = clz.getDeclaredFields();
            for (Field field : fields2) {
                System.out.println(field.getName());
            }

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
}
```
