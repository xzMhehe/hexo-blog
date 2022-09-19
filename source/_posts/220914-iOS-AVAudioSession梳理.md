---
title: 【音视频】iOS AVAudioSession梳理
date: 2022-09-14 18:55:15
tags: 音视频
categories: [音视频]
---

## AVAudioSession 概述
AVAudioSession是一个对象，用于向系统传达你将如何在应用程序中使用音频。
使用AVAudioSession可以向操作系统描述应用程序使用音频的一般策略，而无需详细说明特定场景下的表现或与音频硬件的交互。你可以将这些细节的管理委托给AVAudioSession实现，这样可以确保操作系统能够最好地管理用户的音频体验。

苹果的官方图：
<img src="https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/mo/20220914185949.png"/>

可以看到AVAudioSession就是`用来管理多个APP对音频硬件设备`（`麦克风`，`扬声器`）`的资源使用`。

举例一下AVAudioSession可以做这些事情

- 设置自己的APP是否和其他APP音频同时存在，还是中断其他APP声音

- 在手机调到静音模式下，自己的APP音频是否可以播放出声音

- 电话或者其他APP中断自己APP的音频的事件处理

- 指定音频输入和输出的设备（比如是听筒输出声音，还是扬声器输出声音）

- 是否支持录音，录音同时是否支持音频播放


## AVAudioSession Category
AVAudioSession的接口比较简单。APP启动的时候会自动帮激活AVAudioSession，当然可以手动激活代码如下。

```objc
// 导入头文件
#import <AVFoundation/AVFoundation.h>

// AVAudioSession是一个单例类
AVAudioSession *session = [AVAudioSession sharedInstance];
// AVAudioSessionCategorySoloAmbient是系统默认的category
[session setCategory:AVAudioSessionCategorySoloAmbient error:nil];
// 激活AVAudioSession
[session setActive:YES error:nil];
```

可以看到设置`session`这里有`两个参数`，`category`和`options` Category iOS下目前有七种，每种Category都对应是否支持下面四种能力
- Interrupts non-mixable apps audio：是否打断不支持混音播放的APP

- Silenced by the Silent switch：是否会响应手机静音键开关

- Supports audio input：是否支持音频录制

- Supports audio output：是否支持音频播放

下面用图表来直观的看下每种category具体的能力集



<table>
<thead>
<tr>
<th>Category</th>
<th>是否允许音频播放/录音</th>
<th>是否打断其他不支持混音APP</th>
<th>是否会被静音键或锁屏键静音</th>
</tr>
</thead>
<tbody>
<tr>
<td>AVAudioSessionCategoryAmbient</td>
<td>只支持播放</td>
<td>否</td>
<td>是</td>
</tr>
<tr>
<td>AVAudioSessionCategoryAudioProcessing</td>
<td>不支持播放，不支持录制</td>
<td>是</td>
<td>否</td>
</tr>
<tr>
<td>AVAudioSessionCategoryMultiRoute</td>
<td>支持播放，支持录制</td>
<td>是</td>
<td>否</td>
</tr>
<tr>
<td>AVAudioSessionCategoryPlayAndRecord</td>
<td>支持播放，支持录制</td>
<td>默认YES，可以重写为NO</td>
<td>否</td>
</tr>
<tr>
<td>AVAudioSessionCategoryPlayback</td>
<td>只支持播放</td>
<td>默认YES，可以重写为NO</td>
<td>否</td>
</tr>
<tr>
<td>AVAudioSessionCategoryRecord</td>
<td>只支持录制</td>
<td>是</td>
<td>否（锁屏下仍可录制）</td>
</tr>
<tr>
<td>AVAudioSessionCategorySoloAmbient</td>
<td>只支持播放</td>
<td>是</td>
<td>是</td>
</tr>
</tbody>
</table>


- AVAudioSessionCategoryAmbient，只支持音频播放。这个 Category，音频会被静音键和锁屏键静音。并且不会打断其他应用的音频播放。

- AVAudioSessionCategorySoloAmbient，这个是系统默认使用的 Category，只支持音频播放。音频会被静音键和锁屏键静音。和AVAudioSessionCategoryAmbient不同的是，这个会打断其他应用的音频播放

- AVAudioSessionCategoryPlayback，只支持音频播放。你的音频不会被静音键和锁屏键静音。适用于音频是主要功能的APP，像网易云这些音乐app，锁屏后依然可以播放。

