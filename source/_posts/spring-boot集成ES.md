---
title: spring boot集成ES
date: 2021-01-19 14:59:05
tags:
- Elasticsearch
categories: 
- Elasticsearch
---
Elasticsearch Clients 文档



## spring boot集成ES



Java REST Client [7.10] » Java High Level REST Client 
`一般用高级的客户端`



- 找到原生依赖
```xml
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.10.2</version>
    </dependency>
```


- 找对象
```java
RestHighLevelClient client = new RestHighLevelClient(
        RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http")));

//用完关闭
client.close();
```


>配置基本项目问题: 一定保证, 我们导入的依赖和我们的es版本一致



### ElasticSearchConfig



- ElasticSearchConfig
```java
/**
 * 找到对象
 * 放到Spring里面就可以用了
 *
 *
 * @author mxz
 */
@Configuration
public class ElasticSearchConfig {

    @Bean
    public RestHighLevelClient restHighLevelClient() {
        RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost("localhost", 9200, "http")));
//                        new HttpHost("localhost", 9201, "http")));
        return client;
    }


}
```
- 索引测试代码
```java
package cn.com.codingce;

import cn.com.codingce.config.ElasticSearchConfig;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class CodingceEsApiApplicationTests {

    @Autowired
    @Qualifier("restHighLevelClient")
    private RestHighLevelClient client;

    @Test
    void contextLoads() throws IOException {
        // 创建索引
        CreateIndexRequest request = new CreateIndexRequest("codingce_index");
        // 执行创建请求, IndicesClient, 请求后获得响应
        CreateIndexResponse createIndexResponse = client.indices().create(request, RequestOptions.DEFAULT);
        System.out.println(createIndexResponse);
    }

    //测试获取索引
    @Test
    void testExistIndex() throws IOException {
        GetIndexRequest request = new GetIndexRequest("codingce_index");
        boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
        System.out.println(exists);

    }


    //测试删除索引
    @Test
    void testDeleteIndex() throws IOException {
        DeleteIndexRequest request = new DeleteIndexRequest("codingce_index");
        AcknowledgedResponse delete = client.indices().delete(request, RequestOptions.DEFAULT);
        System.out.println(delete.isAcknowledged());

    }

}
```



### 测试文档的基本操作


- 实体类
```java
package cn.com.codingce.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * @author mxz
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class User {
    private String name;
    private int age;
}
```


- 测试代码

```java
//测试添加文档
    @Test
    void testAddDocument() throws IOException {
        User u = new User("后端码匠", 3);
        // 创建请求
        IndexRequest request = new IndexRequest("codingce_index");

        // 规则 put codingce_index/_doc/1
        request.id("1");
        // 1s
        request.timeout(TimeValue.timeValueSeconds(1));

        // 将我们的数据放入请求   json
        IndexRequest source = request.source(JSON.toJSONString(u), XContentType.JSON);

        // 客户端发送请求
        IndexResponse index = client.index(request, RequestOptions.DEFAULT);

        System.out.println(index.toString());
        System.out.println(index.status()); // 成功就是 CREATE
    }

    // 获取文档 先判断是否存在
    @Test
    void testIsExists() throws IOException {
        GetRequest request = new GetRequest("codingce_index", "1");
        // 不获取返回的_source 的上下文
        request.fetchSourceContext(new FetchSourceContext(false));
        request.storedFields("_none_");


        boolean exists = client.exists(request, RequestOptions.DEFAULT);
        System.out.println(exists);
    }

    // 判断完 存在则获取文档信息
    @Test
    void testGetDocument() throws IOException {
        GetRequest request = new GetRequest("codingce_index", "1");

        GetResponse response = client.get(request, RequestOptions.DEFAULT);
        System.out.println(response.getSourceAsString());
        System.out.println(response);
    }

    @Test
    void testUpdateDocument() throws IOException {
        UpdateRequest updateRequest = new UpdateRequest("codingce_index", "1");
        updateRequest.timeout(TimeValue.timeValueSeconds(1));
        User u = new User("后端码匠", 4);
        updateRequest.doc(JSON.toJSONString(u), XContentType.JSON);


        UpdateResponse updateResponse = client.update(updateRequest, RequestOptions.DEFAULT);
        System.out.println(updateResponse);
        System.out.println(updateResponse.status());
    }

    @Test
    void testDeleteDocument() throws IOException {
        DeleteRequest deleteRequest = new DeleteRequest("codingce_index", "1");
        deleteRequest.timeout(TimeValue.timeValueSeconds(1));

        DeleteResponse deleteResponse = client.delete(deleteRequest, RequestOptions.DEFAULT);
        System.out.println(deleteResponse.toString());
        System.out.println(deleteResponse.status());
    }


    //批量插入
    @Test
    void testAddDocuments() throws IOException {
        BulkRequest bulkRequest = new BulkRequest();
        bulkRequest.timeout(TimeValue.timeValueSeconds(10));

        List<User> list = new ArrayList<>();
        list.add(new User("后端码匠1", 1));
        list.add(new User("后端码匠2", 2));
        list.add(new User("后端码匠3", 3));
        list.add(new User("后端码匠4", 4));
        list.add(new User("后端码匠5", 5));
        list.add(new User("后端码匠6", 6));
        list.add(new User("后端码匠7", 7));
        list.add(new User("后端码匠8", 8));

        for (int i = 0; i < list.size(); i++) {
            // 批量更新和批量删除, 就在这里修改对应的请求就可以了
            bulkRequest.add(new IndexRequest("codingce_index")
                    .id("" + (i + 1))
                    .source(JSON.toJSONString(list.get(i)), XContentType.JSON));
        }
        BulkResponse bulkResponse = client.bulk(bulkRequest, RequestOptions.DEFAULT);
        System.out.println(bulkResponse.toString());
        System.out.println(bulkResponse.hasFailures());
    }

    // 批量查询
    // SearchRequest    搜索请求
    // SearchSourceBuilder  条件构造
    @Test
    void testSearchAll() throws IOException {
        SearchRequest searchRequest = new SearchRequest(ES_INDEX);

        // 查询条件 可以使用 QueryBuilders 工具类
        // termQuery 精确匹配
//        TermQueryBuilder termQueryBuilder = QueryBuilders.termQuery("name", "后端码匠1");
        MatchAllQueryBuilder matchAllQueryBuilder = QueryBuilders.matchAllQuery();


        // 构建搜索条件
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();


        searchSourceBuilder.query(matchAllQueryBuilder);
//        searchSourceBuilder.timeout(TimeValue.timeValueSeconds(60));
        searchSourceBuilder.timeout(new TimeValue(60, TimeUnit.SECONDS));
        searchSourceBuilder.from();
        searchSourceBuilder.size();

        searchRequest.source(searchSourceBuilder);


        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
        System.out.println(JSON.toJSONString(searchResponse.getHits()));
        for (SearchHit hit : searchResponse.getHits().getHits()) {
            System.out.println(hit.getSourceAsMap());
        }

    }
```














>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java