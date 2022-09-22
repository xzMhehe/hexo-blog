---
title: 【Flutter】原生Android调用Flutter的dart方法
date: 2022-09-22 13:18:02
tags: 音视频
categories: [音视频]
---

## main.dart

```dart
import 'package:flutter/material.dart';
import 'dart:async';

import 'package:flutter/services.dart';
import 'package:mediaflutter/mediaflutter.dart';

import 'MyUse.dart';
import 'MainPage.dart';

void main() {
  runApp(const MyApp());
  // printDart();
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String _platformVersion = 'Unknown';

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    String platformVersion;
    // Platform messages may fail, so we use a try/catch PlatformException.
    // We also handle the message potentially returning null.
    try {
      platformVersion =
          await Mediaflutter.platformVersion ?? 'Unknown platform version';
    } on PlatformException {
      platformVersion = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    setState(() {
      _platformVersion = platformVersion;
    });
  }

  @override
  Widget build(BuildContext context) {
    printDart();
    return MaterialApp(
      theme: defaultTheme,
      home: MainPage(),
      // home: Scaffold(
      //   appBar: AppBar(
      //     title: const Text('Plugin example app'),
      //   ),
      //   body: Center(
      //     child: Text('Running on: $_platformVersion\n'),
      //   ),
      // ),
    );
  }
}

final ThemeData defaultTheme = ThemeData(primaryColor: Colors.deepPurple);
```


## MainPage.dart
```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'flutter_toast.dart';

class MainPage extends StatefulWidget {
  @override
  MainPageState createState() => MainPageState();
}

class MainPageState extends State<MainPage> {
  static const _platform = MethodChannel('toFlutterChannelName');

  @override
  void initState() {
    debugPrint('MainPage initState');
    _platform.setMethodCallHandler(flutterMethod);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter调用原生Android的方法',
      debugShowCheckedModeBanner: false,
      home: Scaffold(
          appBar: AppBar(
            title: const Text('融合音视频SDK'),
          ),
          body: Center(
              child: ElevatedButton(
            child: const Padding(
              padding:
                  EdgeInsets.only(left: 20, right: 20, top: 20, bottom: 20),
              child: Text('点击按钮调用原生Android的Java方法'),
            ),
            onPressed: () async {
              const androidMethonName = "flutterUseJava";
              const platform =  MethodChannel(androidMethonName);
              String returnValue = await platform.invokeMethod("后端码匠");
              debugPrint("platform.invokeMethod(\"后端码匠\") $androidMethonName 原生Android的java方法返回的值是：" + returnValue);
              FlutterToastWrapper.show("test");
            },
          ))),
    );
  }

  Future<dynamic> flutterMethod(MethodCall methodCall) async {
    switch (methodCall.method) {
      case 'flutterMethod':
        debugPrint('Android调用了flutterMethod方法！！！');
        debugPrint('Android传递给flutter的参数是：' + methodCall.arguments);
        break;
      default:
        debugPrint('Android调用了flutterMethod失败！！！\t\t' + methodCall.method);
    }
  }
}
```


## MainActivity.java

