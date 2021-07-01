---
title: Java集合-泛型指北1-24
date: 2021-06-30 15:58:52
tags:
---

# 1、ArrayList和linkedList的区别
Array(数组）是基于索引(index)的数据结构，它使用索引在数组中搜索和读取数据是很快的。 Array获取数据的时间复杂度是O(1),但是要删除数据却是开销很大，因为`这需要重排数组中的所有数据`, (因为`删除数据以后`, `需要把后面所有的数据前移`) 缺点: 数组初始化必须指定初始化的长度, 否则报错 例如:
```java
int[] a = new int[4];//推荐使用int[] 这种方式初始化

int c[] = {23,43,56,78};//长度：4，索引范围：[0,3]
```

List—是一个有序的集合，可以包含重复的元素，提供了按索引访问的方式，它继承Collection。             
List有`两个`重要的实现类：`ArrayList`和`LinkedList` 

ArrayList: 可以看作是能够自动增长容量的数组 ArrayList的`toArray`方法返回一个数组 ArrayList的`asList`方法返回一个列表 

ArrayList底层的实现是`Array`, `数组扩容实现` ,`LinkList`是一个`双链表`,在`添加`和`删除元素`时具有比ArrayList`更好的性能`.但在`get`与`set`方面`弱于` ArrayList.当然,这些对比都是指数据量很大或者操作很频繁。


# 2、 HashMap和HashTable的区别

**1、两者父类不同**
HashMap是`继承`自`AbstractMap`类，而Hashtable是`继承`自`Dictionary`类。不过它们都实现了同时实现了  `map`、`Cloneable（可复制）`、`Serializable（可序列化）`这三个接口。 

`public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {}`

`public class Hashtable<K,V>
    extends Dictionary<K,V>
    implements Map<K,V>, Cloneable, java.io.Serializable {}`

**2、对外提供的接口不同**          
Hashtable比HashMap多提供了elments() 和contains() 两个方法。 elments() 方法继承自Hashtable的父类Dictionnary。elements() 方法用于返回此Hashtable中的 value的枚举。 contains()方法判断该Hashtable是否包含传入的value。它的作用与containsValue()一致。事实上， contansValue() 就只是调用了一下contains() 方法。 

**3、对null的支持不同**              
`Hashtable：key和value都不能为null`。 `HashMap：key可以为null`，`但是这样的key只能有一个`，`因为必须保证key的唯一性`；`可以有多个key 值对应的value为null`。 

**4、安全性不同**                
`HashMap是线程不安全的`，在多线程并发的环境下，`可能会产生死锁`等问题，因此需要开发人员自己处理多线程的安全问题。            
`Hashtable是线程安全的`，它的每个方法上都有`synchronized` 关键字，因此可直接用于多线程中。 虽然HashMap是线程不安全的，但是它的效率远远高于Hashtable，这样设计是合理的，因为大部分的 使用场景都是单线程。当需要多线程操作的时候可以使用线程安全的ConcurrentHashMap。 ConcurrentHashMap虽然也是线程安全的，但是它的效率比Hashtable要高好多倍。因为 ConcurrentHashMap使用了分段锁，并不对整个数据进行锁定。 

5、**初始容量大小和每次扩充容量大小不同**

6、**计算hash值的方法不同**


# 3、Collection包结构，与Collections的区别
Collection 是集合类的上级接口，子接口有 `Set`、`List`、`LinkedList`、`ArrayList`、`Vector`、`Stack`、`Set`； 

Collections是`集合类的一个帮助类`， 它包含`有各种有关集合操作的静态多态方法`，用于实现对各种集 合的搜索、排序、线程安全化等操作。`此类不能实例化`，`就像一个工具类`，`服务于Java的Collection框架`。


# 4、泛型常用特点 （待补充）
泛型是Java SE `1.5`之后的特性， `《Java 核心技术》`中对泛型的定义是： “泛型” `意味着编写的代码可以被不同类型的对象所重用`。 “泛型”，顾名思义，“泛指的类型”。

我们提供了泛指的概念，但具体执行的时候却可以有具体的规则来 约束，比如我们用的非常多的ArrayList就是个泛型类，ArrayList作为集合可以存放各种元素，如 Integer, String，自定义的各种类型等，但在`我们使用的时候通过具体的规则来约束`，如我们可以约束 集合中只存放Integer类型的元素，如
```java
List<Integer> iniData = new ArrayList<>()
```

**使用泛型的好处？**                   
以集合来举例，使用泛型的好处是我们不必因为添加元素类型的不同而定义不同类型的集合，如整型集 合类，浮点型集合类，字符串集合类，我们可以定义一个集合来存放整型、浮点型，字符串型数据，而 这并不是最重要的，因为我们只要把底层存储设置了Object即可，添加的数据全部都可向上转型为 Object。 更重要的是我们可以通过规则按照自己的想法控制存储的数据类型。


# 5、说说List,Set,Map三者的区别
**List(对付顺序的好帮手)**： List接口存储一组不唯一（可以有多个元素引用相同的对象），有序的 对象 

**Set(注重独一无二的性质)**:不允许重复的集合。不会有多个元素引用相同的对象。 

**Map(用Key来搜索的专)**: 使用键值对存储。Map会维护与Key有关联的值。两个Key可以引用相 同的对象，但Key不能重复，典型的Key是String类型，但也可以是任何对象。


# 6、Array与ArrayList有什么不一样？
Array 与 ArrayList 都是`用来存储数据的集合`。ArrayList`底层是使用数组实现的`，但是arrayList`对数组进行了封装和功能扩展`，拥有许多原生数组没有的一些功能。`我们可以理解成ArrayList是Array的一个升级版`。


# 7、Map有什么特点
以键值对存储数据 元素存储循序是无序的 不允许出现重复键


# 8、集合类存放于 Java.util 包中， 主要有几 种接口
主要包含set(集）、 list(列表包含 Queue）和 map(映射)。

1. Collection： Collection 是集合 List、 Set、 Queue 的最基本的接口。

2. Iterator：迭代器，可以通过迭代器遍历集合中的数据

3. Map：是映射表的基础接口

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/collectionone.png)


# 9、什么是list接口 
Java 的 List 是非常常用的数据类型。 List 是有序的 Collection。 Java List 一共三个实现类： 分别是 ArrayList、 Vector 和 LinkedList 。

list接口结构图

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/mylistone.png)

# 10、说说ArrayList（数组）
ArrayList 是最常用的 List 实现类，`内部`是通过`数组实现`的，它`允许对元素进行快速随机访问`。数组的 `缺点是每个元素之间不能有间隔`， 当数组大小不满足时需要增加存储能力，就要将已经有数 组的数据 复制到新的存储空间中。 当从 ArrayList 的中间位置插入或者删除元素时，需要对数组进 行复制、移 动、代价比较高。因此，它适合随机查找和遍历，不适合插入和删除。


# 11、Vector（ 数组实现、 线程同步）
Vector 与 ArrayList 一样，`也是通过数组实现的`，不同的是`它支持线程的同步`，`即某一时刻只有一 个线 程能够写 Vector`，避免多线程同时写而引起的不一致性，`但实现同步需要很高的花费`，因此， 访问它 比访问 ArrayList 慢 。


# 12、说说LinkList（链表）
LinkedList 是用`链表结构存储数据`的，`很适合数据的动态插入和删除`，`随机访问和遍历速度比较慢`。另 外，他还提供了 List 接口中没有定义的方法，专门用于操作`表头`和`表尾元素`，可以当作`堆 栈`、`队列`和 `双向队列`使用

# 13、什么Set集合
Set 注重独一无二的性质,该体系集合用于存储无序(存入和取出的顺序不一定相同)元素， `值不能重复`。 对象的相等性本质是对象 hashCode 值（java 是依据对象的内存地址计算出的此序号） 判断的， 如果 想要让两个不同的对象视为相等的，就必须覆盖 Object 的 hashCode 方法和 equals 方 法。

set结构结构图

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/mysetone.png)


![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/mysettwo.png)

# 14、HashSet（ Hash 表）
哈希表边存放的是`哈希值`。 HashSet 存储元素的顺序并不是按照存入时的顺序（和 List 显然不同） 而 是按照哈希值来存的所以取数据也是按照哈希值取得。元素的哈希值是通过元素的 hashcode 方法来获 取的, HashSet 首先判断两个元素的哈希值，如果哈希值一样，接着会比较 equals 方法 如果 equls 结 果为 true ， HashSet 就视为同一个元素。如果 equals 为 false 就不是 同一个元素。 哈希值相同 equals 为 false 的元素是怎么存储呢,就是在同样的哈希值下顺延（可以认为哈希值相 同的元素放在一 个哈希桶中）。也就是哈希一样的存一列。 
如图 1 表示 hashCode 值不相同的情 况； 

图 2 表示 hashCode 值相同，但 equals 不相同的情况。

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210630165151.png)




