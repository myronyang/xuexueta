---
title: 开发规范
date: 2018-9-6
tags: 
  - 业务
---

## CSS命名规范

### BEM思想

BEM的意思就是块（block）、元素（element）、修饰符（modifier）,是由Yandex团队提出的一种前端命名方法论。这种巧妙的命名方法让你的CSS类对其他开发者来说更加透明而且更有意义。BEM命名约定更加严格，而且包含更多的信息，它们用于一个团队开发一个耗时的大项目。

#### 命名约定的模式如下：
``` css{3}
.block{}  
.block__element{}  
.block--modifier{}  
```

> .block 代表了更高级别的抽象或组件。\
> .block__element 代表.block的后代，用于形成一个完整的.block的整体。\
> .block--modifier代表.block的不同状态或不同版本。

BEM的关键是光凭名字就可以告诉其他开发者某个标记是用来干什么的。通过浏览HTML代码中的class属性，你就能够明白模块之间是如何关联的：有一些仅仅是组件，有一些则是这些组件的子孙或者是元素,还有一些是组件的其他形态或者是修饰符。

#### 以steps进度条组件为例
``` css
.steps{} // 进度条外层块命名
.steps__title{}  // 内部元素命名
.steps__main{} 
.steps__foot{} 
.steps--active{} // 修饰符命名 
.steps--full{}
```
<font color=#999>顶级块是‘steps’，它拥有一些元素，如‘title’。在不同交互场景下也会有不同形态，这种形态进而也会拥有它自己的元素‘active’。</font>

#### 项目下可能多个场景下用到进度条，为了避免样式混淆，在块级名称前加上业务名称
``` css
.goods-steps {} // 进度条外层块命名
.goods-steps__title {}  // 内部元素命名
.goods-steps--active {} // 修饰符命名 
```
``` scss
.goods-steps {
  &__title{}  // 内部元素命名
  &__active{}  // 修饰符命名 
} // 进度条外层块命名
```
#### 单个vue页面最外层标签加上类名page-wrap
``` vue
<template>
  <div class="page-wrap">
    ...
  </div>
</template>
```

> **虽然BEM使其项目结构清晰，但是其命名过于繁琐冗余而可能拉大项目周期。建议在周期短或小项目的情况下精简BEM结合css热处理语言进行缩减**

``` scss
.goods-steps {
  &__title {}
  &__item {
    &--active {
      @extend .goods-steps__item;
    }
  }
} // 进度条外层块命名
.goods-steps__title {}  // 内部元素命名
.goods-steps--active {} // 修饰符命名 
```

#### 常用块（block）命名举例
| 名称           | 类型           | 说明  |
| ------------- |:-------------:| -----:|
| container | 块 | 容器,用于最外层 |
| serach | 块 | 搜索 |
| nav | 块 | 主导航 |
| subnav | 块 | 二级导航 |
| menu | 块 | 菜单 |
| submenu | 块 | 子菜单 |
| sideBar | 块 | 侧栏 |

#### 常用元素（element）命名举例
| 名称           | 类型           | 说明  |
| ------------- |:-------------:| -----:|
| head，foot | 元素 | 元素头尾部 |
| main | 元素 | 主体 |
| tag | 元素 | 标签 |
| desc | 元素 | 描述 |
| title | 元素 | 标题 |
| inner | 元素 | 内部嵌套 |
| items | 元素 | 列表父级 |
| item | 元素 | 列表子级 |

#### 常用修饰符（modifier）命名举例
| 名称           | 类型           | 说明  |
| ------------- |:-------------:| -----:|
| active | 修饰符 | 选中状态 |
| full   | 修饰符 | 填满状态 |
| wait | 修饰符 | 等待状态 |