```java
package cn.com.codingce.mediaflutter_example;


import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.os.StrictMode;
import android.util.Log;

import androidx.annotation.NonNull;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
//import io.flutter.plugins.GeneratedPluginRegistrant;

public class MainActivity extends FlutterActivity {

    private static final String channel = "toJava";
    // 自行实现
    private static final String flutterUseJavaChannel = "flutterUseJava";

    MethodChannel methodChannel_toFlutter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (android.os.Build.VERSION.SDK_INT > 9) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
        }

        // 新版的Flutter SDK默认使用的是 import io.flutter.embedding.android.FlutterActivity; 包，
        // 则在MethodChannel方法中的第一个参数填写 getFlutterEngine().getDartExecutor().getBinaryMessenger()
        // 如果你使用的Flutter的SDK是旧版本，那么默认的是 import io.flutter.app.FlutterActivity; 包
        // 则MethodChannel方法中的第一个参数填写 getFlutterView()
        new MethodChannel(getFlutterEngine().getDartExecutor().getBinaryMessenger(), channel).setMethodCallHandler(
                new MethodChannel.MethodCallHandler() {
                    @Override
                    public void onMethodCall(@NonNull MethodCall methodCall, @NonNull MethodChannel.Result result) {
                        if (methodCall.method != null) {
                            result.success(toJava(methodCall.method));
                        } else {
                            result.notImplemented();
                        }
                    }
                }
        );

        new MethodChannel(getFlutterEngine().getDartExecutor().getBinaryMessenger(), flutterUseJavaChannel).setMethodCallHandler(
                (methodCall, result) -> {
                    if (methodCall.method != null) {
                        result.success(flutterUseJava(methodCall.method));
                    } else {
                        result.notImplemented();
                    }
                }
        );

        methodChannel_toFlutter = new MethodChannel(
                getFlutterEngine().getDartExecutor().getBinaryMessenger(), "toFlutterChannelName"
        );

    }

    public String toJava(String name) {
        System.out.println("toJava 传递的参数：" + name);
        invokeFlutterMethod_toAllFlutter();
        return "你好" + name;
    }

    public String flutterUseJava(String name) {
        System.out.println("flutterUseJava 传递的参数：" + name);
        invokeFlutterMethod_toAllFlutter();
        return "flutterUser Java name:" + name;
    }


    /**
     * Android调用Flutter
     */
    public void invokeFlutterMethod_toAllFlutter() {
        if (this.methodChannel_toFlutter != null) {
            this.methodChannel_toFlutter.invokeMethod("flutterMethod", "Android调用Flutter, 将参数传递给Flutter里面的一个方法", new MethodChannel.Result() {
                @Override
                public void success(Object o) {
                    Log.e("MainActivity", "invokeFlutterMethod_toAllFlutter success");
                }

                @Override
                public void error(String s, String s1, Object o) {
                    Log.e("MainActivity", "invokeFlutterMethod_toAllFlutter error");

                }

                @Override
                public void notImplemented() {
                    Log.e("MainActivity", "invokeFlutterMethod_toAllFlutter notImplemented");

                }
            });
        }
    }

    // 获取电池电量
    public static int getBatteryPercentage(Context context) {

        if (Build.VERSION.SDK_INT >= 21) {

            BatteryManager bm = (BatteryManager) context.getSystemService(BATTERY_SERVICE);
            return bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);

        } else {

            IntentFilter iFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = context.registerReceiver(null, iFilter);

            int level = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) : -1;
            int scale = batteryStatus != null ? batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1) : -1;

            double batteryPct = level / (double) scale;

            return (int) (batteryPct * 100);
        }
    }

}
```


## 其它
1、在 MainPage 类中定义一个 `MethodChannel` 常量 `_platform`, 并在 `initState()` 方法中处理Flutter申请要调用的 method 的值，此时会调用自定义方法 flutterMethod

```dart
  static const _platform = MethodChannel('toFlutterChannelName');

  @override
  void initState() {
    debugPrint('MainPage initState');
    _platform.setMethodCallHandler(flutterMethod);
    super.initState();
  }

```
2、定义一个flutterMethod方法
```dart
  Future<dynamic> flutterMethod(MethodCall methodCall) async {
    switch (methodCall.method) {
      case 'flutterMethod':
        debugPrint('Android调用了flutterMethod方法！！！');
        debugPrint('Android传递给flutter的参数是：' + methodCall.arguments);
        break;
      default:
        debugPrint('Android调用了flutterMethod失败！！！\t\t' + methodCall.method);
    }
  }
```

3、在原生Android的MainActivity类中，声明一个MethodChannel的变量，然后在onCreate()方法中，通过这个变量获取通道

```java
public class MainActivity extends FlutterActivity {
 
    MethodChannel methodChannel_toFlutter;
 
    @Override
    protected void onCreate(Bundle savedInstanceState){
         
        super.onCreate(savedInstanceState);
 
         methodChannel_toFlutter = new MethodChannel(
                getFlutterEngine().getDartExecutor().getBinaryMessenger(),"toFlutterChannelName"
         );
 
    }
 
}
```

4、让原生Android调用 invokeFlutterMethod_toAllFlutter() 方法，这个方法里面实现了 "调用flutter方法的动作"。

也可以在onCreate() 里面，直接invokeFlutterMethod_toAllFlutter()调用这个方法，以调用flutter的方法。

```java
    /**
     * Android调用Flutter
     */
    public void invokeFlutterMethod_toAllFlutter() {
        if (this.methodChannel_toFlutter != null) {
            this.methodChannel_toFlutter.invokeMethod("flutterMethod", "Android调用Flutter, 将参数传递给Flutter里面的一个方法", new MethodChannel.Result() {
                @Override
                public void success(Object o) {
                    Log.e("MainActivity", "invokeFlutterMethod_toAllFlutter success");
                }

                @Override
                public void error(String s, String s1, Object o) {
                    Log.e("MainActivity", "invokeFlutterMethod_toAllFlutter error");

                }

                @Override
                public void notImplemented() {
                    Log.e("MainActivity", "invokeFlutterMethod_toAllFlutter notImplemented");

                }
            });
        }
    }
```