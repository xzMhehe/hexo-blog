---
title: 探究io.WriteString
date: 2022-07-06 17:24:35
tags:
  - Go
categories:
  - Go
keywords:
  - Go
description: 探究io.WriteString
---
# 【Go】探究io.WriteString

在io包里有一个函数叫writeString，这个函数接收两个参数，第一个参数是实现io.Writer接口的具体对象，第二个参数是需要写入的字符串。

嗯，为什么会有这个函数的存在。

我们先看看函数io.Writer接口

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}
```

它有一个write方法，接收一个[]byte类型的参数，即为要写入的内容。但是很多时候我们都是操作的字符串，在使用write方法的时候，需要显示的使用类型转换，比如我想向屏幕里输出一句hello golang

```go
_, err := os.Stdout.Write([]byte("hello golang"))
if err != nil { fmt.Fprintln(os.Stderr, err) }
```

在golang中，进行显示的类型转换再传入Write，就意味着要开辟一块零时内存。如果调用write的次数多了，开辟内存的次数也多了，对于应用性能来说是很不理想的。因此，才会有一个WriteString方法。

先看一下io.WriteString

```go
func WriteString(w Writer, s string) (n int, err error) {
    if sw, ok := w.(stringWriter); ok {
        return sw.WriteString(s)
    }
    return w.Write([]byte(s))
}
```

为了操作更加安全，在WriteString函数中进行了类型断言，如果传入的Writer对象有WriteString方法的话，那么就调用它的WriteString方法，反之，调用Write方法，并显示的进行类型转换。