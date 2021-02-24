---
title: JS原型
date: 2018-9-5
tags: 
  - Javascript
---

## 数据类型
js有六种数据类型`Number、String、Boolean、Undefined、Null`（ECMAScript 2015新增了一种基本数据类型：`symbol`）
我们可以用typeof检测数据类型
```js
typeof 123  // Number
typeof 'abc' // String
typeof true  // Boolean
typeof undefined  // Undefined
typeof null  // Object
typeof { }  // Object
typeof [ ]  // Object
typeof new Number(1)  // Object
typeof console.log()  // Function
```

`undefined, number, string, boolean`属于值类型，可以用typeof检测。但是函数、对象、数组、null、new Number()都是对象，它们引用类型。

#### 判断引用类型我们可以使用`instanceof` 
```js
const fn = function() {}
fn instanceof Object // true
```

::: warning 重点提示
一切（引用类型）都是对象，对象是属性的集合
:::
```js
const obj = {
	a: 1,
	b: function() {
		...
	},
	c: {
		name: 'jack'
	}

}
```
在js中数组、函数、数组都是对象。<font color=#9c27b0>**对象里面一切都是属性(包含方法)**</font>。方法也是一种属性，因为它的属性表示为键值对的形式。
并且js对象可以任意扩展属性。

那么可以给函数，数组添加属性吗？当然不行，但是它可以以另一种方式添加属性。只要是对象，就是属性和方法的合集。
```js
var fn = function() {}
fn.a = 123
fn.b = function() {}
fn.c = {
	name: 'jack'
}
```
上面我们对函数fn添加了a、b、c三个属性，此时的fn就是属性的集合。



## 函数和对象
函数和数组是一种对象，数组我们可以说是对象的一种，数组就像对象的一种子集一样。但函数和对象不仅仅是一种包含和被包含的关系，有一种相互共生的意思。
```js
var Fn() {
	this.name = 'tom'
	this.year = '1993'
}
var fn1 = new Fn()
```

通过上面我们发现<font color=#9c27b0>**对象可以通过函数来创建**</font>,但是我们平时创建对象是这样的
```js
var obj = {
	a: 2,
	b: 3
}
var arr = [1, 2, true]
```

这其实是js语法糖，js为了我们方便我们，简化代码的一种‘快捷方式’。
以上代码本质是：
```js
var obj = new Object()
obj.a = 2
obj.b = 3

var arr = new Array()
arr[0] = 1
arr[1] = 2
arr[2] = true
```
而其中的 Object 和 Array 都是函数
```js
typeof Object // function
typeof Array // function
```
所以我们可以确定的说<font color=#9c27b0>**对象都是通过函数来创建的**</font>

这就是扯淡的地方，对象都是通过函数来创建的，而函数又是一种对象。
要搞清楚这个我们就必须去理解prototype原型了。



## prototype原型
在js中默认给每个函数一个属性prototype。这个prototype的属性值是一个对象，而且js给这个对象给了个constructor的属性,<font color=#9c27b0>**指向这个函数本身**</font>

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/prototypes/img1.png)

在Object原型中除了constructor还有很多其他属性，当然我们也可以自己添加属性。
以jQuery为例
```js
var $div = $('div')
$div.attr('id', 12)
```
以上代码$div返回的一个对象，对象是通过函数创建的。
```js
jQuery.prototype.attr = function() { ... }

$('div') = new jQuery()
```
用自己的代码演示就是
```js
function Fn() { }
Fn.prototype.name = 'jack'
Fn.prototype.getYear= function() {
	return 1993
}

var fn = new Fn()
console.log(fn.name)
console.log(fn.getYear())
```
Fn是个函数，fn是Fn函数new出来，是Fn的引用。这样fn就可以调用Fn.prototype中的属性。

而且每个对象都有一个隐藏的属性`__proto__`，这个属性引用了创建这个对象的函数的prototype。

即：`fn.__proto__ === Fn.prototype`



## 隐式原型
#### <font color=#9c27b0>每个函数function都有一个prototype</font>，即原型。同时<font color=#9c27b0>每个对象都有一个__proto__</font>,可成为隐式原型。

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/prototypes/img3.png)

从上图来看`obj.__proto__ === obj.prototype` 

即，<font color=#9c27b0>**每个对象都有一个__proto__属性，指向创建该对象的函数的prototype**</font>

上图中的`object.prototype`也是个对象，那么他的`__proto__`指向哪里？

