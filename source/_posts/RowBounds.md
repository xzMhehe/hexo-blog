---
title: 其他分页
date: 2020-07-14 09:10:39
tags:
- MyBatis
categories:
- MyBatis

thumbnail: https://s1.ax1x.com/2020/07/17/UsF3dO.png
---
#### RowBounds分页
面向对象实现,RowBounds分页比较老了解即可,有些老的公司可能还在使用
不再使用SQL实现分页
- 接口
```java
    //RowBounds分页
    List<User> getUserByRowBounds(Map<String, Integer> map);
``` 
- mapper.xml
```xml
    <!--RowBounds分页-->
    <select id="getUserByRowBounds" parameterType="map" resultType="user" resultMap="UserMap">
        select * from mybatis.user
    </select>
```
- 测试
```java
    @Test
    public void getUserByRowBounds() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        //通过RowBounds实现
        RowBounds rowBounds = new RowBounds(1, 3);
        //通过Java代码层面实现分页
        List<User> userList = sqlSession.selectList("cn.com.codingce.dao.UserMapper.getUserByRowBounds", null, rowBounds);
        for (User u : userList
        ) {
            System.out.println(u);
        }
        sqlSession.close();
    }
```

#### 分页插件
![mark](http://image.codingce.com.cn/blog/20200714/094525457.png)
了解即可, 万一以后公司的架构师, 说要使用, 你需要知道他是什么东西!
底层都是相同的.
