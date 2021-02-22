---
layout: page
seo_title: 留言板
bottom_meta: false
sidebar: []
sitemap: false
---
<div style="margin-top: 2.5rem;text-align: center">
    <span class="milky">🍭留言板</span>
</div>

<div class="poem-wrap">
  <div class="poem-border poem-left"></div>
  <div class="poem-border poem-right"></div>
    <h1>一言</h1>
    <p id="poem">挑选中...</p>
    <p id="info">
</div>

{% p center,有什么想说的，有什么想问，就在下方留言吧，收到我会第一时间回复！请尽情灌水吧！😉 %}

<script>
    $.get("https://v1.hitokoto.cn?c=i&c=j", function (data, status) {
        if (status == 'success') {
            $('#poem').html(data.hitokoto);
            if (data.from_who != null) {
                $('#info').html(data.from_who + " · " + "《 " + data.from + " 》");
            } else {
                $('#info').html(data.from);
            }
        } else {
            $('#poem').html("获取出错啦");
        }
    });
</script>

<style>
.poem-wrap {
    position: relative;
    width: 730px;
    max-width: 80%;
    border: 2px solid #797979;
    border-top: 0;
    text-align: center;
    margin: 80px auto;
}
 
.poem-wrap h1 {
    position: relative;
    margin-top: -20px;
    display: inline-block;
    letter-spacing: 4px;
    color: #797979;
    border-bottom: none;
}
 
.md .poem-wrap h1:before{
    height: 0;
}

.poem-wrap p {
    width: 70%;
    margin: auto;
    line-height: 30px;
    color: #797979;
}
 
.poem-wrap p#poem {
    text-align: center;
    font-size: 25px;
}
 
.poem-wrap p#info {
    text-align: center;
    font-size: 15px;
    margin: 15px auto;
}
 
.poem-border {
    position: absolute;
    height: 2px;
    width: 27%;
    background-color: #797979;
}
 
.poem-right {
    right: 0;
}
 
.poem-left {
    left: 0;
}

@media (max-width: 685px) {
    .poem-border {
        width: 18%;
    }
}
 
@media (max-width: 500px) {
    .poem-wrap {
        margin-top: 60px;
        margin-bottom: 20px;
        border-top: 2px solid #797979;
    }
 
    .poem-wrap h1 {
        margin: 20px 6px;
    }
 
    .poem-border {
        display: none;
    }
}
</style>
