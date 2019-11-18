---
layout:     post
title:      安卓和IOS前端页面调试
subtitle:   调试客户端的webview
date:       2018-10-20
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - 工具
    - 调试

categories:
    - 调试
---

## 场景

我们通常会有这样的开发场景， 开发了一些前端页面，可能在手机浏览器打开，也可能在客户端的webview打开，对应不同的场景我们可能需要不通的手段来进行调试。
对于简单的页面我们一般可以通过chrome的开发工具来调试或者通过safari来直接对手机打开的页面直接进行调试。 但是对于复杂webview我们可能需要一些特殊手段来进行debug.

在本文将总结一部分调试技巧

| 方法分类        | 难度   |  调试目标  | 调试效果 | 优先级 |
| --------   | -----:  | :----:  | :----:  | :----:  |
| Chrome自带模拟器   | 简单 |   所有     |  模拟效果，基本能调试 UI 及标准 JS 所有问题 |  极高 |   
| chrome://inspect  |  简单  |   安卓的自带浏览器+webview   | 真机调试效果显著 |  高   |
| spy-debugger  |  一般  |   所有页面不管是否是webview   | 效果可以 |  高  |
| safari开发模式  |  简单  |   手机safari的所有页面   | 真机调试效果显著 |  高   |
| xcode的iPhone模拟器  |  较难  |  webview和手机浏览器   | 调试效果显著 |  中等   |
| weinre  |  一般  |   所有页面不管是否是webview   | 需要注入代码效果一般 |  低   |
| 微信开发者工具  |  一般  |   模拟手机   |  | 低  |
| TBS Studio  |  一般  |   模拟手机   |  |  未测试  |
| Browsersync  |  一般  |   模拟手机   |  |  未测试   |



## 抓包
对于抓包有很多工具比如 mac上面有 charles，wireShark， windows上面有fiddler 等等。
我常用的一个抓包工具叫 [mitmproxy](https://mitmproxy.org/), 在github已经一万多star了，使用起来比较简单。 一条命令 <code>mitmproxy -p 4000 --set console_mouse=false</code>, 启动后 手机手动代理到 ip+端口就可以开始抓包了，对于https可能需要[安装证书](http://mitm.it/).至于安装过程就不重复了，官网已有[教程](https://docs.mitmproxy.org/stable/)。

charles抓包请查看[这篇教程](https://www.jianshu.com/p/fdd7c681929c)


## 安卓的webview页面
现在的安卓应用内的页面进行调试是真的方便。

* 首先打开手机的usb调试，连接到电脑。
* 第二在chrome输入 <code>chrome://inspect/#devices</code> （开发环境安卓桌面版Chrome32+ 并且 Android 系统高于 4.4）
* 第三 选择app中的页面进行调试即可


## safari调试iPhone页面
这种方式适合手机上面的浏览器页面
需要几步配置

* 首先打开电脑的safari
![](https://cdn.darknights.cn/assets/images/in-post/debug-webview/Safari设置.png)

* 然后打开iPhone进行设置
![](https://cdn.darknights.cn/assets/images/in-post/debug-webview/iPhone设置.png)

* 最后通过电脑的safari打开进行调试
![](https://cdn.darknights.cn/assets/images/in-post/debug-webview/开启调试.png)


## 调试iPhone的webview
iPhone的webview可行的方法就是下载xcode，然后跟客户端开发借来一个xxx.app然后用模拟器打开，这样调试页面的时候可以调试各种情况下的页面，包括safari和应用内的页面。
这是目前唯一靠谱的调试方案。 还有一些 [ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy) 和 [remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter) 类似方案， 这些方案只能够调试手机的safari 对于app中的webview就无能为力了，而且经过本人实践效果并不理想，如果只是为了调试safari那还不如直接usb连接方便快捷，而且安装过程会有很多坑，因此不推荐使用。

简化方案
```
//打开首页
xcrun simctl openurl booted taobao://h5.m.taobao.com/guang/index.html
// 打开模拟器
open -a "Simulator.app" --args -CurrentDeviceUDID "FCE2CFE8-64C3-4DBE-906B-B9BF4180DE49"

```
前提是安装了xcode， 本地需要一个sdk与测试网站进行交互方便获取app和执行本地shell命令
根据[此文章](http://taobaofed.org/blog/2015/11/13/web-debug-in-ios/), 后期开发一个测试环境用的本地调试网站。




[http://taobaofed.org/blog/2015/11/13/web-debug-in-ios/](http://taobaofed.org/blog/2015/11/13/web-debug-in-ios/)

## weinre

Weinre 是一款较老的远程调试工具，功能与 Chrome DevTools 相似，需要在页面中插入一段 JS 脚本来实时调试页面 DOM 结构、样式、JS 等，另外它使用的是代理的方式，所以兼容性很好，无论是新老设备系统通吃，但对于样式调试不友善，缺少断点调试及 Profiles 等常用功能。

* 安装 Weinre
```
$ sudo npm -g install weinre
```

* 启动Weinre监听服务
```
$ weinre --boundHost 10.10.2.144 --httpPort 8090 
```

* 使用chrome访问
[http://10.10.2.144:8090](http://10.10.2.144:8090), 然后将一段 JS 脚本 <script src="http://10.10.2.144:8090/target/target-script-min.js#anonymous"></script> 插入到需要调试的页面中，插入代码后手机访问调试页面。
![](https://cdn.darknights.cn/assets/images/in-post/debug-webview/weinre.png)

到这里还不算完，因为手动插入js不够优雅，所以这里采用js脚本注入
Tools --> Rewrite 选中Enable Rewrite
这里我们需要使用到的是 Body，它的作用是对请求或响应内容进行匹配替换，按照下图的配置，通过将匹配到的响应内容 </body> 标签替换成需要插入到页面中的 JS 脚本，从而实现动态插入。
![](https://cdn.darknights.cn/assets/images/in-post/debug-webview/Charles_Rewrite.jpg)

![](https://cdn.darknights.cn/assets/images/in-post/debug-webview/Charles_Rewrite_Rule.jpg)


## spy-debugger
[spy-debugger](https://github.com/wuchangming/spy-debugger)跟微信开发这工具都在weinre的基础上简化了给页面添加js的步骤，它还对HTTPS的支持

安装spy-debugger
spy-debugger内部集成了[weinre](http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html)、[node-mitmproxy](https://github.com/wuchangming/node-mitmproxy)、[AnyProxy](https://github.com/alibaba/anyproxy)
```
$  sudo npm install spy-debugger -g
```
安装https证书包括手机和PC。
执行启动特别酸爽
```
$ spy-debugger -p 8888
```

## TBS Studio
[TBS Studio](https://x5.tencent.com/guide/debug.html)

## 微信 WebView 调试
[https://x5.tencent.com/tbs/guide/debug/season1.html](https://x5.tencent.com/tbs/guide/debug/season1.html)

## browserSync

## 参考文档

* [前端 WebView 指南之调试篇](https://75team.com/post/webview-debug.html)
* [移动端浏览器调试方法汇总](http://elevenbeans.github.io/2017/06/06/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B0%83%E8%AF%95%E6%96%B9%E6%B3%95%E6%B1%87%E6%80%BB/)
* [移动端真机调试指南](https://aotu.io/notes/2017/02/24/Mobile-debug/index.html)
* [打造最舒适的webview调试环境](https://github.com/riskers/blog/issues/11)
* [移动端前端开发调试](http://yujiangshui.com/multidevice-frontend-debug/)