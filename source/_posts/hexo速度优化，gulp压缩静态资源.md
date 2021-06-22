---
title: hexo速度优化，gulp压缩静态资源
date: 2020-08-11 08:36:17
tags:
- 随记
categories:
- 随记

---

# 起因
自己博客插件加多了之后,感觉访问速度慢了些, 找了一些优化方法
- 少发送请求
把要加载的js文件（css文件同理）合并成一个（尽量少）文件，则可以向服务器少发送请求，从而减少等待时间。(前端不是很懂,太麻烦了,我只采用压缩文件这个方法)

- 压缩文件
使用压缩之后的js、css、img、html等静态资源文件，同样可以减少请求时间。(虽然html文件压缩对小网站意义不大,详见HTML代码到底该不该压缩, 但还是压一压吧TuT)

- js／css位置
css引用建议放在head标签里面；js脚本建议放到body内容的最后，原因：等待js加载或者脚本有错误的时候不会影响html页面的展示。

这里顺便说我的一点教训, 在给自己的博客添加或测试各种插件时,不保证在不同版本以及不同系统一定能成功,一定要做好备份, 备份, 备份 !即使那个插件把自己博客弄崩溃了, 我们还是能从备份中恢复过来, 更可以大胆地去做尝试了.
# 插件安装
- 安装gulp工具
*$ npm install --global gulp*
- ![mark](http://image.codingce.com.cn/blog/20200811/083940539.png)

- 实现gulp压缩需要安装以下五个模块
>gulp-htmlclean // 清理html
gulp-htmlmin // 压缩html
gulp-minify-css // 压缩css
gulp-uglify // 混淆js
gulp-imagemin // 压缩图片

安装命令: *npm install gulp-htmlclean gulp-htmlmin gulp-minify-css gulp-uglify gulp-imagemin --save*

- 添加系统环境变量, 将步骤1图红框的路径添加进Path中, 注意Users后面是你自己的用户名
![mark](http://image.codingce.com.cn/blog/20200811/084059097.png)

- 重启Git, 在博客根目录下安装开发依赖: $ npm install --save-dev gulp
在站点根目录下新建gulpfile.js文件，内容如下：
```java
var gulp = require('gulp');

//Plugins模块获取
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
//压缩css
gulp.task('minify-css', function () {
return gulp.src('./public/**/*.css')
.pipe(minifycss())
.pipe(gulp.dest('./public'));
});
//压缩html
gulp.task('minify-html', function () {
return gulp.src('./public/**/*.html')
.pipe(htmlclean())
.pipe(htmlmin({
removeComments: true,
minifyJS: true,
minifyCSS: true,
minifyURLs: true,
}))

.pipe(gulp.dest('./public'))
});
//压缩js 不压缩min.js
gulp.task('minify-js', function () {
return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
.pipe(uglify())
.pipe(gulp.dest('./public'));
});

//4.0以前的写法 
//gulp.task('default', [
  //  'minify-html', 'minify-css', 'minify-js'
//]);
//4.0以后的写法
// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.parallel('minify-html', 'minify-css', 'minify-js', function() {
  // Do something after a, b, and c are finished.
}));
```

# 使用
命令：
>hexo clean
hexo generate
gulp default     //压缩js、css、img等文件, default是上面gulpfile.js合并任务的任务名
hexo deploy
