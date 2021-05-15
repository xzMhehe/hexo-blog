---
layout: page
seo_title: 小伙伴们
bottom_meta: false
sidebar: [blogger, category, tagcloud]
sitemap: false
---

<div style="margin-top: 2.5rem;text-align: center">
    <span class="milky">🎉小伙伴</span>
</div>

{% issues sites | api=https://gitee.com/api/v5/repos/codingce/blog-friends/issues?sort=created&direction=asc&labels=主题作者-主题文档,技术大佬,朋友们,虐狗博主&state=open&page=1&per_page=100 | group=group:主题作者 + 文档,技术大佬,朋友们,虐狗博主 %}

<br>

{% note warning, <strong>友链更新通知</strong> <br>由于近期对友链系统进行了重做，原链接失效的小伙伴请按照下方交换友链的步骤进行填写。在新的友链系统中，您随时可以对自己的信息进行修改而无需等待博主更新。 %}

<br>

{% tabs links,1 %}

<!-- tab &nbsp;添加友链流程 @plus-circle -->

{% timeline %}

{% timenode 第一步：新建 [Gitee Issue](https://gitee.com/codingce/blog-friends/issues) 按照格式填写并提交 %}

```json
{
    "title": "",
    "avatar": "",
    "screenshot": "",
    "url": "",
    "description": "",
    "group": ""
}
```
为了提高图片加载速度，建议优化头像和截图：

1.打开 [压缩图](https://www.yasuotu.com/) 上传自己的头像，将图片尺寸调整到 `96px` 后下载。
2.将压缩后的图片上传到 [去不图床](https://7bu.top/) 或者 [sm.ms 图床](https://sm.ms/) 并使用此图片链接作为头像。
3.重复上述步骤，把压缩网站截图并把尺寸调整到 `540x360` 以下。

{% endtimenode %}

{% timenode 第二步：添加友链并等待管理员审核 %}

请添加本站到您的友链中，如果您也使用 issue 作为友链源，只需要告知您的友链源仓库即可。
```
title: Ze's Blog # 博客名
avatar: https://i.codingce.com.cn/images/avatar.jpg # 头像链接
url:  https://i.codingce.com.cn # 博客链接
screenshot: https://7.dusays.com/2020/10/23/d6d2f3589e979.png # 网站截图
description: 简单不先于复杂，而是在复杂之后。 # 网站描述
tags: [Java, 前端] # 标签
```
待管理员审核通过，回来刷新即可生效。

{% endtimenode %}

{% endtimeline %}

<!-- endtab -->

<!-- tab &nbsp;友链申明 @bell -->

:bell: 站点失效、停止维护、内容不当都可能被取消友链
:bell: 禁链不尊重他人劳动成果，转载、引用不加出处，恶意行为的站点
:bell: 本站会定期检查并清理无效的、单方面的友链，如更换信息请留言，谢谢合作
:bell: 加入友链后会在本站任意留言区获得<span class="links-tips-friends">小伙伴</span>徽章（以邮箱判定）一枚哦，如果没有请联系我

<!-- endtab -->

<!-- tab &nbsp;更新自己的博客链接 @retweet -->

如果是自己创建的 issue ，可以自己修改。
如果是管理员创建的，请自己重新创建一份，然后让管理员删掉旧的。

<!-- endtab -->

<!-- tab &nbsp;其他方式添加友链 @anchor -->

如果你不会使用 [Gitee Issue](https://gitee.com/codingce/blog-friends/issues) 提交友链，那么请按照以下步骤申请友链。
{% timeline %}

{% timenode 第一步：按照下面格式留言 %}

```yml
{
    "title": "",        # 站点名字
    "avatar": "",       # 头像
    "screenshot": "",   # 站点截图
    "url": "",          # 站点地址
    "description": "",  # 描述
    "group": ""         # 分组,可选值有[技术大佬、朋友们、虐狗博主]
}
```
为了提高图片加载速度，建议优化头像和截图：

1.打开 [压缩图](https://www.yasuotu.com/) 上传自己的头像，将图片尺寸调整到 `96px` 后下载。
2.将压缩后的图片上传到 [去不图床](https://7bu.top/) 或者 [sm.ms 图床](https://sm.ms/) 并使用此图片链接作为头像。
3.重复上述步骤，把压缩网站截图并把尺寸调整到 `540x360` 以下。

{% endtimenode %}

{% timenode 第二步：添加本站友链并等待管理员审核 %}

请添加本站到您的友链中（信息按需取）
```
title: Ze's Blog # 博客名
avatar: https://i.codingce.com.cn/images/avatar.jpg # 头像链接
url:  https://i.codingce.com.cn # 博客链接
screenshot: https://7.dusays.com/2020/10/23/d6d2f3589e979.png # 网站截图
description: 简单不先于复杂，而是在复杂之后。 # 网站描述
tags: [Java, 前端] # 标签
```
待管理员核实以后，会帮您到 [Gitee Issue](https://gitee.com/codingce/blog-friends/issues) 添加友链。

{% endtimenode %}

{% endtimeline %}

<!-- endtab -->

{% endtabs %}

<style>
    .issues-api h2:first-child{
        margin-top: -50px;
    }
</style>
