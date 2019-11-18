---
layout:     post
title:      搭建门户网站技术选型
subtitle:   从零开始搭建门户网站
date:       2018-10-21
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - 工具
    - 脚手架

categories:
    - 脚手架
---



## 起因
工作多年，项目越来越多，总是要做一些重复性的工作开进行开发，每次东配置西配置一大堆，效率很低无法直接投入生产。
通过这篇文章梳理一下自己的知识点，将一些常用技术做一些总结归纳和复习。并且基于此开发一套模版，用于以后网站开发直接套用，不做重复性的工作（这里的网站主要针对pc）。

## 开始
从前端的角度来说，如何从零开始开发一个门户网站呢？ 首先是要有一些基础知识包括<code>JavaScript</code>, <code>css</code>, <code>html</code>。

## html
关于<code>html</code>需要了解的是，语义化的标签，还有html模版。一个html应该有什么呢，我们通过一个html模版来看下[html5-boilerplate](https://github.com/h5bp/html5-boilerplate), 这是一个专业的前端模版html。 由于篇幅问题就不再这里展开大家可以去github仓库中的dist文件夹查看index.html。
我们简单介绍下其中用到的东西

首先是通用的html5的头<code><!doctype html></code>

在HTML中，doctype是所有文档顶部所需的“ 序言“。其唯一目的是防止浏览器在呈现文档时转换成所谓的“怪异”模式; 也就是说，doctype确保浏览器尽力尝试遵循相关规范，而不是使用与某些规范不兼容的不同渲染模式。DOCTYPE用来告知 Web 浏览器页面使用了哪种 HTML 版本,只有确定了一个正确的文档类型，HTML或XHTML中的标签和层叠样式表才能生效，甚至对JavaScript脚本都会有所影响。

 还有这个Meta标签，如果您需要支持IE9或IE8，那么建议使用该标签， 如果支持最新的IE11或Edge则考虑删除此标签
 ```
 <meta http-equiv="x-ua-compatible" content="ie=edge">
 ```
 这个X-UA标记允许web作者选择呈现页面的Internet Explore版本，具体解释请看[这篇文章](https://stackoverflow.com/questions/6771258/what-does-meta-http-equiv-x-ua-compatible-content-ie-edge-do)


然后这里还用到了[normalize.css](https://necolas.github.io/normalize.css/),来消除不通浏览器之间的样式差异。
还使用了[modernizr](https://modernizr.com/)，来进行浏览器功能检查。
以及大家最熟悉的jQuery(如果只兼容IE9+则可以放心使用最新版本，如果需要支持IE8则需要使用2.0以下的版本)

## css
css我们先前在模版中已经引入了[normalize.css](https://necolas.github.io/normalize.css/), 其余css基础知识的获取就需要大家自行补充了，建议读一下《css权威指南》，算是css内功方面的书籍了，再就是了解css的布局包括栅格布局，flex布局， 还有更早期的双飞翼布局，圣杯布局等等。

除了这些基础实战中我们通常会用到css预处理器，[Sass](https://sass-lang.com/)、[Less](http://lesscss.org/)和[Stylus](http://stylus-lang.com/). 最开始我使用的是sass，但是这个的npm包经常会被墙下载不下来，相关依赖感觉也比较重。至于选哪种看大家喜好了，我推荐使用stylus，语法自由度很高，代码非常简洁。

## JavaScript
什么是最轻量的JavaScript框架,那就是[vanilla-js](http://vanilla-js.com/) 来自[ Vanilla JS——世界上最轻量的JavaScript框架（没有之一）](https://segmentfault.com/a/1190000000355277),这里是个玩笑，因为这里说的框架其实就是原生Js。
大型网站的开发还是需要依赖各种js的库或者框架。这里简单列几种，
* jQuery，虽然有些人抵触，但是为了保证代码兼容性，我还是愿意引入jQuery的
* Backbone， 一款轻量级的框架，不过需要配合underscore或者lodash使用
* [Handlebars](https://github.com/wycats/handlebars.js), js模版用来处理html代码片段

具体代码可以考虑使用ES5如果这样的话需要引入[babeljs](https://babeljs.io/),做转换这样就可以愉快的使用新语法了，除此之外我们的选择还有[CoffeeScript](https://coffeescript.org/), 和[TypeScript](https://www.typescriptlang.org/). 

代码规范可以可以参考[这篇文章](https://codeburst.io/5-javascript-style-guides-including-airbnb-github-google-88cbc6b2b7aa)
我推荐使用其中更为广泛的[Airbnb Standard](https://github.com/airbnb/javascript) 比[JavaScript Standard Style](https://github.com/standard/standard) 更多的star。

## 搭建
好了前期准备工作已经完成现在我们开始正式开始