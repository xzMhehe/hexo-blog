---
title: Vue
pin: false
toc: true
icons: []
tags: [Vue]
categories: [Vue]
keywords: [Vue]
abbrlink: f8e09374
date: 2021-02-05 20:43:43
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200933725.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/202108200933725.png
description: Vue
---
## :sun_with_face:Vue
### :sun_with_face:MVVM思想

- M：即Model，模型，包括数据和一些基本操作
- V：即View，视图，页面渲染结果
- VM：即View-Model，模型与视图间的双向操作（无需开发人员干涉）

在MVVM之前，开发人员从后端获取需要的数据模型，然后要通过DOM操作Model渲染到View中。而后当用户操作视图，还需要通过DOM获取View中的数据，然后同步到Model中。      
而MVVM中的VM要做的事情就是把DOM操作完全封装起来，开发人员不用再关心Model和View之间是如何互相影响的：          

- 只要Model发生了改变，View上自然就会表现出来。
- 当用户修改了View，Model中的数据也会跟着改变。

把开发人员从繁琐的DOM操作中解放出来，把关注点放在如何操作Model上。

![](https://image.codingce.com.cn/20210205205042.png)

### :sun_with_face:Vue简介
Vue(读音/vjuː/，类似于view)是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue被设计为可以自底向上逐层应用。Vue的核心库只关注视图层，不仅易于上      
手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue也完全能够为复杂的单页应用提供驱动。     

官网：https://cn.vuejs.org/
参考：https://cn.vuejs.org/v2/guide/

Git地址：https://github.com/vuejs
尤雨溪，Vue.js创作者，VueTechnology创始人，致力于Vue的研究开发。

## :sun_with_face:入门案例
### :sun_with_face:安装
官网文档提供了3中安装方式：

1.直接script引入本地vue文件。需要通过官网下载vue文件。
2.通过script引入CDN代理。需要联网，生产环境可以使用这种方式
3.通过npm安装。这种方式也是官网推荐的方式，需要nodejs环境。
本课程就采用第三种方式


### :sun_with_face:HelloWorld
h2中要输出一句话：`xx是技术类公众号`。前面的`xx`是要渲染的数据。

```html
<div id="#app">
    <h2>{{name}}, 是技术类公众号</h2>
</div>
<script src="./node_modules/vue/dist/vue.min.js"></script>
<script>
    let vm = new Vue({
        el: "#app",
        data: {
            name: "后端码匠"
        }
    });
</scipt>
```


### :sun_with_face:vue声明式渲染
```html
<body>
    <div id="app">
        <h1>{{name}}, 是技术类公众号</h1>
    </div>
    <script src="./node_modules/vue/dist/vue.min.js"></script>
    <script>
        let vm = new Vue({
            el: "#app",
            data: {
                name: "后端码匠"
            }
        });
    </script>
</body>
```

- 首先通过newVue()来创建Vue实例
- 然后构造函数接收一个对象，对象中有一些属性：
    - el：是element的缩写，通过id选中要渲染的页面元素，本例中是一个div
    - data：数据，数据是一个对象，里面有很多属性，都可以渲染到视图中
        - name：这里指定了一个name属性
- 页面中的`h2`元素中，通过{{name}}的方式，来渲染刚刚定义的name属性。


更神奇的在于，当你修改name属性时，页面会跟着变化：

### :sun_with_face:双向绑定

```html
<body>
    <div id="app">
        <h1>{{name}}, 是技术类公众号, 有{{num}}个人关注</h1>
    </div>
    <script src="https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN@main/static/vue.min.js"></script>
    <script>
        let vm = new Vue({
            el: "#app",
            data: {
                name: "后端码匠",
                num: 10000
            }
        });
    </script>
</body>
```

**双向绑定:**
效果：修改表单项，num会发生变化。修改num，表单项也会发生变化。为了实时观察到这个变化，将num输出到页面。
### :sun_with_face:事件处理

```html
<body>
    <div id="app">
        <button v-on:click="num++">关注</button>
        <h1>{{name}}, 是技术类公众号, 有{{num}}个人关注</h1>
    </div>
    <script src="https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN@main/static/vue.min.js"></script>
    <script>
        let vm = new Vue({
            el: "#app",
            data: {
                name: "后端码匠",
                num: 10000
            }
        });
    </script>
</body>
```


- 这里用`v-on`指令绑定点击事件，而不是普通的`onclick`，然后直接操作num
- 普通click是无法直接操作num的。
- 未来会见到更多v-xxx，这些都是vue定义的不同功能的指令。


简单使用总结：

- 使用Vue实例管理DOM
- DOM与数据/事件等进行相关绑定
- 只需要关注数据，事件等处理，无需关心视图如何进行修改










## :sun_with_face:概念

### :sun_with_face:创建Vue实例
每个Vue应用都是通过用Vue函数创建一个新的Vue实例开始的：

```js
let app = new Vue({
});
```

在构造函数中传入一个对象，并且在对象中声明各种Vue需要的数据和方法，包括：

- el
- data
- methods

等等

### :sun_with_face:模板或元素

每个Vue实例都需要关联一段Html模板，Vue会基于此模板进行视图渲染。
可以通过el属性来指定。
例如一段html模板：
```html
<div id = "app">
</div>
```

然后创建Vue实例，关联这个div
```js
let vm = new Vue({
    el: "#app"
});
```

这样，Vue就可以基于id为`app`的div元素作为模板进行渲染了。在这个div范围以外的部
分是无法使用vue特性的。

### :sun_with_face:数据

当Vue实例被创建时，它会尝试获取在data中定义的所有属性，用于视图的渲染，并且监视data中的属性变化，当data发生改变，所有相关的视图都将重新渲染，这就是“响应式
“系统。
html：
```html
<div id = "app">
    <input type = "text" v-model = "name"/>
</div>
```

JS:
```js
let vm = new Vue({
    el: "#app",
    data: {
        name: "后端码匠"
    }
});
```


- name的变化会影响到`input`的值
- input中输入的值，也会导致vm中的name发生改变


### :sun_with_face:方法
Vue实例中除了可以定义data属性，也可以定义方法，并且在Vue实例的作用范围内使用。
Html：
```html
<div id = "app">
    {{num}}
    <button v-on:click="add">加</button>
</div>
```

JS:

```js
let vm = new Vue({
    el: "#app",
    data: {
        num: 0
    },
    methods: {
        add: function(){
            //this代表的当前vue实例
            this.num++;
        }
    }
});
```

### :sun_with_face:指令
什么是指令？

- 指令(Directives)是带有`v-`前缀的特殊特性。
- 指令特性的预期值是：单个JavaScript表达式。
- 指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于DOM。

例如在入门案例中的v-on，代表绑定事件。



### :sun_with_face:插值表达式

#### :sun_with_face:花括号
格式：{{表达式}}
说明：

- 该表达式支持JS语法，可以调用js内置函数（必须有返回值）
- 表达式必须有返回结果。例如1+1，没有结果的表达式不允许使用，如：let a = 1 + 1;
- 可以直接获取Vue实例中定义的数据或函数

#### :sun_with_face:插值闪烁
使用
```bash
{{}}
```
方式在网速较慢时会出现问题。在数据未加载完成时，页面会显示出原始的
```bash
{{}}
```

加载完毕后才显示正确数据，称为插值闪烁。

将网速调慢一些，然后刷新页面，试试看案例：

### :sun_with_face:v-text和v-html

可以使用`v-text`和`v-html`指令来替代 
```bash
{{}}
```

说明：
- v-text：将数据输出到元素内部，如果输出的数据有HTML代码，会作为普通文本输出
- v-html：将数据输出到元素内部，如果输出的数据有HTML代码，会被渲染

示例：

```html
<div id = "app">
    v-text:<span v-text = "hello"></span><br/>
    v-html:<span v-html = "hello"></span>
</div>
<script>
    let vm = new Vue({
    el: "#app",
    data: {
        hello: "<h1>大家好</h1>"
    },
    methods: {
        
    }
});
</script>
```


并且`不会出现插值闪烁`，当没有数据时，`会显示空白或者默认数据`。

### :sun_with_face:v-bind
html属性不能使用双大括号形式绑定，使用v-bind指令给HTML标签属性绑定值；
而且在将`v-bind`用于`class`和`style`时，Vue.js做了专门的增强。

#### :sun_with_face:绑定class

```html
<div class="static" v-bind:class="{active: isActive, 'text-danger': hasError}">
</div>
<script>
    let vm = new Vue({
        el: "#app",
        data: {
            isActive: true,
            hasError: false
        }
    })
</script>
```

#### :sun_with_face:绑定style
`v-bind:style`的对象语法十分直观，看着非常像CSS，但其实是一个JavaScript对象。style属性名可以用驼峰式(camelCase)或短横线分隔(kebab-case，这种方式记得用单引号括起来)来命名。      
例如：font-size-->fontSize


```html
<div id = "app" v-bind:style="{color: activeColor, fontSize: fontSize + 'px'}"></div>
<script>
    let vm = new Vue({
        el: "#app",
        data: {
        activeColor: 'red',
        fontSize: 30
        }
    })
</script>
```
结果：<div style = "color: red; font-size: 30px;"></div>

#### :sun_with_face:绑定其他任意属性

```html
<div id = "app" v-bind:style="{color: activeColor, fontSize: fontSize + 'px'}" v-bind:user = "userName"></div>
<script>
    let vm = new Vue({
        el: "#app",
        data: {
            activeColor: 'red',
            fontSize: 30,
            userName: 'zhangsan'
        }
    })
</script>
```

效果：
<div id = "app" user = "zhangsan" style = "color: red; font-size: 30px;"></div>

### :sun_with_face:v-bind缩写
```html
<div id = "app" :style="{color: activeColor, fontSize: fontSize + 'px'}" :user = userName>
</div>
```


### :sun_with_face:v-model

刚才的v-text、v-html、v-bind可以看做是单向绑定，数据影响了视图渲染，但是反过来就不行。接下来的v-model是双向绑定，视图（View）和模型（Model）之间会互相影响。       
既然是双向绑定，一定是在视图中可以修改数据，这样就限定了视图的元素类型。目前v-model的可使用元素有：

- input
- select
- textarea
- checkbox
- radio
- components（Vue中的自定义组件）

基本上除了最后一项，其它都是表单的输入项。
示例：

```html
<div id = "app">
    <input type = "checkbox" v-model = "language" value = "Java"/>Java<br/>
    <input type = "checkbox" v-model = "language" value = "PHP"/>PHP<br/>
    <input type = "checkbox" v-model = "language" value = "Swift"/>Swift<br/>
    <h1>
        你选择了：{{language.join(',')}}
    </h1>
    <script src="./node_modules/vue/dist/vue.min.js"></script>
    <script>
        let vm = new Vue({
            el: "#app",
            data: {
                language: []
            }
        });
    </script>

</div>
```

- 多个`CheckBox`对应一个model时，model的类型是一个数组，单个checkbox值默认是boolean类型
- radio对应的值是input的value值
- `text`和`textarea`默认对应的model是字符串
- `select`单选对应字符串，多选对应也是数组


### :sun_with_face:v-on
#### :sun_with_face:基本用法
v-on指令用于给页面元素绑定事件。语法：v-on:事件名="js片段或函数名"
示例：

```html
<body>
    <div id="app">
        <button v-on:click="num++">关注</button>
        <button v-on:click="decrement">取消</button>
        <h1>{{name}}, 是技术类公众号, 有{{num}}个人关注</h1>
    </div>
    <script src="https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN@main/static/vue.min.js"></script>
    <script>
        let vm = new Vue({
            el: "#app",
            data: {
                name: "后端码匠",
                num: 10000
            }，
            methods: {
                decrement() {
                    this.num--;
                }
            }
        });
    </script>
</body>
```

另外，事件绑定可以简写，例如`v-on:click='add'`可以简写为`@click='add'`


#### :sun_with_face:事件修饰符
在事件处理程序中调用`event.preventDefault()`或`event.stopPropagation()`是非常常见的需求。尽管可以在方法中轻松实现这点，但更好的方式是：方法只有纯粹的数据逻辑，而不是去处理DOM事件细节。
为了解决这个问题，Vue.js为`v-on`提供了事件修饰符。修饰符是由点开头的指令后缀来表示的。

- `.stop`：阻止事件冒泡到父元素
- `.prevent`：阻止默认事件发生
- `.capture`：使用事件捕获模式
- `.self`：只有元素自身触发事件才执行。（冒泡或捕获的都不执行）
- `.once`：只执行一次


```html
<body>
    <div id="app">
        <!--右击事件，并阻止默认事件发生-->
        <button v-on:contextmenu.prevent = "num++">点赞</button><br/>
        <!--右击事件，不阻止默认事件发生-->
        <button v-on:contextmenu = "decrement($event)">取消</button><br/>
        <h1>{{name}}, 是技术类公众号, 有{{num}}个人关注</h1>
    </div>
    <script src="https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN@main/static/vue.min.js"></script>
    <script>
        let vm = new Vue({
            el: "#app",
            data: {
                name: "后端码匠",
                num: 10000
            }，
            methods: {
                decrement(ev) {
                    //ev.preventDefault();
                    this.num--;
                }
            }
        });
    </script>
</body>
```

效果：右键“点赞”，不会触发默认的浏览器右击事件；右键“取消”，会触发默认的浏览器右击事件）

#### :sun_with_face:按键修饰符
在监听键盘事件时，经常需要检查常见的键值。Vue允许为`v-on`在监听键盘事件时添加按键修饰符：

```html
<!--只有在`keyCode`是13时调用`vm.submit()`-->
<input v-on:keyup.13 = "submit">
```

记住所有的`keyCode`比较困难，所以Vue为最常用的按键提供了别名：
```html
<!--同上-->
<input v-on:keyup.enter = "submit">
<input @keyup.enter = "submit">
<!--缩写语法-->
```

全部的按键别名：
- `enter`
- `tab`
- `.delete`(捕获“删除”和“退格”键)
- `esc`
- `.space`
- `.up`
- `down`
- `left`
- `.right`


#### :sun_with_face:组合按钮
可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。

- `ctrl`
- `alt`
- `shift`

```html
<!--Alt + C-->
<input @keyup.alt.67 = "clear">
<!--Ctrl + Click-->
<div @click.ctrl = "doSomething">Do something</div>
```



### :sun_with_face:v-for  
遍历数据渲染页面是非常常用的需求，Vue中通过v-for指令来实现。

#### :sun_with_face:遍历数组
语法：v-for = "item in items"

- items：要遍历的数组，需要在vue的data中定义好。      
- item：迭代得到的当前正在遍历的元素

```html
<div id = "app">
    <ul>
        <li v-for = "user in users">
            {{user.name}} - {{user.gender}} - {{user.age}}
        </li>
    </ul>
</div>
<script src="https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN@main/static/vue.min.js"></script>
<script>
    let vm = new Vue({
        el: "#app",
        data: {
        users:[
            {name: '柳岩', gender: '女', age: 21},
            {name: '张三', gender: '男', age: 18}
        ]
        }，
        methods: {
            decrement(ev) {
                //ev.preventDefault();
                this.num--;
            }
        }
    });
</script>
```





#### :sun_with_face:数组角标
在遍历的过程中，如果需要知道数组角标，可以指定第二个参数：        
语法：v-for="(item, index) in items"    

- items：要迭代的数组
- item：迭代得到的数组元素别名     
- index：迭代到的当前元素索引，从0开始。    

```html
<div id="app">
    <ul>
    <li v-for = "(user, index) in users">
        {{index + 1}}.{{user.name}} - {{user.gender}} - {{user.age}}
    </li>
    </ul>
</div>
```


#### :sun_with_face:遍历对象
v-for除了可以迭代数组，也可以迭代对象。语法基本类似   
语法：   
v-for="valueinobject"   
v-for="(value,key)inobject"    
v-for="(value,key,index)inobject"    

- 1个参数时，得到的是对象的属性值
- 2个参数时，第一个是属性值，第二个是属性名
- 3个参数时，第三个是索引，从0开始

示例：

```html
<div id="app">
    <ul>
    <li v-for = "(value, key, index) in users">
        {{index + 1}}.{{key}} - {{value}}
    </li>
    </ul>
</div>
<script src="https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN@main/static/vue.min.js"></script>
<script>
    let vm = new Vue({
        el: "#app",
        data: {
        users: [
            user: {name: '张三', gender: '男', age: 18}
        ]
        }，
        methods: {
            decrement(ev) {
                //ev.preventDefault();
                this.num--;
            }
        }
    });
</script>
```

效果：

- 1.name - 张三
- 2.gender - 男
- 3.age - 18

#### :sun_with_face:Key
用来标识每一个元素的唯一特征，这样Vue可以使用“就地复用”策略有效的提高渲染的效率。     
示例：  

```html
<ul>
    <li v-for = "(item, index) in items" :key = "index"></li>
</ul>
<ul>
<li v-for = "item in items" :key = "item.id"></li>
</ul>
```

如果items是数组，可以使用index作为每个元素的唯一标识    
如果items是对象数组，可以使用item.id作为每个元素的唯一标识



### :sun_with_face:v-if和v-show

#### :sun_with_face:基本用法
v-if，顾名思义，条件判断。当得到结果为true时，所在的元素才会被渲染。v-show，当得到结果为true时，所在的元素才会被显示。     
语法：v-if="布尔表达式",v-show="布尔表达式",

```html
<div id = "app">
    <button v-on:click = "show =! show">点我呀</button><br>
    <h1 v-if = "show">
        看到我啦？！
    </h1>
    <h1 v-show = "show">
        看到我啦？！show
    </h1>
</div>
<script src="../node_modules/vue/dist/vue.js"></script>
<script type="text/javascript">
    let app = new Vue({
        el: "#app",
        data: {
            show: true
        }
    });
</script>
```

#### :sun_with_face:与v-for结合
当v-if和v-for出现在一起时，v-for优先级更高。也就是说，会先遍历，再判断条件。修改v-for中的案例，添加v-if：
<ul>
    <li v-for = "(user, index) in users" v-if = "user.gender == '女'">
        {{index + 1}}.{{user.name}} - {{user.gender}} - {{user.age}}
    </li>
</ul>


#### :sun_with_face:v-else和v-else-if
v-else元素必须紧跟在带`v-if`或者`v-else-if`的元素的后面，否则它将不会被识别。

```html
<div id = "app">
    <button v-on:click = "random = Math.random()">点我呀</button>
    <span>{{random}}</span>
    <h1 v-if = "random >= 0.75">
        看到我啦？！v-if>=0.75
    </h1>
    <h1 v-else-if = "random > 0.5">
        看到我啦？！v-else-if>0.5
    </h1>
    <h1 v-else-if = "random > 0.25">
        看到我啦？！v-else-if>0.25
    </h1>
    <h1 v-else>
        看到我啦？！v-else
    </h1>
</div>
<script src="../node_modules/vue/dist/vue.js"></script>
<script type="text/javascript">
    let app = new Vue({
        el: "#app",
        data: {
            random: 1
        }
    });
</script>
```


## :sun_with_face:计算属性和侦听器


### :sun_with_face:计算属性（computed）
某些结果是基于之前数据实时计算出来的，可以利用计算属性。来完成

```html
<div id = "app">
    <ul>
        <li>西游记：价格{{xyjPrice}}，数量：<input type = "number" v-model = "xyjNum"></li>
        <li>水浒传：价格{{shzPrice}}，数量：<input type = "number" v-model = "shzNum"></li>
        <li>总价：{{totalPrice}}</li>
    </ul>
</div>
<script src = "../node_modules/vue/dist/vue.js"></script>
<script type = "text/javascript">
    let app = new Vue({
        el: "#app",
        data: {
            xyjPrice: 56.73,
            shzPrice: 47.98,
            xyjNum: 1,
            shzNum: 1
        },
        computed:{
            totalPrice() {
                return this.xyjPrice * this.xyjNum + this.shzPrice * this.shzNum;
            }
        }
    )};
</script>
```


效果：只要依赖的属性发生变化，就会重新计算这个属性


### :sun_with_face:侦听（watch）

watch可以让监控一个值的变化。从而做出相应的反应。

```html
<div id = "app">
    <ul>
        <li>西游记：价格{{xyjPrice}}，数量：<input type = "number" v-model = "xyjNum"></li>
        <li>水浒传：价格{{shzPrice}}，数量：<input type = "number" v-model = "shzNum"></li>
        <li>总价：{{totalPrice}}</li>
        {{msg}}
    </ul>
</div>
<script src = "../node_modules/vue/dist/vue.js"></script>
<script type = "text/javascript">
    letapp=newVue({
        el: "#app",
        data: {
            xyjPrice: 56.73,
            shzPrice: 47.98,
            xyjNum: 1,
            shzNum: 1,
            msg: ""
        },
        computed:{
            totalPrice() {
                return this.xyjPrice * this.xyjNum + this.shzPrice * this.shzNum;
            }
        },
        atch: {
            xyjNum(newVal, oldVal){
                if(newVal >= 3) {
                    this.msg = "西游记没有更多库存了";
                    this.xyjNum = 3;
                } else {
                    his.msg="";
                }
            }
        }
    )};
</script>
```

### :sun_with_face:过滤器（filters）

过滤器不改变真正的`data`，而只是改变渲染的结果，并返回过滤后的版本。在很多不同的
情况下，过滤器都是有用的，比如尽可能保持API响应的干净，并在前端处理数据的格式。

示例：展示用户列表性别显示男女

```html
<div id = "app">
    <table>
        <tr v-for = "user in userList">
            <td>{{user.id}}</td>
            <td>{{user.name}}</td>
            <!--使用代码块实现，有代码侵入-->
            <td>{{user.gender === 1 ? "男" : "女"}}</td>
        </tr>
    </table>
</div>
<script src = "../node_modules/vue/dist/vue.js"></script>
<script type = "text/javascript">
    let app = new Vue({
        el: "#app",
        data: {
            userList:[
                {id: 1, name: 'jacky', gender: 1},
                {id: 2, name: 'peter', gender: 0}
            ]
        }
        
    )};
</script>
```

#### :sun_with_face:局部过滤器
册在当前vue实例中，只有当前实例能用

```html
<script type = "text/javascript">
    let app = new Vue({
        el: "#app",
        data: {
            userList:[
                {id: 1, name: 'jacky', gender: 1},
                {id: 2, name: 'peter', gender: 0}
            ]
        },
        //filters定义局部过滤器，只可以在当前vue实例中使用
        filters: {
            myGenderFilter(gender){
                return gender === 1 ? '男~' : '女~';
        }
    )};
</script>
```
<!--|管道符号：表示使用后面的过滤器处理前面的数据-->
<td>&#123;&#123;user.gender | myGenderFilter&#125;&#125;</td>


#### :sun_with_face:全局过滤器
```js
//在创建Vue实例之前全局定义过滤器：
Vue.filter('capitalize', function(value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
})
```

任何vue实例都可以使用：
<td >{{user.name | capitalize}}</td

过滤器常用来处理文本格式化的操作。过滤器可以用在两个地方：双花括号插值和v-bind表达式


### :sun_with_face:组件化
在大型应用开发的时候，页面可以划分成很多部分。往往不同的页面，也会有相同的部分。       
例如可能会有相同的头部导航。

但是如果每个页面都独自开发，这无疑增加了开发的成本。所以会把页面的不同部分拆分成独立的组件，然后在不同页面就可以共享这些组件，避免重复开发。

在vue里，所有的vue实例都是组件      


例如你可能会有页头、侧边栏、内容区、等组件, 每个组件又包含了其他的导航链接、博文之类的组件

![](https://cn.vuejs.org/images/components.png)

#### :sun_with_face:全局组件
通过Vue的component方法来定义一个全局组件。

```html
<div id = "app">
    <!--使用定义好的全局组件-->
    <counter></counter>
</div>
<script src="../node_modules/vue/dist/vue.js"></script>
<script type = "text/javascript">
    //定义全局组件，两个参数：1，组件名称。2，组件参数
    Vue.component("counter", {
    template:'<button v-on:click="count++">你点了我{{count}}次，我记住了.</button>',
    data(){
        return{
            count: 0
        }
    }
    })
    let app = new Vue({
        el: "#app"
    })
</script>
```

- 组件其实也是一个Vue实例，因此它在定义时也会接收：data、methods、生命周期函数等
- 不同的是组件不会与页面的元素绑定，否则就无法复用了，因此没有el属性。
- 但是组件渲染需要html模板，所以增加了template属性，值就是HTML模板
- 全局组件定义完毕，任何vue实例都可以直接在HTML中通过组件名称来使用组件了
- data必须是一个函数，不再是一个对象。


#### :sun_with_face:组件的复用

定义好的组件，可以任意复用多次：

```html
<div id = "app">
    <!--使用定义好的全局组件-->
    <counter></counter>
    <counter></counter>
    <counter></counter>
</div>
```

组件的data属性必须是函数！

一个组件的data选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷
贝；
否则：

https://cn.vuejs.org/v2/guide/components.html#data-%E5%BF%85%E9%A1%BB%E6%98%AF%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0



#### :sun_with_face:局部组件
一旦全局注册，就意味着即便以后你不再使用这个组件，它依然会随着Vue的加载而加载。因此，对于一些并不频繁使用的组件，会采用局部注册。

先在外部定义一个对象，结构与创建组件时传递的第二个参数一致：

```js
const counter = {
    template: '<buttonv-on:click="count++">你点了我{{count}}次，我记住了.</button>',
    data(){
        return{
            count:0
        }
    }
};
```
然后在Vue中使用它：
```js
let app = new Vue({
    el: "#app",
    components:{
        counter: counter//将定义的对象注册为组件
    }
})
```

- components就是当前vue对象子组件集合。
    - 其key就是子组件名称
    - 其值就是组件对象名
- 效果与刚才的全局注册是类似的，不同的是，这个counter组件只能在当前的Vue实例中使用

简写：

```js
let app = new Vue({
    el: "#app",
    components:{
        counter//将定义的对象注册为组件
    }
})
```



### :sun_with_face:生命周期钩子函数

#### :sun_with_face:生命周期
每个Vue实例在被创建时都要经过一系列的初始化过程：创建实例，装载模板，渲染模板等等。Vue为生命周期中的每个状态都设置了钩子函数（监听函数）。每当Vue实例处于不同的生命周期时，对应的函数就会被触发调用。

生命周期：你不需要立马弄明白所有的东西。

#### :sun_with_face:钩子函数

- beforeCreated：在用Vue时都要进行实例化，因此，该函数就是在Vue实例化时调用，也可以将他理解为初始化函数比较方便一点，在Vue1.0时，这个函数的名字就是init。
- created：在创建实例之后进行调用。
- beforeMount：页面加载完成，没有渲染。如：此时页面还是{{name}}
- mounted：可以将他理解为原生js中的window.onload=function({.,.}),或许大家也在用jquery，所以也可以理解为jquery中的$(document).ready(function(){….})，他的功能就是：在dom文档渲染完毕之后将要执行的函数，该函数在Vue1.0版本中名字为compiled。此时页面中的{{name}}已被渲染成张三
- beforeDestroy：该函数将在销毁实例前进行调用。
- destroyed：改函数将在销毁实例时进行调用。
- beforeUpdate：组件更新之前。
- updated：组件更新之后。

```html
<div id = "app">
    <span id = "num">{{num}}</span>
    <button v-on:click="num++">赞！</button>
    <h2>
        {{name}}，非常帅！！！有{{num}}个人点赞。
    </h2>
</div>

<script src = "../node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#app",
        data: {
            name: "张三",
            num: 100
        },
        methods: {
            show() {
                return this.name;
            },
            add() {
                this.num++;
            }
        },
        beforeCreate() {
            console.log("=========beforeCreate=============");
            console.log("数据模型未加载：" + this.name, this.num);
            console.log("方法未加载：" + this.show());
            console.log("html模板未加载：" + document.getElementById("num"));
        },
        created:function() {
            console.log("=========created=============");
            console.log("数据模型已加载：" + this.name,this.num);
            console.log("方法已加载：" + this.show());
            console.log("html模板已加载：" + document.getElementById("num"));
            console.log("html模板未渲染：" + document.getElementById("num").innerText);
        },
        beforeMount() {
            console.log("=========beforeMount=============");
            console.log("html模板未渲染：" + document.getElementById("num").innerText);
        },
        mounted() {
            console.log("=========mounted=============");
            console.log("html模板已渲染：" + document.getElementById("num").innerText);
        },
        beforeUpdate() {
            console.log("=========beforeUpdate=============");
            console.log("数据模型已更新：" + this.num);
            console.log("html模板未更新：" + document.getElementById("num").innerText);
        },
        updated() {
            console.log("=========updated=============");
            console.log("数据模型已更新：" + this.num);
            console.log("html模板已更新：" + document.getElementById("num").innerText);
        }
    });
</script>
```





### :sun_with_face:vue模块化开发

- npminstallwebpack-g
全局安装webpack
- npminstall-g@vue/cli-init
全局安装vue脚手架       
- 初始化vue项目；
vueinitwebpackappname：vue脚手架使用webpack模板初始化一个appname项目
- 启动vue项目；
项目的package.json中有scripts，代表能运行的命令        
npmstart=npmrundev：启动项目        
npmrunbuild：将项目打包    

### :sun_with_face:模块化开发

#### :sun_with_face:项目结构
![](https://image.codingce.com.cn/20210209165304.png)

运行流程

进入页面首先加载index.html和main.js文件。

- main.js导入了一些模块【vue、app、router】，并且创建vue实例，关联index.html页面的<divid=”app”>元素。使用了router，导入了App组件。并且使用<App/>标签引用了这个组件
- 第一次默认显示App组件。App组件有个图片和<router-view>，所以显示了图片。但是由于<router-view>代表路由的视图，默认是访问/#/路径（router路径默认使用HASH模式）。在router中配置的/是显示HelloWorld组件。
- 所以第一次访问，显示图片和HelloWorld组件。
- 尝试自己写一个组件，并且加入路由。点击跳转。需要使用<router-linkto="/foo">GotoFoo</router-link>标签




#### :sun_with_face:Vue单文件组件

Vue单文件组件模板有三个部分；
```html
<template>
    <div class="hello">
    <h1>{{msg}}</h1>
    </div>
</template>

<script>
    export default{
        name: 'HelloWorld',
        data() {
            return{
                msg: 'WelcometoYourVue.jsApp'
            }
        }
    }
</script>

<!--Add"scoped"attributetolimitCSStothiscomponentonly-->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }
</style>
```

- Template：编写模板
- Script：vue实例配置
- Style：样式



### 导入element-ui快速开发
1、安装element-ui：npmielement-ui     
2、在main.js中引入element-ui就可以全局使用了。
```bash         
importElementUIfrom'element-ui'      
import'element-ui/lib/theme-chalk/index.css'     
Vue.use(ElementUI)      
```
3、将App.vue改为element-ui中的后台布局     
4、添加测试路由、组件，测试跳转逻辑      
(1)、参照文档el-menu添加router属性     
(2)、参照文档el-menu-item指定index需要跳转的地址       