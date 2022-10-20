---
title: 【Android】开发 ConnectivityManager
date: 2022-10-20 08:46:15
tags: Android
categories: [Android]
---


## 概况
ConnectivityManager主要职责，官方说明：
>Monitor network connections (Wi-Fi, GPRS, UMTS, etc.)
Send broadcast intents when network connectivity changes
Attempt to "fail over" to another network when connectivity to a network is lost
Provide an API that allows applications to query the coarse-grained or fine-grained state of the available networks
Provide an API that allows applications to request and select networks for their data traffic

>监控网络连接(Wi-Fi, GPRS, UMTS, etc.)；
当网络连接改变时发送Intent；
当连接到一个网络失败时，尝试用其他网络补救；
提供API给应用查询有效网络粗略或者精确的状态；
提供API给应用为它们的数据传输请求和选择网络；

`ConnectivityManager类用于查询网络状态，并且也能被动监听网络状态的变化。`

## 需要的权限
```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```



## 判断是否有网络
下面这个getActiveNetworkInfo 方法是过时的旧方法。这里记录一下，请注意如果获取到的是null，那么等于当前设备没有连接网络。注意这里是使用kotlin代码调用的。

```java
private fun hasNetwork(): Boolean {
    val connectivity = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
    val networkInfo = connectivity.activeNetworkInfo
    return networkInfo != null && networkInfo.isAvailable // networkInfo如果是null也是没有网络
}
```

新方法请使用getActiveNetwork，同上如果获取到的是null，那么等于当前设备没有连接网络

```java
private fun hasNetwork2(): Boolean {
    var connectivityManager: ConnectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
        val network = connectivityManager.activeNetwork
        return network != null // 如果是null代表没有网络
    }
    return false
}
```


## 判断当前网络类型
```java
val cm = applicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
val networks = cm.allNetworks
for (item in networks){
    val caps = cm.getNetworkCapabilities(item)
    if (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)){
        Log.e("ytzn", "item wifi 网络")

    } else if (caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)){
        Log.e("ytzn", "item wifi 移动网络")
    }
}
```

## 监听网络状态
如果你的需求只是关注是否有网络，你只需要关心 onAvailable回调（有网络时回调） 与 onLost回调（无网络时回调）
```java
private void networkListener() {
    ConnectivityManager connectivity = (ConnectivityManager) getContext().getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
    NetworkRequest.Builder builder = new NetworkRequest.Builder();
    NetworkRequest request = builder.addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)    // 表示此网络使用Wi-Fi传输
            .addTransportType(NetworkCapabilities.TRANSPORT_CELLULAR)// 表示此网络使用蜂窝传输
            .build();
    connectivity.registerNetworkCallback(request, new ConnectivityManager.NetworkCallback() {
        @Override
        public void onAvailable(Network network) {
            super.onAvailable(network);
            // 网络可用
            ToastUtils.showShortToast("网络可用");
            Log.e("调试_临时_log", "this_onAvailable");

        }

        @Override
        public void onUnavailable() {
            super.onUnavailable();
            // 如果在指定的超时时间内未找到网络，则调用
            Log.e("调试_临时_log", "this_onUnavailable");
        }

        @Override
        public void onLost(@NonNull Network network) {
            super.onLost(network);
            // 当框架的网络严重中断或正常故障结束时调用
            Log.e("调试_临时_log", "this_onLost");
        }

        @Override
        public void onBlockedStatusChanged(@NonNull Network network, boolean blocked) {
            super.onBlockedStatusChanged(network, blocked);
            // 当对指定网络的访问被阻止或取消阻止时调用
            Log.e("调试_临时_log", "this_onBlockedStatusChanged");
        }

        @Override
        public void onCapabilitiesChanged(@NonNull Network network, @NonNull NetworkCapabilities networkCapabilities) {
            super.onCapabilitiesChanged(network, networkCapabilities);
            // 当网络连接到此请求的框架*更改功能但仍满足规定的需求时调用。
            boolean isInternet = networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);// 获取是否能连接Internet网
            Log.e("调试_临时_log", "this_onCapabilitiesChanged : isInternet = " + isInternet);
        }

        @Override
        public void onLosing(@NonNull Network network, int maxMsToLive) {
            super.onLosing(network, maxMsToLive);
            // 当网络即将断开时调用。通常与新替换网络的呼叫配对，
            // 以实现优雅的切换。如果我们有严重损失*（损失而没有警告），则可能无法调用此方法。
            Log.e("调试_临时_log", "this_onLosing");
        }

        @Override
        public void onLinkPropertiesChanged(@NonNull Network network, @NonNull LinkProperties linkProperties) {
            super.onLinkPropertiesChanged(network, linkProperties);
            // 当与该请求连接的框架网络更改时调用。
            Log.e("调试_临时_log", "this_onLinkPropertiesChanged");
        }
    });
}
```

另外你可以在配置的时候addTransportType指定监听某个网络状态比如WiFi或者移动网络，NetworkCapabilities类里还有更多类型：

```java
    /**
    * 表示此网络使用移动蜂窝传输。
    */
    public static final int TRANSPORT_CELLULAR = 0;

    /**
    *表示此网络使用Wi-Fi传输。
    */
    public static final int TRANSPORT_WIFI = 1;

    /**
    * 表示此网络使用蓝牙传输
    */
    public static final int TRANSPORT_BLUETOOTH = 2;

    /**
    * 表示此网络使用以太网传输。
    */
    public static final int TRANSPORT_ETHERNET = 3;

    /**
    * 指示此网络使用VPN传输。
    */
    public static final int TRANSPORT_VPN = 4;

    /**
    * 表示此网络使用支持 Wi-Fi Aware 的传输。
    */
    public static final int TRANSPORT_WIFI_AWARE = 5;

    /**
    * 表示此网络使用低功耗传输。
    */
    public static final int TRANSPORT_LOWPAN = 6;
```