### 样式文件划分
以stylus为例
- reset.styl // 初始化样式
``` stylus
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header,
menu, nav, output, ruby, section, summary,
time, mark, audio, video, input
  margin 0
  padding 0
  border 0
  font-size 100%
  font-weight 100
  vertical-align baseline

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, menu, nav, section
  display block

body
  line-height 1

blockquote, q
  quotes none

blockquote:before, blockquote:after,
q:before, q:after
  content none

table
  border-collapse collapse
  border-spacing 0

/* custom */

a
  color #7e8c8d
  -webkit-backface-visibility hidden
  text-decoration none

a:active 
  outline 0

li
  list-style none

body
  -webkit-text-size-adjust none
  -webkit-tap-highlight-color rgba(0, 0, 0, 0)
```
- base.styl // 基本样式
``` stylus
.clear_fix
  &::after
    content ""
    display table
    clear both

.bd_t_1, .db_r_1, .bd_b_1, .db_l_1
  position relative
  &::before, &::after
    content ""
    display block
    position absolute
    transform-origin 0 0

.bd_t_1
  &::before
    border-top 1px solid $color-row-line
    left 0
    top 0
    width 100%
    transform-origin 0 top

.db_r_1
  &::after
    border-right 1px solid $color-col-line
    top 0
    right 0
    height 100%
    transform-origin right 0

.bd_b_1
  &::after
    border-bottom 1px solid $color-row-line
    left 0
    bottom 0
    width 100%
    transform-origin 0 bottom

.db_l_1
  &::before
    border-left 1px solid $color-col-line
    top 0
    left 0
    height 100%
    transform-origin left 0

@media (min-resolution 2dppx)
  .bd_t_1
    &::before
      width 200%
      transform scale(.5) translateZ(0)
  .db_r_1
    &::after
      height 200%
      transform scale(.5) translateZ(0)
  .bd_b_1
    &::after
      width 200%
      transform scale(.5) translateZ(0)
  .db_l_1
    &::before
      height 200%
      transform scale(.5) translateZ(0)

@media (min-resolution 3dppx)
  .bd_t_1
    &::before
      width 300%
      transform scale(.333) translateZ(0)
  .db_r_1
    &::after
      height 300%
      transform scale(.333) translateZ(0)
  .bd_b_1
    &::after
      width 300%
      transform scale(.333) translateZ(0)
  .db_l_1
    &::before
      height 300%
      transform scale(.333) translateZ(0)
```

- variable.styl // 常用样式变量申明
``` stylus
//// basic
$color-green = #16ce7f
$color-regular-blue = #4a4c5b
$color-background = #f7f7f7
$color-white = #fff
$color-black = #000

//// gray
$color-dark-grey = #333
$color-grey = #666
$color-light-grey = #999
$color-light-grey-s = #ccc
$color-light-grey-ss = #eee
$color-light-grey-sss = #fcfcfc
$color-active-grey = #e8e8e8

$color-dark-grey-opacity = rgba(74, 76, 91, 0.8)
$color-grey-opacity = rgba(0, 0, 0, .08)
$color-light-grey-opacity = rgba(0, 0, 0, .04)
```
- minxin.styl // 常用样式方法
``` stylus
border-1px($color)
  position relative
  &:after
    display block
    position absolute
    left 0
    bottom 0
    border-top 1px solid $color
    content ' '
    width 100%

border-none()
  &:after
    display none

bg-image($url)
  background-image url("images/"+$url + "@2x.png")
  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
    background-image url("images/"+$url + "@3x.png")
```
- index.styl // 以上样式文件引入
``` stylus
@import "./reset.styl"
@import "./variable.styl"
@import "./base.styl"
@import "./minxin.styl"
```



## JS命名规范

### 变量
必须采用小驼峰式命名法  <font color=#999>命名规范：前缀应当是名词。(函数的名字前缀为动词，以此区分变量和函数)</font>

命名建议：尽量在变量名字中体现所属类型，如:length、count等表示数字类型；而包含name、title表示为字符串类型。

``` js
// 好的命名方式
let maxCount = 10;
let tableTitle = 'LoginTable';
// 不好的命名方式
let setCount = 10;
let getTitle = 'LoginTable';
```

### 常量
必须采用全大写的命名 <font color=#999>且单词以_分割，常量通常用于ajax请求url，和一些不会改变的数据</font>

命名规范：使用大写字母和下划线来组合命名，下划线用以分割单词。
``` js
const MAX_COUNT = 10;
const URL = 'https://www.baidu.com';
```

### 函数
- 命名方法：小驼峰式命名法。
- 命名规范：前缀应当为动词。
- 命名建议：可使用常见动词约定。

| 动词           | 含义           | 返回值 |
| ------------- |:-------------:| ------:|
| can | 判断是否可执行某个动作(权限) | 函数返回一个布尔值。true：可执行；false：不可执行 |
| has | 判断是否含有某个值 | 函数返回一个布尔值。true：含有此值；false：不含有此值 |
| is | 	判断是否为某个值 | 函数返回一个布尔值。true：为某个值；false：不为某个值 |
| get | 获取某个值 | 函数返回一个非布尔值 |
| set | 设置某个值 | 无返回值、返回是否设置成功或者返回链式对象 |
| load | 加载某些数据 | 无返回值或者返回是否加载完成的结果 |

### 类 & 构造函数
<font color=#999>命名方法：大驼峰式命名法，首字母大写。</font>

命名规范：前缀为名称。
```js
class Person {
  public name: string;
  constructor(name) {
    this.name = name;
  }
}
const person = new Person('jack');
```

### 类的成员
- 公共属性和方法：跟变量和函数的命名一样
- 私有属性和方法：前缀为_(下划线)，后面跟公共属性和方法一样的命名方式

