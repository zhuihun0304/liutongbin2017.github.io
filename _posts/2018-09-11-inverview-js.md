---
layout:     post
title:      JavaScript面试题 
subtitle:   一些好的JavaScript面试题总结
date:       2018-09-11
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - 面试
    - JavaScript

categories:
    - 面试
---

### 在浏览器输入 URL 回车之后发生了什么
[在浏览器输入 URL 回车之后发生了什么](https://4ark.me/post/b6c7c0a2.html#%E5%89%8D%E8%A8%80)

### 变量提升

```
a = 2;

var a;

console.log(a);  // 结果

```
即使是具名的函数表达式，名称标识符在赋值之前也无法在所在的作用域中使用
```



foo(); // TypeError
bar(); // ReferenceErrtr

var foo = function bar() {
	//...
}

```
函数优先提升, 重复的var会被忽略掉，但是后面的函数声明还是会覆盖前面

```
foo();

var foo;

function foo() {
	console.log(1);
}

foo = function() {
	console.log(2);
}
// 输出结果是 1



foo();

var foo;

function foo() {
	console.log(1);
}

foo = function() {
	console.log(2);
}

function foo() {
	console.log(3);
}

// 输出结果 3
```

### 关于this
```
function foo(num) {
	console.log("foo:" + num);

	this.count++;
}

foo.count = 0;

var i;

for(i = 0; i < 10; i++) {
	if(i > 5) {
		foo(i);
	}
}

console.log(foo.count);

```

还有一个更好的例子

```
function foo() {
	var a = 2; 
	this.bar();
}

function bar() {
	console.log(this.a);
}

foo();

```


### 动态作用域

JavaScript 只有词法作用域，没有动态作用域
```
function foo() {
	console.log(a);
}

function bar() {
	var a = 3;
	foo();
}

var a = 2;

bar();


// 输出结果是 2



```


### 使用立即调用函数IIFE创建局部作用域
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


```

在流行的JavaScript的引擎中的另一个缺陷是函数命名表达式的声明进行提升。

```
var f = g() { returen 17; }
g(); // 17 (在非标准的环境中，标准环境会报错 g is not defined)


我们应该怎样做
var f = function g() { return 17; }
var g = null;

```

方法调用

```
var username="test";

function hello() {
	"use strict";
	return "hello, " + this.username;
}

hello(); "hello, undefined"

```


bind绑定方法接收者，下面例子返回什么结果， 用尽可能多的方法修复该例子

```
var buffer = {
	entries: [],
	add: function(s) {
		this.entries.push(s);
	},
	concat: function() {
		return this.entries.join("");
	}
}

var source = ["867", "-", "5309"];

source.forEach(buffer.add);  // error: entries is undefined


```


什么是函数柯里化？柯里化的作用

* 延迟计算
* 参数复用， 当在多次调用同一个函数，并且传递的参数绝大多数相同，那么该函数可能是一个很好的柯里化候选
* 动态创建函数， 这可以是在部分计算出结果后，在此基础上动态生成新的函数处理后面的业务，这样省略了计算


函数柯里化 一道有难度的面试题,完成plus函数 满足通过所有的测试条件

```

'use strict';
function plus(n){
  
}
module.exports = plus


'use strict';
var assert = require('assert')

var plus = require('../lib/assign-4')

describe('闭包应用',function(){
  it('plus(0) === 0',function(){
    assert.equal(0,plus(0).toString())
  })
  it('plus(1)(1)(2)(3)(5) === 12',function(){
    assert.equal(12,plus(1)(1)(2)(3)(5).toString())
  })
  it('plus(1)(4)(2)(3) === 10',function(){
    assert.equal(10,plus(1)(4)(2)(3).toString())
  })
  it('方法引用',function(){
    var plus2 = plus(1)(1)
    assert.equal(12,plus2(1)(4)(2)(3).toString())
  })
})
```

### 创建一个原型为null的对象用作字典

防止原型污染的最简单的方式之一就是一开始就不使用原型。但是ES5发布之前并没有一个标准的方式创建一个空原型的新对象。你可能会这样做
该例子是否能创建一个原型为null的对象。不能的话要怎么做
```
function C() { }

C.prototype = null;

var o = new C();

Object.getPrototypeOf(o) === null; // false
Object.getPrototypeOf(o) === Object.prototype // true

// ES5之后应该这样做
var x = Object.create(null);

Object.getPrototypeOf(o) === null; // true

在不支持Object.create的JavaScript环境中特殊对象__proto__提供了对对象内部原型链的读写访问

var x = { __proto__: null };

x instanceof Object;  // false;

```
第二种貌似更方便，但是有了Object.create函数后，Object.create是更值得推荐的方式。



### 看下面代码mean的输出值时多少？
```
var scores = [98, 74, 85, 77, 93, 100, 89];

var total = 0;

for(score in scores) {
	total += score;
}

var mean = total / socres.length;


mean; // ?   


```


### JavaScript位操作符的诀窍
```
无符号右移自动转换成数字
"" >>> 0.  // 0
"sdsd" >>> 0   // 0

NaN >>> 0 // 0

undefined >>> 0  // 0
 
null >>> 0 // 0

[] >>> 0  // 0

"70" >>> 0 // 70

{} >>> 0. // Uncaught SyntaxError: Unexpected token >>>

～操作自动转换数字
负数转正数减一， 整数转负数减一， 其他-1

~"sdsd" // -1
~"0"    //-1
~0     //-1
~NaN    //-1
~null    //-1
~undefined    //-1
~[]    //-1
~{}    //-1
~"sdsd"    //-1
~"45sdsd"    //-1
~"-1" // 0
~"1" // -2


```

### 隐式转换一个题目
```
如果想输出success英国如何定义a
if(a == 2 && a == 3)  {
	console.log("success")
}


var i = 2;
Number.prototype.valueOf = function() {
	return i++;
}

var a = new Number( 42 );

```
### ["1","12","121"].map(parseInt)
这是一个很有意思的题目乍一看认为可能会输出[1,12,123] 其实不然输入结果为:
```
 [1,NaN, 1]

 ```
 为什么会这样呢，我们知道parseInt方法可以将数字转为10进制的数值，parseInt(string, radix);其中第二个参数是基数
 An integer between 2 and 36 that represents the radix (the base in mathematical numeral systems) of the string. Be careful — this does not default to 10.

而Array的map方法可以接受三个参数
 ```
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
    // Return element for new_array
}[, thisArg])

这里不写参数默认将index作为基数传给了parseInt所以输出结果时并不是按照我们所想的 

["1","12","121"].map(val => parseInt(val)); 来输出的因为你发现这样写结果反而没有问题

真实结果是这样
["1","12","121"].map((val,index,array) => parseInt(val, index));

```


### HTTP请求307什么时候会发生

HTTP Strict Transport Security <code>HSTS</code>, 当在浏览器输入一个域名baidu.com, nginx启用了HSTS,重定向了 https://baidu.com,这时浏览器控制台会看到307




### 什么是DNS劫持和DNS污染


### babel的polyfill和runtime的区别


### Promise为什么需要一个catch done方法是干什么用的
如果捕获promise的异常

### webpack  tree shaking用来做什么的