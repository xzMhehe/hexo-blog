---
title: Mybatis中的属性名和字段名
date: 2020-07-12 17:20:36
tags:
- MyBatis
categories: 
- MyBatis

thumbnail: https://s1.ax1x.com/2020/07/17/UsF3dO.png
---
### 解决属性名和字段名不一致问题

#### 问题

数据库中的字段

![mark](http://image.codingce.com.cn/blog/20200712/172605242.png)

新建一个项目，拷贝之前，测试实体类字段不一致的情况

```java
public class User {
    private int id;
    private String name;
    private String password;
}
```

测试出现问题

![mark](http://image.codingce.com.cn/blog/20200712/170559295.png)

```xml
select * from mybatis.user where id = #{id}
类型处理器
select id, name, pwd from mybatis.user where id = #{id}
```

解决方案

- 起别名      

  ```xml
   <select id="getUserById" parameterType="int" resultType="cn.com.codingce.pojo.User">
          select id, name, pwd as password from mybatis.user where id = #{id}
      </select>
  ```

- resultMap

  结果集映射

  id	name	pwd

  id	name	password

  ```xml
    <!--结果集映射-->
      <resultMap id="UserMap" type="User">
          <!--colum数据库中的字段, property实体类中的属性-->
          <!-- <result column="id" property="id"/>
          <result column="name" property="name"/> -->
          <result column="pwd" property="password"/>
  
      </resultMap>
  
      <!--查询-->
      <select id="getUserById" parameterType="int" resultMap="UserMap">
          select * from mybatis.user where id = #{id}
      </select>
  ```

- ```resultMap```元素是MyNatis中最强大的元素
- ResultMap 的设计思想是，对简单的语句做到零配置，对于复杂一点的语句，只需要描述语句之间的关系就行了.
- ResultMap 的优秀之处——你完全可以不用显式地配置它们.
- 如果这个世界总是这么简单就好了.

![mark](http://image.codingce.com.cn/blog/20200713/061849013.png)