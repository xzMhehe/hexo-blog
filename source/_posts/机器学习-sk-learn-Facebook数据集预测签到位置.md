---
title: 机器学习-sk-learn-Facebook数据集预测签到位置
date: 2021-08-13 14:33:34
pin: false
toc: false
tags: [机器学习]
categories: [机器学习]
keywords: [机器学习]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108131436463.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108131436463.png
description: 机器学习-sk-learn-Facebook数据集预测签到位置
---

# sk-learn Facebook数据集预测签到位置

本次比赛的目的是预测一个人将要签到的地方。 为了本次比赛，Facebook创建了一个虚拟世界，其中包括10公里*10公里共100平方公里的约10万个地方。

对于给定的坐标集，我们的任务将根据用户的位置，准确性和时间戳等预测用户下一次的签到位置。 数据被制作成类似于来自移动设备的位置数据。

特征值：“x”, “y”, “accuracy”, “day”, “hour”, “weekday”

目标值： place_id

本实例使用Facebook上统计的数据，根据地点坐标和签到时间等特征来训练模型，最终得到目标地点的ID。训练集与测试集比例为8：2。

在进行数据模型训练时，首先要进行数据预处理

>缩小数据范围：因为数据集有2000W+条数据，程序跑起来会非常慢，因此适当缩小数据范围，如果电脑配置够或者租了服务器请随意~
>选择时间特征：数据中的时间分离出day，hour，weekend
>去掉签到较少的地方：剔除意义不大的特殊地点，减少过拟合
>确定特征值和目标值
>分割数据集

交叉验证：将拿到的训练数据，分为训练和验证集。以下图为例：将数据分成4份，其中一份作为验证集。然后经过4次(组)的测试，每次都更换不同的验证集。即得到4组模型的结果，取平均值作为最终结果。又称4折交叉验证。本实例cv=5，则为5折交叉验证。

```py
def facebook_demo():
    """
    sk-learn Facebook数据集预测签到位置
    :return:
    """
    # 1、获取数据集
    facebook = pd.read_csv('/Users/maxinze/Downloads/机器学xiday2资料/02-代码/FBlocation/train.csv')

    # 2.基本数据处理
    # 2.1 缩小数据范围
    # 选择（2,2.5）这一范围的数据，使用 query
    facebook_data = facebook.query("x>5.0 & x<6 & y>5.0 & y<6.0")

    # 2.2 选择时间特征
    # 提取时间
    time = pd.to_datetime(facebook_data["time"], unit="s")
    time = pd.DatetimeIndex(time)
    # 加一列day
    facebook_data["day"] = time.day
    # 加一列hour
    facebook_data["hour"] = time.hour
    # 加一列weekday
    facebook_data["weekday"] = time.weekday

    # 2.3 去掉签到较少的地方
    # 分组聚类，按数目聚类
    place_count = facebook_data.groupby("place_id").count()
    # 选择签到大于3的
    place_count = place_count[place_count["row_id"] > 3]
    # 传递数据
    facebook_data = facebook_data[facebook_data["place_id"].isin(place_count.index)]
    # facebook_data.shape()

    # 2.4 筛选特征值和目标值
    # 特征值
    x = facebook_data[["x", "y", "accuracy", "day", "hour", "weekday"]]
    # 目标值
    y = facebook_data["place_id"]

    # 2.5 分割数据集（数据集划分） 参数特征值， 目标值
    x_train, x_test, y_train, y_test = train_test_split(x, y, random_state=22)

    # 3.特征工程--特征预处理(标准化)
    # 3.1 实例化一个转换器
    transfer = StandardScaler()
    # 3.2 调用fit_transform
    # 特征训练集
    x_train = transfer.fit_transform(x_train)
    # 特征测试集
    x_test = transfer.fit_transform(x_test)

    # 4.机器学习--knn+cv
    # 4.1 实例化一个估计器
    estimator = KNeighborsClassifier()
    # 4.2 调用gridsearchCV
    # param_grid = {"n_neighbors": [1, 3, 5, 7, 9]}
    param_grid = {"n_neighbors": [5, 7, 9]}
    estimator = GridSearchCV(estimator, param_grid=param_grid, cv=3 )
    # 4.3 模型训练
    estimator.fit(x_train, y_train)

    # 5.模型评估
    # 5.1 基本评估方式
    score = estimator.score(x_test, y_test)
    print("最后预测的准确率为:\n", score)

    y_predict = estimator.predict(x_test)
    print("最后的预测值为:\n", y_predict)
    print("预测值和真实值的对比情况:\n", y_predict == y_test)

    # 5.2 使用交叉验证后的评估方式
    print("在交叉验证中验证的最好结果:\n", estimator.best_score_)
    print("最好的参数模型:\n", estimator.best_estimator_)
    print("每次交叉验证后的验证集准确率结果和训练集准确率结果:\n", estimator.cv_results_)

    return None
```

![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108131432427.png)
![](https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108131432331.png)

因为只选用了部分数据跑代码，所以模型训练后测试的准确率不太高，如果可以选用全部数据跑。