``` js
class Person {
  private _name: string;
  constructor() { }
  // 公共方法
  getName() {
    return this._name;
  }
  // 公共方法
  setName(name) {
    this._name = name;
  }
}
const person = new Person();
person.setName('jack');
person.getName();
```

### vue命名规范

#### vue生命周期顺序
``` vue
<script>
export default {
  name: ' ',
  props: { }，
  data() { }，
  computed: { }，
  components: { },
  watch: { },
  filters: { },
  created() { }，
  mounted() { },
  methods: { },
  beforeDestroy() { },
  destroyed() { }
}
</script>
```

#### data对象下属性命名
- 数据列表使用list结尾
- 数据详情对象使用detail结尾
- 选中对象使用selected开头
- 选中样式状态使用active结尾
- 显示隐藏状态使用visible结尾

``` js
data() {
  return {
    splitPayActive: 1,
    popupVisible: false,
    selectedSplitPay: {},
    priceDetail: {},
    couponList: []
  }
}
```

> **如果visible有多个属性，建议放在一个对象下**

``` js
data() {
  return {
    visible: {
      detail: false,
      downPay: false,
      periods: false,
      coupon: false
    }
  }
}
```

#### 点击类事件使用handle开头
``` vue
<div
  class="tj-checker"
  :class="active ? 'tj-checker__active' : ''"
  :style="style"
  @click="handleClick"
>
  <slot></slot>
</div>
```

#### 组件绑定事件使用on开头
``` vue
<selected-address
  :data="addressLists"
  :visible.sync="visible.address"
  @change="onAddressChange"
></selected-address>
```

#### 获取接口数据方法使用fetch开头
``` js
fetchAddressLists() {
  const params = {
    isHot: this.mianBodyType.isHot
  };
  database.getStoreProvinceCity(params).then(res => {
    this.addressLists = res;
  });
}
```


## Git提交规范

#### 1. commit message格式

>  `<type>:  <subject>`
>
> 注意：冒号后面有空格

#### 2. 用于说明 commit 的类别，只允许使用下面7个标识

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

#### 3. subject  是commit代码的简短描述，末尾不加标点符号



## Vue开发规范

### 目录结构
```
|— config 项目全局配置文件
|— serves 接口API封装
|— components 全局通用组件
|— routes 路由文件
|— store 全局状态管理
``` 

### 组件命名规范、组件结构规范

1. #### 组件

组件名以单词大写开头，当多个单词拼写成的组件时，采用驼峰式命名规则。一般是多个单词全拼，减少简写的情况。组件应该都放到components文件夹下，单个页面独立一个文件夹，用来放相对应的vue文件以及页面相关的样式文件，样式少可直接写到页面组件里边，这样更符合组件化的思想。

2. #### 基础组件

- 当项目中需要自定义比较多的基础组件的时候，比如一些button，input，icon，建议以一个统一的单词base开头，或者放到bases文件夹统一管理，这样做的目的是为了方便查找。

- 布局组件以layout开头，或者放到layoutes文件夹统一管理。

3. #### 组件结构

组件结构遵循从上往下template，script，style的结构。


### 组件样式

单个组件样式一般可直接写到组件下style标签下，为了防止样式污染，可添加scoped属性，也可以通过设置作用域来防止样式污染，写样式的时候尽量少写元素选择器，为了提高代码查找速度，可以用类选择器。

### Template模板文件
- 标签语义化，避免清一色的div元素。
- 多特性，分行写，提高可读性。即一个标签内有多个属性，属性分行写。
- 指令采用缩写形式。
- 组件/实例选项中的空行。便于阅读和代码架构清晰。
- 自定义标签：使用自闭标签的写法。例如：，如果自定义标签中间需要传入slot，则写开始标签和结束标签，结束标签必须加/。

### Script模块
- 调试信息 console.log() 、debugger使用完及时删除。
- 无特殊情况不允许使用原生API操作dom,谨慎使用this.$refs直接操作dom。
- 能用单引号不用双引号， 尽量使用===。
- 指令缩写：都用指令缩写 (用 : 表示 v-bind: 和用 @ 表示 v-on:)。
- 用ES6风格编码源码,定义变量使用let,定义常量使用const,使用export,import模块化。
- 为v-for设置Key值。



<!-- ## 简易项目模块划分
当项目业务逻辑多业务量大的时候建议这样划分。当后台接口未完成，写mock数据太麻烦，先自己定义视图数据，保证视图组件字段通用性，最后后台接口数据相转换。

### database目录
此目录下存放各个模块业务所需要的数据，各js文件以业务逻辑区分，比如说商品模块，购物车模块等。
以案例case.js为例
``` js
// 封装后的ajax方法
import { postAxios, getAxios } from '../utils'
class CaseDB {
  /**
   * 获取首页数据
   */
  getIndexDetail (data) {
    return postAxios('index/getad', data)
  }

  /**
   * 获取案例列表所有风格
   */
  getHouseStyles (data) {
    return postAxios('index/GetAllHouseStyles', data)
  }

  /**
   * 获取案例列表
   */
  getCaseList (data) {
    return postAxios('index/GetCaseList', data)
  }
}

// 导出模块
export {
  CaseDB
}
```

