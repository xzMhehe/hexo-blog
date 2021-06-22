---
title: Java中exdents与implement区别
date: 2020-07-13 13:00:03
tags:
- Java
categories:

thumbnail: https://s1.ax1x.com/2020/07/17/UsF3dO.png
---
## Java中exdents implement  区别
### 简单说：
- extends是继承父类，只要那个类不是声明为final或者那个类定义为abstract的就能继承，
- JAVA中不支持多重继承，但是可以用接口来实现，这样就要用到implements，
- 继承只能继承一个类，但implements可以实现多个接口，用逗号分开就行了 ,比如  class A extends B implements C,D,E

### 术语话来说：
extends 继承类；implements 实现接口。
类和接口是不同的：类里是有程序实现的；而接口无程序实现，只可以预定义方法

Java也提供继承机制﹐但还另外提供一个叫interface的概念。由于Java的继承机制只能提供单一继承（就是只能继承一种父类别）﹐所以就以Java的interface来代替C++的多重继承。interface就是一种介面﹐规定欲沟通的两物件﹐其通讯该有的规范有哪些。

如以Java程式语言的角度来看﹐Java的interface则表示：

一些函数或资料成员为另一些属于不同类别的物件所需共同拥有,则将这些函数与资料成员定义在一个interface中,然后让所有不同类别的Java物件可以共同操作使用之。
Java的class只能继承一个父类别（用extends关键字）, 但可以拥有（或称实作）许多interface（用implements关键字）。

extends和implements有什么不同？
对于class而言，extends用于（单）继承一个类（class），而implements用于实现一个接口（interface）。  

interface的引入是为了部分地提供多继承的功能。在interface中只需声明方法头，而将方法体留给实现的class来做。 这些实现的class的实例完全可以当作interface的实例来对待。 在interface之间也可以声明为extends（多继承）的关系。

注意: 一个interface可以extends多个其他interface。
