---
title: ES6特性
date: 2021-02-01 11:14:28
pin: false
toc: true
icons: [fas fa-fire red]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200949291.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200949291.png
tags: [JavaScript]
categories: [JavaScript]
keywords: [JavaScript]
abbrlink: 461108bb
description: ES6特性
---
## :sun_with_face: ES6
### :sun_with_face: 简介
`ECMAScript6.0`（以下简称ES6，ECMAScript是一种由Ecma国际(前身为欧洲计算机制造商协会,英文名称是EuropeanComputerManufacturersAssociation)通过ECMA-262标准化的脚本程序设计语言）`是JavaScript语言的下一代标准`，已经在2015年6月正式发布了，并且从ECMAScript6开始，开始采用年号来做版本。即ECMAScript2015，就是ECMAScript6。它的目标，是使得JavaScript语言可以用来编写复杂的大型应用程序，成为企业级开发语言。
`每年一个新版本`。


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0abd9b7c3c514a538eaba2ab748c45b8~tplv-k3u1fbpfcp-watermark.image)

### :sun_with_face: 什么是ECMAScript
来看下前端的发展历程：
#### :sun_with_face: web1.0时代：
最初的网页以HTML为主，是纯静态的网页。网页是只读的，信息流只能从服务的到客户端单向流通。`开发人员也只关心页面的样式和内容即可`。

#### :sun_with_face: web2.0时代：

- 1995年，网景工程师BrendanEich花了10天时间设计了JavaScript语言。
- 1996年，微软发布了JScript，其实是JavaScript的逆向工程实现。
- 1996年11月，JavaScript的创造者Netscape公司，决定将JavaScript提交给标准化组织ECMA，希望这种语言能够成为国际标准。
- 1997年，ECMA发布262号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript，这个版本就是1.0版。JavaScript和JScript都是`ECMAScript`的标准实现者，随后各大浏览器厂商纷纷实现了`ECMAScript`标准。

所以，`ECMAScript`是浏览器脚本语言的规范，而各种我们熟知的js语言，如`JavaScript则是规范的具体实现`。


### :sun_with_face: ES6新特性

#### :sun_with_face: 1. let声明变量

```js
  //var声明的变量往往会越域
  //let声明的变量有严格局部作用域
  {
    var a = 1;
    let b = 2;
  }
  console.log(a); //1
  console.log(b); //ReferenceError:bisnotdefined
  
  
  //var可以声明多次
  //let只能声明一次
  var m = 1
  var m = 2
  let n = 3
  //let n = 4
  console.log(m) //2
  console.log(n) //Identifier'n'hasalreadybeendeclared
  
  //var会变量提升
  //let不存在变量提升
  console.log(x); //undefined
  var x = 10;
  console.log(y); //ReferenceError:yisnotdefined
  let y = 20;
```


#### :sun_with_face: 2. const声明常量（只读变量）
```js
  //1.声明之后不允许改变
  //2.一但声明必须初始化，否则会报错
  const a = 1;
  a = 3;  //UncaughtTypeError:Assignmenttoconstantvariable.
```

#### :sun_with_face: 3. 解构表达式
##### :sun_with_face:数组结构
```js
let arr = [1, 2, 3];
//以前我们想获取其中的值，只能通过角标。ES6可以这样：
const [x, y, z] = arr; //x，y，z将与arr中的每个位置对应来取值//然后打印
console.log(x, y, z);
```

##### 对象结构
```js
const person = {
  name: "jack",
  age: 21,
  language: ['java','js','css']
}

//解构表达式获取值，将person里面每一个属性和左边对应赋值
const {name, age, language} = person;
//等价于下面
//const name = person.name;
//const age = person.age;
//const language = person.language;
//可以分别打印
console.log(name);
console.log(age);
console.log(language);

//扩展：如果想要将name的值赋值给其他变量，可以如下,nn是新的变量名
const {name: nn, age, language} = person;
console.log(nn);
console.log(age);
console.log(language);
```

#### :sun_with_face: 4. 字符串扩展

##### :sun_with_face: 几个新的API
ES6为字符串扩展了几个新的API：
- `includes()`：返回布尔值，表示是否找到了参数字符串。
- `startsWith()`：返回布尔值，表示参数字符串是否在原字符串的头部。
- `endsWith()`：返回布尔值，表示参数字符串是否在原字符串的尾部。