我们自己定义函数的prototype的本质和`var obj = {}`是一样的，都是被Object创建，所以他的`__proto__`指向`Object.prototype`。

::: warning 重点提示
但是`Object.prototype`是一个特例，它的·`__proto__`指向`null`
:::

函数也是对象，函数也有`__proto__`吗？

当然有，函数是通过`Function`创建的，这是个大写的F。
```js
var fn = function(x, y) {
	return x + y
}
console.log(fn(1, 2))

var fn2 = new Function('x', 'y', 'return x + y')
console.log(fn1(1, 2))
```
第一种是我们常用方式，第二种是通过`new Function`来创建。
::: danger
首先根本不推荐使用Function来创建函数(此处只是演示)
:::

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/prototypes/img6.png)


上图中的`Foo.__proto__`根据__proto__属性，指向创建该对象的函数的prototype，所以指向`Function.prototype`，`Object.__proto__`指向`Function.prototype`，还有一个`Function.__proto__`指向`Function.prototype`这是个是一个环形结构。

Function是一个函数，函数是一种对象，也有__proto__属性。既然是函数它一定是被Function创建。所以Function是被自身创建，所以它的__proto__指向自身的prototype。

还有一个问题，`Function.prototype`指向的对象，它的__proto__是不是也指向`Object.prototype`？
答案是肯定的，因为`Function.prototype`指向的对象也是被一个普通的被Object创建的对象，所以也遵循基本的规则。



## instanceof

instanceof用于我们typeof返回object/function时，我们不知道它是对象还是数组或者new Number时。
```js
function Fn() {}
var fn = new Fn()

fn instanceof Fn  // true
fn instanceof Object  // true
fn instanceof Function  // true
```
要弄懂fn由Fn创建，为什么fn instanceof Object为true了，先看下图

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/prototypes/img7.png)

#### 重点看上图，看似繁杂，但是我们必须一步步分析，首先温故两个概念
::: warning 重点提示
- 每个对象都有一个__proto__属性，指向创建该对象的函数的prototype
- 每个函数都有一个属性叫做prototype
且默认的只有一个叫做constructor的属性，指向这个函数本身
:::

- f1由Foo创建，所以f1的__proto__指向Foo.prototype，而Foo是由function Foo创建，Foo也是一个函数，函数的prototype和onstructor指向函数本身，
所以function Foo和Foo.prototype相互关联。
- Foo.prototype的原型是个对象，他的__proto__往上找就是Object.prototype，而Object是由function Object创建，所以function Object的__proto__指向Function.prototype
- Function.prototype是个对象所以它的__proto__指向Object.prototype

#### instanceof是如何判断的
首先Instanceof运算符的第一个变量是一个对象，暂时称为A；第二个变量一般是一个函数，暂时称为B。

Instanceof的判断队则是：沿着A的__proto__这条线来找，同时沿着B的prototype这条线来找，如果两条线能找到同一个引用，即同一个对象，那么就返回true。如果找到终点还未重合，则返回false。

#### 自己实现一个instanceof，就是检测A的原型链（__proto__）上是否有B.prototype，若有返回true，否则false。
```js

function instance_of(A, B) { // A表示左表达式，B表示右表达式 
    var O = B.prototype;   // 取 R 的显示原型 
    A = A.__proto__;  // 取 L 的隐式原型

    while (true) {    
        if (A === null)      
             return false;   
        if (O === A)  // 当 O 显式原型 严格等于  A隐式原型 时，返回true
             return true;   
        A = A.__proto__;  
    }
}
```

Instanceof这样弄的意思其实想表达一种继承关系，或者原型链的结构。



## 继承
javascript中如何通过原型链来实现继承的
```js
function Foo() { }
var f1 = new Foo()

f1.a = 10

Foo.prototype.a = 100
Foo.prototype.b = 200

console.log(f1.a) // 10
console.log(f1.b) // 200
```
以上代码中，f1是由Foo函数new出来的对象，f1.a是f1对象的基本属性，f1.b是从Foo.prototype得来，因为`f1.__proto__`指向的是`Foo.prototype`。

::: warning 重点提示
访问一个对象的属性时，先在基本属性中查找，如果没有，再沿着__proto__这条链向上找，这就是原型链。
:::

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/prototypes/182013450814552.png)

上图中，访问f1.b时，f1的基本属性中没有b，于是沿着__proto__找到了Foo.prototype.b。

