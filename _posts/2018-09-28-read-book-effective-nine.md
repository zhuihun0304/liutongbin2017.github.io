---
layout:     post
title:      Effective JavaScript (九)
subtitle:   库和API设计
date:       2018-09-28
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---


## 保持一致的约定

## 将undefined当作没有值
undefined很特殊，每当JavaScritp无法提供具体的值时，就产生undefined。为赋值的初始值即为undefiend

```
var x;
x // undefined;

var obj = {};
obj.x; //undefined


function f() {
	return ;
}

function g() {}


f();  //undefined
f();  //undefined

function f(x) {
	return x;
}
f(); // undefined

```	

例如一个Web服务器可以接受一个可选的主机名称
```
var s1 = new Server(80, "example.com");

var s2 = new Server(80); //defaults to "localhost"

我们可以通过判断arguments.length来实现Server构造函数

function Server(port, hostname) {
	if(arguments.length < 2) {
		hostname = "localhost";
	}

	hostname = String(hostname);
}

这种情况如果第二个值是undefined的话可能会使用undefined，这并不是我们想要的所以我们最好判断undefined

function Server(port, hostname) {
	if(hostname === undefined) {
		hostname = "localhost";
	}

	host = String(hostname);
}


另一种合理的方式是测试hostname是否为真

function Server(port, hostname) {
	hostname = String(hostname || "localhost");
	// ...
}
```

但是最后一种的真值检测并不总是安全的，如果一个函数允许接受0(或NaN，虽然不常见)为可接受的参数,则不应该使用真值测试

比如
```


function Element(width, height) {
	this.width = width || 320;
	this.height = height || 240;
	// ...
}
var c1 = new Element(0, 0); 
c1.width; // 320
c1.height; // 240


这种情况我们需要更详细的测试来测试undefined
function Element(width, height) {
	this.width = width === undefined ? 320 : width;
	this.height = height === undefined ? 240 : height;

	// ...
}

var c1 = new Element(0, 0);
c1.width; // 0
c1.height; // 0

var c2 = new Element();
c2.width; // 320
c2.height; // 240

```

## 接受关键字参数的选项对象
保持参数顺序的一致约定对于帮助程序员记住每个参数在函数调用中的意义是很重要的，参数较少时它是适用的。但是参数过多后根本不可扩展
```
var alert = new Alert(100, 75, 300, 200,
		"Error", message,
		"blue", "white", "black",
		"error", true
	);

```
一个函数起初很简单，但是过一段时间，随着库功能的扩展，该函数的签名便会获得越来越多的参数。

幸运的是，JavaScrtip提供了一个简单、轻量的惯用法： 选项对象(options object).

```
var alert = new Alert({
	x: 100, y: 75,
	width: 300, height: 200,
	title: "Error", message: message,
	titleColor: "blue", bgColor: "white", textColor: "black",
	icon: "error", modal: true	
});

```
这个虽然烦琐，但明显更易于阅读，每个参数都是自我描述(self-documenting)的。

```
function Alert(parent, message, opts) {
	opts = opts || {};

	this.width = opts.width === undefined ? 320 : opts.width;
	this.height = opts.width === undefined ? 240 : opts.height;
	this.title = otps.title || "Alert";

}

基于 extend 的另一种实现

function extend(target, source) {
	if(source) {
		for(var key in source) {
			var val = source[key];

			if(typeof val !== "undefined") {
				target[key] = val;
			}
		}
	}

	return target;
}



function Alert(parent, message, opts) {
	opts = extend({
		width: 320,
		height: 240
	});

	opts = extend({
		title: "Alert"	
	}, opts);

	this.width = opts.width;
	this.height = opts.height;
	this.title = opts.title;

}


进一步简化


function Alert(parent, message, opts) {
	opts = extend({
		width: 320,
		height: 240
	});

	opts = extend({
		title: "Alert"	
	}, opts);

	extend(this, opts);
}


```

## 区分数组对象和类数组对象

使用instanceof的不完美选择
```
StringSet.prototype.add = function(x) {
	if(typeof x === 'String') {
		// xxx
	} else if(x instanceof Array) { //有局限性
		// xxx
	} else {
		// xxx
	}
}


```

instanceof 操作符测试一个对象是否继承自Array.prototype。 在一些允许多个全局对象的环境中可能会有标准的Array构造函数和原型对象的多份副本。在浏览器中有这种情况，每个frame会有标准库的一份单独副本，当跨frame通信时，一个frame中的数组不会继承自另一个frame的Array.prototype.出于这个原因，ES5中引入了<code>Array.isArray</code>函数， 其用于测试一个值是否是数组，而不管原型继承。ESMAScript标准中， 该函数测试对象内部[[Class]]属性值是否是Array。它比<code>instanceof</code>更加可靠。
所以有这个更健壮的实现。
```
StringSet.prototype.add = function(x) {
	if(typeof x  === 'String') {

	} else if(Array.isArray(x)) {

	} else {

	}
}


```
对于不支持ES5的环境中我们可以自己实现一个测试方法

```
var toString = Object.prototype.toString;

function isArray(x) {
	return toString(x) === '[object Array]';
}


// 转为真实数组
你不能传入arguments对象并期待它被视为数组，
最好还是自己转化一下
[].slice.call(arguments);



```

<code>Object.prototype.toString</code>函数使用对象内部<code>[[Class]]</code>属性创建结果字符串，所以比<code>instance of</code>操作符更可靠。


## 避免过度的强制转换

我们创建一个BitVector的构造函数guard, 这里有一个思路可以用来做检测用。
```
function BitVector(x) {
	// 链式调用
	uint32.or(arrayLike).guard(x);
}


var guard = {
	guard: function(x) {
		if(!this.test(x)) {
			throw new TypeError("expected " + this);
		}
	}
}

var uint32 = Object.create(guard);

uint32.toString = function() {
	return "uint32";
}


var arrayLike = Object.create(guard);

arrayLike.test = function(x) {
	return typeof x === "object" && x && uint32.test(x.length);
}

arrayLike.toString = function() {
	return "array-like object";
}


guard.or = function(other) {
	var result = Object.create(guard);

	var self = this;
	result.test = function(x) {
		return self.test(x) || other.test(x);
	};

	var description = this + " or " + other;

	result.toString = function() {
		return description;
	};

	return result;

}


```

## 支持方法链

```
function escapeBasicHTML(str) {
	return str.replace(/&/g, "&amp;")
			  .replace(/</g, "&lt;")
			  .replace(/>/g, "&gt;")
			  .replace(/"/g, "&quot;")
			  .replace(/'/g, "&apos;");
}

这种比下面的方法更加简洁

function escapeBasicHTML(str) {
	var str2 = str.replace(/&/g, "&amp;");
	var str3 = str2.replace(/</g, "&lt;");
	var str4 = str3.replace(/>/g, "&gt;");
	var str5 = str4.replace(/"/g, "&quot;");
	var str6 = str5..replace(/'/g, "&apos;");

	return str6;
}


var users = records.map(function(record) {
		return record.username;
	})
	.filter(function(username) {
		return !!username;
	})
	.map(function(username) {
		return username.toLowerCase();
	});

```

* 使用方法链来连接无状态的操作
* 通过无状态的方法中返回新对象来支持方法链
* 通过在有状态的方法中返回this来支持方法链