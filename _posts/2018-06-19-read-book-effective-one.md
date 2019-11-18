---
layout:     post
title:      Effective JavaScript(一)
subtitle:   了解你使用的JavaScript版本
date:       2018-06-19
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---

## 了解你使用的JavaScript版本

由于不同的浏览器，对于JS的实现不同，我们必须精心编写代码保证他们在所有浏览器下工作如一。否则你可能面临这样的困境--应用程序在你自己的计算机上运行良好，但是部署到不同的环境时却无法运行。
例如，const关键字在支持非标准特性的JavaScript引擎上测试时运行良好，但是当将它部署到不识别const关键字的web浏览器上就会出现语法错误。
为此，ES5引入了一种版本控制的考量<code>严格模式</code>。此特性允许你选择在受限制的JavaScript版本中禁止使用一些JavaScript语言中问题较多或者易于出错的特性。
由于其语法设计向后兼容，因此即使在那些没有实现严格模式检查的环境中仍然可以执行严格代码（strict code）
```javascript
"use strict";
```
该指令只有定义到脚本或函数的顶部才能生效。需要注意的是脚本连接时可能会将非严格模式脚本运行到严格模式下如下：

```javascript
"use strict";
function f() {}

// no strict-mode
function g() {
  var arguments = [];
}

```
这种情况会报错，为了解决这个问题，我们通常会使用 立即调用的函数表达式(IIFE Immediately Invoked Function Expression) 如下：
```javascript
(function(){
  "use strict";
  function f() {}
})();

(function(){
  function g() {
    var arguments = [];
  }
})();
```

## 编写文件使其在两种模式下行为一致
想要编写一个库来获得最大的兼容性最简单的方法就是在严格模式下编写代码，并显示的将代码内容包裹在本地启用了严格模式的函数中，这种类似前面所说的 将库文件包裹到一个立即调用的函数表达式中。

```javascript
 (function(){
  "use strict"
  function g() {
    var arguments = [];
  }
})();
```

<code>为了达到更普遍的兼容性建议在严格模式下编写代码。</code>




