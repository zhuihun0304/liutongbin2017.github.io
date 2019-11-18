---
layout:     post
title:      在浏览器输入 URL 回车之后发生了什么
subtitle:   在浏览器输入 URL 回车之后的一系列流程解析
date:       2019-09-16
author:     "toshiba"
header-img: "images/bg/batman/bat3.jpg"
comments: true

tags :
    - 基础
    - 面试
    - HSTS

categories:
    - 面试
---

不久前看了一篇文章[在浏览器输入 URL 回车之后发生了什么](https://4ark.me/post/b6c7c0a2.html), 感觉讲的实在很好所以在此我也想总结一下,当自己被问到这个问题的时候会如何回答呢?

在浏览器输入 URL 回车之后发生了什么？
大致流程如下

* 1.URL解析
* 2.DNS查询；
* 3.建立TCP连接；
* 4.发送HTTP请求；
* 5.服务器处理请求；
* 6.返回响应结果；
* 7.关闭TCP连接；
* 8.浏览器解析HTML；
* 9.浏览器布局渲染；


当我们在浏览器输入网址回车后,一切从这里开始
### URL解析

> <code>HSTS(HTTP Strict Transport Security), 强制客户端使用 HTTPS 访问页面</code>,[你不知道的HSTS](https://www.barretlee.com/blog/2015/10/22/hsts-intro/)

首先判断你输入的是一个合法的URL还是一个带搜索的关键词
* 如果输入的是内容则将输入内容自动编码。
* 输入的是网址向服务器请求我们想要的页面内容则开始进行DNS域名查询

浏览器需要首先确认的是域名所对应的服务器在哪里,将域名解析成对应的服务器IP地址这项工作,是由DNS服务器来完成的.
客户端收到你输入的域名地址后,

* 1.首先会从浏览器缓存中查找是否有对应域名
* 2.操作系统缓存
* 3.路由器DNS缓存
* 4.查找本地的hosts文件
* 5.ISP的DNS服务器
* 6.根域名服务器 [维基百科](https://zh.wikipedia.org/wiki/%E6%A0%B9%E7%B6%B2%E5%9F%9F%E5%90%8D%E7%A8%B1%E4%BC%BA%E6%9C%8D%E5%99%A8)


> <code>ISP</code>是<code>Internet Service Provider(因特网服务提供商)</code>的简称,ISP有专门的DNS服务器应对DNS查询请求.每一个ISP（网络服务提供商），或一个大学，甚至是一个大学里的系都会有一个自己的本地域名服务器，他会在url第一次访问时缓存该域名的指向。下次再访问时，他会从缓存里把这个url曾经指向的IP调出来。

> ISP的DNS服务器还找不到的话，它就会向根服务器发出请求，进行递归查询（DNS服务器先问根域名服务器.com域名服务器的IP地址，然后再问.com域名服务器，依次类推）。


#### 根域名服务器查询
在前面所有步骤没有缓存的情况下，本地 DNS 服务器会将请求转发到互联网上的根域，下面这个图很好的诠释了整个流程：
![](https://cdn.darknights.cn/assets/images/in-post/browser-input/search.png)

需要注意的点

* 递归方式：一路查下去中间不返回，得到最终结果才返回信息（浏览器到本地DNS服务器的过程）
* 迭代方式，就是本地DNS服务器到根域名服务器查询的方式。
* [什么是 DNS 劫持](https://www.bisend.cn/blog/dns-ji-chi-yu-wu-ran)
* [前端 dns-prefetch 优化](https://zhuanlan.zhihu.com/p/50043595)


递归查询：
    主机向本地域名服务器的查询一般都是采用递归查询。
    如果主机所询问的本地域名服务器不知道被查询的域名的IP地址，那么本地域名服务器就以DNS客户的身份，向其根域名服务器继续发出查询请求报文(即替主机继续查询)，而不是让主机自己进行下一步查询。因此，递归查询返回的查询结果或者是所要查询的IP地址，或者是返回一个失败的响应，表示无法查询到所需的IP地址

迭代查询：
    本地域名服务器向根域名服务器的查询通常是采用迭代查询。
    当根域名服务器收到本地域名服务器发出的迭代查询请求报文时，要么返回给本地域名服务器所要查询的IP地址，要么返回给本地域名服务器下一步应当查询的域名服务器的IP地址。



### TCP连接
TCP/IP 分四层,在发送数据时,每层都要对数据进行封装

![](https://cdn.darknights.cn/assets/images/in-post/browser-input/tcp.png)


#### 应用层:发送HTTP请求

在前面的步骤我们已经得到服务器的 IP 地址，浏览器会开始构造一个 HTTP 报文，其中包括：
* 请求报头（Request Header）：请求方法、目标地址、遵循的协议等等
* 请求主体（其他参数）

其中需要注意的点：
* 浏览器只能发送 GET、POST 方法，而打开网页使用的是 GET 方法



#### 传输层: TCP传输报文
传输层会发起一条到达服务器的 TCP 连接，为了方便传输，会对数据进行分割（以报文段为单位），并标记编号，方便服务器接受时能够准确地还原报文信息。

在建立连接前，会先进行 TCP 三次握手。[通俗解释TCP协议三次握手](https://github.com/jawil/blog/issues/14)、[计算机网络](https://hit-alibaba.github.io/interview/basic/network/HTTP.html)

> [SYN 泛洪攻击](https://blog.csdn.net/cpcpcp123/article/details/52739407)


#### 网络层: IP协议查询Mac地址
将数据段打包，并加入源及目标的IP地址，并且负责寻找传输路线。
判断目标地址是否与当前地址处于同一网络中，是的话直接根据 Mac 地址发送，否则使用路由表查找下一跳地址，以及使用 [ARP 协议](https://zhuanlan.zhihu.com/p/28771785)查询它的 Mac 地址。
> 注意：在 OSI 参考模型中 [ARP](https://zhuanlan.zhihu.com/p/28771785) 协议位于链路层，但在 TCP/IP 中，它位于网络层。

#### 链路层: 以太网协议

根据以太网协议将数据分为以"帧"为单位的数据包, 每一帧分为两个部分:
* 标头: 数据包的发送者、接受者、数据类型
* 数据: 数据包具体内容

> Mac地址
> 以太网规定了连入网络的所有设备都必须具备“网卡”接口, 数据包都是从一块网卡传递到另一块网卡,网卡地址就是Mac地址.每一个Mac地址都是独一无二的,具备了一对一的能力.

> 广播
> 发送数据的方法很原始，直接把数据通过 ARP 协议，向本网络的所有机器发送，接收方根据标头信息与自身 Mac 地址比较，一致就接受，否则丢弃。 但是接受方回应是单播.

#### 服务器接受请求

### 服务器处理请求

#### HTTPD
最常见的 HTTPD 有 Linux 上常用的 Apache 和 Nginx，以及 Windows 上的 IIS。
它会监听得到的请求，然后开启一个子进程去处理这个请求。

#### 处理请求
接受 TCP 报文后，会对连接进行处理，对HTTP协议进行解析（请求方法、域名、路径等），并且进行一些验证：

* 验证是否配置虚拟主机
* 验证虚拟主机是否接受此方法
* 验证该用户可以使用该方法（根据 IP 地址、身份信息等）


#### URL重写
然后会查看 URL 重写规则，如果请求的文件是真实存在的，比如图片、html、css、js文件等，则会直接把这个文件返回。

否则服务器会按照规则把请求重写到 一个 REST 风格的 URL 上。

然后根据动态语言的脚本，来决定调用什么类型的动态文件解释器来处理这个请求。

以 PHP 语言的 MVC 框架举例，它首先会初始化一些环境的参数，根据 URL 由上到下地去匹配路由，然后让路由所定义的方法去处理请求。


### 浏览器接受响应
浏览器接收到来自服务器的响应资源后，会对资源进行分析。

首先查看 Response header，根据不同状态码做不同的事（比如上面提到的重定向）。

如果响应资源进行了压缩（比如 gzip），还需要进行解压。

然后，对响应资源做缓存。

接下来，根据响应资源里的 MIME 类型去解析响应内容（比如 HTML、Image各有不同的解析方式）。

### 渲染页面

![](https://cdn.darknights.cn/assets/images/in-post/browser-input/core.png)

![](https://cdn.darknights.cn/assets/images/in-post/browser-input/process.png)



# 文章参考
* [从浏览器输入url按回车后发生了什么](https://hellogithub2014.github.io/2017/09/24/how-do-network-connect/)
* [浏览器探究&前端优化指南](https://zhuanlan.zhihu.com/p/50043595)
* [ARP](https://zhuanlan.zhihu.com/p/28771785)
* [什么是DNS劫持与DNS污染](https://www.bisend.cn/blog/dns-ji-chi-yu-wu-ran)
* [深入理解Http请求、DNS劫持与解析](https://juejin.im/post/59ba146c6fb9a00a4636d8b6)
* [HTTP基础与DNS分析](https://blog.csdn.net/it_rod/article/details/79939651)
* [DNS原理及其解析过程](https://www.cnblogs.com/gopark/p/8430916.html)
* [在浏览器输入 URL 回车之后发生了什么](https://4ark.me/post/b6c7c0a2.html)
* [DNS查找域名的过程](http://www.cnblogs.com/xsilence/)
* [从输入 URL 到页面加载完成的过程中都发生了什么事情？](http://fex.baidu.com/blog/2014/05/what-happen/)

