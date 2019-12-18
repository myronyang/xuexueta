module.exports = {
  title: '记录集',
  description: '记录生活，沉淀技术',
  base: '/blog/',
  port: 8099,
  head: [
    ['link', {
      rel: 'manifest',
      href: '/manifest.json'
    }],
    ['link', {
      rel: 'apple-touch-icon',
      href: '/img/logo.png'
    }],
  ],
  themeConfig: {
    //git 仓库地址
    repo: 'myronyang',
    docsDir: 'docs',
    nav: [{
        text: '主页',
        link: '/'
      },
      {
        text: '开发规范',
        link: '/standard/'
      },
      {
        text: 'javascript',
        link: '/javascript/',
        items: [{
          text: 'JS原型',
          link: '/javascript/prototype/'
        }, {
          text: 'JS闭包',
          link: '/javascript/closure/'
        }, {
          text: 'JS异步',
          link: '/javascript/async/'
        }, {
          text: 'JS设计模式',
          link: '/javascript/design/'
        }]
      },
      {
        text: '技术框架',
        link: '/technical/',
        items: [{
            text: '组件库',
            link: 'https://myronyang.github.io/TJUI/#/'
          },
          {
            text: '常用函数',
            link: '/technical/function/'
          },
          {
            text: 'webpack',
            link: '/technical/webpack/'
          }
        ]
      },
    ],
    sidebar: {
      '/standard/': genSidebarConfig()
    },
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: 'Last Updated', // string | boolean
    serviceWorker: true
  }
}

function genSidebarConfig(title) {
  return [{
    title,
    collapsable: false,
    children: [
      '',
      'factory'
    ]
  }]
}