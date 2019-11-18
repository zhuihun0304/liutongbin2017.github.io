---
layout:     post
title:      Effective JavaScript (四)
subtitle:   了解分号插入的局限性
date:       2018-06-27
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---


## 了解分号插入的局限性

JavaScript的一个便利是能够离开 语句结束分号 工作。 删除分号后，结果变得轻量而优雅，比如下面这个例子去掉所有分号，JavaScript会自动插入分号。
```javascript
  function Point(x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  Point.prototype.isOrigin = function() {
    return this.x === 0 && this.y === 0
  }

```
这段没有分号的代码能够工作依赖于JavaScript的<code>自动分号插入技术(automatic semicolon insertion)</code>, 它是一种程序解析技术。它能够推断出上下文省略的分号，然后有效的将分号自动插入到程序中。

> 像隐式的强制转换一样，分号插入也有其陷阱，你根本不能避免学习其规则， 即使你从来不省略分号，受分号插入的影响，JavaScript语法也有一些额外的限制。一旦学会分号插入机制，你会从删除不必要的分号的痛苦中解脱出来

## 规则一
> 分号仅在 } 标记之前、一个或多个换行之后和程序输入的结尾被插入。

```javascript

  //合法省略分号
  function square(x) {
    var n = +x
    return n * n
  }

  function area(r) { r = +r; return Math.PI * r * r }

  function add1(x) { return x + 1 }

  // 不合法
  function area(r) { r = +r return Math.PI * r * r }

```

## 规则二
> 分号进在随后的输入标记不能被解析时插入 , 换句话说分号插入是一种错误矫正机制。

```javascript

  a = b
  (f()); // 这个例子会被解析为 a = b(f()); 所以不会插入分号，因为能够正确解析

  a = b
  f();   // 这个例子会被解析为 a = b f(); 解析有误，所以会插入分号
```

## 有5个明确有问题的字符需要密切注意
**(、[、+、-和/**， 每一个字符都能作为一个表达式运算符或一条语句的前缀， 这依赖于具体上下文。，如果下一行以这五个有问题的字符串之一来时，则不会自动插入分号。向上面的例子

```javascript
  a = b
  ["r", "g", "b"].forEach(function(key) {
    background[key] = foreground[key] / 2;
  });
  // 这看起来像两条语句但是使用了<code>[</code>，所以被解析为一条语句
  // 这里例子看起来有点奇怪，但是，JavaScript允许逗号分隔表达式。
  // 逗号分隔表达式从左至右依次执行，并返回最后一个表达式的值。
  a = b["r", "g", "b"].forEach(function(key) {
    background[key] = foreground[key] / 2;
  });

  // /通常作为正则表达式的开始
  /Error/i.test(str) && fail();

  //这种情况会被解析到一行不会插入分号
  a = b
  /Error/i.test(str) && fail();

  a = b/Error/i.test(str) && fail();  //  / 解析为除法运算符


```

又一个例子,这是一个完全正确的例子，因为会自动插入分号
```javascript
  a = b
  var x
  (f())

  // 但是如果重构时被意外的修改过如下，第二个分号不会插入, 会被错误的解析为 a = b(f())
  var x
  a = b
  (f())
```
一个不幸的结果就是，你总是需要注意省略的分号， 并且检查接下来的一行开始的标记是否会禁用自动插入分号。所以你可以采用在**(、[、+、-和/**，字符的开始前置一个额外的分号语句
```javascript
  a = b
  var x
  ;(f())


  var x
  a = b
  ;(f())
```

还有一个常用的情况就是脚本连接的情况
```javascript
  // file1.js
  (function() {

  })()

  // file2.js
  (function() {

  })()

  // 当文件连接到一起时
  (function() {

  })()
  (function() {

  })()

  // 被视为一条单一的语句，等价于：

  (function() {

  })()(function() {

  })();

  // 所以如果文件最开始的语句以这5个字符开始，你应该防御性的给每个前缀一个额外的分号

  // file1.js
  ;(function() {

  })()

  // file2.js
  ;(function() {

  })()

```
> 最安全的选择就是防御性的增加分号


你可能认为 “我从来不省略分号，我会没事的。” 事实并不是这样。也有一些情况，尽管不会出现解析错误，但是也会强制性的插入分号，
这是所谓的JavaScript的语法限制式（restricted production），它不允许两个字符之间存在换行。

```javascript
  return {};    // 返回一个对象

  return  // 这段代码被解析为
  {};

  return;
  {}
  ;
```

类似的JavaScript的语法限制产生式包括： return, throw, break, continue, 后置自增或自减运算符。
在<code>return, throw, break, continue, ++, --</code>,参数之前决不能出现换行

关于自增和自减运算符 是为了避免以下代码出现的歧义，
```javascript
  a
  ++
  b
  // ++既可以作为前置也可以作为后置，但是后置根据语法限制式,不允许a++之间存在换行 所以上面代码解析为

  a; ++b;

```

## 第三条也是最后一条规则
分号不会作为分隔符在for循环空语句头部被自动插入，换言之，for头部里面的<code>;</code>不能省略，必须显示的包含分号
```
  // 下面代码会解析错误
  for(var i = 0, total = 1 // parse error
      i < n
      i++) {
    total *= i
  }

```
同样的 <code>while</code>，也是需要显示分号的情况
```
  function infiniteLoop() { while(true) }  // parse error

  function infiniteLoop() { while(true); }
```

