---
title: JS异步
date: 2018-10-27
tags: 
  - Javascript
---

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
  url: '/data.json',
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
1. 网络请求，如ajax http.get
1. IO 操作，如readFile readdir
1. 定时函数，如setTimeout setInterval

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

<font color=#b29400>**虽然 JS 是异步执行的语言，但是人的思维是同步的**</font>。所以我们寻求让逻辑看上去更接近同步。

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


## ES6的Promise

### 传统的异步操作
```js
var wait = function () {
    var task = function () {
        console.log('执行完成')
    }
    setTimeout(task, 2000)
}
wait()
```

接下来将使用 ES6 的Promise进行封装
```js
const wait =  function () {
    // 定义一个 promise 对象
    const promise = new Promise((resolve, reject) => {
        // 将之前的异步操作，包括到这个 new Promise 函数之内
        const task = function () {
            console.log('执行完成')
            resolve()  // callback 中去执行 resolve 或者 reject
        }
        setTimeout(task, 2000)
    })
    // 返回 promise 对象
    return promise
}
```
从整体看来，感觉这次比用 jquery 那次简单一些，逻辑上也更加清晰一些。
- 将之前的异步操作那几行程序，用new Promise((resolve,reject) => {.....})包装起来，最后return即可
- 异步操作的内部，在callback中执行resolve()（表明成功了，失败的话执行reject）

但是`wait()`返回的是`Promise`对象，而promise对象有then属性。

```js
const w = wait()
w.then(() => {
    console.log('ok 1')
}, () => {
    console.log('err 1')
}).then(() => {
    console.log('ok 2')
}, () => {
    console.log('err 2')
})
```
then还是和之前一样，接收两个参数（函数），第一个在成功时（触发resolve）执行，第二个在失败时(触发reject)时执行。而且，then还可以进行链式操作。


### Promise基本应用

```js
const fs = require('fs')
const path = require('path')  // 后面获取文件路径时候会用到
const readFilePromise = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err)  // 注意，这里执行 reject 是传递了参数，后面会有地方接收到这个参数
            } else {
                resolve(data.toString())  // 注意，这里执行 resolve 时传递了参数，后面会有地方接收到这个参数
            }
        })
    })
}
```
以上一段nodejs代码将读取函数fs.readFile封装为一个Promise。

我们使用`readFilePromise`读取一个json文件，在函数中`resolve(data.toString())`传递的参数会被下面第一`then(data => {...})`接收到。
后面的`catch`函数会在执行`reject`之后触发，也可以传递参数。
```js
const fullFileName = path.resolve(__dirname, '../data.json')
const result = readFilePromise(fullFileName)
result.then(data => {
    console.log(data)
}).catch(err => {
    console.log(err.stack)
})
```

> <big> **这一段内容提到的“参数传递”其实有两个方面** </big> \
> 执行resolve传递的值，会被第一个then处理时接收到 \
> 如果then有链式操作，前面步骤返回的值，会被后面的步骤获取到


### 串联多个异步操作
如果我们读取data.json的内容后再去读取data2.json的内容，如果用传统callback去实现会很麻烦，回调会层层嵌套（callback-hell），当时用Promise可以轻松实现。
```js
const fullFileName2 = path.resolve(__dirname, '../data2.json')
const result2 = readFilePromise(fullFileName2)
const fullFileName1 = path.resolve(__dirname, '../data.json')
const result1 = readFilePromise(fullFileName1)

result2.then(data => {
    console.log('data2.json', data)
    return result1  // 此处只需返回读取 data1.json 的 Promise 即可
}).then(data => {
    console.log('data.json', data) // data 即可接收到 data1.json 的内容
})
```


### Promise.all和Promise.race的应用
比如现在我们需要等data.json和data2.json两个文件都读取后，再做下一步需求。此时就需要用到`Promise.all`
```js
// Promise.all 接收一个包含多个 promise 对象的数组
Promise.all([result1, result2]).then(datas => {
    // 接收到的 datas 是一个数组，依次包含了多个 promise 返回的内容
    console.log(datas[0])
    console.log(datas[1])
})
```

读取两个文件data1.json和data2.json，现在我需要一起读取这两个文件，但是只要有一个已经读取了，就可以进行下一步的操作。此时需要用到`Promise.race`
```js
// Promise.race 接收一个包含多个 promise 对象的数组
Promise.race([result1, result2]).then(data => {
    // data 即最先执行完成的 promise 的返回值
    console.log(data)
})
```


### Promise/A+ 规范

网上有很多介绍 Promise/A+ 规范的文章，看了之后自己总结的关于状态。

- 关于状态
    - promise 可能有三种状态：等待（pending）、已完成（fulfilled）、已拒绝（rejected）
    - promise 的状态只可能从“等待”转到“完成”态或者“拒绝”态，不能逆向转换，同时“完成”态和“拒绝”态不能相互转换

- 关于then方法
    - promise 必须实现then方法，而且then必须返回一个 promise ，同一个 promise 的then可以调用多次（链式），并且回调的执行顺序跟它们被定义时的顺序一致
    - then方法接受两个参数，第一个参数是成功时的回调，在 promise 由“等待”态转换到“完成”态时调用，另一个是失败时的回调，在 promise 由“等待”态转换到“拒绝”态时调用
下面挨个介绍这些规范在上一节代码中的实现，所谓理论与实践相结合。在阅读以下内容时，你要时刻准备参考上一节的代码

> **Promise不仅仅是没有取代callback或者弃而不用，反而Promise中要使用到callback。因为，JS 异步执行的本质，必须有callback存在，否则无法实现**



## ES6的Generator

