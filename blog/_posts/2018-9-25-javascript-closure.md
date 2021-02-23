---
title: JS闭包
date: 2018-9-25
tags: 
  - Javascript
---

## 执行上下文
什么是“执行上下文”(也叫做“执行上下文环境”）？我们先不定义，先看以下几种情况。

#### 第一种情况，变量声明，默认赋值为undefined
首先我们在浏览器控制台来调试一段代码。
```js
console.log(a) // Uncaught ReferenceError: a is not defined

console.log(a) // undefined
var a

console.log(a) // undefined
var a = 10
```
第一个打印报错，因为a未定义。第二个、第三个输出都是undefined，说明浏览器在执行console.log(a)时，已经知道了a是undefined，但却不知道a是10（第三句中）。

在一段js代码运行前，浏览器会做一些“准备工作”，其中就包括对变量的的声明，而不是赋值。

变量赋值是在赋值语句执行的时候进行的。
```js
console.log(a) // 首先声明a, 默认值为undefined
var a = 10 // 给a赋值为10
```
#### 第二种情况，直接给this赋值
我们知道无论在哪个位置获取this都是有值的。通常来讲this指向对应的执行环境，详细的下面会花专门一章来讲解this。
```js
console.log(this) 
// Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
```

与第一种情况不同的是第一种只是对变量进行了声明，并没有赋值。而这种情况直接给this赋值。这也是“准备工作”情况要做的事情之一。


#### 另外还有第三种情况, “函数声明“和“函数表达式“。
虽然两者都很常用，但是这两者在“准备工作”时，却是两种不同的情况。

```js
console.log(f1) // ƒ f1() {}
function f1() {} // 函数声明

console.log(f2) // undefined
var f2 = function() {} // 函数表达式
```
以上代码“函数声明”我们看到了第二种情况，直接给f1赋值了。而函数表达式则是第一种情况。
在“准备工作”中对待函数表达式，就像对待`var a = 10`这样的变量一样，只是声明。而对待函数声明时，却把函数整个赋值了。

::: warning 总结下在“准备工作”中完成了哪些工作
- 变量、函数表达式——变量声明，默认赋值为undefined。
- this——赋值。
- 函数声明——赋值。
#### 这三种数据的准备情况我们称之为“执行上下文”或者“执行上下文环境”。
:::

上面所有的例子都是在全局环境下执行的。在js执行一段代码前，都会进行这些“准备工作”来生成执行上下文。
**这个“代码段”其实分三种情况——全局代码，函数体，eval代码。**

什么是代码段？就是一段文本形式的代码。

#### 首先，全局代码是一种，就是手写文本到`<script>`标签里面的。
```js
<script type="text/javascript">
  // 代码段...
</script>
```

#### 其次，eval代码接收的也是一段文本形式的代码(eval不常用，不推荐)。
```js
eval('alert(123)')
```

#### 最后，函数体是代码段是因为函数在创建时，本质上是 new Function(…) 得来的，其中需要传入一个文本形式的参数作为函数体。
```js
function fn(x) {
	console.log(x)
}

var fn = new Function('x', 'console.log(x)')
```

如果在函数中，除了以上数据之外，还会有其他数据。
```js
function fn(x) {
	// arguments封装函数参数的数组
	console.log(arguments) // [10]
	console.log(x) // 10
}
fn(10)
```
以上代码展示了在函数体的语句执行之前，arguments变量和函数的参数都已经被赋值。从这里可以看出，**函数每被调用一次，都会产生一个新的执行上下文环境**。因为不同的调用可能就会有不同的参数。

另外一点不同在于，**函数在定义的时候（不是调用的时候），就已经确定了函数体内部自由变量的作用域**。用一个例子说明：
```js
var a = 10
function fn() {
	// a是自由变量
	// 函数创建时，就确定了a要取值的作用域
	console.log(a)
}

function bar(f) {
	var a = 20
	f() // 打印‘10’，而不是‘20’
}
bar(fn)
```

#### 总结完了函数的附加内容，我们就此要全面总结一下上下文环境的数据内容。

全局代码的上下文环境数据内容为：
| 场景          | 结果          |
| ------------- |:-------------:|
| 普通变量（包括函数表达式），如： var a = 10; | 声明（默认赋值为undefined） |
| 函数声明，如： function fn() { } | 赋值 |
| this | 赋值 |

如果代码段是函数体，那么在此基础上需要附加：
| 场景          | 结果          |
| ------------- |:-------------:|
| 参数 | &emsp;&emsp;&emsp;赋值&emsp;&emsp;&emsp; |
| arguments | 赋值 |
| 自由变量的取值作用域 | 赋值 |

::: warning 给执行上下文环境下一个通俗的定义
在执行代码之前，把将要用到的所有的变量都事先拿出来，有的直接赋值了，有的先用undefined占个空。
:::

在执行js代码时，会有数不清的函数调用次数，会产生许多个上下文环境。这么多上下文环境该如何管理，以及如何销毁而释放内存呢？下下节将通过“执行上下文栈”来解释这个问题。



## this
在说“执行上下文栈”前，先把this说一下。其实，this的取值，分四种情况。

::: warning 强调一遍一个非常重要的知识点
**在函数中this到底取何值，是在函数真正被调用执行的时候确定的，函数定义的时候确定不了。**

因为this的取值是执行上下文环境的一部分，每次调用函数，都会产生一个新的执行上下文环境。
:::

#### 情况1：构造函数
所谓构造函数就是用来new对象的函数。其实严格来说，所有的函数都可以new一个对象，但是有些函数的定义是为了new一个对象，而有些函数则不是。另外注意，构造函数的函数名第一个字母大写（规则约定）。例如：Object、Array、Function等。
```js
function Foo() {
	this.name = 'Jack'
	this.year = 1993

	console.log(this) // Foo {name: "Jack", year: 1993}
}

var f1 = new Foo()
console.log(f1.name) // 'jack'
```
以上代码中，如果函数作为构造函数用，那么其中的this就代表它即将new出来的对象。

注意，以上仅限new Foo()的情况，即Foo函数作为构造函数的情况。如果直接调用Foo函数，而不是new Foo()，情况就大不一样了。

```js
function Foo() {
	this.name = 'Jack'
	this.year = 1993

	console.log(this) // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
}

Foo()
```
这种情况下this是window，我们后文中会说到。

#### 情况2：函数作为对象的一个属性
如果函数作为对象的一个属性时，**并且作为对象的一个属性被调用时**，函数中的this指向该对象。
```js
var obj = {
	x: 10,
	fn: function() {
		console.log(this) // Object {x: 10, fn: function}
		console.log(this.x) // 10
	}
}
obj.fn();
```
以上代码中，fn不仅作为一个对象的一个属性，而且的确是作为对象的一个属性被调用。结果this就是obj对象。

如果fn函数不作为obj的一个属性被调用，会是什么结果呢？
```js
var obj = {
	x: 10,
	fn: function() {
		console.log(this) // Object {x: 10, fn: function}
		console.log(this.x) // undefined
	}
}

var fn = obj.fn
fn();
```
如上代码，如果fn函数被赋值到了另一个变量中，并没有作为obj的一个属性被调用，那么this的值就是window，this.x为undefined。

#### 情况3：函数用call或者apply调用
当一个函数被call和apply调用时，this的值就取传入的对象的值。
```js
var obj = {
	x: 10
}

var fn = function() {
	console.log(this) // Object {x: 10}
	console.log(this.x) // 10
}

fn.call(obj);
```

#### 情况4：全局 & 调用普通函数
在全局环境下，this永远是window。
```js
console.log(this === window) // true
```
普通函数在调用时，其中的this也都是window。
```js
var x = 10
var fn = function() {
	console.log(this) // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
	console.log(this.x) // 10
}
```
以上代码很好理解，不过下面的情况需要注意一下：
```js
var obj = {
	x: 10,
	fn: function() {
		function f() {
			console.log(this)  // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
			console.log(this.x) // undefined
		}
		f()
	}
}
obj.fn()
```
函数f虽然是在obj.fn内部定义的，但是它仍然是一个普通的函数，this仍然指向window。



## 执行上下文栈
执行全局代码时，会产生一个执行上下文环境，每次调用函数都又会产生执行上下文环境。当函数调用完成时，这个上下文环境以及其中的数据都会被消除，再重新回到全局上下文环境。**处于活动状态的执行上下文环境只有一个**。

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/closures/img1.png)

