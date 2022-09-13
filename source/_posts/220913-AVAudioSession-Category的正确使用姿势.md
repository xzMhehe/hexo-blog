---
title: 【音视频】AVAudioSession-Category的正确使用姿势
date: 2022-09-13 13:13:31
tags: 音视频
categories: [音视频]
---

# 1.常规播放
一般如果应用只有简单音乐播放功能，那么我们的AVAudioSession-Category只用像如下一样设置即可：
```objc
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];     
[[AVAudioSession sharedInstance] setActive:YES error:nil];
```

此时如果我们只是播放音乐，而不需要独占锁屏界面时，还可以设置：
```objc
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback
                                    withOptions:AVAudioSessionCategoryOptionMixWithOthers
                                        error:nil];
```

这样我们兼容其他后台播放的音乐一起进行播放，不过`大部分场景下`，我们是需要`独占式后台播放`。

# 2.常规录音
在录音的时候，我们一般如以下设置：
```objc
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryRecord error:nil];     
[[AVAudioSession sharedInstance] setActive:YES error:nil];
```

# 3.如果将录音和播放同时进行时，我们改选择何种Category？
同时进行播放和录音时，我们需要这样设置:
```objc
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord                                            error:nil];     
[[AVAudioSession sharedInstance] setActive:YES error:nil];
```

需要注意的是，设置成这样的情况下，如果，在录音未开启的情况下，直接进行播放，则会出现，播放音量特别小的情况，我们需要在播放之前，将录音打开。

# 4.前后台切换
上述的模式，在iOS系统下，是`不允许录音`和`播放`在`后台状态下同时进行`的(PS:语音视频通话是通过CallKit实现的，不用于常规的播放和录音功能)。由此，我们在应用进入后台时就需要关掉其中一个功能。

以后台支持播放为例，在应用将要失活时，先切换模式，再关掉录音功能：

// stopRecording...

// 切换模式
```objc
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
[[AVAudioSession sharedInstance] setActive:YES error:nil];
```

应用即将进入前台时，切换模式，再开启录音功能:
```objc
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
[[AVAudioSession sharedInstance] setActive:YES error:nil];
```

// 延迟恢复，否则会导致AVAudioSession的i/o错误
```objc
[self performSelectorOnMainThread:@selector(startRecording) withObject:nil waitUntilDone:NO];
```

# 5.电话中断
电话闹钟的中断也会对，[AVAudioSession sharedInstance] 产生影响。

我们一般场景下会用 下面这个通知进行监控并处理暂停和恢复的工作：
```objc
[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleInterruption:) name:AVAudioSessionInterruptionNotification object:nil]; 
```

```objc
- (void)handleInterruption:(NSNotification*)notification
{ 
    NSLog(@"interruption info:%@",notification.userInfo); 
}
```

但是，当我们在处理第四个场景前后台的情况下，这个通知，在中断的时候会进入，但是电话结束后，不会再接收到中断结束的通知。

原因：

有的app使用了AVCaptureDevice和AVCaptureSession，以进行录音录像操作。为了调优app设置，以更好的进行录音录像，从iOS7开始，在默认情况下，AVCaptureSession会使用app的AVAudioSession，并对其进行修改。这样，设置的中断监听方法会失效。

而电话来电也会使我们的应用接收到 失活的通知，在失活的时候处理了AVAudioSession，就会导致上述通知失效。

解决方案：我这里采用了比较折中的方案，因为我们的需求，对于第四条的处理是必要的。使用的是 CoreTelephony框架下的CTCallCenter对象，来监控电话的 拨入接通、挂断等状态。代码如下：

```objc
self.center = [[CTCallCenter alloc] init];
// TODO: 检测到来电后的处理
self.center.callEventHandler = ^(CTCall * call){
    if (call.callState == CTCallStateIncoming ||
        call.callState == CTCallStateConnected ||
        call.callState == CTCallStateDialing)
    {
    }
    else if (call.callState == CTCallStateDisconnected)
    {
    }
};
```

