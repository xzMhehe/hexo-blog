---
title: 第一个MyBatis程序
date: 2020-07-11 10:11:52
tags:
- MyBatis
categories:
- MyBatis

thumbnail: https://s1.ax1x.com/2020/07/17/UsFtWd.jpg
---

 ##  第一个MyBatis程序
 思路: 搭建环境-->导入MyBatis-->编写代码-->测试
 ### 搭建环境
 搭建数据库

 ### 新建项目
 - 新建一个普通的maven项目
 - 删除src目录
 - 导入maven依赖
 ```xml
    <!--导入依赖-->
    <dependencies>
        <!--mybatis-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.4.5</version>
        </dependency>
        <!--mysql驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.46</version>
        </dependency>
        <!--junit-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
    </dependencies>
 ```

### 创建一个模块
- 编写mybatis的核心配置文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="org/mybatis/example/BlogMapper.xml"/>
  </mappers>
</configuration>
```
- 编写mybatis的工具类
```java
//sqlSessionFactory->sqlSession
public class MybatisUtils {

    private static SqlSessionFactory sqlSessionFactory;
    static {

        try {
            //使用Mybatis第一步:获取sqlSessionFactory对象
            String resource = "org/mybatis/example/mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //既然有了 SqlSessionFactory,顾名思义,我们可以从中获得 SqlSession 的实例.SqlSession 提供了在数据库执行 SQL 命令所需的所有方法.你可以通过 SqlSession 实例来直接执行已映射的 SQL 语句.例如：
    public static SqlSession getSession() {
//        SqlSession sqlSession = sqlSessionFactory.openSession();
//        return sqlSession;
        return sqlSessionFactory.openSession();
    }
}
```
- 编写代码
    - 实体类
    - Dao接口
```java
public interface UserDao {
    List<User> getUserList();
}
```
- 接口实现类由原来的UserDaoImpl转变为一个Mapper配置文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--namespace=绑定一个对应的Dao/Mapper接口-->
<mapper namespace="cn.com.codingce.dao.UserDao">
<!--查询语句   id和接口方法一一对应-->
<select id="getUserList" resultType="cn.com.codingce.pojo.User">
    select * from mybatis.user
</select>
</mapper>
<!--相当于UserDaoImpl

-->
```
### 测试
>org.apache.ibatis.binding.BindingException: Type interface cn.com.codingce.dao.UserDao is not known to the MapperRegistry.

这个错会经常遇到

```java
    @Test
    public void test() {
        //第一步: 获得SqlSession对象
        SqlSession sqlSession = MybatisUtils.getSqlSession();

        try {
            //方式一:getMapper
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            List<User> userList = userDao.getUserList();
            //方式二:
//            List<User> userList = sqlSession.selectList("cn.com.codingce.dao.UserDao.getUserList");

            for (User u:userList
            ) {
                System.out.println(u);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //关闭sqlSession
            sqlSession.close();
        }
    }
```
可能遇到的问题:
- 配置文件没有注册
- 绑定接口错误
- 方法名不对
- 返回类型不对
- Maven导出资源问题

### CRUE
#### namespace
namespace中的包名要和Dao/mapper接口包名一致
#### select
选择,查询语句:
- id: 就是对应的namespace中的方法名
- resultType: Sql语句执行的返回值! 
- parameterType: 参数类型!
```java
    @Test
    public void getUserById() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserMapper userDao = sqlSession.getMapper(UserMapper.class);
            List<User> userList = userDao.getUserList();
            User user = userDao.getUserById(1);
            System.out.println(user);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            sqlSession.close();
        }
    }
```
- 插入一条数据
```java
    //insert一个用户
    int addUser(User user);

    //注解插入  就不用使用mapper配置
    @Insert("insert into mybatis.user(id, name, pwd) values (#{id}, #{name}, #{pwd})")
    int insertUser(User user);

    <!--插入, 对象中的属性可以直接取出来-->
    <insert id="addUser" parameterType="cn.com.codingce.pojo.User">
        insert into mybatis.user(id, name, pwd) values (#{id}, #{name}, #{pwd})
    </insert>
    @Test
    public void addUser() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        int i = userMapper.addUser(new User(5, "123", "123456"));
        System.out.println(i);
        //提交事务
        sqlSession.commit();
        sqlSession.close();
    }

```

- 修改用户
```java
    //修改
    int updateUser(User user);
    <!--修改-->
    <update id="updateUser" parameterType="cn.com.codingce.pojo.User">
        update mybatis.user set name = #{name}, pwd = #{pwd} where id = #{id}
    </update>

    @Test
    public void updateUser() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        int res = userMapper.updateUser(new User(5, "bytedance", "123456"));
        if (res > 0) {
            System.out.println("修改成功");
        }
        //提交事务
        sqlSession.commit();
        sqlSession.close();
    }
```
- 删除用户
```java
    //删除
    int deleteUser(int id);

    <!--删除-->
    <delete id="deleteUser" parameterType="int">
        delete from mybatis.user where id = #{id}
    </delete>

    @Test
    public void deleteUser() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        int res = userMapper.deleteUser(4);
        if (res > 0) {
            System.out.println("删除成功");
        }
        sqlSession.commit();
        sqlSession.close();
    }

```

**注意点:增删改需要提交事务**

### 分析错误
- 标签不要匹配错误
- resource绑定mapper, 需要使用路径
- 程序配置文件必须符合规范
- NullPointerException, 没有注册资源
- 输出的xml文件存在中文乱码问题
- maven资源导出问题

### 万能的Map
```java
    User getUserByIdTwo(Map<String, Object> map);

    <!--查询Map-->
    <select id="getUserByIdTwo" parameterType="map" resultType="cn.com.codingce.pojo.User">
        select * from mybatis.user where id = #{id} and name = #{name}
    </select>

    @Test
    public void getUserByIdTwo() {
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        try {
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            HashMap<String, Object> map = new HashMap<String, Object>();
            map.put("id", 1);
            map.put("name", "掌上编程");
            User user = userMapper.getUserByIdTwo(map);
            System.out.println(user);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            sqlSession.close();
        }
    }

```
若实体类或者数据库中的表字段或者参数过多,我们应当考虑使用Map parameterType="map"
对象传递参数,直接在sql中取对象的属性即可  parameterType="object"
只有一个基本类型参数的情况下, 可以直接在sql中取到   parameterType="int" 可以不写
多个参数用Map, 或者注解

### 模糊查询
- Java代码执行的时候, 传递通配符%%
>List<User> userList = userMapper.getUserListLike("%掌%");

- 在sql拼接使用通配符
>select * from mybatis.user where name like "%"#{name}"%"

### 配置解析
#### 核心配置文件
- mybatis-config.xml(官方建议使用这个名字)
- mybatis的配置文件包含了会深深影响Mybatis行为设置和属性信息
```
configuration（配置）
properties（属性）
settings（设置）
typeAliases（类型别名）
typeHandlers（类型处理器）
objectFactory（对象工厂）
plugins（插件）
environments（环境配置）
environment（环境变量）
transactionManager（事务管理器）
dataSource（数据源）
databaseIdProvider（数据库厂商标识）
mappers（映射器）
```

#### 环境配置(environments)
MyBatis 可以配置成适应多种环境
**不过要记住：尽管可以配置多个环境,但每个 SqlSessionFactory 实例只能选择一种环境.**
学会使用配置多套运行环境
**Mybatis默认的事务管理器就是JDBC, 连接池POOLED**

#### 属性(properties)
我们可以通过properties属性来实现引用配置文件
这些属性可以在外部进行配置,并可以进行动态替换.你既可以在典型的 Java 属性文件中配置这些属性,也可以在 properties 元素的子元素中设置.(db.properties)

```xml

    <!--内部-->
    <properties resource="org/mybatis/example/config.properties">
        <property name="username" value="dev_user"/>
        <property name="password" value="F2Fa3!33TYyg"/>
    </properties>

    <!--优先使用外部引入  引入外部配置文件-->
    <properties resource="db.properties" />

    driver=com.mysql.jdbc.Driver
    url=jdbc:mysql://cdb-q9atzwrq.bj.tencentcdb.com:1067/mybatis?useSSL=true&amp;useUnicode=true
    username=root
    password=123456
```

#### 类型别名（typeAliases）
- 类型别名可为 Java 类型设置一个缩写名字. 它仅用于 XML 配置,意在降低冗余的全限定类名书写.
```xml
<typeAliases>
  <typeAlias alias="Author" type="domain.blog.Author"/>
  <typeAlias alias="Blog" type="domain.blog.Blog"/>
  <typeAlias alias="Comment" type="domain.blog.Comment"/>
  <typeAlias alias="Post" type="domain.blog.Post"/>
  <typeAlias alias="Section" type="domain.blog.Section"/>
  <typeAlias alias="Tag" type="domain.blog.Tag"/>
</typeAliases>
当这样配置时,Blog 可以用在任何使用 domain.blog.Blog 的地方.
```

也可以指定一个包名,MyBatis 会在包名下面搜索需要的 Java Bean
每一个在包 domain.blog 中的 Java Bean,在没有注解的情况下,会使用 Bean 的首字母小写的非限定类名来作为它的别名. 比如 domain.blog.Author 的别名为 author；若有注解,则别名为其注解值.
```xml
<typeAliases>
  <package name="domain.blog"/>
</typeAliases>
```
实体类少的时候使用第一种, 实体类多的时候使用第二种
第一种可以DIY别名,第二种则不行, 如果非要改, 需要在实体类上增加注解
使用注解
```java
@Alias("author")
public class Author {
    ...
}
```
#### 设置
这是Mybatis中极为重要的调整设置, 他们会改变Mybatis的运行行为
>cacheEnabled   全局性地开启或关闭所有映射器配置文件中已配置的任何缓存.    true | false    true
lazyLoadingEnabled  	延迟加载的全局开关.当开启时,所有关联对象都会延迟加载. 特定关联关系中可通过设置 fetchType 属性来覆盖该项的开关状态.  true | false    true
logImpl 指定 MyBatis 所用日志的具体实现,未指定时将自动查找 SLF4J | LOG4J | LOG4J2 | JDK_LOGGING | COMMONS_LOGGING | STDOUT_LOGGING | NO_LOGGING    未设置

#### 其他配置
- typeHandlers（类型处理器）
- objectFactory（对象工厂）
- plugins（插件）

#### 映射器（mappers）
既然 MyBatis 的行为已经由上述元素配置完了,我们现在就要来定义 SQL 映射语句了. 但首先,我们需要告诉 MyBatis 到哪里去找到这些语句. 在自动查找资源方面,Java 并没有提供一个很好的解决方案,所以最好的办法是直接告诉 MyBatis 到哪里去找映射文件. 你可以使用相对于类路径的资源引用,或完全限定资源定位符（包括 file:/// 形式的 URL）,或类名和包名等.
```xml
<!-- 使用相对于类路径的资源引用 推荐使用-->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
<!-- 使用完全限定资源定位符（URL） 不建议使用-->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>
<!-- 使用映射器接口实现类的完全限定类名   
接口和他的Mapper配置文件必须同名! 
接口和他的Mapper配置文件必须在同一个包下-->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
<!-- 将包内的映射器接口实现全部注册为映射器 
接口和他的Mapper配置文件必须同名! 接口和他的Mapper配置文件必须在同一个包下-->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>

```

#### 生命周期和作用域
生命周期和作用域是至关重要, 因为错误的使用会导致严重的**并发问题**.
##### SqlSessionFactoryBuilder
- 一旦创建了 SqlSessionFactory，就不再需要它了
- 局部变量
##### SqlSessionFactory
- 说白了可以想象为: 数据库连接池
- 一旦被创建就应该在应用的运行期间一直存在，**没有任何理由丢弃它或重新创建另一个实例**(多次重建 SqlSessionFactory 被视为一种代码“坏习惯”)
##### SqlSession
- 连接到连接池的一个请求
- SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域
- 用完之后赶紧关闭, 否则资源占用

![mark](http://image.codingce.com.cn/blog/20200712/173037493.png)









>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java