### viewmodel目录
此目录下存放各个模块数据结构，以功能模块划分，对应相应的视图组件，如表单和视图展示的列表详情数据。
``` js
/**
 * 案例评论列表
 */
class CaseCommentListVM {
  constructor () {
    this.id = null
    this.image = ''
    this.name = ''
    this.context = ''
    this.reply = []
  }
}

/**
 * 案例上传
 */
class CasePublishVM {
  constructor () {
    this.token = ''
    this.name = ''
    this.community = null
    this.style = ''
    this.house = {
      type: '',
      area: null,
      room: null,
      hall: null,
      kitchen: null,
      toilet: null
    }
    this.description = ''
    this.promise = false
  }
}

export {
  CasePublishVM,
  CaseCommentListVM
}
```

CasePublishVM主要用于案例上传的表单数据
``` vue
<template>
<el-form :model="viewmodel" :rules="rules" ref="viewmodel" label-width="100px">
  <el-form-item label="小区名称" prop="name">
    <el-input v-model="viewmodel.name" placeholder="请输入小区名称"></el-input>
  </el-form-item>
  <el-form-item label="小区地址" prop="address" class="form-house">
    <el-row>
      <el-select v-model="viewmodel.province" filterable placeholder="请选择省份/直辖市" @change="checkProvince">
        <el-option :label="item.provincename" :value="item.provinceid" v-for="item in area.province"></el-option>
      </el-select>
      <el-select v-model="viewmodel.city" filterable class="ml_10" placeholder="请选择城市" @change="checkCity">
        <el-option :label="item.cityname" :value="item.cityid" v-for="item in area.city"></el-option>
      </el-select>
      <el-select v-model="viewmodel.district" filterable class="ml_10" placeholder="请选择县/区">
        <el-option :label="item.districtname" :value="item.districtid" v-for="item in area.district"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <vmap placeholder="请输入小区详细地址(可输入小区名称搜索)" width="1070" height="500" @change="changeMap"></vmap>
    </el-row>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('viewmodel')">立即创建</el-button>
    <el-button @click="resetForm('viewmodel')">重置</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import { CommunityPublishVM } from "@/assets/js/viewmodel/case"
import { Publish2dControl } from "@/assets/js/controller/publish2d"

export default {
  data() {
    return {
      controller: new Publish2dControl(),
      viewmodel: new CommunityPublishVM()
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.controller.addCommunity(this.viewmodel).then(res => {
            this.$message({
              message: '小区添加成功',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  }
}
</script>
```
将表单数据提交到controller下的addCommunity方法进行数据转换和数据提交再异步返回成功后的回调，下面会说到controller下的用法。

### controller目录
此目录下存放各个视图业务模块数据处理，而视图里面只处理视图特效操作逻辑，将数据操作抽离出来。
``` js
import { CaseDB, CasePictureDB } from '../database/case'
import { AddCasePictureVM, CaseGoodsListVM } from '../viewmodel/case'
import { formatDate } from '../utils'

export class Publish2dControl {
  constructor () {
    this.casePictureDB = new CasePictureDB()
    this.caseDB = new CaseDB()
  }

  /**
   * 小区信息上传
   */
  async addCommunity (param) {
    let result = {}
    const postParam = {
      UserId: param.id,
      Token: param.token,
      Name: param.name,
      ProvinceId: param.province,
      CityId: param.city,
      DistrictId: param.district,
      DetialAddress: param.address
    }
    await this.caseDB.addCommunity(postParam).then(res => {
      result = res
    })
    return result
  }

  /**
   * 案例效果图修改列表数据转换
   */
  async setChangeCaseList (data) {
    const result = []
    const params = {
      caseid: data.caseId
    }
    await this.caseDB.getCaseDetail(params).then(res => {
      res.imgs.forEach(ele => {
        const view = new AddCasePictureVM()
        view.token = param.token
        view.id = param.caseId
        view.type = ele.imgtype
        view.primary = ele.bimg
        view.time = utils.formatDate(ele.time) // 时间格式转换
        result.push(view)
      })
    })
    return result
  }
  
}
```

- addCommunity方法将视图中数据转换成接口中要的数据提交到database的接口中异步返回接口返回结果。
- setCasePictureList方法将database中的getCaseDetail接口返回的数据处理成视图中所需要的数据结构和属性名称。

> **具体情况根据项目实际情况划分，不能一蹴而就。小点项目业务逻辑没那么复杂时不建议使用这套，最终以目录代码结构清晰为最终目的。**  -->