通过各种打电话的场景测试后，可以实现电话中断恢复功能。

ps:至于闹钟的中断以及siri等其他中断，暂时没有调研和实现。


# 6.蓝牙车载
本来以为车载的车机连接后对于iPhone的播放控制与锁屏控制类似，直接在系统媒体远程控制监控中就能够拿到相应的控制方法回调。

在APPDelegate中加上如下代码：

```objc
//监听远程交互方法
- (void)remoteControlReceivedWithEvent:(UIEvent *)event
{
    switch (event.subtype)
    {
            //播放
        case UIEventSubtypeRemoteControlPlay:
            break;
            //停止
        case UIEventSubtypeRemoteControlPause:
            break;
            //下一首
        case UIEventSubtypeRemoteControlNextTrack:
            break;
            //上一首
        case UIEventSubtypeRemoteControlPreviousTrack:
            break;
        default:
          break;
    }
}
```

事实上，当我们的应用只有简单的播放功能的时候，上述代码的确可以完美的实现车机对于播放的控制功能。但是当应用出于前台的情况下，我们添加上了一直录音的功能的时候，用车机控制播放，就完全没有任何响应了。可以注意到的是，我们看到车机的屏幕上，会显示通话中。查阅了各种资料和文章，都没有找到相关的解决办法和原理解释。

最后，想到了看看有没有其他类似的语音识别及播放功能的应用(iOS)有没有类似的处理，结果调研到百度地图 中的小度 有相关的处理。在它的设置中，找到 语音设置有一个蓝牙连接设置 。两个模式设置 如下：

a.蓝牙设备播报，小度无法唤醒使用(播放体验最佳)

b.蓝牙设备播报，小度唤醒正常使用(车机显示通话中，播报音量可能变小)


由此可以看出，a场景下 录音功能关闭，只有语音播报功能，b场景下，录音功能开启，车机就是会识别到手机设备在录音和播放中，认为就是在通话中，这个是车机本身的限制，无法从应用层进行优化。而且，百度地图的给用的默认选择就是，连接蓝牙的情况下，小度不能唤醒。

综合上面我们协同产品，从交互层面上更改，保证，在连接车机的情况下，能够控制播放。具体处理交互如下：

在应用进入到前台时，检测到连接了蓝牙设备，弹出弹框，让用户选择，继续开启唤醒功能开始，关闭唤醒功能(保证播放控制功能)。继续开启的情况下，车机无法控制播放。

下面是检测是否有输出设备连接的代码(并未找到检查当前是否有连接蓝牙设备的方法):

```objc
+ (BOOL)checkIsConnectToBluetooth
{
    BOOL isBluetooth = NO;
    // 找出当前所有支持输入的设备  availableInputs 这里面会出现 iPhone麦克风, 蓝牙耳机1, 蓝牙耳机2 , 三个对象, 在一个数组里.
    NSArray* inputArray = [[AVAudioSession sharedInstance] availableInputs];
    for (AVAudioSessionPortDescription* desc in inputArray)
    {
        if ([desc.portType isEqualToString:AVAudioSessionPortBluetoothLE] ||
            [desc.portType isEqualToString:AVAudioSessionPortBluetoothHFP] ||
            [desc.portType isEqualToString:AVAudioSessionPortBluetoothA2DP])
        {
            isBluetooth = YES;
        }
    }
    return isBluetooth;
}
```

同时，还需要配合Category的设置：

```objc
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord                                          withOptions:AVAudioSessionCategoryOptionAllowBluetooth                                                error:&error];        
[[AVAudioSession sharedInstance] setActive:YES error:&error1];
```

AVAudioSessionCategoryOptionAllowBluetooth这是必须要添加的，否则上面的方法，连接蓝牙后，在应用即将活跃的监控的时候，是会返回NO，拿不到准确的值。