在实际应用中我们可以通过`hasOwnProperty`来区分一个属性到底是基本的还是从原型中找到。
```js
function Foo() { }
var f1 = new Foo()

f1.a = 10

Foo.prototype.a = 100
Foo.prototype.b = 200

for(var item in f1) {
	console.log(a) // a b
}

for(var item in f1) {
	if (f1.hasOwnProperty(item))
	console.log(a) // a
}
```
- 首先我们发现f1根本没有hasOwnProperty这个属性方法，而且Foo.prototype中也没有，而Object.prototype中是有asOwnProperty。

- 对象的原型链是沿着__proto__这条线走的，因此在查找f1.hasOwnProperty属性时，就会顺着原型链一直查找到Object.prototype。

- 所以所有的对象都会找到Object.prototype，因此所有的对象都会有Object.prototype的方法。这就是所谓的“继承”。

- 我们都知道每个函数都有call，apply方法，都有length，arguments，caller等属性。函数由Function函数创建，因此继承的Function.prototype中的方法,因此每个函数都可以用这些方法。

- 而且函数也有hasOwnProperty，上节说到重复下Function.prototype的__proto__指向Object.prototype，那所以Function.prototype继承了来自Object.prototype的方法。



## 灵活性
在Java和C#中，class如同一个模具，对象就是根据这个模具来创建的，创建完成是不能随便改动的。

而在js中，没有模具，你可以随意改变。

#### js的对象属性是可以随时改动的。

对象或者函数被new出来后，可能没有任何属性。但是后面你可以不断添加属性，非常灵活。

例如在jQuery源码中，对象被创建时什么属性都没有，都是代码一步一步执行时，一个一个加上的。
```js
jQuery = function(selector, context) {
	return jQuery.fn.init(selector, context)
}

jQuery.extend({
	expando: "jQuery" + (version + Math.random().relplace(/\D/g, "")),
	isReady: true,
	error: function(msg) {
		throw new Error(msg)
	},
	noop: function() {}
})

```

#### 如果继承的方法不合适，可以做出修改。
```js
var obj = {
	a: 10,
	b: 20
}
console.log(obj.toString()) // [object Object]

var arr = [1, 2, 3]
console.log(arr.toString()) // 1, 2, 3
```
arr本身属性是没有toString的，它的toString来自__proto__指向的Object.prototype。但是我们发现两次toString结果不一样。肯定是肯定是Array.prototype.toString()方法做了修改。

同理，我也可以自定义一个函数，并自己去修改prototype.toString()方法。

```js
function Foo() { }
var f1 = new Foo()

Foo.prototype.toString = function() {
	return 'toString已修改'
}

console.log(f1.toString()) // toString已修改
```

#### 如果觉得缺少你要用的方法，也可以自己创建。

如在Date对象中添加格式化方法。
```js
Date.prototype.format = function(fmt) {
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if (/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if (new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  
```



## es6中class
综上所述的我们要创建一个类（对象），我们可以通过函数创建，再prototype上添加属性方法。
```js
function Person(name) {
  this.name = name
}

Person.prototype.getName = function() {
  return this.name
}

var person = new Person('tom')
console.log(person.getName()) // tom
```

ES6引入了Class（类）这个概念，通过class关键字可以定义类。该关键字的出现使得其在对象写法上更加清晰，更接近java/c#那些后台语言。

用ES6重写上面代码
```js
class Person() {
	constructor(name) {
		this.name = name
	}

	getName() {
		return this.name
	}
}

var person = new Person('tom')
console.log(person.getName()) // tom
```

对于es6中的class，其实就是第二章提到语法糖。它的绝大部分功能，ES5都可以看到，新的class写法只是让对象原型的写法更加清晰，更像面向对象编程语法而已。
```js
console.log(typeof Person) //function
console.log(Person === Person.prototype.constructor) //true
```
从上面代码Person其实还是由函数创建，它也有自己的prototype, prototype下的属性constructor指向其本身。

我们可以通过prototype重写getName方法。
```js
class Person() {
	constructor(name) {
		this.name = name
	}

	getName() {
		return this.name
	}
}

Person.prototype.getName = function() {
	return 'prototype ' + this.name
}

const person = new Person('tom')
console.log(person.getName()) // prototype tom
```
实际上类的所有方法都定义在类的prototype属性上。

当然我们也可以使用person的__proto__来添加属性。但是使用__proto__属性会改写原型，会改变Class的原始定义，影响到所有实例，所以不推荐使用！

