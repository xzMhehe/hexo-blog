---
title: MyBatis-Plus
date: 2020-10-05 10:15:23
tags:
---
![mark](http://image.codingce.com.cn/blog/20201006/144630065.png)
## MyBatis-Plus
是什么？
https://baomidou.com/#/
Mybatis-Plus（简称MP）是一个 Mybatis 的增强工具，在 Mybatis 的基础上只做增强不做改变，为简化开发、提高效率而生。这是官方给的定义，关于mybatis-plus的更多介绍及特性，可以参考mybatis-plus官网。那么它是怎么增强的呢？其实就是它已经封装好了一些crud方法，我们不需要再写xml了，直接调用这些方法就行，就类似于JPA。

## 特性
- **无侵入** ：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑
- **损耗小** ：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作, BaseMapper
- **强大的 CRUD 操作** ：内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求, 以后的简单的增删改查, 它不用自己写了!
- **支持 Lambda 形式调用** ：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错
- **支持主键自动生成** ：支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题
- **支持 ActiveRecord 模式** ：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行强大的 CRUD 操作
- **支持自定义全局通用操作** ：支持全局通用方法注入（ Write once, use anywhere ）
- **内置代码生成器** ：采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、 Controller 层代码，支持模板引擎，更有超多自定义配置等您来使用,可插拔的方式（自动帮你生成代码）
- **内置分页插件** ：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询
- **分页插件支持多种数据库** ：支持 MySQL、MariaDB、Oracle、DB2、H2、HSQL、SQLite、Postgre、SQLServer 等多种数据库
- **内置性能分析插件** ：可输出 Sql 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出慢查询
- **内置全局拦截插件** ：提供全表 delete 、 update 操作智能分析阻断，也可自定义拦截规则，预防误操作

## 快速入门
地址: https://baomidou.com/guide/quick-start.html
使用第三方组件
- 导入对应依赖
- 研究如何让编写配置
- 代码如何编写
- 提高拓展

### 步骤
#### 创建数据库    
mybatis_plus
#### 创建 user表

```sql
DROP TABLE IF EXISTS user;

CREATE TABLE user
(
	id BIGINT(20) NOT NULL COMMENT '主键ID',
	name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
	age INT(11) NULL DEFAULT NULL COMMENT '年龄',
	email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
	PRIMARY KEY (id)
);

真实开发过程中, version（乐观锁）、delete（逻辑删除）、gmt_create、gm_modified
```
其对应的数据库 Data 脚本如下：
```sql
DELETE FROM user;

INSERT INTO user (id, name, age, email) VALUES
(1, 'Jone', 18, 'test1@baomidou.com'),
(2, 'Jack', 20, 'test2@baomidou.com'),
(3, 'Tom', 28, 'test3@baomidou.com'),
(4, 'Sandy', 21, 'test4@baomidou.com'),
(5, 'Billie', 24, 'test5@baomidou.com');
```
 
#### 创建SpringBoot项目
mybatis_plus

#### 导入依赖
```xml
<!--数据库驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <!--mybatis-plus-boot-starter是自己开发的, 并非官方-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.0.5</version>
        </dependency>
```

说明: 我们使用mybatis-plus可以节省我们大量代码, 尽量不要导入mybtis和mybatis-plus! 版本差异

#### 连接数据库
```yml
spring.datasource.username=root
spring.datasource.data-password=123456
spring.datasource.url=jdbc:mysql://cdb-q9atzwrq.bj.tencentcdb.com:10167/mybatis_plus?useSSL=false&amp;useUnicode=true&characterEncoding=UTF-8&serverTimezone=GMT%2B8
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
## serverTimezone=GMT 时区 8.0以上版本需要添加否则会报错
```

#### 传统项目结构对比使用mybatis-plus之后
- pojo-dao(连接mybatis, 配置mapper.xml文件)service-controller
- 使用mybatis-plus之后
    - pojo
    - mapper接口
    ```java
package cn.com.codingce.mapper;

import cn.com.codingce.pojo.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * 在对应的Mapper上实现基本接口BaseMapper
 * @author xzMa
 */
@Mapper
@Repository
public interface UserMapper extends BaseMapper<User> {
    //所有的CRUD操作都已经编写完成
}
    ```
    - 使用
    ```java
package cn.com.codingce;

import cn.com.codingce.mapper.UserMapper;
import cn.com.codingce.pojo.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class MybatisPlusApplicationTests {

    @Autowired
    private UserMapper userMapper;

    /*
    wrapper条件构造器, 这里我们先不用 null
    //查询全部用户
     */
    @Test
    void contextLoads() {
        List<User> users = userMapper.selectList(null);
        users.forEach(System.out::println);
    }

}
    ```

### 思考问题
- SQL谁帮我们写好了?    MyBatis-Plus都写好了
方法哪里来?     MyBatis-Plus都写好了


## 配置日志
我们所有的SQL是不可见的, 我们希望知道它是怎么执行的, 所以我们必须要看日志
(真正上线, 在下)
```yml
## 配置日志
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

## CRUD拓展
### Insert
```java
    @Test
    void testInsert() {
        User user = new User();
        user.setName("掌上编程");
        user.setAge(19);
        user.setEmail("2460798168@qq.com");
        userMapper.insert(user);
    }
```

>数据库插入的id的默认值为：全局的唯一id

### 主键的策略
分布式系统唯一id生成：
```java
默认
    @TableId(type = IdType.ID_WORKER)
    private Long id;
```

**雪花算法**：snowflake是Twitter开源的分布式ID生成算法，结果是一个long型的ID。其核心思想是：使用41bit作为毫秒数，10bit作为机器的ID（5个bit是数据中心，5个bit的机器ID），12bit作为毫秒内的流水号（意味着每个节点在每毫秒可以产生 4096 个 ID），最后还有一个符号位，永远是0。具体实现的代码可以参看https://github.com/twitter/snowflake。

>主键自增

我们需要配置主键自增
- 实体类字段上     @TableId(type = IdType.AUTO)
- 数据库字段一定要自增!

- 再次测试插入即可

其他源码检测
```java
public enum IdType {
    AUTO(0),    //数据库id自增
    NONE(1),    //未设置主键
    INPUT(2),   //手动输入
    ID_WORKER(3),//默认的全局id
    UUID(4),    //全局唯一id   uuid
    ID_WORKER_STR(5);   //ID_WORKER 字符串表示法

    private int key;

    private IdType(int key) {
        this.key = key;
    }

    public int getKey() {
        return this.key;
    }
}
```

### 更新操作
```java
    @Test
    void testUpdate() {
        User user = new User();
        //通过条件自动拼接动态sql
        user.setId(1L);
        user.setEmail("21211@qq.com");
        int i = userMapper.updateById(user);
        System.out.println(i);
    }
```

### 自动填充
创建时间、更改时间! 这些操作一遍都是自动化完成的, 我们不希望手动更新！ 
阿里巴巴开发手册：所有的数据表:gm_create、 gmt_modified 几乎所有的表都需要配置上！而且需要自动化!

#### 方式一 数据库级别
- 在表中新增字段create_time、 update_time

![mark](http://image.codingce.com.cn/blog/20201006/203803878.png)
```java
package cn.com.codingce.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author xzMa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer age;
    private String email;
    private Date createTime;
    private Date updateTime;

}

