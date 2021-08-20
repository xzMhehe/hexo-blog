---
title: 专题面经一（Java基础）
date: 2021-07-18 07:15:38
tags:
  - 面试
categories:
  - 面试
keywords:
  - 面试
description: Java
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210718093154.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210718093154.png
---
# 1.ArrayList和LinkedList区别
ArrayList：基于`动态数组`，`连续内存存储`，适合下标访问（随机访问），

扩容机制：因为数组长度固定，超出长度存数据时需要新建数组，然后将老数组的数据拷贝到新数组，如果不是尾部插入数据还会 涉及到元素的移动（往后复制一份，插入新元素），`使用尾插法并指定初始容量`可以极大提升性能、甚至超过linkedList（需要创建大量的node对象）

LinkedList：基于`链表`，`可以存储在分散的内存中`，适合做数据`插入及删除`操作，不适合查询：需要逐 一遍历

`遍历LinkedList必须使用iterator不能使用for循环`，`因为每次for循环体内通过get(i)取得某一元素时都需要对list重新进行遍历`，性能消耗极大。 `另外不要试图使用indexOf等返回元素索引`，并利用其进行遍历，使用indexlOf对list进行了遍历，当结 果为空时会遍历整个列表。


# 2.HashMap和HashTable有什么区别？其底层实现是什么？
1. 区别 ：

（1）HashMap方法没有synchronized修饰，线程非安全，HashTable线程安全；

（2）HashMap允许key和value为null，而HashTable不允许

（3）HashMap继承了AbstractMap，HashTable继承Dictionary抽象类，两者均实现Map接口

2. 底层实现：数组+链表实现

jdk8开始链表高度到8、数组长度超过64，链表转变为红黑树，元素以内部类Node节点存在

Hashtable计算hash是直接使用key的hashcode对table数组的长度直接进行取模

HashMap计算hash对key的hashcode进行了二次hash，以获得更好的散列值，然后对table数组长度取模

如果没有产生hash冲突(下标位置没有元素)，则直接创建Node存入数组， 如果产生hash冲突，先进行equal比较，相同则取代该元素，不同，则判断链表高度插入链表，链 表高度达到8，并且数组长度到64则转变为红黑树，长度低于6则将红黑树转回链表 key为null，存在下标0的位置

3. 数组扩容

`HashMap`的初始容量为`16`，`Hashtable`初始容量为`11`，两者的`填充因子默认都是0.75`。HashMap扩容时是当前容量翻倍即:`capacity 2`，Hashtable扩容时是容量翻倍+1即:`capacity (2+1)`



# 3.ConcurrentHashMap原理，jdk7和jdk8版本的区别
**jdk7**： 

`数据结构`：ReentrantLock+Segment+HashEntry，一个Segment中包含一个HashEntry数组，每个 HashEntry又是一个链表结构

`元素查询`：`二次hash`，第一次Hash定位到Segment，第二次Hash定位到元素所在的链表的头部

`锁`：Segment分段锁 Segment继承了ReentrantLock，锁定操作的Segment，其他的Segment不受影 响，并发度为segment个数，可以通过构造函数指定，数组扩容不会影响其他的segment

`get方法无需加锁`，`volatile保证`

**jdk8**：

`数据结构`：`synchronized`+`CAS`+`Node`+`红黑树`，`Node`的`val`和`next`都用`volatile`修饰，`保证可见性`  

`查找，替换，赋值操作都使用CAS`

`锁`：`锁链表的head节点`，`不影响其他元素的读写`，`锁粒度更细`，`效率更高`，`扩容时，阻塞所有的读写 操作、并发扩容`

`读操作无锁`：Node的val和next使用volatile修饰，读写线程对该变量互相可见 数组用volatile修饰，保证扩容时被读线程感知


# 4.什么是字节码？采用字节码的好处是什么？
java中的编译器和解释器：

Java中引入了`虚拟机`的概念，即在`机器`和`编译程序之间`加入了一层抽象的虚拟的机器。这台虚拟的机器 在任何平台上都提供给编译程序一个的共同的接口。 编译程序只需要面向虚拟机，生成虚拟机能够理解的代码，然后由解释器来将虚拟机代码转换为特定系 统的机器码执行。在Java中，这种供虚拟机理解的代码叫做 字节码（即扩展名为 .class的文件），它不 面向任何特定的处理器，只面向虚拟机。 每一种平台的解释器是不同的，但是实现的虚拟机是相同的。

Java源程序经过编译器编译后变成字节码，字节码由虚拟机解释执行，虚拟机将每一条要执行的字节码送给解释器，解释器将其翻译成特定机 器上的机器码，然后在特定的机器上运行。这也就是解释了Java的编译与解释并存的特点。 

