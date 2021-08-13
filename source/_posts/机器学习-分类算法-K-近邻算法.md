---
title: 分类算法-K-近邻算法
date: 2021-08-13 08:13:20
pin: false
toc: false
tags: [机器学习]
categories: [机器学习]
keywords: [机器学习]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202108130815581.jpg
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202108130815581.jpg
description: 机器学习-分类算法-K-近邻算法
---

# 目标
- 说明K-近邻算法的距离公式

- 说明K-近邻算法的超参数K值以及取值问题

- 说明K-近邻算法的优缺点

- 应用KNeighborsClassifier实现分类

- 了解分类算法的评估标准准确率

- 应用：Facebook签到位置预测


# K-近邻算法(KNN)
## 定义
如果一个样本在特征空间中的k个最相似(即特征空间中最邻近)的样本中的大多数属于某一个类别，则该样本也属于这个类别，即由你的“邻居”来推断出你的类别

>来源：KNN算法最早是由Cover和Hart提出的一种分类算法

## 距离公式
两个样本的距离可以通过如下公式计算，又叫欧式距离

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202108130819435.png)

曼哈顿距离 绝对值距离

明可夫斯基距离

# 电影类型分析
假设我们有现在几部电影

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202108130827721.png)

其中？ 号电影不知道类别，如何去预测？我们可以利用K近邻算法的思想

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202108130828409.png)


## 问题
如果取的最近的电影数量不一样？会是什么结果？

k 值取值过大，样本不均衡的影响      
k 值取值过小，容易受到异常点影响

结合前面的约会对象数据，分析k-近邻算法需要做怎么样的处理

无量纲化的处理

推荐 标准还


## K-近邻算法数据的特征工程处理
结合前面的约会对象数据，分析K-近邻算法需要做什么样的处理

# K-近邻算法API
- sklearn.neighbors.KNeighborsClassifier(n_neighbors=5,algorithm='auto')
    
    - n_neighbors：int,可选（默认= 5），k_neighbors查询默认使用的邻居数
    
    - algorithm：{‘auto’，‘ball_tree’，‘kd_tree’，‘brute’}，可选用于计算最近邻居的算法：‘ball_tree’将会使用 BallTree，‘kd_tree’将使用 KDTree。‘auto’将尝试根据传递给fit方法的值来决定最合适的算法。 (不同实现方式影响效率)


# 案例1 鸢尾花种类预测

## 数据集介绍
Iris数据集是常用的分类实验数据集，由Fisher, 1936收集整理。Iris也称鸢尾花卉数据集，是一类多重变量分析的数据集。关于数据集的具体介绍：

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202108130903213.png)


## 步骤
- 获取数据

- 数据集划分

- 特征工程
  
  - 标准化

- 机器学习训练 KNN 预估器流程

- 模型评估



## 代码
```py

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler


def knn_iris():
    # 1) 获取数据
    iris = load_iris()

    # 2) 数据集划分
    x_train, x_test, y_train, y_test = train_test_split(iris.data, iris.target, random_state=22)

    # 3) 特征工程 标准化
    transfer = StandardScaler()
    # 训练集做标准化
    x_train = transfer.fit_transform(x_train)

    # 测试集 标准化 转化
    x_test = transfer.transform(x_test)

    # 4) KNN 预估器流程
    estimator = KNeighborsClassifier(n_neighbors=3)

    estimator.fit(x_train, y_train)

    # 5) 模型评估
    # 方法一：直接比对真实值和预测值

    y_predict = estimator.predict(x_test)

    print("预测(y_predict):\n", y_predict)
    print("直接比对真实值和预测值:\n", y_test == y_predict)

    # 方法二：计算准确率
    score = estimator.score(x_test, y_test)

    print("准确率为:\n", score)

    return None


if __name__ == '__main__':
    knn_iris()
```

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img202108130900431.png)




# K-近邻总结
## 优点
简单，易于理解，易于实现，无需训练
## 缺点
- 懒惰算法，对测试样本分类时的计算量大，内存开销大

- 必须指定K值，K值选择不当则分类精度不能保证

- 使用场景：小数据场景，几千～几万样本，具体场景具体业务去测试






