>需要注意一下，选择支持在静音键切到静音状态以及锁屏键切到锁屏状态下仍然可以播放音频 Category 时，必须在应用中开启支持后台音频功能，详见 [UIBackgroundModes](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html#//apple_ref/doc/uid/TP40009252-SW22)。

- AVAudioSessionCategoryRecord，只支持音频录制。不支持播放。

- AVAudioSessionCategoryPlayAndRecord，支持音频播放和录制。音频的输入和输出不需要同步进行，也可以同步进行。需要音频通话类应用，可以使用这个 Category。

- AVAudioSessionCategoryAudioProcessing，只支持本地音频编解码处理。不支持播放和录制。

- AVAudioSessionCategoryMultiRoute，支持音频播放和录制。允许多条音频流的同步输入和输出。（比如USB连接外部扬声器输出音频，蓝牙耳机同时播放另一路音频这种特殊需求）

也可以通过AVAudioSession的属性来读取当前设备支持的Category
```objc
@property(readonly) NSArray<NSString *> *availableCategories;
```

这样可以保证设备兼容性。

设置Category的代码示例如下
```objc
NSError *setCategoryError = nil;
BOOL isSuccess = [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:&setCategoryError];
if (!success) { 
    //这里可以读取setCategoryError.localizedDescription查看错误原因
}
```


##  AVAudioSession Mode&&Options
刚刚介绍的Category定义了七种主场景，实际开发需求中有时候需要对Category进行微调整，发现这个接口还有两个参数`Mode`和`Options`。
```objc
/* set session category and mode with options */
- (BOOL)setCategory:(NSString *)category mode:(NSString *)mode options:(AVAudioSessionCategoryOptions)options error:(NSError **)outError API_AVAILABLE(ios(10.0), watchos(3.0), tvos(10.0));
```

### AVAudioSession Mode
通过读取下面这条属性获取当前设备支持的Mode

```objc
@property(readonly) NSArray<NSString *> *availableModes;
```
iOS下有七种mode来定制Category行为
<table>
<thead>
<tr>
<th>模式</th>
<th>兼容的 Category</th>
<th>场景</th>
</tr>
</thead>
<tbody>
<tr>
<td>AVAudioSessionModeDefault</td>
<td>All</td>
<td>默认模式</td>
</tr>
<tr>
<td>AVAudioSessionModeVoiceChat</td>
<td>AVAudioSessionCategoryPlayAndRecord</td>
<td>VoIP</td>
</tr>
<tr>
<td>AVAudioSessionModeGameChat</td>
<td>AVAudioSessionCategoryPlayAndRecord</td>
<td>游戏录制，GKVoiceChat自动设置</td>
</tr>
<tr>
<td>AVAudioSessionModeVideoRecording</td>
<td>AVAudioSessionCategoryPlayAndRecord AVAudioSessionCategoryRecord</td>
<td>录制视频</td>
</tr>
<tr>
<td>AVAudioSessionModeMoviePlayback</td>
<td>AVAudioSessionCategoryPlayback</td>
<td>视频播放</td>
</tr>
<tr>
<td>AVAudioSessionModeMeasurement</td>
<td>AVAudioSessionCategoryPlayAndRecord AVAudioSessionCategoryRecord AVAudioSessionCategoryPlayback</td>
<td>最小系统</td>
</tr>
<tr>
<td>AVAudioSessionModeVideoChat</td>
<td>AVAudioSessionCategoryPlayAndRecord</td>
<td>视频通话</td>
</tr>
</tbody>
</table>

下面逐一介绍下每个Mode

- AVAudioSessionModeDefault，默认模式,与所有的 Category 兼容


- AVAudioSessionModeVoiceChat，适用于VoIP 类型的应用。只能是 AVAudioSessionCategoryPlayAndRecord Category下。在这个模式系统会自动配置AVAudioSessionCategoryOptionAllowBluetooth 这个选项。系统会自动选择最佳的内置麦克风组合支持语音聊天。


- AVAudioSessionModeVideoChat，用于视频聊天类型应用，只能是 AVAudioSessionCategoryPlayAndRecord Category下。适在这个模式系统会自动配置 AVAudioSessionCategoryOptionAllowBluetooth 和 AVAudioSessionCategoryOptionDefaultToSpeaker 选项。系统会自动选择最佳的内置麦克风组合支持视频聊天。


- AVAudioSessionModeGameChat，适用于游戏类应用。使用 GKVoiceChat 对象的应用会自动设置这个模式和 AVAudioSessionCategoryPlayAndRecord Category。实际参数和AVAudioSessionModeVideoChat一致


- AVAudioSessionModeVideoRecording，适用于使用摄像头采集视频的应用。只能是 AVAudioSessionCategoryPlayAndRecord 和 AVAudioSessionCategoryRecord 这两个 Category下。这个模式搭配 AVCaptureSession API 结合来用可以更好地控制音视频的输入输出路径。(例如，设置 automaticallyConfiguresApplicationAudioSession 属性，系统会自动选择最佳输出路径。


- AVAudioSessionModeMeasurement，最小化系统。只用于 AVAudioSessionCategoryPlayAndRecord、AVAudioSessionCategoryRecord、AVAudioSessionCategoryPlayback 这几种 Category。


- AVAudioSessionModeMoviePlayback，适用于播放视频的应用。只用于 AVAudioSessionCategoryPlayback 这个Category。


### AVAudioSession Options
可以使用options去微调Category行为，如下表

<table>
<thead>
<tr>
<th>Option</th>
<th>Option功能说明</th>
<th>兼容的 Category</th>
</tr>
</thead>
<tbody>
<tr>
<td>AVAudioSessionCategoryOptionMixWithOthers</td>
<td>支持和其他APP音频 mix</td>
<td>AVAudioSessionCategoryPlayAndRecord AVAudioSessionCategoryPlayback AVAudioSessionCategoryMultiRoute</td>
</tr>
<tr>
<td>AVAudioSessionCategoryOptionDuckOthers</td>
<td>系统智能调低其他APP音频音量</td>
<td>AVAudioSessionCategoryPlayAndRecord AVAudioSessionCategoryPlayback AVAudioSessionCategoryMultiRoute</td>
</tr>
<tr>
<td>AVAudioSessionCategoryOptionAllowBluetooth</td>
<td>支持蓝牙音频输入</td>
<td>AVAudioSessionCategoryRecord AVAudioSessionCategoryPlayAndRecord</td>
</tr>
<tr>
<td>AVAudioSessionCategoryOptionDefaultToSpeaker</td>
<td>设置默认输出音频到扬声器</td>
<td>AVAudioSessionCategoryPlayAndRecord</td>
</tr>
</tbody>
</table>

### 调优Category
通过Category和合适的Mode和Options的搭配可以调优出效果，下面举两个应用场景:

用过高德地图的都知道，在后台播放QQ音乐的时候，如果导航语音出来，QQ音乐不会停止，而是被智能压低和混音，等导航语音播报完后，QQ音乐正常播放，这里需要后台播放音乐，所以Category使用`AVAudioSessionCategoryPlayback`，需要混音和智能压低其他APP音量，所以Options选用 `AVAudioSessionCategoryOptionMixWithOthers`和`AVAudioSessionCategoryOptionDuckOthers`

代码示例如下
```objc
 BOOL isSuccess = [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionMixWithOthers | AVAudioSessionCategoryOptionDuckOthers error:&setCategoryError];
```

又或者希望AVAudioSessionCategoryPlayAndRecord这个Category默认的音频由扬声器播放，那么可以调用这个接口去调整Category
```objc
- (BOOL)setCategory:(NSString *)category withOptions:(AVAudioSessionCategoryOptions)options error:(NSError **)outError
```

通过选择合适和Category，mode和options，就可以调优音频的输入输出，来满足日常开发需求（需要注意的是Category，mode，option是搭配使用的，而`不是简单组合`，也就是说某种Category支持某些mode和option，从上面的表中也可以看出这一点）

## 音频中断处理
其他APP或者电话会中断APP音频，所以相应的要做出处理。 可以通过监听`AVAudioSessionInterruptionNotification`这个`key`获取音频中断事件

回调回来`Userinfo`有键值

>AVAudioSessionInterruptionTypeKey：取值AVAudioSessionInterruptionTypeBegan表示中断开始 取值AVAudioSessionInterruptionTypeEnded表示中断结束

`中断开始`：需要做的是保存好播放状态，上下文，更新用户界面等     
`中断结束`：要做的是恢复好状态和上下文，更新用户界面，根据需求准备好之后选择是否激活session。

选择不同的音频播放技术，处理中断方式也有差别，具体如下:

- System Sound Services：使用 System Sound Services 播发音频，系统会自动处理，不受APP控制，当中断发生时，音频播放会静音，当中断结束后，音频播放会恢复。

- AV Foundation framework：AVAudioPlayer 类和 AVAudioRecorder 类提供了中断开始和结束的 Delegate 回调方法来处理中断。中断发生，系统会自动停止播放，需要做的是记录播放时间等状态，更新用户界面，等中断结束后，再次调用播放方法，系统会自动激活session。

- Audio Queue Services, I/O audio unit：使用aduio unit这些技术需要处理中断，需要做的是记录播放或者录制的位置，中断结束后自己恢复audio session。

- OpenAL：使用 OpenAL 播放时，同样需要自己监听中断。管理 OpenAL上下文，用户中断结束后恢复audio session。

**需要注意的是**      
- 有中断开始事件，不一定对应有中断结束事件，所以需要在用户进入前台，点击UI操作的时候，需要保存好播放状态和对Audio Session管理，以便不影响APP的音频功能。

- 音频资源竞争上，一定是电话优先。

- AVAudioSession同样可以监听外设音频状态，比如耳机拔入拔出。这里不做累述

## AVAudioSession总结
AVAudioSession的作用就是`管理音频这一唯一硬件资源的分配`，通过调优合适的AVAudioSession来适配APP对于音频的功能需求。`切换音频场景时候`，`需要相应的切换AVAudioSession`。

