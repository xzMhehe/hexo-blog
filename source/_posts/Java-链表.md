---
title: Java-链表
date: 2021-01-15 09:48:35
tags:
- Java
- 面经
categories: 
- Java
---
## 链表
>链表是一种物理存储单元上非连续、非顺序的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的。链表由一系列结点（链表中每一个元素称为结点）组成，结点可以在运行时动态生成。每个结点包括两个部分：一个是存储数据元素的数据域，另一个是存储下一个结点地址的指针域。 

上面是链表的定义，那么我们用通俗点的语言来说就是，`一些节点，除了最后一个节点以外的每一个节点都存储着下一个节点的地址，依据这种方法依次连接， 构成一个链式结构`。

在Java中我们需要自己定义一个链表的类来生成对象，这个类需要由一个存储数据的数据域也需要有存储下一个节点地址的域，因此，我们至少定义两个属性
```java
/**
 * @author mxz
 */
public class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        this.val = x;
    }

    @Override
    public String toString() {
        return "ListNode{" +
                "val=" + val +
                ", next=" + next +
                '}';
    }
}

```

因为每个节点都相当于一个ListNode类生成的对象，因此，next属性需要定义为ListNode。

接下来，我们玩一玩链表, 顺便把力扣 `两数相加做了`

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 *
 * 请你将两个数相加，并以相同形式返回一个表示和的链表。
 *
 * 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/add-two-numbers
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 *
 * @author mxz
 */
public class ListNodeTest {
    public static void main(String[] args) {

        ListNode head1 = new ListNode(2);
        head1.next = new ListNode(4);
        head1.next.next = new ListNode(3);

        ListNode head2 = new ListNode(5);
        head2.next = new ListNode(6);
        head2.next.next = new ListNode(4);

        System.out.println(addTwoNum(head1, head2));
        addTwoNum(head1, head2);

    }

    public static ListNode addTwoNum(ListNode l1, ListNode l2) {
        ListNode head = null, tail = null;
        int carry = 0;

        while (l1 != null || l2 != null) {
            int n1 = l1 != null ? l1.val : 0;
            int n2 = l2 != null ? l2.val : 0;
            int sum = n1 + n2 + carry;
            if (head == null) {
                head = tail = new ListNode(sum % 10);
            } else {
                tail.next = new ListNode(sum % 10);
                tail = tail.next;
            }
            carry = sum / 10;
            if(l1 != null) {
                l1 = l1.next;
            }

            if(l2 != null) {
                l2 = l2.next;
            }
        }

        if (carry > 0 ) {
            tail.next = new ListNode(carry);
        }
        return head;
    }
}
```

输出
```bash
ListNode{val=7, next=ListNode{val=0, next=ListNode{val=8, next=null}}}
```