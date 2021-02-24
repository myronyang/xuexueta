---
title: 常用函数
date: 2019-5-29
tags: 
  - Javascript
  - 工具
---

``` js
/*jquery ajax函数*/
function Ajax(url, type, success, error) {
  $.ajax({
    url: url,
    type: type,
    dataType: 'json',
    timeout: 10000,
    success: function(d) {
      var data = d.data;
      success && success(data);
    }
  });
}

/*jsonp方式*/
function jsonp() {
  var options = config || {}; // 需要配置url, success, time, fail四个属性
  var callbackName = ('jsonp_' + Math.random()).replace(".", "");
  var oHead = document.getElementsByTagName('head')[0];
  var oScript = document.createElement('script');
  oHead.appendChild(oScript);
  window[callbackName] = function(json) {  //创建jsonp回调函数
    oHead.removeChild(oScript);
    clearTimeout(oScript.timer);
    window[callbackName] = null;
    options.success && options.success(json);   //先删除script标签，实际上执行的是success函数
  };
  oScript.src = options.url + '?' + callbackName;    //发送请求
  if (options.time) {  //设置超时处理
    oScript.timer = setTimeout(function () {
      window[callbackName] = null;
      oHead.removeChild(oScript);
      options.fail && options.fail({ message: "超时" });
    }, options.time);
  }
}
// 使用方法：
jsonp({
  url: '/b.com/b.json',
  success: function(d){
    //数据处理
  },
  time: 5000,
  fail: function(){
    //错误处理
  }       
});

/*常用正则表达式*/
// 手机号验证
var validate = function(num) {
  var reg = /^1[3-9]\d{9}$/;
  return reg.test(num);
};
// 身份证号验证
var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
// ip验证
var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
// 判断是否有中文
var reg = /.*[\u4e00-\u9fa5]+.*$/;

/*阻止冒泡*/
function stopBubble(e) {
  e = e || window.event;
  if(e.stopPropagation) {
    e.stopPropagation();  //W3C阻止冒泡方法  
  }else {
    e.cancelBubble = true; //IE阻止冒泡方法  
  }
}

/*全部替换replaceAll*/
var replaceAll = function(bigStr, str1, str2) {
  //把bigStr中的所有str1替换为str2
  var reg = new RegExp(str1, 'gm');
  return bigStr.replace(reg, str2);
}

/*获取浏览器url中的参数值*/
var getURLParam = function(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)', "ig").exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

/*深度拷贝对象*/
function cloneObj(obj) {
  var o = obj.constructor == Object ? new obj.constructor() : new odj.constructor(obj.valueOf());
  for(var key in obj) {
    if(o[key] != obj[key]) {
      if(typeof(obj[key]) == 'object' ){
        o[key] = mods.cloneObj(obj[key]);
      }else{
        o[key] = obj[key];
      }
    }
  }
  return o;
}

/*数组去重*/
var unique = function(arr) {
  var result = [], json = {};
  for (var i = 0; i < arr.length; i++) {
    if(!json[arr[i]]) {
      json[arr[i]] = 1;
      result.push(arr[i]);  //返回没被删除的元素
    }
  }
  return result;
}

/*判断数组元素是否重复*/
var isRepeat = function(arr) {  //arr是否有重复元素
  var hash = {};
  for (var i in arr) {
    if (hash[arr[i]]) return true;
    hash[arr[i]] = true;
  }
  return false;
}

/*判断是对象还是数组*/
function isArray = function(o) {
  return toString.apply(o) === '[object Array]';
}
function isObject = function(o) {
  return toString.apply(o) === '[object Object]';
}

/*生成随机数*/
function randombetween(min, max) {
  return min + (Math.random() * (max - min + 1));
}

/*操作cookie*/
var $cookie = {
  set: function(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = 'expires='+d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
  },
  get: function(name) {
    var cname = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0; i< ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(cname) != -1) return c.substring(cname.length, c.length);
    }
    return '';
  }
}
```


