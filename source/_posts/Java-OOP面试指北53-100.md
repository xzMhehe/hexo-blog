---
title: Java-OOP面试打卡第二天
date: 2021-06-28 10:01:04
tags:
  - Java
  - 面经
categories:
  - Java
keywords:
  - Java
description: Java
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210628133138.png

thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210628133138.png
---

# 53、Hashcode的作用
java的`集合`有`两类`，一类是`List`，还有一类是`Set`。`前者有序可重复`，`后者无序不重复`。当我们在set中 插入的时候怎么判断是否已经存在该元素呢，可以通过equals方法。但是如果元素太多，用这样的方法 就会比较慢。

于是有人发明了`哈希算法`来提高集合中查找元素的效率。 这种方式将集合分成若干个存储区域，每个对 象可以计算出一个哈希码，可以将哈希码分组，每组分别对应某个存储区域，根据一个对象的哈希码就 可以确定该对象应该存储的那个区域。

`hashCode`方法可以这样理解：它返回的就是根据对象的内存地址换算出的一个值。这样一来，`当集合要添加新的元素时，先调用这个元素的hashCode方法`，就一下子能定位到它应该放置的物理位置上。 如果这个位置上没有元素，它就可以直接存储在这个位置上，不用再进行任何比较了；如果这个位置上 已经有元素了，就调用它的equals方法与新元素进行比较，相同的话就不存了，不相同就散列其它的地 址。这样一来实际调用equals方法的次数就大大降低了，几乎只需要一两次。

# 54、 Java的四种引用，强弱软虚
**强引用**            
强引用是平常中使用最多的引用，强引用在程序内存不足（OOM）的时候也不会被回收，使用方式：          
`String str = new String("str");`

**软引用**           
软引用在程序内存不足时，会被回收，使用方式：    
```java      
// 注意：wrf这个引用也是强引用，它是指向SoftReference这个对象的，               
// 这里的软引用指的是指向new String("str")的引用，也就是SoftReference类中T        
SoftReference<String> wrf = new SoftReference<String>(new String("str"));
```


可用场景： 创建缓存的时候，创建的对象放进缓存中，当内存不足时，JVM就会回收早先创建的对象。

**弱引用**

弱引用就是只要JVM垃圾回收器发现了它，就会将之回收，使用方式： 

`WeakReference<String>wrf=newWeakReference<String>(str);`

**可用场景**：Java源码中的java.util.WeakHashMap中的key就是使用弱引用，我的理解就是，

一旦我不需要某个引用，JVM会自动帮我处理它，这样我就不需要做其它操作。

**虚引用**

虚引用的回收机制跟弱引用差不多，但是它被回收之前，会被放入ReferenceQueue中。注意哦，其它 引用是被JVM回收后才被传入ReferenceQueue中的。由于这个机制，所以虚引用大多被用于引用销毁 前的处理工作。还有就是，虚引用创建的时候，必须带有ReferenceQueue，使用

例子：
```java
PhantomReference<String>prf=newPhantomReference<String>(new

String("str"),newReferenceQueue<>());

```

可用场景： 对象销毁前的一些操作，比如说资源释放等。**Object.finalize()** 虽然也可以做这类动作， 但是这个方式即不安全又低效上诉所说的几类引用，都是指对象本身的引用，而不是指 Reference 的四个子类的引用 ( SoftReference 等)。


# 55、Java创建对象有几种方式？
java中提供了以下四种创建对象的方式:

1. new创建新对象

2. 通过反射机制

3. 采用clone机制

4. 通过序列化机制

# 56、有没有可能两个不相等的对象有相同的hashcode
`有可能`. 在产生hash冲突时,两个不相等的对象就会有相同的 hashcode 值. 当hash冲突产生时,一般有以下几种方式来处理:         
1. 拉链法: 每个哈希表节点都有一个next指针,多个哈希表节点可以用next指针构成一个单向链表，被 分配到同一个索引上的多个节点可以用这个单向链表进行存储.

2. 开放定址法: 一旦发生了冲突,就去寻找下一个空的散列地址,只要散列表足够大,空的散列地址总能找 到,并将记录存入

3. 再哈希: 又叫双哈希法,有多个不同的Hash函数.当发生冲突时,使用第二个,第三个….等哈希函数计算 地址,直到无冲突


# 57、拷贝和浅拷贝的区别是什么?
**浅拷贝**:       
被复制对象的所有变量都含有与原来的对象相同的值, 而所有的对其他对象的引用仍然指向原来的对象. 换言之, `浅拷贝仅仅复制所考虑的对象`,`而不复制它所引用的对象`.