```



#### 方式二：代码级别
数据库的时间默认值去掉

直接在实体类中
```java
package cn.com.codingce.pojo;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author xzMa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer age;
    private String email;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

}
```

**MyMetaObjectHandler**
```java
package cn.com.codingce.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 自己写的处理器
 * @author xzMa
 */
@Slf4j
@Component  //一定不要把我们的处理器加到IOC中
public class MyMetaObjectHandler implements MetaObjectHandler {
    //插入时的填充策略
    @Override
    public void insertFill(MetaObject metaObject) {
        log.info("Start insert fill ...");
        //String fieldName, Object fieldVal, MetaObject metaObject
        this.setFieldValByName("createTime", new Date(), metaObject);
        this.setFieldValByName("updateTime", new Date(), metaObject);
    }

    //更新时的填充策略
    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("Start update fill ...");
        this.setFieldValByName("updateTime", new Date(), metaObject);
    }
}
```

### 乐观锁
在面试过程中, 我们经常会被问到的乐观锁, 悲观锁! 这个其实非常简单!

>乐观锁：乐观锁（ Optimistic Locking ） 相对悲观锁而言，乐观锁假设认为数据一般情况下不会造成冲突，所以在数据进行提交更新的时候，才会正式对数据的冲突与否进行检测，如果发现冲突了，则让返回用户错误的信息，让用户决定如何去做。
故名思意十分乐观, 它总是认为不会出现问题, 无论干什么都不去上锁! 如果出现问题, 再次更新新值测试(version  new version)

>悲观锁:故名思意十分悲观, 它总认为总是出现问题, 无论干什么都会上锁! 再去操作!

乐观锁机制:
- 取出记录记录, 获取当前version
- 更新时, 带上这个version
- 执行更新时, set version = new Version where version = oldVersion
- 如果version不对, 就更新失败

```sql
---A
update user set name = "zhangshangbiancheng", version = version + 1
where id = 2 and version = 1

---B 线程抢先完成, 这个时候 version = 2 会导致A修改失败!
update user set name = "zhangshangbiancheng", version = version + 1
where id = 2 and version = 1
```

#### 测试MP乐观锁插件
- 给数据库中添加version字段
![](http://image.codingce.com.cn/blog/20201006/220733613.png)

- 我们对实体类添加对应的字段
```java
    @Version    //乐观锁Version注解
    private Integer version;
