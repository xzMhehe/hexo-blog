---
title: 【Android】 Support 和 AndroidX
date: 2022-10-11 08:47:56
tags: Android
categories: [Android]
---

## Android Support Library的由来
Android 3.0 (API 11) 为了更好地兼容平板，加入了Fragment，而想让低版本的系统也能用上，需要做一个 向下兼容，于是Android团队推出了Android Support Library。

老Android们熟知的下述库 (`v后面的数字代表 最低兼容API版本`，如4对应Android 1.6) 都属于Android Support Library：

com.android.support:support-v4 → Android 1.6，包含`Fragment`、`NotificationCompat`等`控件`，包含v7和v11的基础功能，早期用到；
com.android.support:appcompat-v7:xx.xx → Android 2.1，增加了很多Material Design的兼容类和素材，包含v4的全部内容，用得最多；
support-v13 → Android 3.2，为平板开发推出的版本兼容包，Android 3.x系统是平板专用系统，用得不多；

Android版本更新飞快，现在都Android 12了，国内APP基本都最少兼容Android 5.1 (API 21)，这种v4、v7的命名早已没太大的意义。

## AndroidX Library的出现
从Android 9.0 (API 28) 开始，appcompat-v7:28.0.0 作为 Support Library的 终结版本，未来的新特性和改进都会进入AndroidX Library。升级内容主要有两个方面：

- 包名 → Support Library 中的API包名都是 android.support.，而AndroidX Library中的API都变成androidx.，意味着后续android.*包下的API都是随系统发布的，而androidx.包下的API都是随着扩展库发布的，API基本不依赖于操作系统的具体版本；

- 命名规则 → AndroidX Library 中所有的库命名规则不再包含具体的操作系统API版本号，如下面的appcompat-v7变成了appcompat库；

```java
api 'com.android.support:appcompat-v7:28.0.0'
api 'androidx.appcompat:appcompat:1.0.0'
```

## 从Support过渡到AndroidX
**一键迁移**           
AS 3.2及以上版本提供了`一键迁移到AndroidX的功能`，依次点击`菜单栏`的 `Refactor` → `Migrate to AndroidX`

注：`一键迁移，compileSdkVersion需大于等于28`，`否则会提示：You need to have at least have compileSdk 28 set in your module build.gradle to refactor to androidx`。

如果迁移失败，就重复下面的进行手动迁移吧~

- 1、版本要求
  - Android Studio → 升级到3.2及以上；

  - Gradle插件 → 升级到4.6及以上，可在gradle/wrapper/gradle-wrapper.propertie 中修改distributionUrl指向版本号；

  - compileSdkVersion → 升级到28及以上；

  - buildToolsVersion → 升级到28.0.2及以上；

- 2、迁移AndroidX配置
在项目的gradle.properties文件中添加下述配置：   
当前项目启用androidx
```java
android.useAndroidX=true
```

将依赖包也迁移到androidx，一般写true

如果设为false表不迁移依赖包到 androidx，如果有第三方依赖可能会出问题
```java
android.enableJetifier=true
```

- 3、修改依赖库
参照AndroidX变化中的依赖库映射改，可直接查 官方文档 或下载映射的 CSV文件，修改示例如下：

```java
implementation com.android.support:cardview-v7
// 替换成→ implementation androidx.cardview:cardview

implementation com.android.support:collections
// 替换成 → implementation androidx.collection:collection

implementation com.android.support:coordinatorlayout
// 替换成 → androidx.coordinatorlayout:coordinatorlayout
```


- 4、依赖类重新打包
参照AndroidX变化中的类映射改，可直接查 官方文档 或下载映射的 CSV文件，修改示例如下：

```java
import android.support.v7.app.AlertDialog
// 修改成 → import androidx.appcompat.app.AlertDialog

import android.support.v7.app.AppCompatActivity
// 修改成 → import androidx.appcompat.app.AppCompatActivity
```
Tips：还可能需要手动对混淆文件proguard-rules进行修改~

## 一些问题收集
**Support 和 AndroidX 能共存吗？**

答：不可以，只能选一种。


**执行完Migrate to AndroidX后就完成AndroidX迁移了？**

答：不一定，部分报名/路径名转换可能有问题，有些还需手动调整 (xml、java、kt)

**DataBinding中的错误（重名id错误）？**

答：androidx中对错误的检查和处理更严格，同一个xml布局文件中存在同名id会报错。

**attr.xml 中重复的属性名称会报错？**

答：自定义控件编写自定义属性，不能与android已有属性重名，如textSize必须使用android:textSize。


**Glide注解不兼容AndroidX**

答：Glide升级到4.8.0以后，具体可见 官方issues

**没有迁移到androidX，却出现Support库和AndroidX库冲突？**

答：大概率是依赖的第三方库用到了AndroidX，可执行 gradlew :app:dependencies 查看第三方的依赖树，直接搜androidx的包。看官方从是哪个版本开始引用androidx库的，回退到之前的版本即可。另外，建议引用依赖库时使用具体的版本，而尽量避免使用latest.release或+方式。