**深拷贝**:       
被复制对象的所有变量都含有与原来的对象相同的值.而那些引用其他对象的变量将指向被复制过的新对象. 而不再是原有的那些被引用的对象.换言之. `深拷贝把要复制的对象所引用的对象都复制了一遍`.

# 58、static都有哪些用法?
所有的人都知道static关键字这两个基本的用法:   `静态变量`和`静态方法`. 也就是被static所修饰的 `变量/方法` 都属于`类的静态资源`,`类实例所共享`.

除了静态变量和静态方法之外,static也用于静态块, `多用于初始化操作`：

```java
public calss PreCache{ 
  static{ //执行相关操作 }
}
```

此外static也多用于修饰内部类, 此时称之为静态内部类.

最后一种用法就是静态导包,即 import static , import static是在JDK 1.5之后引入的新特性,可以用来指 定导入某个类中的静态资源,并且不需要使用类名,可以直接使用资源名,比如:

```java
import static java.lang.Math.*; 

public class Test{
  public static void main(String[] args){ 
    //System.out.println(Math.sin(20));传统做法 
    System.out.println(sin(20));
  }

}
```

# 59、a=a+b与a+=b有什么区别吗?
+= 操作符会进行隐式自动类型转换, 此处 a+=b 隐式的将加操作的结果类型强制转换为持有结果的类型,

而 a=a+b 则不会自动进行类型转换.如：


# 60、ﬁnal、ﬁnalize()、ﬁnally
**性质不同**         
1. ﬁnal为关键字；

2. ﬁnalize()为方法；

3. ﬁnally为区块标志，用于try语句中；

**作用**         
1. ﬁnal为用于标识常量的关键字，ﬁnal标识的关键字存储在常量池中（在这里ﬁnal常量的具体用法 将在下面进行介绍）；

2. ﬁnalize()方法在Object中进行了定义，用于在对象“消失”时，由JVM进行调用用于对对象进行垃圾 回收，类似于C++中的析构函数；用户自定义时，用于释放对象占用的资源（比如进行I/0操作）；

3. ﬁnally{}用于标识代码块，与try{}进行配合，不论try中的代码执行完或没有执行完（这里指有异 常），该代码块之中的程序必定会进行；

# 61、JDBC操作的步骤

加载数据库驱动类 打开数据库连接 执行sql语句 处理返回结果 关闭资源

```java
package cn.com.codingce.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * 数据库常用的增删改查
 * 微信公众号搜索 后端码匠 与你共同成长
 *
 * @author williamma
 */
public class Dbutil {

    private static final String URL = "jdbc:mysql://localhost:3306/mxz?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai";
    private static final String USENAME = "root";
    private static final String PASSWORD = "1234567890";
    public static Connection connection = null;
    public static PreparedStatement pstmt = null;
    public static ResultSet rs = null;

    /**
     * 获取数量
     *
     * @param sql sql
     * @param sql
     * @return
     */
    public static int getTotalCount(String sql) {
        int count = -1;
        try {
            pstmt = createPreparedStatement(sql, null);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            closeAll(rs, pstmt, connection);
        }
        return count;
    }

    /**
     * 通用的增删改
     *
     * @param sql
     * @param params
     * @return
     */
    public static boolean executeUpdate(String sql, Object[] params) {
        try {
            // 执行操作
            pstmt = createPreparedStatement(sql, params);
            int count = pstmt.executeUpdate();
            if (count > 0)
                return true;
            else
                return false;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            closeAll(null, pstmt, connection);
        }
    }

    /**
     * 通用查 返回的是一个集合
     *
     * @param sql
     * @param params
     * @return
     */
    public static ResultSet executeQuery(String sql, Object[] params) {
        try {
            pstmt = createPreparedStatement(sql, params);
            rs = pstmt.executeQuery();
            System.out.println(sql);
            return rs;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        /*
         * 你要用rs不能关
         */
    }

    /**
     * 连接
     *
     * @return
     * @throws ClassNotFoundException
     * @throws SQLException
     */
    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver");

        return DriverManager.getConnection(URL, USENAME, PASSWORD);

    }

    public static PreparedStatement createPreparedStatement(String sql, Object[] params) throws ClassNotFoundException, SQLException {
        pstmt = getConnection().prepareStatement(sql);
        if (params != null) {
            for (int i = 0; i < params.length; i++) {
                pstmt.setObject(i + 1, params[i]);
            }
        }
        return pstmt;
    }

    /**
     * 关闭
     *
     * @param rs
     * @param stmt
     * @param connection
     */
    public static void closeAll(ResultSet rs, Statement stmt, Connection connection) {
        try {
            if (rs != null)
                rs.close();
            if (pstmt != null)
                pstmt.close();
            if (connection != null)
                connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
```