```
- 注册组件
```java
package cn.com.codingce.config;

import com.baomidou.mybatisplus.extension.plugins.OptimisticLockerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement    //扫描我们的mapper文件夹
@MapperScan("cn.com.codingce.mapper")
@Configuration  //配置类
public class MyBatisPlusConfig {

    //注册乐观锁插件
    @Bean
    public OptimisticLockerInterceptor optimisticLockerInterceptor() {
        return new OptimisticLockerInterceptor();
    }

}
```

- 测试
```java
    @Test
    void testOptimisticLocker() {
        //查询用户信息
        User user = userMapper.selectById(1L);
        //修改用户信息
        user.setName("xzMhehe");
        user.setEmail("codingce@ce.com");
        //执行更新操作
        userMapper.updateById(user);
    }

    /**
     * 测试乐观锁失败  多线程下
     */
    @Test
    void testOptimisticLocker2() {
        //线程1
        User user = userMapper.selectById(1L);
        user.setName("xzMhehe111");
        user.setEmail("codingce@ce.com");

        //模拟另外一个线程执行了插队操作
        User user2 = userMapper.selectById(1L);
        user2.setName("xzMhehe222");
        user2.setEmail("codingce@ce.com");
        userMapper.updateById(user2);

        //自旋锁来多次尝试提交
        userMapper.updateById(user);    //如果没有乐观锁就会覆盖插队线程的值！
    }
```


### 查询操作
```java
    @Test
    public void select() {
        User user = userMapper.selectById(1L);
        System.out.println(user);
    }

    @Test
    public void selectBatchIds() {
        List<User> users = userMapper.selectBatchIds(Arrays.asList(1L, 2L, 3L));
        users.forEach(System.out::println);
    }

    //条件查询 map
    @Test
    public void testSelectByBathIds() {
        HashMap<String, Object> map = new HashMap<>();
        //自定义要查询
        map.put("name", "xzMhehe222");
        map.put("age", 12);

        List<User> userList = userMapper.selectByMap(map);
        userList.forEach(System.out::println);
    }
```

### 分页查询
分页在网站使用的十分之多
- 原始的limit进行分页
- pageHelper第三方插件
- MP其实也内置了分页插件

>如何使用    

配置拦截器组件
```java
//Spring boot方式
@Configuration
@MapperScan("com.baomidou.cloud.service.*.mapper*")
public class MybatisPlusConfig {

    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }
}
```
- 直接使用Page插件即可

```java
    /**
     * 测试分页
     */
    @Test
    public void testPage() {
        //current参数一：当前页
        //参数二：页面大小
        Page<User> page = new Page<>(1, 5);
        IPage<User> userIPage = userMapper.selectPage(page, null);

        page.getRecords().forEach(System.out::println);
    }
```

### 基本删除操作
```java
    //真删
    @Test
    public void testDelete() {
        userMapper.deleteById(1L);
    }


    //批量删除
    @Test
    public void testDeleteBatchId() {
        userMapper.deleteBatchIds(Arrays.asList(1L, 2L, 3L));
    }

    //通过map删除
    @Test
    public void testDeleteMap() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("name", "xzMhehe");
        userMapper.deleteByMap(map);
    }
```

我们在工作中会遇到一些问题：逻辑删除

### 逻辑删除
>物理删除：从数据库中直接删除
逻辑删除：在数据库中没有移除，而是通过一个变量让他失效！ deleted = 0 =>deleted = 1
管理员可以查看删除记录！防止数据丢失，类似于回收站


- 在数据库中添加deleted字段
![](http://image.codingce.com.cn/blog/20201011/094331687.png)

- 在实体类中添加属性
```java
    @TableField //逻辑删除
    private Integer deleted;
```



- 配置
```java
    //逻辑删除组件
    @Bean
    public ISqlInjector sqlInjector() {
        return new LogicSqlInjector();
    }
```

```yml
mybatis-plus.global-config.db-config.logic-delete-value=1
mybatis-plus.global-config.db-config.logic-not-delete-value=0
```
![](http://image.codingce.com.cn/blog/20201011/100107803.png)

### 性能分析插件
在平时开发中, 会遇到一些慢sql. 测试！druid
MP也提供性能分析插件, 如果超过这个时间停止运行！

- 导入插件
```java
    @Bean
    @Profile({"dev", "test"})   //设置 dev text 环境开启, 保障我们的效率
    public PerformanceInterceptor performanceInterceptor() {
        PerformanceInterceptor performanceInterceptor = new PerformanceInterceptor();
        //  在工作中, 不允许用户等待
        performanceInterceptor.setMaxTime(500);    //ms 设置sql执行的最大时间, 如果超过了则不执行
        performanceInterceptor.setFormat(true); //开启格式化输出
        return performanceInterceptor;
    }
