---
sidebar: auto
pageClass: common-class
---

# javascript异步

## 何为异步

#### JS 为何会有异步

JS 是单线程的语言，所谓“单线程”就是一根筋，对于拿到的程序，一行一行的执行，上面的没执行为完，那就等着。
```js
var i,
	t = Date.now()

for (i = 0; i < 100000000; i++) {
	// ...
}
console.log(Date.now() - t) // 250
``` 
上面的程序花费 250ms 的时间执行完成，执行过程中就会有卡顿，其他的代码暂时不管了。

这样执行本问题，但是对于 JS 最初使用的环境“浏览器客户端”就不行了。因为浏览器在客户端运行js，可能会有大量的网络请求，**而一个网络资源啥时候返回，这个时间是不可预估的**，这种情况等着，那客户端体验就太糟了。

因此，JS 对于这种场景就设计了异步。 --即，发起一个网络请求，就先不管这边了，先干其他事儿，网络请求啥时候返回结果，到时候再说。这样就能保证一个网页的流程运行。

#### 异步的实现原理
我们在jQuery常用的ajax请求。
```js
var ajax = $.ajax({
  url: '/data/data1.json',
  success: function () {
      console.log('success')
  }
})
```
当请求成功时success函数才会执行。**对于这种传递过去不执行，等出来结果之后再执行的函数，叫做callback，即回调函数。**

从上传文件时更加能说明回调函数。唯一区别就是：上面代码时网络请求，而下面代码时 IO 操作。

```js
var reader = new FileReader()
reader.readAsDataURL(file);
reader.onload = function(e) {
  // ...
};
```
从上面例子来看，**实现异步的最核心原理，就是将callback作为参数传递给异步执行函数，当有结果返回之后再触发 callback执行**，就是如此简单！

#### 常用的异步操作

开发中比较常用的异步操作有：
- 网络请求，如ajax http.get
- IO 操作，如readFile readdir
- 定时函数，如setTimeout setInterval

#### event-loop
event-loop 中文翻译叫做“事件轮询”，它是能体现出单线程中异步操作是如何被执行的。

结合阮一峰老师的 [《再谈Event Loop》](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)中有详细介绍。

```js
console.log('line 1')
setTimeout(console.log, 1000, 'line 2')
console.log('line 3')
```
- 执行第一行，将结果line 1打印出来。
- 执行第二行，注意此时会将这个操作暂时存储到其他地方，因为setTimeout是一个异步执行操作。
- 执行第三行，将结果line 3打印出出来。
- 等都全部执行完，然后立马实时查看刚才暂存的异步操作有没有。如果有可执行的，就立即拿到出来继续执行。
- 执行完毕之后，再实时查看暂存位置中是否还有未执行的异步回调。

```js
setTimeout(console.log, 0, 'a')
console.log('b')
console.log('c')
```
根据上面论述，上述代码最后返回的结果是b c a。



## jQuery异步

传统的$.ajax中异步实现使用callback方式。
```js
var ajax = $.ajax({
    url: 'data.json',
    success: function () {
        console.log('success')
    },
    error: function () {
        console.log('error')
    }
})

console.log(ajax) // 返回一个 XHR 对象
```
当我们要在成功后还有别的需求时，会回调越来越多，嵌套越深，代码可读性就会越来越差，俗称“回调地狱”。所以我们急需一种更优雅的方式。

于是从jQuery v1.5开始，以上代码就可以这样写了：可以链式的执行done或者fail方法。
```js
var ajax = $.ajax('data.json')
ajax.done(function () {
    console.log('success 1')
}).fail(function () {
    console.log('error')
}).done(function () {
    console.log('success 2')
})

console.log(ajax) // 返回一个 deferred 对象
```

两端代码中打印的ajax的结果是不同的。

这样改造的好处原来ajax还可以这样写，让代码更加抽象明了。这也为以后的Promise标准制定提供了很大意义的参考，你可以以为这就是后面Promise的原型。

**虽然 JS 是异步执行的语言，但是人的思维是同步的**。所以我们寻求让逻辑看上去更接近同步。


jquery v1.5开始，$.ajax可以使用类似当前Promise的then函数以及链式操作。那它是如何实现的呢？

首先我们使用setTimeout函数实现一个简单的异步操作。
```js
var wait = function () {
    var task = function () {
        console.log('执行完成')
    }
    setTimeout(task, 2000)
}
wait()
```





```js
function waitHandle() {
  var dtd = $.Deferred();
  var wait = function(dtd) {
    var task = function() {
      console.log("执行完成");
      dtd.resolve();
    };
    setTimeout(task, 2000);
    return dtd.promise(); // 注意，这里返回的是 primise 而不是直接返回 deferred 对象
  };
  return wait(dtd);
}

var w = waitHandle();
$.when(w)
  .then(function() {
    console.log("ok 1");
  })
  .then(function() {
    console.log("ok 2");
  });
```














