---
layout: friends     # 必须
title: 小伙伴们   # 可选，这是友链页的标题
top_meta: true
bottom_meta: false
sidebar: [blogger, category, tagcloud]
sitemap: false
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/links-or-tools.png
---
### 申请友链：
{% tabs links,1 %}

<!-- tab &nbsp;添加流程 @plus-circle -->

{% timeline %}

{% timenode 请先添加本站链接 %}

名称：Ze's Blog
链接：[https://i.codingce.com.cn](https://i.codingce.com.cn)
头像：[https://i.codingce.com.cn/images/avatar.jpg](https://i.codingce.com.cn/images/avatar.jpg)
描述：简单不先于复杂，而是在复杂之后！
标签：Java，前端
背景颜色（若有）：#967ADC
文字颜色（若有）：#fff

{% endtimenode %}

{% timenode 下方评论区按此格式申请友链 %}

```
- name: Ze's Blog Blog # 博客名
  avatar: https://i.codingce.com.cn/images/avatar.jpg # 头像链接
  url: https://i.codingce.com.cn # 博客链接
  tags: [Java, 前端] # 标签
```

{% endtimenode %}

{% timenode 等待本站添加贵站 %}

{% folding cyan open, 友链申明 %}
:bell: 站点失效、停止维护、内容不当都可能被取消友链
:bell: 禁链不尊重他人劳动成果，转载、引用不加出处，恶意行为的站点
:bell: 本站会定期检查并清理无效的、单方面的友链，如更换信息请留言，谢谢合作
:bell: 加入友链后会在本站任意留言区获得<span class="links-tips-friends">小伙伴</span>徽章（以邮箱判定）一枚哦，如果没有请联系我
{% endfolding %}

{% endtimenode %}

{% timenode 互链成功 %}

{% noteblock poo cyan %}
已经添加的友链不会轻易删除。如果您已经移除本站，本站也将移除友链
{% endnoteblock %}

{% endtimenode %}

{% endtimeline %}

<!-- endtab -->

<!-- tab &nbsp;清理记录 @minus-circle -->

如果出现误清理请重新申请即可！

{% timeline %}

{% timenode 2020-08-20 %}

*  朱纯树博客 - https://si***og.cn
    站点无法访问
*  Emil’s blog - https://blog.hv***g.com/
    站点未开启Https

{% endtimenode %}

{% endtimeline %}

<!-- endtab -->

{% endtabs %}

{# 修改时间线中的样式 #}
<style>
    details summary:hover:after{
        right: 4px;
    }
    
    .links-tips-friends {
        font-size: 12px;
        padding: 4px 4px;
        background: #6cf;
        color: #fff;
        border-radius: 2px;
        margin: 0 3px;
        vertical-align: 1px;
    }
</style>