```js
let str = "hello.vue";
console.log(str.startsWith("hello")); //true
console.log(str.endsWith(".vue")); //true
console.log(str.includes("e")); //true
console.log(str.includes("hello")); //true
```

##### :sun_with_face: 字符串模板
模板字符串相当于加强版的字符串，用反引号`,除了作为普通字符串，还可以用来定义多行字符串，还可以在字符串中加入变量和表达式。

```js
//1、多行字符串
let ss = `
  <div>
  	<span>helloworld<span>
  </div>
`

console.log(ss)

//2、字符串插入变量和表达式。变量名写在${}中，${}中可以放入JavaScript表达式。


let name ="张三";
let age = 18;
let info = `我是${name}，今年${age}了`;
console.log(info)

//3、字符串中调用函数
function fun() {
  return"这是一个函数"
}

let sss = `O(∩_∩)O哈哈~，${fun()}`;
console.log(sss); //O(∩_∩)O哈哈~，这是一个函数
```

#### :sun_with_face: 5. 函数优化
##### :sun_with_face: 函数参数默认值
```js
//在ES6以前，我们无法给一个函数参数设置默认值，只能采用变通写法：
function add(a, b) {
  //判断b是否为空，为空就给默认值1
  b = b || 1;
  return a + b;
}

//传一个参数
console.log(add(10));

//现在可以这么写：直接给参数写上默认值，没传就会自动使用默认值
function add2(a, b = 1) {
  return a + b;
}
//传一个参数
console.log(add2(10));

```

##### 不定参数
不定参数用来表示不确定参数个数，形如，...变量名，`由...加上一个具名参数标识符组成。具名参数只能放在参数列表的最后，并且有且只有一个不定参数`

```js
function fun(...values){
    console.log(values.length)
}
fun(1, 2) //2
fun(1, 2, 3, 4) //4
```

##### 箭头函数
ES6中定义函数的简写方式

- 一个参数时：

```js
//以前声明一个方法
var print = function(obj){
    console.log(obj);
}


//可以简写为：
var print = obj => console.log(obj);
//测试调用
print(100);
```

- 多个参数：

```js
//两个参数的情况：
var sum = function(a, b) {
    return a+b;
}
//简写为：
//当只有一行语句，并且需要返回结果时，可以省略{},结果会自动返回。
var sum2 = (a, b) => a + b;
//测试调用
console.log(sum2(10, 10)); //20

//代码不止一行，可以用`{}`括起来
var sum3 = (a, b) => {
  c = a + b;
  return c;
};
//测试调用
console.log(sum3(10, 20)); //30
```

##### 实战：箭头函数结合解构表达式
```js
//需求，声明一个对象，hello方法需要对象的个别属性
//以前的方式：
const person = {
  name: "jack",
  age: 21,
  language: ['java', 'js', 'css']
}

function hello(person) {
	console.log("hello, " + person.name)
}
//现在的方式
var hello2 = ({name}) => {console.log("hello," + name)};
//测试
hello2(person);
```

#### 6. 对象优化
##### 新增的API
ES6给Object拓展了许多新的方法，如：

- keys(obj)：获取对象的所有key形成的数组
- values(obj)：获取对象的所有value形成的数组
- entries(obj)：获取对象的所有key和value形成的二维数组。格式：`[[k1, v1],[k2, v2],...]`
- assign(dest,...src)：将多个src对象的值拷贝到dest中。（第一层为深拷贝，第二层为浅拷贝）

```js
const person = {
  name: "jack",
  age: 21,
  language: ['java', 'js', 'css']
}

console.log(Object.keys(person)); //["name","age","language"]
console.log(Object.values(person)); //["jack",21,Array(3)]
console.log(Object.entries(person)); //[Array(2),Array(2),Array(2)]
```

##### 声明对象简写
```js
const age = 23
const name = "张三"
//传统
const person1 = {age: age, name: name}
console.log(person1)

