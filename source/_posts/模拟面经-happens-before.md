---
title: happens-before
date: 2021-08-26 18:30:30
tags: [面试]
categories: [面试]
keywords: [面试]
description: 一面
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108261831887.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108261831887.png
---
# happens-before指的是什么？
happens-before主要是为保证`Java多线程操作时`的`有序性`和`可见性`，防止了`编译器重排序`对程序结果的影响。 因为当一个变量出现`一写多读`，`多读多写`的情况时，就是多个线程读这个变量，然后至少一个线程写这个变量，因为编译器在编译时会对指令进行重排序，如果没有happens-before原则对重排序进行一些约束，就有可能造成程序执行不正确的情况。

具体有`8`条规则：       

1. 程序次序性规则：一个线程内，按照代码顺序，书写在前面的操作先行发生于书写在后面的操作。一段代码在单线程中执行的结果是有序的。(只在单线程有效，一写多读时，写的变量如果是没有使用volatile修饰时，是没法保证其他线程读到的变量是最新的值)

2. 锁定规则：一个锁的解锁操作总是要在加锁操作之前。

3. volatile规则：如果一个写操作去写一个volatile变量，一个读操作去读volatile变量，那么写操作一定是在读操作之前。

4. 传递规则：操作A happens before 操作B， B happens before C，那么A一定是happens before C的。

5. 线程启动规则：线程A执行过程中修一些共享变量，然后再调用threadB.start()方法来启动线程B，那么A对那些变量的修改对线程B一定是可见的。

6. 线程终结规则：线程A执行过程中调用了threadB.join()方法来等待线程B执行完毕，那么线程B在执行过程中对共享变量的修改，在join()方法返回后，对线程A可见。

7. 线程中断规则：对线程interrupt()方法的调用先行发生于被中断线程的代码检测到中断事件的发生。

8. 对象终结规则：一个对象的初始化完成先行发生于他的finalize()方法的开始；