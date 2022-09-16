---
title: Java-注解
date: 2021-06-29 19:03:37
tags:
  - Java
  - 面经
categories:
  - Java
keywords:
  - Java
description: Java
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210629190505.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210629190505.png
---
## 1、4种标准元注解是哪四种？
元注解的作用是负责注解其他注解。 `Java5.0` 定义了 `4` 个标准的 `meta-annotation` 类型，它们被用来提供对其它 `annotation` 类型`作说明`。

**@Target 修饰的对象范围**             
@Target 说明了 Annotation 所修饰的对象范围： Annotation可被用于 `packages`、`types`（`类`、`接口`、 `枚举`、`Annotation` 类型）、类型成员（方法、构造方法、成员变量、枚举值）、方法参数和本地变量 （如循环变量、catch 参数）。在 Annotation 类型的声明中使用了 target 可更加明晰其修饰的目标


**@Retention 定义 被保留的时间长短**         
 定义Retention了该 Annotation   `保留的时间长短`：表示需要在什么级别保存注解信息，用于描述注 解的生命周期（即：被描述的注解在什么范围内有效），取值（RetentionPoicy）由：

1. SOURCE:在源文件中有效（即源文件保留）

2. CLASS:在 class 文件中有效（即 class 保留）

3. RUNTIME:在运行时有效（即运行时保留）


**@Documented 描述-javadoc**             
@ Documented 用于描述其它类型的 annotation 应该被作为被标注的程序成员的公共 API，因
此可以被例如 javadoc 此类的工具文档化。


**@Inherited 阐述了某个被标注的类型是被继承的**     
@Inherited 元注解是一个标记注解，@Inherited 阐述了某个被标注的类型是被继承的。如果一
个使用了@Inherited 修饰的 annotation 类型被用于一个 class，则这个 annotation 将被用于该
class 的子类。


## 2、注解是什么？
Annotation（注解）是 Java 提供的一种对元程序中元素关联信息和元数据（metadata）的途径和方法。 Annatation(注解)是一个接口，程序可以通过反射来获取指定程序中元素的 Annotation对象，然 后通过该 Annotation 对象来获取注解中的元数据信息。