//ES6：属性名和属性值变量名一样，可以省略
const person2 = {age, name}
console.log(person2)  //{age:23,name:"张三"}
```

##### 对象的函数属性简写

```js
let person = {
  name: "jack",
  //以前：
  eat: function(food) {
    console.log(this.name+"在吃"+food);
  },
  //箭头函数版：这里拿不到this
  eat2: food => console.log(person.name + "在吃" + food);
  //简写版：
  eat3(food) {
      console.log(this.name + "在吃" + food);
  }
}
person.eat("apple");
```

##### 对象拓展运算符
拓展运算符（...）用于取出参数对象所有可遍历属性然后拷贝到当前对象。

```js
//1、拷贝对象（深拷贝）
let person1 = {name: "Amy", age: 15}
let someone = {...person1}
console.log(someone)//{name: "Amy", age: 15}
//2、合并对象
let age = {age: 15}
let name = {name: "Amy"}
let person2 = {...age, ...name} //如果两个对象的字段名重复，后面对象字段值会覆盖前面对象的字段值
console.log(person2) //{age: 15, name: "Amy"}
```


#### 7. map和reduce
数组中新增了map和reduce方法。

##### map
map()：接收一个函数，将原数组中的所有元素用这个函数处理后放入新数组返回。

```js
let arr = ['1', '20', '-5', '3'];
console.log(arr)

arr = arr.map(s => parseInt(s));
console.log(arr)
```

##### reduce
语法：     
`arr.reduce(callback,[initialValue])`      
reduce为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用reduce的数组。 

callback（执行数组中每个值的函数，包含四个参数）      

- previousValue（上一次调用回调返回的值，或者是提供的初始值（initialValue））
- currentValue（数组中当前被处理的元素）
- index（当前元素在数组中的索引）
- array（调用reduce的数组）

initialValue（作为第一次调用callback的第一个参数。）
示例：

```js
const arr = [1, 20, -5, 3];
//没有初始值：
console.log(arr.reduce((a, b) => a + b)); //19
console.log(arr.reduce((a, b) => a * b)); //-300

//指定初始值：
console.log(arr.reduce((a, b) => a + b, 1)); //20
console.log(arr.reduce((a, b) => a * b, 0)); //-0
```



#### 8. Promise
在JavaScript的世界中，所有代码都是单线程执行的。由于这个“缺陷”，导致JavaScript的所有网络操作，浏览器事件，都必须是异步执行。异步执行可以用回调函数实现。一旦有一连串的ajax请求a,b,c,d...后面的请求依赖前面的请求结果，就需要层层嵌套。这种缩进和层层嵌套的方式，非常容易造成上下文代码混乱，我们不得不非常小心翼翼处理内层函数与外层函数的数据，一旦内层函数使用了上层函数的变量，这种混乱程度就会加剧......总之，这     
种`层叠上下文`的层层嵌套方式，着实增加了神经的紧张程度。     
案例：用户登录，并展示该用户的各科成绩。在页面发送两次请求：     

1. 查询用户，查询成功说明可以登录
2. 查询用户成功，查询科目
3. 根据科目的查询结果，获取去成绩

分析：此时后台应该提供三个接口，一个提供用户查询接口，一个提供科目的接口，一个提供各科成绩的接口，为了渲染方便，最好响应json数据。在这里就不编写后台接口了，而是提供三个json文件，直接提供json数据，模拟后台接口：

```json
user.json：
{
  "id": 1,
  "name": "zhangsan",
  "password": "123456"
}
```

```json
user_corse_1.json:
{
  "id": 10,
  "name": "chinese"
}
```

```json
corse_score_10.json:
{
  "id": 100,
  "score": 90
}
```

```js
//回调函数嵌套的噩梦：层层嵌套。
$.ajax({
    url: "mock/user.json",
    success(data) {
        console.log("查询用户：", data);
        $.ajax({
            url:`mock/user_corse_${data.id}.json`,
            success(data){
            	console.log("查询到课程：", data);
                $.ajax({
                    url:`mock/corse_score_${data.id}.json`,
                    success(data) {
                        console.log("查询到分数：", data);
                    },
                    error(error) {
                    	console.log("出现异常了：" + error);
                    }
                });
            },
            error(error){
            	console.log("出现异常了：" + error);
            }
        });
    },
    error(error){
        console.log("出现异常了：" + error);
    }
});
```

我们可以通过Promise解决以上问题。
##### Promise语法

```js
const promise = new Promise(function(resolve, reject) {
	//执行异步操作
    if(/*异步操作成功*/) {
        resolve(value); //调用resolve，代表Promise将返回成功的结果
    } else {
    	reject(error);//调用reject，代表Promise会返回失败结果
    }
});


