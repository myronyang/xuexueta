---
title: JS设计模式
date: 2019-4-5
tags: 
  - Javascript
  - 设计模式
---

## 设计原则

### 何为设计
- 即按照一种思路或者标准来实现功能
- 功能相同，可以由不同设计方案来实现
- 伴随需求的增加，设计的作用才能体现出来

### UNIX/LINUX设计思想

参考文献 [《UNIX/LINUX设计思想》](https://download.csdn.net/download/kxjrzyk/10868478)

#### 准则1: 小即是美
#### 准则2: 让每个程序只做好一件事
<font color=#999>把每个子程序做的足够小，实现单一功能，大程序是各个小程序的集合。</font>

#### 准则3: 快速建立原型
<font color=#999>不管产品还是程序，先实现基本功能，再一步步扩展。</font>

#### 准则4: 舍弃高效率而取可移植性
<font color=#999>例如组件或插件的通用性优先级高于高效性，长远看同个组件适用多个项目，将节省大量成本。</font>

#### 准则5: 采用纯文本来储层数据
<font color=#999>在效率和可读性上的取舍。</font>

#### 准则6: 充分利用软件的杠杆效应（软件复用）
#### 准则7: 使用shell脚本来提高杠杆效应和可移植性
#### 准则8: 避免强制性的用户界面
#### 准则9: 让每个程序都称为过滤器

#### <font color=#9c27b0>精简设计思想中的小准则</font>
#### 小准则：允许用户定制环境
#### 小准则：尽量使操作系统内核小而轻量化
#### 小准则：使用小写字母尽量缩短
#### 小准则：沉默是金
#### 小准则：各部分之和大于整体
#### 小准则：需求90%的解决方案
<font color=#999>例如二八定律，花20%的成本解决80%的需求</font>


## SOLID五大设计原则

#### S-单一职责原则
- 一个程序只做好一件事
- 如果功能过于复杂就拆分开，每个部分保持独立

#### O-开放封闭原则
- 对扩展开放，对修改封闭
- 怎加需求时，扩展新代码，而非修改已有代码

#### L-李氏置换原则
- 子类能覆盖父类
- 父类能出现的地方子类就能出现
- JS中使用较少（弱类型&继承使用较少）

#### I-接口独立原则
- 保持接口的单一独立，避免出现“胖接口”
- JS中没有接口（typescript除外），使用较少
- 类型单一职责原理，这里更关注接口

#### D-依赖倒置原则
- 面向接口编程，依赖于抽象而不依赖具体
- 使用方只关注接口而不关注具体类的实现
- JS中使用较少（弱类型&没有接口）

> <big>前端SO体现较多，重点理解，LID体现较少，但可了解其用意。</big>

```js
const loadImg = src => {
	return new Promise((resolve, reject) => {
		const img = document.createElement('img')
		img.onload = function() {
			resolve(img)
		}
		img.onerror = function() {
			resolve('加载失败')
		}
		img.src = src
	})
}

const src = " ... img path"
const result = loadImg(src)

result.then(img => {
	console.log('img.width', img.width)
	return img
}).then(img => {
	console.log('img.height', img.height)
}).catch(err => {
	console.log(err)
})
```
从以上代码体现：
- 单一职责原则：在每个`then`中只做好一件事
- 开放封闭原则：如果有新需求我们只需扩展`then`



## 设计模式

#### 创建型
<font color=#999>这几种模式主要是对象该如何创建出来</font>
- 工厂模式（工厂方法模式, 抽象工厂模式, 建造者模式）
- 单例模式
- 原型模式

#### 组合型
<font color=#999>类和对象该是怎样的组合形式</font>
- 适配器模式
- 装饰器模式
- 代理模式
- 外观模式

#### 行为型
<font color=#999>这几种设计模式涵盖日常开发中常用行为</font>
- 观察者模式
- 迭代器模式
- 状态模式

### 工厂模式
工厂模式是我们最常用的实例化对象模式，是用工厂方法代替new操作的一种模式。因为工厂模式就相当于创建实例对象的new，我们经常要根据类Class生成实例对象，如A a=new A() 工厂模式也是用来创建实例对象的，所以以后new时就注意，是否可以考虑使用工厂模式。

![工厂模式](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/designs/1.png)
```js
class Product {
    constructor(name) {
        this.name = name
    }
    init() {
        alert('init')
    }
    fun() {
        alert('fn1')
    }
}

class Creator {
    create(name) {
        return new Product(name)
    }
}

let creator = new Creator()
let p = creator.create('p1')
p.init()
p.fun()
```
我们只需要creator.create能生成一个实例，而不用关心Product的具体逻辑。

#### 实际应用
```js
class jQuery {
    constructor(selector) {
        let slice = Array.prototype.slice
        let dom = slice.call(document.querySelectorAll(selector))
        let len = dom ? dom.length : 0
        for (let i = 0; i < len; i++) {
            this[i] = dom[i]
        }
        this.length = len
        this.selector = selector || ''
    }
    append(node) {

    }
    addClass(name) {

    }
    html(data) {

    }
    // 此处省略若干 API
}
window.$ = function (selector) {
    return new jQuery(selector)
}
```
想象一下如果jQuery没有使用工厂模式
- $('div')将要写成 new jQuery(selector)代码作将变得繁琐
- 一旦构造函数jQuery有变化，使用者也要改变


#### 设计原则验证：

- 工造函数和创建者分离
- 符合开放封闭原则




### 单例模式
单例模式，是一种常用的软件设计模式。在它的核心结构中只包含一个被称为单例的特殊类。通过单例模式可以保证系统中，应用该模式的类一个类只有一个实例。即一个类只有一个对象实例。

![单例模式](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/designs/1.jpg)


单例模式用到了 java 的一些特性，而 es6 没有这些特性，因此只能用 java 进行演示。

```js
public class SingleObject {
    // 注意，私有化构造函数，外部不能 new ，只能内部能 new ！！！！
    private SingleObject(){
    }
    // 唯一被 new 出来的对象
    private SingleObject instance = null;
    // 获取对象的唯一接口
    public SingleObject getInstance() {
        if (instance == null) {
            // 只 new 一次
            instance = new SingleObject();
        }
        return instance;
    }

    // 对象方法
    public void login(username, password){
      System.out.println("login...");
   }
}
```

单例模式的关键在于不能让外部使用者 new 出对象，即构造函数是 private ，这一点 JS 是无法实现的。


```js
class SingleObject {
    login() {
        console.log('login...')
    }
}
SingleObject.getInstance = (function () {
    let instance
    return function () {
        if (!instance) {
            instance = new SingleObject();
        }
        return instance
    }
})()

// 测试：注意这里只能使用静态函数 getInstance ，不能 new SingleObject() ！！！
let obj1 = SingleObject.getInstance()
obj1.login()
let obj2 = SingleObject.getInstance()
obj2.login()
console.log(obj1 === obj2)  // 两者必须完全相等
```

#### 实际应用

日常使用中，很多都用到了单例的思想，但是不一定完全按照单例的类图来实现：

```js
// jQuery 只有一个 `$`
if (window.jQuery != null) {
    return window.jQuery
} else {
    // 初始化...
}
```

模拟实现一个登录框

```js
class LoginForm {
    constructor() {
        this.state = 'hide'
    }
    show() {
        if (this.state === 'show') {
            alert('已经显示')
            return
        }
        this.state = 'show'
        console.log('登录框已显示')
    }
    hide() {
        if (this.state === 'hide') {
            alert('已经隐藏')
            return
        }
        this.state = 'hide'
        console.log('登录框已隐藏')
    }
}
LoginForm.getInstance = (function () {
    let instance
    return function () {
        if (!instance) {
            instance = new LoginForm();
        }
        return instance
    }
})()

// 一个页面中调用登录框
let login1 = LoginForm.getInstance()
login1.show()
// login1.hide()

// 另一个页面中调用登录框
let login2 = loginForm.getInstance()
login2.show()

// 两者是否相等
console.log('login1 === login2', login1 === login2)
```

- 购物车，和登录框实现方式差不多
- 所有弹框遮罩层只有一个实例

#### 单例模式 vs 单一职责原则

- 单一职责原则是针对所有的设计，单个功能尽量拆分，一个模块做好一个功能。如果做不好，会带来模块臃肿，不好维护
- 单例模式是系统的只能有一份唯一的数据，如果不这样做，会出 bug 的

#### 设计原则验证

- 符合单一职责原则，只实例化唯一的对象
- 没法具体开放封闭原则，但是绝对不违反开放封闭原则



### 适配器模式
将一个类的接口适配成用户所期待的。一个适配允许通常因为接口不兼容而不能在一起工作的类工作在一起，做法是将类自己的接口包裹在一个已存在的类中。

![适配器模式](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/designs/1.png)

```js
class Adaptee {
    specificRequest() {
        return '德国标准的插头'
    }
}

class Target {
    constructor() {
        this.adaptee = new Adaptee()
    }
    request() {
        let info = this.adaptee.specificRequest()
        return `${info} -> 转换器 -> 中国标准的插头`
    }
}

// 测试
let target = new Target()
target.request()
```

#### 实际应用

随着前端框架的发展，越来越多的开发者开始使用MVVM框架进行开发，只需要操作数据而不需要操作DOM元素，jQuery的作用越来越少。而很多项目中还是引用着jQuery库作用工具类，因为我们要利用jQuery提供的ajax去服务器请求数据。如果jQuery在项目中的作用仅仅是作为ajax工具库的话，有点杀鸡焉用牛刀的感觉，造成资源浪费。这个时候我们完全可以封装一个自己的ajax库。 假设我们封装的ajax就通过一个函数进行使用：


```js
// 自己封装的 ajax ，使用方式如下：
ajax({
    url:'/getData',
    type:'Post',
    dataType:'json',
    data:{
        id:"123"
    }
})
.done(function(){})

// 但因为历史原因，代码中全都是：
// $.ajax({...})
```

除了调用接口ajax与jQuery的$.ajax的不同，其他完全一样。 项目中请求ajax的地方必然很多，我们替换jQuery的时候不可能一个一个去修改$.ajax，那怎么办呢，这个时候，我们就可以增加一个适配器：

```js
// 做一层适配器
var $ = {
    ajax:function (options){
        return ajax(options);
    }
}
```

#### 设计原则验证
- 将现有接口和使用者进行分离
- 符合开放封闭原则



### 装饰器模式

装饰器模式（Decorator Pattern）允许向一个现有的对象添加新的功能，同时又不改变其结构。这种类型的设计模式属于结构型模式，它是作为现有的类的一个包装。动态地给一个对象添加一些额外的职责。就增加功能来说，装饰器模式相比生成子类更为灵活。

![装饰器模式](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/designs/1.jpg)

```js
class Circle {
    draw() {
        console.log('画一个原型')
    }
}

class Decorator {
    constructor(circle) {
        this.circle = circle
    }
    draw() {
        this.circle.draw()
        this.setRedBoder(circle)
    }
    setRedBoder(circle) {
        console.log('设置红色边框')
    }
}

// 测试代码
let circle = new Circle()
circle.draw()

let dec = new Decorator(circle)  // 装饰
dec.draw()
```

#### 实际应用

就 ES7 标准中增加的装饰器来体会一下装饰器模式在 JS 中的应用。

如果node -v是6.x版本的话，要安装npm i babel-plugin-transform-decorators-legacy --save-dev，然后修改.babrlrc

```js
{
    "presets": ["es2015", "latest"],
    "plugins": ["transform-decorators-legacy"]
}
```

#### ES7 装饰器
```js
// 一个简单的 demo
@testDec
class Demo {
  // ...
}

function testDec(target) {
  target.isDec = true;
}
alert(Demo.isDec) // true
```

可以加参数

```js
// 可以加参数
function testDec(isDec) {
  return function(target) {
    target.isDec = isDec;
  }
}

@testDec(true)
class Demo {
    // ...
}
alert(Demo.isDec) // true
```

装饰器的原理
```js
// 装饰器的原理

@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

最后一个示例
```js
function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}

const Foo = {
  foo() { alert('foo') }
}

@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo() // 'foo'
```

#### 装饰方法

```js
function readonly(target, name, descriptor){
  // descriptor 属性描述对象（Object.defineProperty 中会用到），原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

class Person {
    constructor() {
        this.first = 'A'
        this.last = 'B'
    }

    // 装饰方法
    @readonly
    name() { return `${this.first} ${this.last}` }
}

var p = new Person()
console.log(p.name())
// p.name = function () {} // 这里会报错，因为 name 是只读属性
```

#### 设计原则验证
- 将现有对象和装饰器进行分离，两者独立存在
- 符合开放封闭原则
