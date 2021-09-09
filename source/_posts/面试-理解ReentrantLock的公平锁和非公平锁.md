---
title: 理解ReentrantLock的公平锁和非公平锁
date: 2021-09-07 09:17:04
tags: [面试]
categories: [面试]
keywords: [面试]
description: 一面
copyright: false
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202109070922104.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202109070922104.png
---
学习AQS的时候，了解到AQS依赖于内部的FIFO同步队列来完成同步状态的管理，当前线程获取同步状态失败时，同步器会将当前线程以及等待状态等信息构造成一个Node对象并将其加入到同步队列，同时会阻塞当前线程，当同步状态释放时，会把首节点中的线程唤醒，使其再次尝试获取同步状态。

这时，我有了一个疑问，AQS的同步队列是FIFO的，就是先来排队的先走。那怎么实现非公平锁呢？查阅了一些资料，总算知道了。

首先从公平锁开始看起。

# ReentrantLock 的公平锁
ReentrantLock 默认采用非公平锁，除非在构造方法中传入参数 true 。

```java
    //默认
    public ReentrantLock() {
        sync = new NonfairSync();
    }
    //传入true or false
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
```

# 公平锁的 lock 方法：
```java
    static final class FairSync extends Sync {
        final void lock() {
            acquire(1);
        }
        // AbstractQueuedSynchronizer.acquire(int arg)
        public final void acquire(int arg) {
            if (!tryAcquire(arg) &&
                acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
                selfInterrupt();
        }
        protected final boolean tryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                // 1. 和非公平锁相比，这里多了一个判断：是否有线程在等待
                if (!hasQueuedPredecessors() &&
                    compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
    }
```

我们可以看到，在注释1的位置，有个`!hasQueuedPredecessors()`条件，意思是说当前同步队列没有前驱节点（也就是没有线程在等待）时才会去`compareAndSetState(0, acquires)`使用CAS修改同步状态变量。所以就实现了公平锁，根据线程发出请求的顺序获取锁。


# 非公平锁的lock方法
```java
    static final class NonfairSync extends Sync {
        final void lock() {
            // 2. 和公平锁相比，这里会直接先进行一次CAS，成功就返回了
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                acquire(1);
        }
        // AbstractQueuedSynchronizer.acquire(int arg)
        public final void acquire(int arg) {
            if (!tryAcquire(arg) &&
                acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
                selfInterrupt();
        }
        protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires);
        }
    }
    /**
    * Performs non-fair tryLock.  tryAcquire is implemented in
    * subclasses, but both need nonfair try for trylock method.
    */
    final boolean nonfairTryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            //3.这里也是直接CAS，没有判断前面是否还有节点。
            if (compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0) // overflow
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
```
非公平锁的实现在刚进入lock方法时会直接使用一次CAS去尝试获取锁，不成功才会到acquire方法中，如注释2。而在nonfairTryAcquire方法中并没有判断是否有前驱节点在等待，直接CAS尝试获取锁，如注释3。由此实现了非公平锁。


# 总结
**非公平锁和公平锁的两处不同**：
- 非公平锁在调用 lock 后，首先就会调用 CAS 进行一次抢锁，如果这个时候恰巧锁没有被占用，那么直接就获取到锁返回了。

- 非公平锁在 CAS 失败后，和公平锁一样都会进入到 tryAcquire 方法，在 tryAcquire 方法中，如果发现锁这个时候被释放了（state == 0），非公平锁会直接 CAS 抢锁，但是公平锁会判断等待队列是否有线程处于等待状态，如果有则不去抢锁，乖乖排到后面。


公平锁和非公平锁就这两点区别，如果这两次 CAS 都不成功，那么后面非公平锁和公平锁是一样的，都要进入到阻塞队列等待唤醒。

相对来说，非公平锁会有更好的性能，因为它的吞吐量比较大。当然，非公平锁让获取锁的时间变得更加不确定，可能会导致在阻塞队列中的线程长期处于饥饿状态。


原文链接:https://www.jianshu.com/p/2ada27eee90b







