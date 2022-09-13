---
title: 【操作】Win11 Docker镜像存储路径更改（非C盘路径）
date: 2022-09-13 08:39:48
tags: 操作
categories: [操作]
---

# 背景
基于WSL2安装docker后，在使用过程中会发现大量的docker镜像文件，使系统C盘容量激增，对电脑后续使用造成不便，所以需要在安装的时候，手动修改docker的镜像地址，使得镜像文件保存到另外的非系统盘中。


最新的windows提供了新的虚拟化技术（WSL/WSL2），所以设置页面不能镜像的存储位置进行修改了。

# 修改方案

退出Docker Desktop

## 查看WSL应用
```bash
wsl --list -v
```

确保所有wsl应用都停止（stopped）

## 导出docker镜像文件
创建文件夹
```bash
D:\Software\Docker
```

```bash
wsl --export docker-desktop-data "D:\Software\Docker\docker-desktop-data.tar"
wsl --export docker-desktop "D:\Software\Docker\docker-desktop.tar"
```

## 注销docker-desktop-data、docker-desktop
```bash
wsl --unregister docker-desktop-data
wsl --unregister docker-desktop
```

## 指定文件夹重新导入
```bash
wsl --import docker-desktop-data D:\Software\Docker\data "D:\Software\Docker\docker-desktop-data.tar" --version 2

wsl --import docker-desktop D:\Software\Docker\desktop "D:\Software\Docker\docker-desktop.tar" --version 2
```

`重启Docker`

## 参考文档
- [WSL/WSL2官网介绍](https://docs.microsoft.com/zh-cn/windows/wsl/)

- [Docker的WSL介绍](https://docs.docker.com/desktop/windows/wsl/)