#### 可根据以下代码来详细介绍上下文栈的压栈、出栈过程。
```js
// 1.进入全局上下文环境
var a = 10, 
    fn,
    bar = function(x) {
    	var b = 5
    	fn(x + b) // 3.进入fn函数上下文环境
    }

fn = function(y) {
	var c = 5
	console.log(y + c)
}

bar(10) // 2.进入bar函数上下文环境
```

在执行代码之前，首先将创建全局上下文环境。

| 全局上下文环境 | |
| ----- |:-----:|
| a | undefined |
| fn | undefined |
| bar | undefined |
| this | window |

然后是代码执行。代码执行到`bar(10)`之前，上下文环境中的变量都在执行过程中被赋值。

| 全局上下文环境 | |
| ----- |:-----:|
| a | 10 |
| fn | undefined |
| bar | undefined |
| this | window |

执行到`bar(10)`，调用bar函数。

跳转到bar函数内部，执行函数体语句之前，会创建一个新的执行上下文环境。

| (bar函数)执行上下文环境 | |
| ----- |:-----:|
| b | undefined |
| x | 10 |
| arguments | [10] |
| this | window |

并将这个执行上下文环境压栈，设置为活动状态。

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/closures/img2.png)

执行到`fn(x + b)`，又调用了fn函数。进入fn函数，在执行函数体语句之前，会创建fn函数的执行上下文环境，并压栈，设置为活动状态。

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/closures/img3.png)

