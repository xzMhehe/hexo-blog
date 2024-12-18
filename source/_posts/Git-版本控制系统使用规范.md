---
title: Git 版本控制系统使用规范
date: 2021-01-14 11:16:05
tags:
- Git
categories: 
- Git
---


### 前言

Git 版本控制系统使用规范旨在帮助每一个人规范操作流程，杜绝因随意操作致使的版本控制错误，从而提高工作效率。

### 目录

### 分支说明

- master 长期稳定分支，该分支不可直接提交代码，仅允许仅严格测试通过后的代码合并过来到主干分支。若长期稳定分支出现错误，须在长期稳定分支上创建以bug-error-name格式创建新的分支，错误修复后，在合并到master分支。
- develop 长期开发分支，该分支代码代码主要来自于feature-name格式创建的分支，在每个新功能开发完成后，经严格测试后，合并到develop分支，并做系统继承测试，系统集成测试通过后，发布版本，并合并到master分支上。
- bug 错误分支，该分支大多数情况下是修复master分支上面的错误，在错误修复完成后，在合并回master分支。

[点击查看](http://www.ruanyifeng.com/blog/2012/07/git.html)Git分支管理策略详情

### 提交要求

1. 每个小功能完成后请求提交一次，不可好多功能开发完成后才进行提交。比如：学员管理功能包括添加、修改、删除等小功能，再每个小功能开发、测试完成后，须提交代码到版本控制。
2. 每次提交代码必须填写代码提交说明，代码提交说明格式如下：
   - 添加新功能。格式： A 提交说明
   - 修改已有功能。格式：F  提交说明
   - 删除已有功能。格式：D  提交说明
### 合并要求
1. 若出现冲突，在合并代码时必须联系对应的开发者，一起进行合并。

### 使用流程
1. 更新代码
2. 提交代码
3. 更新代码
4. 推送代码



>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java