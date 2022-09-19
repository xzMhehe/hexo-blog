---
title: 【音视频】ijkplayer参数设置讲解
date: 2022-09-12 12:41:52
tags: 音视频
categories: [音视频]
---

## IJKFFOptions参数说明
```cpp
// 打开h265硬解
ijkMediaPlayer.setOption(IjkMediaPlayer.OPT_CATEGORY_PLAYER, "mediacodec-hevc", 1);
/*-------------CodecOption-------------*/
// 解码参数，画面更清晰
[options setCodecOptionIntValue:IJK_AVDISCARD_DEFAULT forKey:@"skip_loop_filter"];
[options setCodecOptionIntValue:IJK_AVDISCARD_DEFAULT forKey:@"skip_frame"];

// 以下是直播、点播参数设置不同
if (直播) {
   // Param for living
   // 最大缓存大小是3秒，可以依据自己的需求修改
   [options setPlayerOptionIntValue:3000 forKey:@"max_cached_duration"];
   // 无限读
   [options setPlayerOptionIntValue:1 forKey:@"infbuf"];  
   // 关闭播放器缓冲
   [options setPlayerOptionIntValue:0 forKey:@"packet-buffering"];
} else {
   // Param for playback
   [options setPlayerOptionIntValue:0 forKey:@"max_cached_duration"];
   [options setPlayerOptionIntValue:0 forKey:@"infbuf"];
   [options setPlayerOptionIntValue:1 forKey:@"packet-buffering"];
}

/*-------------PlayerOption-------------*/
// 在视频帧处理不过来的时候丢弃一些帧达到同步的效果
// 跳帧开关，如果cpu解码能力不足，可以设置成5，否则会引起音视频不同步，也可以通过设置它来跳帧达到倍速播放
[options setPlayerOptionIntValue:5/*0*/ forKey:@"framedrop"];
// 最大fps
[options setPlayerOptionIntValue:30 forKey:@"max-fps"];
// 帧速率(fps) 可以改，确认非标准桢率会导致音画不同步，所以只能设定为15或者29.97
[options setPlayerOptionIntValue:29.97 forKey:@"r"];
// 设置音量大小，256为标准音量。（要设置成两倍音量时则输入512，依此类推）
[options setPlayerOptionIntValue:512 forKey:@"vol"];
// 指定最大宽度
[options setPlayerOptionIntValue:960 forKey:@"videotoolbox-max-frame-width"];
// 开启/关闭 硬解码（硬件解码CPU消耗低。软解，更稳定）
[options setPlayerOptionIntValue:0 forKey:@"videotoolbox"];
// 是否有声音
[options setPlayerOptionIntValue:1  forKey:@"an"];
// 是否有视频
[options setPlayerOptionIntValue:1  forKey:@"vn"];
// 每处理一个packet之后刷新io上下文
[options setPlayerOptionIntValue:1 forKey:@"flush_packets"];
// 是否禁止图像显示(只输出音频)
[options setPlayerOptionIntValue:1 forKey:@"nodisp"];
// 
[options setPlayerOptionIntValue:0 forKey:@"start-on-prepared"];
// 
[options setPlayerOptionIntValue:@"fcc-_es2" forKey:@"overlay-format"];
// 
[options setPlayerOptionIntValue:3 forKey:@"video-pictq-size"];
// 
[options setPlayerOptionIntValue:25 forKey:@"min-frames"];


/*-------------FormatOption-------------*/
// 如果是rtsp协议，可以优先用tcp(默认是用udp)
[options setFormatOptionValue:@"tcp" forKey:@"rtsp_transport"];
// 播放前的探测Size，默认是1M, 改小一点会出画面更快
[options setFormatOptionIntValue:1024*16*0.5 forKey:@"probsize"];
// 播放前的探测时间
[options setFormatOptionIntValue:50000 forKey:@"analyzeduration"];
// 自动转屏开关
[options setFormatOptionIntValue:0 forKey:@"auto_convert"];
// 重连次数
[options setFormatOptionIntValue:1 forKey:@"reconnect"];
// 超时时间，timeout参数只对http设置有效。若果你用rtmp设置timeout，ijkplayer内部会忽略timeout参数。rtmp的timeout参数含义和http的不一样。
[options setFormatOptionIntValue:30 * 1000 * 1000 forKey:@"timeout"];
// 
[options setFormatOptionIntValue:@"nobuffer" forKey:@"fflags"];
// 
[options setFormatOptionIntValue:@"ijkplayer" forKey:@"user-agent"];
// 
[options setFormatOptionIntValue:0 forKey:@"safe"];
// 
[options setFormatOptionIntValue:0 forKey:@"http-detect-range-support"];
// 
[options setFormatOptionIntValue:4628439040 forKey:@"ijkapplication"];
// 
[options setFormatOptionIntValue:6176477408 forKey:@"ijkiomanager"];
```


## skip_loop_filter参数相关
```cpp
// for codec option 'skip_loop_filter' and 'skip_frame'
typedef enum IJKAVDiscard {
    /* We leave some space between them for extensions (drop some
     * keyframes for intra-only or drop just some bidir frames). */
    IJK_AVDISCARD_NONE    =-16, // /< discard nothing
    IJK_AVDISCARD_DEFAULT =  0, // /< discard useless packets like 0 size packets in avi
    IJK_AVDISCARD_NONREF  =  8, // /< discard all non reference
    IJK_AVDISCARD_BIDIR   = 16, // /< discard all bidirectional frames
    IJK_AVDISCARD_NONKEY  = 32, // /< discard all frames except keyframes
    IJK_AVDISCARD_ALL     = 48, // /< discard all
} IJKAVDiscard;
```

