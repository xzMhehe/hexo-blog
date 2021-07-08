---
title: Hexo基于live2d插件的动态猫猫设置
date: 2021-07-07 08:37:19
tags: 随记
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210708095955.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210708095955.png
---

# 下载安装
检测npm版本是否最新             
`npm -v`

npm更新方法:            
`nmp install npm@latest -g`

安装hexo-helper-live2d          
进入`hexo`目录下                  
`npm install –save hexo-helper-lived`
    
打开hexo目录下的_config.yml的配置文件

# 配置
将以下代码添加到配置文件末尾
```bash
# Live2D
## https://github.com/EYHN/hexo-helper-live2d
live2d:
  enable: true
  # scriptFrom: jsdelivr # jsdelivr CDN
  # scriptFrom: unpkg # unpkg CDN
  # scriptFrom: https://cdn.jsdelivr.net/npm/live2d-widget@3.x/lib/L2Dwidget.min.js # 你的自定义 url
  # use: wanko # 博客根目录/live2d_models/ 下的目录名
  # use: ./wives/wanko # 相对于博客根目录的路径
  # use: https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json # 你的自定义 url
  # enable: false
  scriptFrom: local # 默认
  pluginRootPath: live2dw/ # 插件在站点上的根目录(相对路径)
  pluginJsPath: lib/ # 脚本文件相对与插件根目录路径
  pluginModelPath: assets/ # 模型文件相对与插件根目录路径
  model:
    use: live2d-widget-model-ni-j # npm-module package name
    scale: 1
    hHeadPos: 0.5
    vHeadPos: 0.618
  display:
    superSample: 2
    width: 150
    height: 300
    position: left
    hOffset: 0
    vOffset: -50
  mobile:
    show: true
    scale: 0.5
  react:
    opacityDefault: 0.7
    opacityOnHover: 0.2
```

下载模型动画
[后宫预览点这里](https://huaji8.top/post/live2d-plugin-2.0/)
[选择你的后宫](https://github.com/xiazeyu/live2d-widget-models)

看好了默默记下小姐姐的名字,初音的模型名字:`ni-j`

博客中都是按照`ni-j`操作

`npm install –save live2d-widget-model-ni-j`
此时初音模型已经下载完毕

```bash
model:
   use: live2d-widget-model-ni-j # 将`ni-j`替换成其他包名,即可替换不同模型人物.
```

# 资源
[github源码和中文操作指南][3]

# 重新加载博客
```bash
hexo clean
hexo g
打开浏览器看看你的初音吧
```