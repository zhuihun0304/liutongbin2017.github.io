---
layout:     post
title:      URL编码
subtitle:   URL编码相关知识
date:       2019-10-16
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - 面试
    - 基础
    - JavaScript

categories:
    - 基础
---

### 起因
前几天的时候做了一个领奖的公众号,回调的时候url中会自动带过来一个使用des3加密的orderId, 本来在测试环境的时候是没有问题的,但是到了线上却出现了问题,经过排查发现加密串本来是<code>tq+3wB8PdfY=</code>, 传到后台的错误结果是<code>tq%203wB8PdfY%3D</code>,但是真实需要传给后台的却是<code>tq%2B3wB8PdfY%3D</code>. 因此在这里将该问题总结一下.转载自[关于URL编码](http://www.ruanyifeng.com/blog/2010/02/url_encoding.html)

### 需要知道
首先需要知道的是一般来说，URL只能使用英文字母、阿拉伯数字和某些标点符号，不能使用其他文字和符号。比如，世界上有英文字母的网址"http://www.abc.com"，但是没有希腊字母的网址"http://www.aβγ.com"（读作阿尔法-贝塔-伽玛.com）。这是因为网络标准RFC 1738做了硬性规定：
> "...Only alphanumerics [0-9a-zA-Z], the special characters "$-_.+!*'()," [not including the quotes - ed], and reserved characters used for their reserved purposes may be used unencoded within a URL."
> "只有字母和数字[0-9a-zA-Z]、一些特殊符号"$-_.+!*'(),"[不包括双引号]、以及某些保留字，才可以不经过编码直接用于URL。"

这意味着，如果URL中有汉字，就必须编码后使用。但是麻烦的是，RFC 1738没有规定具体的编码方法，而是交给应用程序（浏览器）自己决定。这导致"URL编码"成为了一个混乱的领域。

### 不同情况下URL编码

#### 1.当汉字出现在URL中
IE现在的使用率的确低,这里出现只为了做对比.
在IE8浏览器中输入网址<code>http://zh.wikipedia.org/wiki/春节</code>,会怎么样呢?
* 我们刚刚说过汉字不可以不编码直接用于url,这里直接用的后果就是不同的浏览器会按照各种的方式进行编码

我们查看请求头发现IE实际查询的网址是<code>http://zh.wikipedia.org/wiki/%E6%98%A5%E8%8A%82</code>, 也就是说IE自动将<code>春节</code>编码成<code>%E6%98%A5%E8%8A%82</code>

"春"和"节"的utf-8编码分别是"E6 98 A5"和"E8 8A 82"，因此，"%E6%98%A5%E8%8A%82"就是按照顺序，在每个字节前加上%而得到的, 网址路径的编码，用的是utf-8编码(FireFox中结果也一样)。

<code>所以当汉字出现在url中的时,网址路径的编码用的时utf-8编码.</code>

#### 2.汉字出现在查询字符串中
在IE8浏览器中输入网址<code>http://www.baidu.com/s?wd=春节</code>, <code>春节</code>这两个字此时属于查询字符串，不属于网址路径.
查看http请求头信息,IE将<code>春节</code>转化成了一个乱码.切换成16进制才能清楚看到这两个字被转成了<code>B4 BA BD DA</code>
"春"和"节"的GB2312编码（"Windows xp"中文版的默认编码）分别是"B4 BA"和"BD DA"。因此，IE实际上就是将查询字符串，以GB2312编码的格式发送出去。

Firefox跟Chrome发送的请求头如下, 同样采用GB2312编码，但是在每个字节前加上了%;

<code>所以查询字符串的编码，用的是操作系统的默认编码。</code>

#### 3.Get方法生成的URL包含汉字
上面的情况都是直接在浏览器中输入url的情况, 更常见的情况是，在已打开的网页上，直接用Get或Post方法发出HTTP请求。
根据[台湾中兴大学吕瑞麟老师的试验](http://xml-nchu.blogspot.com/p/url.html), 这时的编码方法由网页的编码决定，也就是由HTML源码中字符集的设定决定.
```
<meta http-equiv="Content-Type" content="text/html;charset=xxxx">
```

如果上面这一行最后的charset是UTF-8，则URL就以UTF-8编码；如果是GB2312，URL就以GB2312编码。

举例来说，百度是GB2312编码，Google是UTF-8编码。因此，从它们的搜索框中搜索同一个词"春节"，生成的查询字符串是不一样的。

* 百度生成的是%B4%BA%BD%DA，这是GB2312编码。
* Google生成的是%E6%98%A5%E8%8A%82，这是UTF-8编码。

<code>GET和POST方法的编码，用的是网页的编码</code>


#### 4.Ajax调用URL包含汉字
前几种情况都是浏览器发送HTTP请求,Ajax是JavaScript来生成HTTP请求,也就是Ajax调用. 这种情况传送给服务器的参数,IE总是采用操作系统默认编码, Chrome则是Utf-8编码.


### 编码解码的方法
<code>escape</code>跟<code>unescape</code>,已经不推荐使用. 它的具体规则是，除了ASCII字母、数字、标点符号"@ * _ + - . /"以外，对其他所有字符进行编码。在\u0000到\u00ff之间的符号被转成%xx的形式，其余符号被转成%uxxxx的形式。对应的解码函数是unescape()。
```
escape("春节");
// %u6625%u8282

escape("Hello World");
// Hello%20World

unescape("%u6625%u8282")
// 春节

unescape("\u6625\u8282")
// 春节

```
这两个方法不推荐使用.




<code>encodeURI</code>是Javascript中真正用来对URL编码的函数。但是对于以下网址中有特殊含义的符号不进行编码.
```
; / ? : @ & = + $ , #
```

相反的<code>encodeURIComponent</code>方法会将上面的符号也进行编码.
<code>decodeURI</code>和<code>decodeURIComponent</code>是相应的解码方法


### 解决
再回到一开始的问题
* 第一步浏览器url拿到的查询参数是正确的<code>tq%2B3wB8PdfY%3D</code>
* 第二步代码中获取到的参数变量也是正确的<code>tq+3wB8PdfY=</code>
* 第三部利用该参数向url中拼接跳转下一步页面例如 /xxx/xxx?orderId=tq+3wB8PdfY 到这里其实是有问题的浏览器会自动将<code>+</code>号转为空格

> escape()不对"+"编码。但是我们知道，网页在提交表单的时候，如果有空格，则会被转化为+字符。服务器处理数据的时候，会把+号处理成空格。所以，使用的时候要小心。

从这里开始再向后台传参数就不会拿到正确的地址了,其实要解决很简单使用<code>encodeURIComponent</code>编码一下就可以,其实vue和react的框架其实自己可以转换,但是要正确使用跳转URL的方法.

### 参考文章

* [不同浏览器中URL的编码方式](https://blog.csdn.net/u014785687/article/details/74078512)