### Generator简介
```js
function* Hello() {
    yield 100
    yield (function () {return 200})()
    return 300
}

var h = Hello()
console.log(typeof h)  // object

console.log(h.next())  // { value: 100, done: false }
console.log(h.next())  // { value: 200, done: false }
console.log(h.next())  // { value: 300, done: true }
console.log(h.next())  // { value: undefined, done: true }
```

#### 在 nodejs 环境执行这段代码，打印出来的数据都在代码注释中了，也可以自己去试试。将这段代码简单分析一下吧
- 定义`Generator`时，需要使用`function*`，其他的和定义函数一样。内部使用yield，至于yield的用处以后再说
- 执行`var h = Hello()`生成一个`Generator`对象，经验验证typeof h发现不是普通的函数
- 执行`Hello()`之后，Hello内部的代码不会立即执行，而是出于一个暂停状态
- 执行第一个`h.next()`时，会激活刚才的暂停状态，开始执行Hello内部的语句，但是，直到遇到yield语句。一旦遇到yield语句时，它就会将yield后面的表达式执行，并返回执行的结果，然后又立即进入暂停状态
- 因此第一个`console.log(h.next())`打印出来的是`{ value: 100, done: false }`，value是第一个yield返回的值，`done: false`表示目前处于暂停状态，尚未执行结束，还可以再继续往下执行
- 执行第二个`h.next()`和第一个一样，不在赘述。此时会执行完第二个yield后面的表达式并返回结果，然后再次进入暂停状态
- 执行第三个`h.next()`时，程序会打破暂停状态，继续往下执行，但是遇到的不是yield而是return。这就预示着，即将执行结束了。因此最后返回的是`{ value: 300, done: true }，done: true`表示执行结束，无法再继续往下执行了
- 再去执行第四次`h.next()`时，就只能得到`{ value: undefined, done: true }`，因为已经结束，没有返回值了

#### 分析以上步骤， 我们可以发现以下几点
- Generator不是函数是对象
- `Hello()`不会立即出发执行，而是一上来就暂停
- 每次`h.next()`都会打破暂停状态去执行，直到遇到下一个yield或者return
- 遇到yield时，会执行yeild后面的表达式，并返回执行之后的值，然后再次进入暂停状态，此时`done: false`
- 遇到return时，会返回值，执行结束，即`done: true`
- 每次`h.next()`的返回值永远都是`{value: ... , done: ...}`的形式

#### Generator最终是何如处理异步操作
```js
readFilePromise('some1.json').then(data => {
    console.log(data)  // 打印第 1 个文件内容
    return readFilePromise('some2.json')
}).then(data => {
    console.log(data)  // 打印第 2 个文件内容
    return readFilePromise('some3.json')
}).then(data => {
    console.log(data)  // 打印第 3 个文件内容
    return readFilePromise('some4.json')
}).then(data=> {
    console.log(data)  // 打印第 4 个文件内容
})
```

然后用Generator改造如下
```js
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    console.log(r1)  // 打印第 1 个文件内容
    const r2 = yield readFilePromise('some2.json')
    console.log(r2)  // 打印第 2 个文件内容
    const r3 = yield readFilePromise('some3.json')
    console.log(r3)  // 打印第 3 个文件内容
    const r4 = yield readFilePromise('some4.json')
    console.log(r4)  // 打印第 4 个文件内容
})
```


### Iterator遍历器
ES6 中引入了很多此前没有但是却非常重要的概念，Iterator就是其中一个。
Iterator对象是一个指针对象，实现类似于单项链表的数据结构，通过next()将指针指向下一个节点。

Symbol是一个特殊的数据类型，和number string等并列，详细的教程可参考[阮一峰老师 ES6 入门的 Symbol 篇](https://es6.ruanyifeng.com/#docs/symbol)
```js
console.log(Array.prototype.slice)  // [Function: slice]
console.log(Array.prototype[Symbol.iterator])  // [Function: values]
```
数组的slice属性大家都比较熟悉了，就是一个函数，可以通过`Array.prototype.slice`得到。这里的slice是一个字符串，但是我们获取`Array.prototype[Symbol.iterator]`可以得到一个函数，只不过这里的`[Symbol.iterator]`是Symbol数据类型，不是字符串。但是没关系，Symbol数据类型也可以作为对象属性的key。
```js
// 数组
console.log([1, 2, 3][Symbol.iterator])  // function values() { [native code] }
// 某些类似数组的对象，NoeList
console.log(document.getElementsByTagName('div')[Symbol.iterator])  // function values() { [native code] }
```

原生具有`[Symbol.iterator]`属性数据类型有一个特点，就是可以使用`for...of`来取值，例如
```js
var item
for (item of [100, 200, 300]) {
    console.log(item)
}
// 100 200 300 
// 这里每次获取的 item 是数组的 value，而不是 index ，这一点和 传统 for 循环以及 for...in 完全不一样
```
而具有`[Symbol.iterator]`属性的对象，都可以一键生成一个Iterator对象。

定义一个数组，然后生成数组的Iterator对象
```js
const arr = [100, 200, 300]
const iterator = arr[Symbol.iterator]()  // 通过执行 [Symbol.iterator] 的属性值（函数）来返回一个 iterator 对象
```

使用iterator有两种方式：next和for...of。
```js
console.log(iterator.next())  // { value: 100, done: false }
console.log(iterator.next())  // { value: 200, done: false }
console.log(iterator.next())  // { value: 300, done: false }
console.log(iterator.next())  // { value: undefined, done: true }
```

```js
let i
for (i of iterator) {
    console.log(i)
}
// 打印：100 200 300 
```

> **Generator返回的也是Iterator对象**