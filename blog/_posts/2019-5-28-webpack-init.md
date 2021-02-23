---
title: Webpack 初始化
date: 2019-5-28
tags: 
  - Webpack
  - 工具
---

## webpack 初始化
#### 详细配置参考 [webpack中文文档](https://www.webpackjs.com/concepts/)

创建项目目录  `cd project`

在命令行工具中运行 `yarn init`

安装webpack包 `yarn install webpack webpack-cli --dev`

安装webpack插件 `yarn install webpack-dev-server html-webpack-plugin --dev`

<font color=#999>--dev 生产依赖</font>

创建 webpack.dev.config.js `touch webpack.dev.config.js`

创建 index.html `touch index.html`

创建 src目录 `mkdir src`

创建 index.js `touch index.js`


兼容es6需安装babel插件 `yarn add babel-loader @babel/core @babel/preset-env --dev`,在webpack.dev.config.js中的module添加对应的rules

::: danger
各版本有相对应的插件文档，注意版本号
- "@babel/core": "^7.4.3",
- "@babel/preset-env": "^7.4.3",
- "babel-loader": "^8.0.5",
- "html-webpack-plugin": "^3.2.0",
- "webpack": "^4.30.0",
- "webpack-cli": "^3.3.1",
- "webpack-dev-server": "^3.3.1"
:::

webpack.dev.config.js
``` js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 打包入口文件
  entry: './src/index.js',
  // 打包输出文件
  output: {
    // __dirname 当前目录
    path: __dirname,
    // 打包目录名称
    filename: './release/bundle.js'
  },
  // 告知 webpack为development模式
  mode: 'development',
  module: {
    rules: [
      {
        // 匹配js文件 转换es5
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  plugins: [
    // 模版文件
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    // 根目录
    contentBase: path.join(__dirname, './release'),
    // 自动打开浏览器
    open: true,
    port: 9000
  }
}
```

在package.json文件 script属性下添加 webpack打包命令
``` js
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  // 运行webpack 引入webpack.dev.config.js
  "dev": "webpack-dev-server --config webpack.dev.config.js"
},
```

运行 `yarn run dev` 根目录下生成release目录，包含打包好的bundle.js