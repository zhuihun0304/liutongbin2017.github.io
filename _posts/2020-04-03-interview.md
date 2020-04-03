---
layout:     post
title:      interview
subtitle:   面试中遇到的一些问题总结
date:       2020-04-03
author:     "binn"
header-img: "https://i.loli.net/2020/04/01/OGmz4tWRHn2ql7D.jpg"
comments: true

tags :
    - 基础
    - 面试
    - HSTS

categories:
    - 面试
---
### http与https的区别与作用：
1. https数据传输期间对信息进行加密；  
2. 使用https可以提高seo，提高搜索排名；  
3. https是使用TLS/SSL加密的http协议；  
4. http的端口是80，https是433，https需要ca申请证书，一般免费证书很少，需要交费；  
5. http协议是Hyper Text Transfer Protocol(超文本传输协议)的缩写，是用于从万维网(wwww:World Wide Web)服务器传输超文本到本地浏览器的传送协议。http是一个基于TCP/IP通信协议来传递数据(HTML文件，图片，查询结果等)。

### 闭包：
闭包就是能够读取其他函数内部变量的函数，例如在js中，只有函数内部的自函数才能读取局部变量，所以闭包可以理解成“定义在一个函数内部的函数”。在本质上，闭包是将函数内部和函数外部连接起来的桥梁。  
[详解](https://blog.csdn.net/weixin_43586120/article/details/89456183)

### react与vue区别：
#### react优点：     
虚拟DOM，丰富的js库；  
#### react缺点：  
react只是一个库，并不是完整的框架，需要配合react-router及redux或者dva；  
#### vue优点：  
易于上手，占用空间小；  
#### vue缺点：  
框架市场份额小。  
#### 正式比较：  
react使用的是jsx，vue使用的是html，react提供了一种Flux/Redux架构的创新解决方案，单向数据流，替代了传统的[*MVC*](https://www.runoob.com/design-pattern/mvc-pattern.html)框架；vue使用的是vuex的架构，架构不一样；react使用Create React App脚手架工具，vue使用vue-cli

