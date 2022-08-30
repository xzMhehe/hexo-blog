---
title: ijkplayer引入Android项目
date: 2022-07-05 21:58:42
tags:
  - Android
categories:
  - Android
keywords:
  - Android
description: ijkplayer引入Android项目
---

# 【ijkplayer】引入Android项目（基于k0.8.8）



# 编译准备

git（Mac自带）、yasm（brew install yasm）、Android sdk（Android studio 默认）、ndk（r14b）、并配置环境变量

## ndk 环境变量

```bash
export ANDROID_SDK=/Users/inke219223m/Library/Android/sdk/platform-tools
export ANDROID_NDK=/Volumes/Victory/dev/android-ndk-r14b

export PATH=$PATH:$ANDROID_SDK
export PATH=$PATH:$ANDROID_NDK
## mac环境需要配置下面亮项
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --disable-linux-perf"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --disable-bzlib"
```



## M1 芯片配置ndk-build

```bash
#!/bin/sh
# 原来的注释掉
#DIR="$(cd "$(dirname "$0")" && pwd)"
#$DIR/build/ndk-build "$@"

# M1 build
DIR="$(cd "$(dirname "$0")" && pwd)"
arch -x86_64 /bin/bash $DIR/build/ndk-build "$@"
```



# ijk 项目下载和拉取 ffmpeg 代码

```bash
# clone项目
git clone https://github.com/Bilibili/ijkplayer.git

# 进入ijkplayer-android目录
cd ijkplayer

# 切换到最新代码分支
git checkout -B latest k0.8.8

# 会检查下载ffmpeg代码 
./init-android.sh

#初始化openSSL（使ijk编译后支持https）
./init-android-openssl.sh
```



# 编译前选择你的配置

官方库说明中提供了三种配置支持，每个sh脚本里有对应的配置信息，包含支持编码格式、流媒体协议类型等，如下截取一些decoders，enable标识支持该格式，disable则标识不支持。

支持解码格式

```bash
./configure --list-decoders

export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --disable-decoders"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=aac"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=aac_latm"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=flv"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=h264"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=mp3*"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=vp6f"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=flac"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=hevc"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=vp8"
export COMMON_FF_CFG_FLAGS="$COMMON_FF_CFG_FLAGS --enable-decoder=vp9"
```



选择配置文件，ln -s 命令标识软连接，module.sh可以直接获取module-default.sh的配置

```bash
#If you prefer more codec/format
cd config
rm module.sh
ln -s module-default.sh module.sh

#If you prefer less codec/format for smaller binary size (include hevc function)
cd config
rm module.sh
ln -s module-lite-hevc.sh module.sh

#If you prefer less codec/format for smaller binary size (by default)
cd config
rm module.sh
ln -s module-lite.sh module.sh
```



# 编译

本次编译的是 Android 项目，所以先  cd  到  android/contrib 下 执行清除命令，然后编译对于的  so  库，all  标识编译所有架构的  so，想编译 armv7a 架构则将 all 替换成 armv7a

```bash
./compile-openssl.sh clean #清除
./compile-ffmpeg.sh clean  #清除
./compile-openssl.sh all   #编译
./compile-ffmpeg.sh all    #编译
```



<img src="https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/mo/20220705175114.png" width="600"/>



生成 ijkplayer 对应架构  so 文件（all 同上输入对应架构则生成对应架构动态链接库），动态链接库生成路径如下图所示（路径示例：ijkplayer-android/android/ijkplayer/ijkplayer-armv7a/src/main/libs/armeabi-v7a）

注意本步骤需要同意不受信任软件权限，[具体参考地址](https://support.apple.com/en-us/HT202491)

```bash
# 注意回到android 路径下
cd ..
# 执行脚步生成so 文件
./compile-ijk.sh all
```



到此 ijkplayer 编译完成，如果播放器之前逻辑已经写好，则直接替换项目中对应的动态链接库文件就行

<img src="https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/mo/20220705175436.png" width="600"/>




# 使用
待合并




# 问题记录
待记录