>前面两个都看得懂
>第三个是抛弃非参考帧（I帧）
>第四个是抛弃B帧
>第五个是抛弃除关键帧以外的，比如B，P帧
>第六个是抛弃所有的帧，这我就奇怪了，之前Android默认的就是48，难道把所有帧都丢了？
>那就没有视频帧了，所以应该不是这么理解，应该是skip_loop_filter和skip_frame的对象要过滤哪些帧类型。
>skip_loop_filter这个是解码的一个参数，叫环路滤波，设置成48和0，图像清晰度对比，0比48清楚，理解起来就是，0是开启了环路滤波，过滤的是大部分，而48基本没启用环路滤波，所以清晰度更低，但是解码性能开销小
>skip_loop_filter（环路滤波）简言之：
>a:环路滤波器可以保证不同水平的图像质量。
>b:环路滤波器更能增加视频流的主客观质量，同时降低解码器的复杂度。

[去块效应滤波器介绍](https:// blog.csdn.net/h514434485/article/details/52241778)
[h.264 去块滤波块效应及其产生原因](https:// www.cnblogs.com/TaigaCon/p/5500110.html)


## 相关问题以及解决方案
### 达不到秒开，首屏显示慢，后来把播放前探测时间改为1
```cpp
// 播放前的探测时间
[options setFormatOptionIntValue:1 forKey:@”analyzeduration”];
```

### 音画不同步
有同事发现在模拟器的情况下音画不同步，刚开始理解以为是CPU处理画面处理不过来，所以加了framedrop参数 做了丢帧处理，后来才明白是因为模拟器处理效率低，不需要做丢帧处理
```cpp
// 开启硬解码（硬件解码CPU消耗低。软解，更稳定）
[options setPlayerOptionIntValue:1 forKey:@”videotoolbox”];
```

### 延迟产生的原因以及优化
原因:       
保证直播的流畅性是指在直播过程中保证播放不发生卡顿，卡顿是指在播放过程中声音和画面出现停滞，非常影响用户体验。造成卡顿的原因有几种情况:
- 推流端网络抖动导致数据无法发送到服务器，造成播放端卡顿;

- 播放端网络抖动导致数据累积在服务器上拉不下来，造成播放卡顿。

由于从服务器到播放器的网络情况复杂，尤其是在3G和带宽较差的WIFI环境下，抖动和延迟经常发生，导致播放不流畅，播放不流畅带来的负面影响就是延时增大。如何在网络抖动的情况下保证播放的流畅性和实时性是保障直播性能的难点。


流畅度优化:      
目前主流的`直播协议`是`RTMP`、`HTTP-FLV`和`HLS`，都是基于`TCP的长连接`。在播放的过程中，若播放端所处的网络环境在一个较佳的状态，此时播放会很流畅。若网络环境不是很稳定，经常会发生抖动，如果播放端没有做特殊处理，可能会经常发生卡顿，严重的甚至会出现黑屏。而移动直播由于其便捷性，用户可以随时随地发起和观看直播，我们无法保证用户的网络一直处于一个非常好的状态，所以，在网络不稳定的情况下保证播放的流畅度是非常重要的。

为了解决这个问题，首先`播放器需要将拉流线程和解码线程分开`，`并建立一个缓冲队列用于缓冲音视频数据`。拉流线程将从服务器上获取到的音视频流放入队列，解码线程从队列中获取音视频数据进行解码播放，队列的长度可以调整。当网络发生抖动时，播放器无法从服务器上获取到数据或获取数据的速度较慢，此时队列中缓存的数据可以起到一个过渡的作用，让用户感觉不到网络发生了抖动。
当然这是对于网络发生抖动的情况所采取的策略，如果播放端的网络迟迟不能恢复或者服务器的边缘结点 出现宕机，则需要应用层进行重连或调度。

### 软硬编解码的选择
`软编解码`：使用`CPU进行编解码`，大多使用`FFmpeg`来编码和解压音视频数据；

`硬编解码`：主要使用`非CPU`进行编解码，如`GPU`等。在使用中，大多直接调用系统API进行音视频编解码处理。

<table>
<thead>
<tr>
<th style="text-align:center">序号</th>
<th style="text-align:center"></th>
<th style="text-align:center">优点</th>
<th style="text-align:center">缺点</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">1</td>
<td style="text-align:center">软编解码</td>
<td style="text-align:center">在不同的设备、系统版本中兼容性极高；解码时，色彩还原度更高；编解码过程可扩展性强；</td>
<td style="text-align:center">CPU占用高，手机易发热，耗电量大。</td>
</tr>
<tr>
<td style="text-align:center">2</td>
<td style="text-align:center">硬编解码</td>
<td style="text-align:center">系统占用少，执行效率高。</td>
<td style="text-align:center">兼容性低，需根据硬件厂商和系统版本单独适配；可控性比较差；</td>
</tr>
</tbody>
</table>

综合以上情况，在推流方面，iOS系统和硬件设备统一性高，使用全硬编方案效果更好；Android因机型繁杂，支持程度不一，推荐4.3以上使用硬编。在播放解码方面，iOS硬解和软解支持性都较高，软解功耗更高，但是在部分细节方面表现较优，可控性强，具体视项目情况选择；Android推荐4.1版本以上使用硬解，以下版本使用软解。

