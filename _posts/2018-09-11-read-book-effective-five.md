---
layout:     post
title:      Effective JavaScript (五)
subtitle:   理解变量提升
date:       2018-09-11
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---


## 理解变量提升

try...catch 语句将捕获的异常绑定到一个变量，该变量的作用域只是catch语句块。
```javascript

  function test() {
    var x = "var", result = [];
    result.push(x);

    try {
      throw "exception";
    } catch(x) {
      x = "catch";
    }

    result.push(x);

    return result;
  }

  test(); // ["var", "var"]
  

```

## 使用立即调用函数IIFE创建局部作用域
```javascript

function wrapElements(a) {
  var result = [], i, n;
  for(i = 0, n = a.length; i < n; i++) {
    result[i] = function() { return a[i] }
  }

  return result;
}

var wrapped = wrapElements([10, 20, 30, 40, 50]);

var f = wrapped[0];

f();  // ? 输出结果 undefined


// 更具有欺骗性的例子
function wrapElements(a) {
  var result = [];
  for(var i = 0, n = a.length; i < n; i++) {
    result[i] = function() { return a[i] }
  }

  return result;
}

var wrapped = wrapElements([10, 20, 30, 40, 50]);

var f = wrapped[0];


f();  // ? 输出结果 undefined


// 为了避免这种问题需要用一个立即调用的函数创建一个局部作用域

(function() {
  var j = i;
  result[j] = function() { return a[j]; }
})();

// or

(function(j) {
  result[j] = function() { return a[j]; }
})(i);


```

## 当心命名函数表达式笨拙的作用域

```
function double(x) { return x * 2; }

这里既可以是一个函数声明，也可以是一个命名函数表达式

var f = function(x) { return x * 2; }

var f = function double(x) { return x * 2 }

根据ECMAScript规范， 此语句将该函数绑定到变量f，而不是变量double。

匿名和命名函数表但是的官方区别在于后者会绑定到其函数名相同的变量上，该变量将作为该函数内的一个局部变量。（只能在函数内部调用）可以用来写递归函数表达式

```

> 命名函数表达式是作用域和兼容性问题臭名昭著的来源，这归结于ECMAScript规范的历史中很不幸的错误以及流行的JavaScript引擎中的Bug. 规范的错误在ES3中就已经存在，JavaScript引擎被要求将命名函数表达式的作用域表示为一个对象，这有点像with，该作用域对象也继承了Object.prototype的属性，这意味着仅仅是给函数表达式命名也会将Object.prototype中的所有属性引入到作用域中。

```
var constructor = function() { return null; }

var f = function f() {
  return constructor();
}

f();  // 结果 {} (in ES3 环境中)。这里错误的使用了Object.prototype.constructor (Object的构造函数)
```

幸运的ES5修正了这个问题，但是有些JavaScript仍然使用过时的对象作用域，还有些更不符合标准的对于匿名函数的表达式也使用对象的作用域。

```
var constructor = function() { return null; }

var f = function () {
  return constructor();
}

f();  // 结果 {} (在更不标准的环境中)。本来这里应该正确解析不使用对象的作用域但是不标准的环境导致匿名函数表达式仍然使用对象作用域

```

> 最好的做法就是避免任何时候在Object.prototype中添加属性，以及避免使用与标准Object.prototype属性同名的局部变量

在流行的JavaScript的引擎中的另一个缺陷是函数命名表达式的声明进行提升。

```
var f = g() { returen 17; }
g(); // 17 (在非标准的环境中会返回17，标准环境会报错 g is not defined)

我们应该怎样做
var f = function g() { return 17; }
var g = null;

```

> 由于命名函数表达式会导致很多问题，所以不值得使用



## 当心局部块函数声明笨拙的作用域

比较有迷惑性的一个例子
```javascript

function f() { return "global"; }

function test(x) {
  function f() { return "local"; }

  var result = [];
  if(x) {
    result.push(f());
  }

  result.push(f());
  return result;
}

// 返回结果
test(true); // ["local", "local"]
test(false); // ["local"]

```

当函数f放到局部块里将有什么不同呢，首先要记住一点
 <code>JavaScript没有块级作用域</code>
```javascript

function f() { return "global"; }

function test(x) {

  var result = [];
  if(x) {
    function f() { return "local"; }
    result.push(f());
  }
console.log(f);
  result.push(f());
  return result;
}

// 返回结果
test(true); // ["local", "local"]
test(false); // 有些平台显示["local"] 有些平台返回： f is not a function

你可能认为 第一个结果为["local", "global"], 第二个结果为 ["global"], 但是有一点需要记住 JavaScript没有块级作用域
这里根据平台的实现不同结果会不一样,代码很难理解，还会导致性能降低。 

```
<code> 对此官方指定函数声明只能出现在其他函数或者程序的最外层。</code>

编写可移植的函数最好方式是始终避免将函数声明置于局部块或者子语句中，如果想写嵌套函数声明应该将它置于父函数的最外层。如果要根据条件判断选择函数，最好的方法是使用var声明和函数表达式来实现。例子如下：
```
function f() { return "global"; }

function test(x) {

  var g = f, result = [];
  if(x) {
    g = function() { return "local"; }
    result.push(g());
  }
  result.push(g());
  return result;
}

这样消除内部变量作用域的神秘性，结果很明确，函数可移植。
```
## 避免使用eval创建局部变量

使用eval的例子
```javascript
var y = "global";
function test(x) {
  if(x) {
    eval("var y = 'local';");
  }
  return y;
}

test(true); // "local";
test(false); // "global"

var y = "global";
function test(src) {
  if(x) {
    eval(src);
  }
  return y;
}

test("var y = 'local';"); // "local";
test("var z = 'local';"); // "global"
这段代码很脆弱，也很不安全，它赋予了外部调用者能改变test函数内部作用域的能力。ES5严格模式将eval函数运行在一个嵌套的作用域中防止这种污染

```
> 保证eval函数不影响外部作用域的一个简单的方法是一个明确的嵌套作用域中运行它

```
var y = "global";
function test(src) {
  if(x) {
    (function() { eval(src); })();
  }
  return y;
}

```

## 间接调用eval函数由于直接调用
大部分函数只能访问他们所在的作用域，而不能访问除此之外的作用域。然而 eval函数具有访问调用它那时的整个作用域的能力。这是很强大的能力，但是导致一个问题eval很难很高效的调用一个任何函数，因为一旦被调用的是eval函数，那么每个函数调用都需要确保在运行时整个作用域对eval函数是可访问的。

总而言之我们使用过程中尽可能间接调用eval而不要直接调用。代码如下
```
var f = eval;
f("x");

编写间接调用的一种简洁方法是

(0, eval)(src);  // 逗号表达式求值返回eval函数，然后调用。  这种表达式被视为eval的一种间接调用。
```