待`fn(x + b)`执行完毕，即fn函数执行完毕后，此次调用fn所生成的上下文环境出栈，并且被销毁（已经用完了，就要及时销毁，释放内存）。

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/closures/img4.png)


同理，待`bar(10)`执行完毕，即bar函数执行完毕后，调用bar函数所生成的上下文环境出栈，并且被销毁（已经用完了，就要及时销毁，释放内存）。

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/closures/img5.png)


#### 其实以上我们所演示的是一种比较理想的情况。有一种情况，而且是很常用的一种情况，无法做到这样干净利落的说销毁就销毁。这种情况就是闭包。



## 作用域
常说“javascript没有块级作用域”。所谓“块”，就是大括号“｛｝”中间的语句。例如在if、for中。
```js
var status = true
if (status) {
	var name = "jack"
}
console.log(a) // jack

for(var i = 0; i < 10; i++) {
	// ...
}
console.log(i) // 10 
```

ES6新增了let命令用来进行变量声明，只在let命令所在代码块内有效。
```js
{
	var a = 3
	let b = 4
}
console.log(a) // 3
console.log(a) // underfind
```

::: warning 除了“javascript没有块级作用域”，还需知道
**javascript除了全局作用域之外，只有函数可以创建的作用域。**

我们在声明变量时，全局代码要在代码前端声明，函数中要在函数体一开始就声明好。除了这两个地方，其他地方都不要出现变量声明。而且建议用“单var”形式。
:::

#### 作用域是一个很抽象的概念，类似于一个“地盘”。