//使用箭头函数可以简写为：
const promise = new Promise((resolve, reject) => {
    //执行异步操作
    if(/*异步操作成功*/) {
        resolve(value);//调用resolve，代表Promise将返回成功的结果
    } else {
        reject(error);//调用reject，代表Promise会返回失败结果
    }
});
```

这样，在promise中就封装了一段异步执行的结果。


##### 处理异步结果
如果我们想要等待异步执行完成，做一些事情，我们可以通过promise的then方法来实现。如果想要处理promise异步执行失败的事件，还可以跟上catch：

```js
promise.then(function(value){
    //异步执行成功后的回调
}).catch(function(error){
    //异步执行失败后的回调
})
```

##### Promise改造以前嵌套方式
```js
new Promise((resolve, reject) => {
    $.ajax({
        url:"mock/user.json",
        success(data){
            console.log("查询用户：", data);
            resolve(data.id);
        },
        error(error) {
            console.log("出现异常了：" + error);
        }
    });
}).then((userId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url:`mock/user_corse_${userId}.json`,
            success(data) {
                console.log("查询到课程：",data);
                resolve(data.id);
            },
            error(error) {
                console.log("出现异常了："+error);
            }
        });
    });
}).then((corseId) => {
    console.log(corseId);
    $.ajax({
        url: `mock/corse_score_${corseId}.json`,
        success(data) {
            console.log("查询到分数：", data);
        },
        error(error) {
            console.log("出现异常了："+error);
        }
    });
});
```

##### 优化处理
优化：通常在企业开发中，会把promise封装成通用方法，如下：封装了一个通用的get请求方法；

```js
let get = function(url, data) { //实际开发中会单独放到common.js中
    return new Promise((resolve, reject) => {
        $.ajax({
            url:url,
            type:"GET",
            data:data,
            success(result) {
                resolve(result);
            },
            error(error) {
                reject(error);
            }
        });
    })
}

//使用封装的get方法，实现查询分数
get("mock/user.json").then((result) => {
    console.log("查询用户：", result);
    return get(mock/user_corse_${result.id}.json); 
}).then((result) => {
    console.log("查询到课程：",result);
    return get(mock/corse_score_${result.id}.json)
}).catch(() => {
    console.log("出现异常了：" + error);
});
```

通过比较，我们知道了Promise的扁平化设计理念，也领略了这种`上层设计`带来的好处。   
我们的项目中会使用到这种异步处理的方式；



#### 9. 模块化
模块化就是把代码进行拆分，方便重复利用。类似java中的导包：要使用一个包，必须先导包。而JS中没有包的概念，换来的是模块。

模块功能主要由两个命令构成：`export`和`import`。

- `export`命令用于规定模块的对外接口。
- `import`命令用于导入其他模块提供的功能。

##### export
比如我定义一个js文件:hello.js，里面有一个对象
```js
const util = {
    sum(a, b) {
    return a + b;
    }
}
```


我可以使用export将这个对象导出：
```js
const util = {
    sum(a, b) {
        return a + b;
    }
}

export {util};
```

当然，也可以简写为：
```js
export const util = {
    sum(a, b) {
    return a + b;
    }
}
```

`export`不仅可以导出对象，一切JS变量都可以导出。比如：基本类型变量、函数、数组、对象。      
当要导出多个值时，还可以简写。比如我有一个文件：user.js：

省略名称
上面的导出代码中，都明确指定了导出的变量名，这样其它人在导入使用时就必须准确写出变量名，否则就会出错。      
因此js提供了`default`关键字，可以对导出的变量名进行省略          
例如：
```js
//无需声明对象的名字
export default {
    sum(a, b) {
    return a + b;
    }
}
```

这样，当使用者导入时，可以任意起名字

##### import
使用`export`命令定义了模块的对外接口以后，其他JS文件就可以通过`import`命令加载这个模块。

例如我要使用上面导出的util：
```js
//导入util
import util from 'hello.js'
//调用util中的属性
util.sum(1, 2)
```

要批量导入前面导出的name和age：
```js
import {name, age} from 'user.js'
console.log(name + ", 今年" + age + "岁了")
```

但是上面的代码暂时无法测试，因为浏览器目前还不支持ES6的导入和导出功能。除非借助于工具，把ES6的语法进行编译降级到ES5，比如`Babel-cli`工具

>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址github: https://github.com/xzMhehe/codingce-java