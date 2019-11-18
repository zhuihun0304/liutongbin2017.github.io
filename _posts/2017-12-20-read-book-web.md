---
layout:     post
title:      高性能网站建设指南
subtitle:   读书《高性能网站建设指南》总结
date:       2017-12-20
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---

# 高性能网站建设指南-前端工程师技能精髓

## 减少HTTP请求
<code>性能黄金法则</code>提示了只有10%~20%响应时间花在了HTML文档上其他都用在了加载各种组件包括（图片，样式表，脚本，falsh）进行的HTTP请求上。因此改善响应时间的最简单途径就是减少组件数量，并由此减少请求数量

可以以下通过方式
> CSS Sprites

>内联图片 data:URL

>合并脚本和样式表

data:URL模式首次在1995年被提议其格式如下 :<code>data:mediatype;base64,data</code>
其他类似的模式还有
 ftp:，file:， mailto:， smtp:， pop:， dns:， whois:， finger:， daytime:，news: ， run:
需要注意的是内联图片不被IE支持，而且增加了文档的大小如果存在于HTML当中首次下载的文档大小会变大，鉴于此可以将内联图片放到css当中这样可以让图片可以被缓存而且这样减少了一个图片的http请求。

## 使用内容发布网络CDN
合理使用cdn会很大程度增加网站响应速度而且价格不贵，比如本站使用的又拍云（非广告），即使被DDOS了也花不了多少

## 添加Expires头
通过设置一个长久有效的Expires头可以使web组件被缓存。web服务器通过Expires头来告诉Web客户端它可以使用一个组件的当前副本直到制定的时间为止。
但是由于Expires是一个特定时间，它要求服务器跟客户端始终严格同步（通常很难保证），所以需要跟Cache-Control: max-age=31500000 配合使用该项配置告诉客户端该组件过多长时间才会失效而不是到某一个时间失效。
如果两者同时出现max-age指令会覆盖Expires头。
比较幸运的是mod_expires Apache模块能够使用Expires头时能像max-age那样以相对的方式设置日期。使用Expire-Default指令来完成。设置如下：
```
    <FilesMatch "\.(gif|jpg|js|css)$">
        ExpiresDefault "access plus 10 years"
    </FileMatch>
    //该指令会同时向响应中发送Expires头和Cache-Contral max-age,响应格式如下：
    Expires: Wed, 16 Oct 2024 05:43:02 GMT
    Cache-control: max-age=315360000

```
通过设置Expires头可以避免额外的http请求，减少一半的响应时间。

##压缩组件
使用gzip来压缩组件，从HTTP1.1开始Web客户端可以通过HTTP请求中的: Accept-Enconding: gzip,deflate  来表示对于压缩的支持，如果Web服务器看到请求中有这个头就会使用客户端列出来的方法中的一种来压缩响应。Web服务器通过响应中的Content-Encoding头来通知客户端 : Content-Encoding: gzip.
> gzip是目前最流行和最有效的压缩方法， 另外一种deflate的方式效果略逊且不流行，因此gzip使最理想的压缩方式

配置gzip使用的模块取决于Apache的版本
* Apache1.3使用mod_gzip
* Apache2.x使用mod_deflate

目前的状况是浏览器与服务器直接连接并没有任何问题，但是如果中间有代理服务器的话有两种情况
情况一：Web客户端不支持gzip发送到代理服务器，代理服务器向服务器请求得到未压缩的组件，然后组件被代理服务器缓存，此后对该组件的所有请求都走缓存，组件失去了压缩的机会，即使以后的客户端支持gzip也没用了
情况二：如何顺序相反缓存的则是gzip压缩后的组件，这样一个不支持gzip的Web浏览器无法正常解压导致组件可能失效。
无论哪种情况都不是我们希望见到的，解决这个问题的方式是在Web服务器的响应中添加Vary头。Web服务器可以告诉代理根据一个或多个请求头来改变缓存响应，由于压缩决定基于Accept-Encoding请求头的，因此需要在服务器的Vary响应中包含Accept-Encoding.  如 Vary: Accept-Encoding
这使得代理会缓存两个版本的内容如果有设置Accept-Encoding: gzip,deflate的返回压缩版本，没有设置的返回未压缩版本。
还可以把在Apache设置支持和不支持gzip白名单将User-Agent加入Vary如 <code>Vary: Accept-Encoding,User-Agent</code>


## 将样式表放在顶部
最好的实践是将Css放到head标签中防止FOUC（Flash Of Unstyled Content）。
> 和A不一样，[LINK]只能出现在文档的HEAD中，但出现的次数时任意的

CSS放到底部会在IE导致白屏
> * 在新窗口打开时
> * 重新加载时
> * 作为主页时



## 将脚本放到底部
> * 脚本会阻塞后面组件的下载
> * 脚本会阻塞后面内容的呈现

所以最佳的位置就是放到页面body最底部



## 避免CSS表达式
css表达式使用不当会导致频繁的求值导致地下的性能
> 可以明确的一点是不了解底层影响的情况下使用css表达式是非常危险的，所以尽量避免使用CSS表达式。


## 使用外部的Javascript和CSS

组件的引入不外乎内联和外置。就纯粹而已内联要快一些但是我们还是会使用外置的css和脚本，这是因为外置的组件是会被缓存的导致以后的请求会从浏览器缓存读渲染会更快，而内联的脚本会导致html体积增大但是HTML是不会缓存的这样每次请求的html体积都会很大，造成额外的带宽消耗。

* 加载后下载脚本可以在第一次加载内联的组件然后异步加载外部组件以便为下次加载提供便利这里使用的html是不一样的需要注意。
* 动态内联，使用cookie来让后台决定返回那个页面。


## 减少DNS查找
根据HTTP1.1规范，建议浏览器从每个主机名并行下载两个组件，如果一个web页面平均的将组件放到两个主机名下整体响应时间会减少一半。
Yahoo研究表明使用两个主机名比使用1，4，10个主机名能带来更好的性能。因此建议将组件分别放到至少两个但是不超过四个与主机名下，这样不会造成过多的DNS查找，又可以为并行下载。

## 精简Javascript

可以使用gulp等工具对脚本和css进行混淆，精简和压缩，服务端开启gzip，以减少文件的体积大小。

## 避免重定向
比如为了使用www.xxx.com 重定向到 www.xxx.com/ 这种是不推荐的，我们只需要使用服务端配置，无需重定向就能拥有如此简洁的url即可
> 寻找一种避免重定向的方法

## 删除重复脚本

> 确保脚本只被包含一次

可以添加文件MD5后缀或者时间戳来保证文件是不同的

## 配置或删除ETag
ETag，一般建议移除ETag

> 比较最新修改日期 Last-Modified
> 比较实体标签 ETag

## 使Ajax可缓存
真实情况ajax一般不缓存
缓存可以缓存的ajax请求，通过修改cache-control

## 析构网站的工具
YSlow






