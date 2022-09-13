---
title: 【操作】Win11家庭版安装Docker步骤
date: 2022-09-12 23:14:26
tags: 操作
categories: [操作]
---

# 一、安装 Hyper-V
>目前有很多Win11系统的用户使用的是windows11家庭中文版，程序添加这就没有hyper-v，只有专业版才有。以下为你提供详细的教程，只要按照以下方法操作，就可以开启Hyper-V功能了！

Windows11家庭中文版找不到hyper解决方法：
1、将如下代码添加到记事本中，并另存为Hyper-V.cmd文件。代码如下：
```bash
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
for /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
del hyper-v.txt
Dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL
```

2、右键点击【Hyper-V.cmd】文件图标，在右键菜单中点击：以管理员身份运行；

3、然后弹出一个 用户帐户控制 - Windows命令处理程序 对话框，我们点击：是。

4、然后系统自动进行Windows命令处理，我们等待处理完成以后，在最末处输入：Y，电脑自动重启，进行配置更新。

5、重启后可以在“打开或关闭windows功能”里看到已经Hyper-V已经安装并打上勾了，重启即可使用。

`注意重启完避免重启不彻底，建议手动再次重启下`

# 二、初始化环境
已管理员身份打开Powershell,分别执行下面的命令
```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

# 三、更新wsl2
下载安装 wsl2
```bash
https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
```
已管理员身份打开Powershell, 执行命令(此处有坑，手动重启解决)
```bash
wsl --set-default-version 2
```

# 四、安装Docker
在[官网](https://www.docker.com/get-started/)下载，下一步执行即可
修改Docker Engine配置，增加镜像仓库地址

设置>docker Engine

```bash
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "debug": false,
  "experimental": false,
  "features": {
    "buildkit": true
  },
  "insecure-registries": [],
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```