# 62、在使用jdbc的时候，如何防止出现sql注入的问题。 
使用`PreparedStatement`类，而不是使用`Statement`类


# 63、怎么在JDBC内调用一个存储过程
使用`CallableStatement`

# 64、是否了解连接池，使用连接池有什么好处？
`数据库连接是非常消耗资源的`，影响到程序的性能指标。`连接池`是用来`分配`、`管理`、`释放数据库连接` 的，可以使应用程序重复使用同一个数据库连接，`而不是每次都创建一个新的数据库连接`。`通过释放空闲时间较长的数据库连接避免数据库因为创建太多的连接而造成的连接遗漏问题`，`提高了程序性能`。

# 65、你所了解的数据源技术有那些？使用数据源有什么好处？
`Dbcp`,`c3p0`等，用的最多还是c3p0，因为c3p0比dbcp更加稳定，安全；通过配置文件的形式来维护数 据库信息，而不是通过硬编码。当连接的数据库信息发生改变时，不需要再更改程序代码就实现了数据 库信息的更新。


# 66、&和&&的区别
&是`位运算符`。&&是`布尔逻辑运算符`，在进行逻辑判断时用&处理的前面为false后面的内容仍需处理， 用&&处理的前面为false不再处理后面的内容。

# 67、静态内部类如何定义
```java
public class Out {

  private static int a; private int b; 
    public static class Inner {
      public void print() {
        System.out.println(a);
      }
    }
  }
}
```

1. 静态内部类可以访问外部类所有的静态变量和方法，即使是 private 的也一样。 

2. 静态内部类和一般类一致，可以定义静态变量、方法，构造方法等。

3. 其它类使用静态内部类需要使用“外部类.静态内部类”方式，如下所示：Out.Inner inner = new Out.Inner();inner.print();

4. Java集合类HashMap内部就有一个静态内部类Entry。Entry是HashMap存放元素的抽象， HashMap 内部维护 Entry 数组用了存放元素，但是 Entry 对使用者是透明的。像这种和外部类关 系密切的，且不依赖外部类实例的，都可以使用静态内部类。


# 68、什么是成员内部类
定义在类内部的非静态类，就是成员内部类。成员内部类不能定义静态方法和变量（final修饰的除 外）。这是因为成员内部类是非静态的，类初始化的时候先初始化静态成员，如果允许成员内部类定义 静态变量，那么成员内部类的静态变量初始化顺序是有歧义的。实例：
```java
public class Out {

  private static int a;

    private int b;

    public class Inner {

      public void print() {
        System.out.println(a);
        System.out.println(b);
      }

  }

}
```

# 69、Static Nested Class 和 Inner Class的不同
Nested Class （一般是C++的说法），Inner Class (一般是JAVA的说法)。Java内部类与C++嵌套类最大 的不同就在于是否有指向外部的引用上。注： 静态内部类（Inner Class）意味着1创建一个static内部 类的对象，不需要一个外部类对象，2不能从一个static内部类的一个对象访问一个外部类对象


# 70、什么时候用assert
`assertion(断言)`在软件开发中是一种常用的调试方式，很多开发语言中都支持这种机制。在实现中， assertion就是在程序中的一条语句，它对一个boolean表达式进行检查，一个正确程序必须保证这个 boolean表达式的值为true；如果该值为false，说明程序已经处于不正确的状态下，系统将给出警告或 退出。一般来说，assertion用于保证程序最基本、关键的正确性。assertion检查通常在开发和测试时 开启。为了提高性能，在软件发布后，assertion检查通常是关闭的


# 71、Java有没有goto 
java中的保留字，现在没有在java中使用

# 72、数组有没有length()这个方法? String有没有length()这个方法

数组没有length()这个方法，有`length`的`属性`。String有length()这个方法

# 73、用最有效率的方法算出2乘以8等几
2 << 3

# 74、ﬂoat型ﬂoat f=3.4是否正确?

不正确。精度不准确,应该用强制类型转换，如下所示：ﬂoat f=(ﬂoat)3.4

