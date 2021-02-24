---
title: 常用函数
date: 2019-5-29
tags: 
  - Javascript
  - 工具
---

### localStorage操作
``` js
/**
 * 存储Storage
 */
export const Storage = {
  set (name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  },
  get(name) {
    if (!name) return
    return window.localStorage.getItem(name)
  },
  remove(name) {
    if (!name) return
    window.localStorage.removeItem(name)
  }
}
```


### Cookie操作
``` js
/**
 * 存储Cookie
 */
export const Cookie = {
  set(name, value, exdays){
    const d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = 'expires=' + d.toGMTString()
    document.cookie = name + '=' + value + '; ' + expires
  },
  get(name){
    name = name + '='
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim()
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  },
  remove(name) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    const cval = getCookie(name)
    if (cval != null)
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}
```

### 获取url参数
``` js
/**
 * 获取url参数
 */
export const getQueryStr = name => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)
  if (result != null) {
    return unescape(result[2])
  }
  return null
}
```

### 时间戳转换
``` js
/**
 * 时间戳转换
 */
export const formatDate = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  const time = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in time) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (time[k]) : (('00' + time[k]).substr(('' + time[k]).length)))
    }
  }
  return fmt
}
```

### 返回顶部
``` js
/**
 * 返回顶部
 * @param {number} y 距离顶部距离
 * @param {duration} y 返回动画时间
 */
export const toScroll = (y, duration) => {
  const initialY =
    document.documentElement.scrollTop || document.body.scrollTop
  const baseY = (initialY + y) * 0.5
  const difference = initialY - baseY
  const startTime = performance.now()

  const step = () => {
    let normalizedTime = (performance.now() - startTime) / duration
    if (normalizedTime > 1) normalizedTime = 1

    window.scrollTo(
      0,
      baseY + difference * Math.cos(normalizedTime * Math.PI)
    )
    if (normalizedTime < 1) window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}
```

### 函数防抖
``` js
/**
 * 函数防抖
 * @param {function} fn 回调函数
 * @param {number} delay 间隔时间
 */
export const debounce = (fn, delay = 1000) => {
  let timer = null
  return function() {
    let args = arguments
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, args) // this 指向vue
    }, delay)
  }
}
```

### 函数节流
``` js
/**
 * 函数节流
 * @param {function} fn 回调函数
 * @param {number} delay 间隔时间
 */
export const thorttle = (fn, delay = 1000) => {
  let lastTime = ''
  let timer = ''
  let interval = delay
  return function () {
    let args = arguments
    let nowTime = Date.now()
    if (lastTime && nowTime - lastTime < interval) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        lastTime = nowTime
        fn.apply(this, args)
      }, interval)
    } else {
      lastTime = nowTime
      fn.apply(this, args)
    }
  }
}
```

### 获取指定范围随机数
``` js
/**
 * 获取指定范围随机数
 */
export const getRandom = (start, end) => {
  const length = end - start
  const value = parseInt(Math.random() * length + start)
  return value
}
```

### 获取文件后缀
``` js
/**
 * 获取文件后缀
 */
export const getFileSuffix = (name) => {
  const index = name.lastIndexOf('.')
  return name.substring(index + 1)
}
```