```
- 测试使用
![](http://image.codingce.com.cn/blog/20201011/110911588.png)

### 条件构造器
十分重要 Wrapper
![](http://image.codingce.com.cn/blog/20201012/103127618.png)

- 测试1
```java
    @Test
    void contextLoads() {
        //查询条件name和邮箱不为空的用户, 年龄大于等于12的用户
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.isNotNull("name")
                .isNotNull("email")
                .ge("age", 12);
        userMapper.selectList(wrapper).forEach(System.out::println); //对比Map
    }
```
- 测试2
```java
@Test
    public void Test() {
        //查询名字 后端码匠
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("name", "后端码匠");
        userMapper.selectList(wrapper).forEach(System.out::println);
    }
```

```java
    @Test
    public void Test3() {
        //年龄在20~30岁之间的人
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.between("age", 20, 30);
        Integer count = userMapper.selectCount(wrapper);
        System.out.println(count);
        userMapper.selectList(wrapper).forEach(System.out::println);
    }

    @Test
    public void Test4() {
        //名字中不包含
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.notLike("name", "e")
                .likeRight("email", "t");   //左和右   %t%         likeRight("email", "t")         t%
        List<Map<String, Object>> maps = userMapper.selectMaps(wrapper);
        maps.forEach(System.out::println);
    }

    @Test
    public void Test5() {
        //id在子查询查出来
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.inSql("id", "select id from user where id < 3");
        List<Map<String, Object>> maps = userMapper.selectMaps(wrapper);
        maps.forEach(System.out::println);
    }

    @Test
    public void Test6() {
        //排序
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("id");
        List<Map<String, Object>> maps = userMapper.selectMaps(wrapper);
        maps.forEach(System.out::println);
    }
```

### 代码自动生成器
dao pojo service controller 都是自动生成

```java
package cn.com.codingce.generator;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.po.TableFill;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

import java.util.ArrayList;

public class CodeGenerator {
    public static void main(String[] args) {

        // 1、创建代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 2、全局配置
        GlobalConfig gc = new GlobalConfig();
        //当前的项目路径
        String projectPath = System.getProperty("user.dir");
        //所有代码都会生成到     /src/main/java  路径下
        gc.setOutputDir(projectPath + "/src/main/java");
        gc.setAuthor("小马Coding");
        gc.setOpen(false); //生成后是否打开资源管理器
        gc.setFileOverride(false); //重新生成时文件是否覆盖
        gc.setServiceName("%sService");	//去掉Service接口的首字母I
        gc.setIdType(IdType.ID_WORKER_STR); //主键策略
        gc.setDateType(DateType.ONLY_DATE);//定义生成的实体类中日期类型
        gc.setSwagger2(true);//开启Swagger2模式

        mpg.setGlobalConfig(gc);

        // 3、数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:mysql://cdb-q9atzwrq.bj.tencentcdb.com:10167/codingstudy?useUnicode=true&characterEncoding=utf-8&useSSL=false");
        dsc.setDriverName("com.mysql.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("123456");
        dsc.setDbType(DbType.MYSQL);

        mpg.setDataSource(dsc);

        // 4、包配置
        PackageConfig pc = new PackageConfig();
        pc.setModuleName("blog");
        pc.setParent("cn.com.codingce");
        pc.setController("controller");
        pc.setEntity("pojo");
        pc.setService("service");
        pc.setMapper("mapper");

        mpg.setPackageInfo(pc);

        // 5、策略配置
        StrategyConfig strategy = new StrategyConfig();
        //strategy.setInclude("ze_user");//设置要映射的表名
        //strategy.setInclude("ze_user", "ze_course");//可设置多个
        strategy.setInclude("ze_user");//设置要映射的表名
        strategy.setNaming(NamingStrategy.underline_to_camel);//数据库表映射到实体的命名策略
        strategy.setTablePrefix("ze_");//设置表前缀不生成
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);//数据库表字段映射到实体的命名策略
        strategy.setEntityLombokModel(true); // lombok 模型 @Accessors(chain = true) setter链式操作
        strategy.setRestControllerStyle(true); //restful api风格控制器
        strategy.setControllerMappingHyphenStyle(true); //url中驼峰转连字符
        //strategy.setLogicDeleteFieldName("deleted");    //逻辑删除字段
        //自动填充配置
        //TableFill gmtCreate = new TableFill("gmt_create", FieldFill.INSERT);
        //TableFill gmtModified = new TableFill("gmt_modified", FieldFill.INSERT_UPDATE);
        //ArrayList<TableFill> tableFills = new ArrayList<>();
        //tableFills.add(gmtCreate);
        //tableFills.add(gmtModified);
        //strategy.setTableFillList(tableFills);

        mpg.setStrategy(strategy);

        // 6、执行
        mpg.execute();
    }
}
```