# 75、排序都有哪几种方法？请列举
排序的方法有：

插入排序（直接插入排序、希尔排序），

交换排序（冒泡排序、快速排序），

选择排序 （直接选择排序、堆排序），

归并排序，

分配排序（箱排序、基数排序）


# 76、静态变量和实例变量的区别？
static i = 10; //常量 class A a; a.i =10;//可变


# 77、说出一些常用的类，包，接口，请各举5个
常用的类：BufferedReader BufferedWriter FileReader FileWirter String Integer

常用的包：java.lang java.awt java.io java.util java.sql

常用的接口：Remote List Map Document NodeList


# 78、a.hashCode() 有什么用？与 a.equals(b) 有什么关系？
hashCode() 方法是相应对象整型的 hash 值。它常用于基于 hash 的集合类，如 Hashtable、 HashMap、LinkedHashMap 等等。它与 equals() 方法关系特别紧密。根据 Java 规范，两个使用 equal() 方法来判断相等的对象，必须具有相同的 hash code。


# 79、Java 中的编译期常量是什么？使用它又什么风险？ 
公共静态不可变（public static final ）变量也就是我们所说的编译期常量，这里的 public 可选的。实 际上这些变量在编译时会被替换掉，因为编译器知道这些变量的值，并且知道这些变量在运行时不能改 变。这种方式存在的一个问题是你使用了一个内部的或第三方库中的公有编译时常量，但是这个值后面 被其他人改变了，但是你的客户端仍然在使用老的值，甚至你已经部署了一个新的 jar。为了避免这种情况，当你在更新依赖 JAR 文件时，确保重新编译你的程序

# 80、在 Java 中，如何跳出当前的多重嵌套循环？
在最外层循环前加一个标记如 A，然后用 break A;可以跳出多重循环。（Java 中支持带标签的 break 和 continue 语句，作用有点类似于 C 和 C++中的 goto 语句，但是就像要避免使用 goto 一样，应该避免 使用带标签的 break 和 continue，因为它不会让你的程序变得更优雅，很多时候甚至有相反的作用， 所以这种语法其实不知道更好）

# 81、构造器（constructor）是否可被重写（override）？
构造器不能被继承，因此不能被重写，但可以被重载。

# 82、两个对象值相同(x.equals(y) == true)，但却可有不同的hash code，这句话对不对？
不对，如果两个对象 x 和 y 满足 x.equals(y) == true，它们的哈希码（hash code）应当相同。Java 对 于 eqauls 方法和 hashCode 方法是这样规定的：

(1)如果两个 对象相同（equals 方法返回 true），那么它们的 hashCode 值一定要相同；

(2)如果两个对象的 hashCode 相同，它们并不一定相同。当然，你未必要按照要求去做，但是如果你 违背了上述原则就会发现在使用容器时，相同的对象可以出现在 Set 集合中，同时增加新元素的效率会 大大下降（对于使用哈希存储的系统，如果哈希码频繁的冲突将会造成存取性能急剧下降）。

# 83、是否可以继承 String 类？
String 类是 final 类，不可以被继承，继承 String 本身就是一个错误的行为，对 String 类型最好的重用 方式是关 联关系（Has-A）和依赖关系（Use-A）而不是继承关系（Is-A）。

# 84、当一个对象被当作参数传递到一个方法后，此方法可改变这个对象的属性，并可返回变化后的结果，那么这里到底是值传递还是引用传递？
是值传递。Java 语言的方法调用只支持参数的值传递。当一个对象实例作为一个参数被传递到方法中 时，参数的值就是对该对象的引用。对象的属性可以在被调用过程中被改变，但对对象引用的改变是不 会影响到调用者的。C++和 C#中可以通过传引用或传输出参数来改变传入的参数的值。在 C#中可以编 写如下所示的代码，但是在 Java 中却做不到。


# 85、String 和 StringBuilder、StringBuffer 的区别？
Java 平台提供了两种类型的字符串：`String` 和 `StringBuffer/StringBuilder`，它们可以储存和操作字符串。其中 String 是`只读字符串`，也就意味着 String 引用的字符串内容是不能被改变的。而 StringBuﬀer/StringBuilder 类表示的字符串对象可以直接进行修改。StringBuilder 是 `Java 5` 中引入 的，它和 StringBuﬀer 的方法完全相同，区别在于它是在单线程环境下使用的，因为它的所有方面都没 有被synchronized 修饰，因此它的效率也比 StringBuﬀer 要高。