`Java源代码---->编译器---->jvm可执行的Java字节码(即虚拟指令)---->jvm---->jvm中解释器----->机器可执 行的二进制机器码---->程序运行`。 

`采用字节码的好处`：                 
Java语言通过字节码的方式，`在一定程度上解决了传统解释型语言执行效率低的问题`，`同时又保留了解释型语言可移植的特点`。`所以Java程序运行时比较高效`，而且，由于字节码并不专对一种特定的机器， 因此，Java程序无须重新编译便可在多种不同的计算机上运行。



# 5.Java中的异常体系
Java中的所有异常都来自顶级父类`Throwable`。 

Throwable下有两个子类`Exception`和`Error`。 

`Error是程序无法处理的错误`，一旦出现这个错误，则程序将被迫停止运行。 

Exception不会导致程序停止，又分为两个部分`RunTimeException运行时异常`和`CheckedException检查异常`。 

RunTimeException `常常发生在程序运行过程中`，`会导致程序当前线程执行失败`。CheckedException常常发生在`程序编译`过程中，`会导致程序编译不通过`。



# 6.Java类加载器
## JAVA类加载器包括几种？
**引导类加载器 bootstrap class loader**

启动类加载器主要加载的是JVM自身需要的类，这个类加载使用C++语言实现的，`是虚拟机自身的一部分`，它负责将 `/lib`路径下的`核心类库`或`-Xbootclasspath参数指定的路径下的jar包`加载到内存中，`注意必由于虚拟机是按照文件名识别加载jar包的`，`如rt.jar`，如果文件名不被虚拟机识别，即使把jar包丢到lib目录下也是没有作用的(出于安全考虑，Bootstrap启动类加载器只加载包名为java、javax、sun等开头的类

**扩展类加载器 extensions class loader**

它负责加载`JAVA_HOME/lib/ext`目录下或者由系统变量-Djava.ext.dir指定位路径中的类库，开发者可以直接使用标准扩展类加载器。

**应用程序类加载器 application class loader**

应用程序加载器是指 Sun公司实现的sun.misc.Launcher$AppClassLoader。它负责加载系统类路径java -classpath或-D java.class.path 指定路径下的类库，也就是我们经常用到的classpath路径，开发者可以直接使用系统类加载器，一般情况下该类加载是程序中默认的类加载器，通过ClassLoader#getSystemClassLoader()方法可以获取到该类加载器。

**自定义类加载器 java.lang.classloder**

就是自定义啦，通过继承java.lang.ClassLoader类的方式


## 类加载器之间的关系
启动类加载器，由C++实现，没有父类。                  
拓展类加载器(ExtClassLoader)，由Java语言实现，父类加载器为null                  
系统类加载器(AppClassLoader)，由Java语言实现，父类加载器为ExtClassLoader               
自定义类加载器，父类加载器肯定为AppClassLoader。               


# 7.双亲委派机制
请注意双亲委派模式中的父子关系并非通常所说的类继承关系。

**其工作原理的是**：如果一个类加载器收到了类加载请求，它并不会自己先去加载，而是把这个请求委托给父类的加载器去执行，如果父类加载器还存在其父类加载器，则进一步向上委托，依次递归，请求最终将到达顶层的启动类加载器，如果父类加载器可以完成类加载任务，就成功返回，倘若父类加载器无法完成此加载任务，子加载器才会尝试自己去加载，这就是双亲委派模式，即每个儿子都很懒，每次有活就丢给父亲去干，直到父亲说这件事我也干不了时，儿子自己想办法去完成。


双亲委派模型的好处：              
主要是为了安全性，避免用户自己编写的类动态替换 Java的一些核心类，比如 String。 同时也避免了类的重复加载，因为 JVM中区分不同类，不仅仅是根据类名，相同的 class文件被不 同的 ClassLoader加载就是不同的两个类



# 8.GC如何判断对象可以被回收
**引用计数法**：每个对象有一个引用计数属性，新增一个引用时计数加1，引用释放时计数减1，计 数为0时可以回收， 

**可达性分析法**：从 GC Roots 开始向下搜索，搜索所走过的路径称为引用链。当一个对象到 GC Roots 没有任何引用链相连时，则证明此对象是不可用的，那么虚拟机就判断是可回收对象。


>引用计数法，可能会出现A 引用了 B，B 又引用了 A，这时候就算他们都不再使用了，但因为相互
>引用 计数器=1 永远无法被回收。


GC Roots的对象有：          
- 虚拟机栈(栈帧中的本地变量表）中引用的对象 
- 方法区中类静态属性引用的对象 
- 方法区中常量引用的对象 
- 本地方法栈中JNI(即一般说的Native方法)引用的对象


可达性算法中的不可达对象并不是立即死亡的，对象拥有一次自我拯救的机会。对象被系统宣告死亡至 少要经历两次标记过程：第一次是经过可达性分析发现没有与GC Roots相连接的引用链，第二次是在由 虚拟机自动建立的Finalizer队列中判断是否需要执行finalize()方法。

当对象变成(GC Roots)不可达时，GC会判断该对象是否覆盖了finalize方法，若未覆盖，则直接将其回 收。否则，若对象未执行过finalize方法，将其放入F-Queue队列，由一低优先级线程执行该队列中对象 的finalize方法。执行finalize方法完毕后，GC会再次判断该对象是否可达，若不可达，则进行回收，否 则，对象“复活”

每个对象只能触发一次finalize()方法

由于finalize()方法运行代价高昂，不确定性大，无法保证各个对象的调用顺序，不推荐大家使用，建议 遗忘它。


# 9.List和Set的区别
**List**：有序，按对象进入的顺序保存对象，可重复，允许多个Null元素对象，可以使用Iterator取出 所有元素，在逐一遍历，还可以使用get(int index)获取指定下标的元素 

**Set**：无序，不可重复，最多允许有一个Null元素对象，取元素时只能用Iterator接口取得所有元 素，在逐一遍历各个元素


# 10.接口和抽象类的区别
抽象类可以存在普通成员函数，而接口中只能存在public abstract 方法。 

抽象类中的成员变量可以是各种类型的，而接口中的成员变量只能是public static final类型的。

抽象类只能继承一个，接口可以实现多个。


抽象类是对类本质的抽象，表达的是 is a 的关系，比如： BMW is a 用特性，将子类存在差异化的特性进行抽象，交由子类去实现。

Car 。抽象类包含并实现子类的通

而接口是对行为的抽象，表达的是 like a 的关系。比如： Bird like a Aircraft （像飞行器一样可以 飞），但其本质上 is a Bird 。接口的核心是定义行为，即实现类可以做什么，至于实现类主体是谁、 是如何实现的，接口并不关心。

# 11.重载和重写的区别
**重载**： 发生在同一个类中，方法名必须相同，参数类型不同、个数不同、顺序不同，方法返回值和访问 修饰符可以不同，发生在编译时。 

**重写**： 发生在父子类中，方法名、参数列表必须相同，返回值范围小于等于父类，抛出的异常范围小于 等于父类，访问修饰符范围大于等于父类；如果父类方法访问修饰符为private则子类就不能重写该方 法。

# 12.String、StringBuffer、StringBuilder
`String` 是 `final` 修饰的，`不可变`，`每次操作都会产生新的String对象`

`StringBuffer` 和 `StringBuilder` 都是在原对象上操作 StringBuffer 是线程安全的，StringBuilder 线程不安全的 StringBuffer 方法都是 synchronized 修饰的 性能：`StringBuilder > StringBuffer > String`

**场景**：经常需要改变字符串内容时使用后面两个

优先使用StringBuilder，多线程使用共享变量时使用StringBuffer


# 12.final
最终的

**修饰类**:表示类不可被继承 修饰方法：表示方法不可被子类覆盖，但是可以重载 修饰变量：表示变量一旦被赋值就不可以更改它的值。

**修饰成员变量**:如果final修饰的是类变量，只能在静态初始化块中指定初始值或者声明该类变量时指定初始值。 如果final修饰的是成员变量，可以在非静态初始化块、声明该变量或者构造器中执行初始值。

**修饰局部变量**:系统不会为局部变量进行初始化，局部变量必须由程序员显示初始化。因此使用final修饰局部变量时， 即可以在定义时指定默认值（后面的代码不能对变量再赋值），也可以不指定默认值，而在后面的代码 中对final变量赋初值（仅一次）

# 13.==和equals比较
**==**:对比的是`栈中的值`，`基本数据类型是变量值`，`引用类型是堆中内存对象的地址`  

**equals**：object中默认也是采用==比较，通常会重写

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```
上述代码可以看出，String类中被复写的equals()方法其实是比较两个字符串的内容。

```java
public static void main(String[] args) {
    String str1 = "Hello";
    String str2 = new String("Hello");
    String str3 = str2; // 引用传递
    System.out.println(str1 == str2); // false
    System.out.println(str1 == str3); // false
    System.out.println(str2 == str3); // true
    System.out.println(str1.equals(str2)); // true
    System.out.println(str1.equals(str3)); // true
    System.out.println(str2.equals(str3)); // true
}
```



>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java