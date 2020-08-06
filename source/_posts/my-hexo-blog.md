---
title: my hexo blog
date: 2020-07-07 21:22:21
tags:
- 随记
categories:

thumbnail: https://s1.ax1x.com/2020/07/28/aEm3dS.gif
top: 1
---
我是xzMhehe，一名Java开发者，技术一般，经历平平，但是也一直渴望进步，同时也努力活着，为了人生不留遗憾，也希望能够一直做着自己喜欢的事情，得闲时分享心得、分享一些浅薄的经验，等以后老得不能再老了，就说故事已经讲完了,不去奢求圆满。
相信浏览这段话的你也知道，学习是一件极其枯燥而无聊的过程，甚至有时候显得很无助，我也想告诉你，成长就是这样一件残酷的事情，任何成功都不是一蹴而就，需要坚持、需要付出、需要你的毅力，短期可能看不到收获，因为破茧成蝶所耗费的时间不是一天

>我等了三年，就是要等一个机会，我要争一口气，不是证明我了不起，我是要告诉大家，我失去的东西我一定要亲手拿回来」 --《英雄本色》

## 关于Blog

> 本站历史
<p>博客从<ahref="http://localhost:4000/2019/12/29/%E8%A7%86%E5%9B%BE%E7%9A%84%E6%93%8D%E4%BD%9C"><strong>2019.8.11</strong></a>至今已经运行<span id="htmer_time" style="color: #90CAF9; font-weight: bold;"></span></p>

## 起步

>📝记录从初识到熟悉的过程

## 再次起步

- 博客园    https://www.cnblogs.com/mzdljgz/
- CSDN  https://blog.csdn.net/weixin_43874301
- 简书  https://www.jianshu.com/u/a22e10515f17
- 知乎  https://www.zhihu.com/people/jing-qing-qiu-52
- 掘金  https://juejin.im/user/131597127652312
- 公众号 ThePalmJava

## 至今
<center><font color=BBBBBB size=5>本站微信公众号</font></center>

![mark](https://s1.ax1x.com/2020/07/17/UsFeJJ.jpg)


## 致谢

<script>
function secondToDate(second) {
     if (!second) {
         return 0;
     }
     var time = new Array(0, 0, 0, 0, 0);
     if (second >= 365 * 24 * 3600) {
        time[0] = parseInt(second / (365 * 24 * 3600));
        second %= 365 * 24 * 3600;
    }
    if (second >= 24 * 3600) {
        time[1] = parseInt(second / (24 * 3600));
        second %= 24 * 3600;
    }
    if (second >= 3600) {
        time[2] = parseInt(second / 3600);
        second %= 3600;
    }
    if (second >= 60) {
        time[3] = parseInt(second / 60);
        second %= 60;
    }
    if (second > 0) {
        time[4] = second;
    }
    return time;
};
function setTime() {
         // 博客创建时间秒数，时间格式中，月比较特殊，是从0开始的，所以想要显示5月，得写4才行，如下
         var create_time = Math.round(new Date(Date.UTC(2019, 8, 11, 18, 37, 16)).getTime() / 1000);// 当前时间秒数,增加时区的差异
         var timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
         currentTime = secondToDate((timestamp - create_time));
         if (currentTime[0]==0){
             currentTimeHtml = currentTime[1] + '天'+ currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
         }else{
             currentTimeHtml = currentTime[0] + '年' + currentTime[1] + '天' + currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
         }
         // 兼容pjax，当htmer_time存在时输出，否则清空计时器
         if (document.getElementById("htmer_time")){
             document.getElementById("htmer_time").innerHTML = currentTimeHtml;
         }else{
              clearInterval(timer);
         }
}
var timer = setInterval(setTime, 1000);
</script>