# 86、重载（Overload）和重写（Override）的区别。重载的方法能否根据返回类型进行区分？
方法的`重载`和`重写`都是`实现多态的方式`，区别在于`前者实现的是编译时的多态性`，而`后者实现的是运行时的多态性`。重载发生在一个类中，同名的方法如果有不同的参数列表（参数类型不同、参数个数不同 或者二者都不同）则视为重载；重写发生在子类与父类之间，重写要求子类被重写方法与父类被重写方 法有相同的返回类型，比父类被重写方法更好访问，不能比父类被重写方法声明更多的异常（里氏代换原则）。

重载对返回类型没有特殊的要求。

# 87、char 型变量中能不能存贮一个中文汉字，为什么？
char 类型可以存储一个中文汉字，因为 `Java 中使用的编码是 Unicode`（不选择任何特定的编码，直接使用字符在字符集中的编号，这是统一的唯一方法），一个 char 类型占 `2 个字节`（`16 比特`），所以放一个中文是没问题的。

补充：使用 Unicode 意味着字符在 JVM 内部和外部有不同的表现形式，在 JVM内部都是 Unicode，当这个字符被从 JVM 内部转移到外部时（例如存入文件系统中），需要进行编码转换。所以 Java 中有字 节流和字符流，以及在字符流和字节流之间进行转换的转换流，如 `InputStreamReader` 和 `OutputStreamReader`，这两个类是字节流和字符流之间的适配器类，承担了编码转换的任务；对于 C 程序员来说，要完成这样的编码转换恐怕要依赖于 union（联合体/共用体）共享内存的特征来实现 了。

# 88、Java 中会存在内存泄漏吗，请简单描述。
理论 上 Java 因为有垃圾回收机制（ GC）不会存在内存泄露问题（ 这也 是 Java 被广泛使用于服务器端编 程的 一个 重要 原因 ）； 然而在实际开发中 ，可能会存在无用但可达的对象，这些对象不能被 GC 回收 ，因此也会导致内存泄露的发生 。

例如 Hibernate 的 Session（ 一级 缓存 ）中的 对象 属于 持久态，垃圾 回收 器是 不会回收这些 对象 的，然而 这些 对象 中可 能存在无用的垃圾对象 ，如果不及时关闭（close）或清空 (flush) 一级缓存就可能导致内存泄露下面例子中的代码也会导致内存泄露


# 89、抽象的（abstract）方法是否可同时是静态的（static）,是否 可同时是本地方法（native），是否可同时被 synchronized修饰？
都不能。 抽象方法需要子类重写，而静态的方法是无法被重写的，因此二者是矛盾的。本地方法是由本地代码（如 C 代码）实现的方法，而抽象方法是没有实现的，也是矛盾的。synchronized 和方法的实 现细节有关，抽象方法不涉及实现细节，因此也是相互矛盾的。


# 90、是否可以从一个静态（static）方法内部发出对非静态（nonstatic）方法的调用？
不可以，静态方法只能访问静态成员，因为非静态方法的调用要先创建对象，在调用静态方法时可能对 象并没有被初始化。

# 91、如何实现对象克隆？
有两种方式：          
1). 实现 Cloneable 接口并重写 Object 类中的 clone()方法；           

2). 实现 Serializable 接口， 通过对象的序列化和反序列化实现克隆，可以实现真 正的深度克隆。



# 92、接口是否可继承（extends）接口？抽象类是否可实现 （implements）接口？抽象类是否可继承具体类 （concreteclass）？
接口可以继承接口 ，而且支持多重继承。抽象类可以实现 (implements)接口 ， 抽象类可继承具体类也可以继承抽象类。


# 93、一个”.java”源文件中是否可以包含多个类（不是内部类）？有 什么限制？
可以，但一个源文件中最多只能有一个公开类（public class）而且文件名必须和公开类的类名完全保 持一致。

# 94、Anonymous Inner Class(匿名内部类)是否可以继承其它类？ 是否可以实现接口？

可以继承其他类或实现其他接口，在 Swing 编程和 Android 开发中常用此方式来实现事件监听和回 调。

# 95、内部类可以引用它的包含类（外部类）的成员吗？有没有什么 限制？

一个内部类对象可以访问创建它的外部类对象的成员，包括私有成员。

# 96、Java 中的 ﬁnal 关键字有哪些用法？

(1)修饰类：表示该类不能被继承；

(2)修饰方法：表示方法不能被重写；

(3)修饰变量：表示变量只能一次赋值以后值不能被修改（常量）。