![prototype](http://gxzn-free.oss-cn-zhangjiakou.aliyuncs.com/Web-private-resource/Blog/closures/img6.png)

如上图，全局代码和fn、bar两个函数都会形成一个作用域。而且，作用域有上下级的关系，上下级关系的确定就看函数是在哪个作用域下创建的。例如，fn作用域下创建了bar函数，那么“fn作用域”就是“bar作用域”的上级。

**作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突**。例如以上代码中，三个作用域下都声明了“a”这个变量，但是他们不会有冲突。各自的作用域下，用各自的“a”。

例如jQuery源码的最外层是一个自动执行的匿名函数：
```js
(function(window, underfind) {
	var a, b, c
	// ...
})(window)
```
原因就是在jQuery源码中，声明了大量的变量，这些变量将通过一个函数被限制在一个独立的作用域中，而不会与全局作用域或者其他函数作用域的同名变量产生冲突。


#### 我们把作用域和上下文环境结合起来说一下，会理解的更深一些
```js
// 全局作用域
var a = 1,
    b = 2

function fn(x) { // fn作用域
	var a = 10,
		c = 30

	function bar(x) { // bar作用域
		var a = 100,
			d = 400
	}

	bar(10)
	bar(20)
}

fn(1)

```
如上，我们在上文中已经介绍了，除了全局作用域之外，每个函数都会创建自己的作用域，**作用域在函数定义时就已经确定了。而不是在函数调用时确定**。

- 第一步，在加载程序时，已经确定了全局上下文环境，并随着程序的执行而对变量就行赋值。

| 全局上下文环境 | |
| ----- |:-----:|
| a | 1 |
| b | 2 |
| fn | ƒ fn() |
| 其他 | ... ... |

- 第二步，程序执行到`fn(1)`处，调用fn(1)，此时生成此次调用fn函数时的上下文环境，压栈，并将此上下文环境设置为活动状态。

| fn(1)上下文环境 | |
| ----- |:-----:|
| x | 1 |
| a | 10 |
| b | 30 |
| bar | ƒ bar(x) |
| 其他 | ... ... |


- 第三步，程序执行到`bar(10)`处，调用bar(10)，生成此次调用的上下文环境，压栈，并设置为活动状态。

| bar(10)上下文环境 | |
| ----- |:-----:|
| x | 10 |
| a | 100 |
| d | 400 |
| 其他 | ... ... |


- 第四步，执行完`bar(10)`，bar(10)调用完成。则bar(10)上下文环境被销毁。接着执行到`bar(20)`，调用bar(20)，则又生成bar(20)的上下文环境，压栈，设置为活动状态。

| bar(20)上下文环境 | |
| ----- |:-----:|
| x | 20 |
| a | 100 |
| d | 400 |
| 其他 | ... ... |

- 第五步，执行完`bar(20)`，则bar(20)调用结束，其上下文环境被销毁。此时会回到fn(1)上下文环境，变为活动状态。

| fn(1)上下文环境 | |
| ----- |:-----:|
| x | 1 |
| a | 10 |
| b | 30 |
| 其他 | ... ... |

- 第六步，执行完`fn(1)`，fn(1)执行完成之后，fn(1)上下文环境被销毁，全局上下文环境又回到活动状态。

| 全局上下文环境 | |
| ----- |:-----:|
| a | 1 |
| b | 2 |
| 其他 | ... ... |

**作用域只是一个“地盘”，一个抽象的概念，其中没有变量。要通过作用域对应的执行上下文环境来获取变量的值**。同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值。所以，**作用域中变量的值是在执行过程中产生的确定的，而作用域却是在函数创建时就确定了**。



## 自由变量到作用域链

什么是“自由变量”？

在A作用域中使用的变量x，却没有在A作用域中声明（即在其他作用域中声明的），对于A作用域来说，x就是一个自由变量。

```js
var x = 10
function fn() {
	var b = 20
	console.log(x + b) // 这里x就是自由变量
}
```

如上述代码中，b的值在fn作用域中取，因为b就是在fn中定义。而x的值就需要在另一个作用域中取，但是到哪个作用域中取呢？

**有人说过要到父作用域中取，其实有时候这种解释会产生歧义**。例如：

```js
var x = 10;
function fn() {
	console.log(x)
}

function show(f) {
	var x = 20
	(function() {
		f() // 10
	})()
}

show(fn)
```

所以，不要在用以上说法了。相比而言，用这句话描述会更加贴切——**要到创建这个函数的那个作用域中取值——是“创建”，而不是“调用”，切记切记**——其实这就是所谓的“静态作用域”。

对于本文第一段代码，在fn函数中，取自由变量x的值时，要到哪个作用域中取？——要到创建fn函数的那个作用域中取——无论fn函数将在哪里调用。

上面描述的只是跨一步作用域去寻找。

如果跨了一步，还没找到呢？——接着跨！一直跨到全局作用域为止。要是在全局作用域中都没有找到，那就是真的没有了。

这个一步一步“跨”的路线，我们称之为——作用域链。

```js
var a = 10
function fn() {
	var b = 10

	function bar() {
		console.log(a + b) // 20
	}

	return bar
}

var x = fn(),
	b = 200

x()
```

上述代码中，fn()返回的是bar函数，赋值给x。执行x()，即执行bar()。取b的值时，直接在fn作用域中取出。取a的值时，先在fn()作用域中取，但是没取到，只能转向创建fn的那个作用域中找。



## 闭包
对于闭包笼统的理解只需要知道应用的两种情况即可--**函数作为返回值，函数作为参数传递。**

#### 第一，函数作为返回值
```js
function fn() {
	var max = 10

	return function bar(x) {
		if (x > max) {
			console.log(x)
		}
	}
}

var f1 = fn()
f1(15)
```
以上代码，bar函数作为返回值，赋值给f1变量。执行f1(15)时，用到了fn作用域下的max变量的值。至于如何跨作用域取值，可以参考上一节。

#### 第二，函数作为参数被传递
```js
var max = 10,
	fn = function(x) {
		if (x > max) {
			console.log(x)
		}
	}

(function(f) {
	var max = 100
	f(15)
})(fn)
```
以上代码，fn函数作为一个参数被传递进入另一个函数，赋值给f参数。执行f(15)时，max变量的取值是10，而不是100。

::: warning 自由变量跨作用域取值
#### 要去创建这个函数的作用域取值，而不是“父作用域”。

理解了这一点，以上两端代码中，自由变量如何取值应该比较简单。
:::

讲到闭包，除了结合着作用域之外，还需要结合着执行上下文栈来说。

前面讲执行上下文栈时，提到当一个函数被调用完成之后，其执行上下文环境将被销毁，其中的变量也会被同时销毁。

但是在最后说到——有些情况下，函数调用完成之后，其执行上下文环境不会接着被销毁。**这就是需要理解闭包的核心内容**。

可以拿本文的第一段代码（稍作修改）来分析一下。
```js
// 全局作用域
function fn() { 
	// fn作用域
	var max = 10

	return function bar(x) { 
		// bar作用域
		if (x > max) {
			console.log(x)
		}
	}
}

var f1 = fn(),
	max = 100
f1(15)
```

#### 第一步，代码执行前生成全局上下文环境，并在执行时对其中的变量进行赋值。此时全局上下文环境是活动状态。
| 全局上下文环境 | |
| ----- |:-----:|
| fn | ƒ fn() |
| f1 | underfind |
| max | underfind |
| 其他 | ... ... |

#### 第二步，代码执行到`var f1 = fn()`，产生fn()执行上下文环境，压栈，并设置为活动状态。
| fn上下文环境 | |
| ----- |:-----:|
| max | 10 |
| 其他 | ... ... |

#### 第三步，代码执行完`var f1 = fn()`，fn()调用完成。按理说应该销毁掉fn()的执行上下文环境，但是这里不能这么做。因为执行fn()时，**返回的是一个函数。函数的特别之处在于可以创建一个独立的作用域**。而正巧合的是，返回的这个函数体中，还有一个自由变量max要引用fn作用域下的fn()上下文环境中的max。因此，这个max不能被销毁，销毁了之后bar函数中的max就找不到值了。

因此，这里的fn()上下文环境不能被销毁，还依然存在与执行上下文栈中。

即，执行到`max = 100`时，全局上下文环境将变为活动状态，但是fn()上下文环境依然会在执行上下文栈中。另外，执行完到`max = 100`时，全局上下文环境中的max被赋值为100。
| 全局上下文环境 | |
| ----- |:-----:|
| fn | ƒ fn() |
| f1 | ƒ bar(x) |
| max | 100 |
| 其他 | ... ... |


#### 第四步，执行到`f1(15)`，执行f1(15)，即执行bar(15)，创建bar(15)上下文环境，并将其设置为活动状态。
| bar(15)上下文环境 | |
| ----- |:-----:|
| x | 15 |
| 其他 | ... ... |

执行`bar(15)`时，max是自由变量，需要向创建bar函数的作用域中查找，找到了max的值为10。

这里的重点就在于，创建bar函数在执行fn()时创建的。fn()早就执行结束了，但是fn()执行上下文还存在与栈中，因为bar(15)时，max可以查找到。如果fn()上下文环境销毁了，那么max就找不到了。

**使用闭包会增加内容开销，现在很明显了吧！**

#### 第五步，执行完`fn(15)`就是上下文环境的销毁过程，这里就不再赘述了。

闭包和作用域、上下文环境有着密不可分的关系，需一步步理解,
