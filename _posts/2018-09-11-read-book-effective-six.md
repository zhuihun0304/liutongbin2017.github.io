---
layout:     post
title:      Effective JavaScript (六)
subtitle:   使用函数
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


## 函数调用
理解函数调用， 方法调用，构造函数调用之间的不同。

```javascript

最简单的函数调用
function hello(username) {
	return "hello, " + username;
}

hello("Keyser soze");

方法调用
var obj = {
	hello: function() {
		return "hello, " + this.username;
	},
	username: "Hans, Gruber";
}

obj.hello(); // hello, Hans, Gruber


// 在函数调用过程中由调用表达式自身来确定this变量的绑定。 
  
构造函数调用

function User(name, pass) {
	this.name = name;
	this.pass = pass;
}  

var u = new User("sketcon", "123456");

与函数调用和方法调用不同的是，构造函数调用将一个全新的对象作为this变量的值，并隐式的返回这个对象作为调用结果。
构造函数的主要职责是初始化这个新对象。


```

## 熟练掌握高阶函数
高阶函数无非就是将函数作为参数或返回值的函数。将函数作为参数通常称为回调函数。


## 使用call方法自定义接收者来调用方法
通常情况下，函数或方法的接接收者（即绑定到特殊关键字this的值）是由调用者的语法决定的。但是有时我需要自定义一个接收者，幸运的是函数有一个内置的方法call来自定义接收者。可以通过函数对象的call方法来调用自身。
```
f.call(obj, arg1, arg2, arg3);

f(arg1, arg2, arg3);
```
不同的是第一个参数提供了一个显示的接收者对象。

## 使用apply方法通过不同数量的参数调用函数

这里理解有误区，接受一个数组的参数，但是方法调用时将参数依次传入方法

```
average 函数是一个称为可变参数或可变元的函数（函数的元市值其期望的参数个数）

average(1, 2, 3);

average(1);

average(1, 2, 3, 7, 9);

可变参数的版本更加简洁，优雅。


averageOfArray([1, 2, 3]);

averageOfArray([1]);

averageOfArray([1, 2, 3, 7, 9]);


// 本来average 只接受可变参数，假设我有这样一个数字数组， average函数中没有this引用，所以简单的传null就可以。
var scores = getAllScores();
average.apply(null, scores)  
传入一个数组，调用时这样 average(scores[0], scores[1], scores[2])





使用apply方法指定一个可计算的参数数组来调用可变参数的函数。
使用apply方法的第一个参数给可变参数的方法提供一个接收者。

```



## 使用arguments创建可变参数的函数

```
参数可变函数的实现
function average() {
	for(var i = 0, sum = 0, n = argumants.length; i < n; i++) {
		sum += arguments[i];
	}

	return sum / n;
}
```
可变参数的函数提供了灵活的接口，不同的调用者可以使用不同数量的参数来调用它们，但是它们自身也失去了一点便利。如果使用者要使用数组的参数则只能使用 apply。 
apply方法会降低可读性而且经常导致性能损失

好的经验是

> 如果提供了一个便利的可变参数的函数，最好也提供一个需要显示指定数组的固定元数的版本。这样可以编写一个轻量级的封装，并委托固定元数的版本来实现可变参数的函数

比较拗口，代码比较直观如下：

```

固定元数的版本实现 用来作为数组参数的调用
function averageOfArray(a) {
	for(var i = 0, sum = 0, n = a.length; i < n; i++) {
		sum += a[i];
	}

	return sum / n;
}

averageOfArray([1, 2, 3]);


参数可变函数的实现可以通过调用 固定元数版本来实现
function average() {
	// averageOfArray本来就支持数组 所以无论average传入数组还是啥
	return averageOfArray(arguments);
}



```


## 永远不要修改arguments对象
不要修改arguments对象，并且将arguments对象复制到一个真正的数组中再进行调整。

```
var obj = {
	add: function(x, y) { return x + y; }
}

function callMethod(obj, method) {
	var shift = [].shift;
	shift.call(arguments);
	shift.call(arguments);

	return obj[method].apply(obj, arguments);
}

callMethod(obj, "add", 17, 25);  // cannot read property "apply" of undefined   17[25]

这里的arguments 对象并不是函数参数的副本，所有命名参数都是arguments对象中对应索引的别名。

```
永远不要修改arguments对象是更为安全的，通过一开始复制参数中的元素到一个真正的数组的方式，很容易避免修改arguments对象。
```
var args = [].slice.call(argumants);

slice会复制整个数组，其结果是一个真正的标准Array类型实例。

function callMethod(obj, method) {
	var args = [].slice.call(arguments, 2);
	return obj[method].apply(obj, args);
}

callMethod(obj, "add", 17, 25);
```

## 使用变量保存arguments的引用

```
// 实现一个迭代器


function values() {
	var i = 0, n = arguments.length;
	return {
		hasNext: function() {
			return i < n;
		},
		next: function() {
			if(i >= n) {
				throw new Error("end of iteration");
			}
			return arguments[i++]; // wrong arguments;
		}
	}
}

var it = values(1, 2, 3, 5, 78);

it.next(); //undefined

it.next(); //undefined

it.next(); //undefined

每次调用next的时候，next方法内部会存在一个arguments这里可能我们关心的只是values的arguments, 所以正确的方法是将values的arguments保存下来

function values() {
	var i = 0, n = arguments.length, arg = arguments;
	return {
		hasNext: function() {
			return i < n;
		},
		next: function() {
			if(i >= n) {
				throw new Error("end of iteration");
			}
			return arg[i++];
		}
	}
}

```

## 使用bind方法提取具有确定接收者的方法

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
buffer.add 方法的接收者并不是buffer对象，函数的接收者取决于它是如何被调用，
不过我们并没有调用它，而是把它传给了forEach方法
而我们并不知道forEach在哪里调用了它，事实上forEach方法的实现使用全局对象作为默认的接收者。由于全局对象没有entries属性所以这段代码抛出了一个错误。
幸运的是forEach允许调用者提供一个可选的参数作为回调函数的接收者，所以我们可以很轻松的修复该例子。


方法一
```
var source = ["867", "-", "5309"];

source.forEach(buffer.add, buffer); 


```


并非所有的高阶函数都会为使用者提供其毁掉函数的接收者。如果forEach不接受额外的接收者参数怎么办

方法二
```
source.forEach(function(s) {
	buffer.add(s);
});

bujjer.join();

```

创建一个函数用来实现绑定其接收者到一个指定的对象是非常常见的，因此ES5标准库直接支持这种模式，函数对象的bind方法需要一个接收者对象，并产生一个以该接收者对象的方法调用的方式调用原来的函数的封装函数。

方法三

```
var source = ["867", "-", "5309"];

source.forEach(buffer.add.bind(buffer)); 


buffer.add.bind(buffer) 创建了一个新函数而不是修改了bufffer.add函数 该函数将接收者绑定到了buffer对象，而原有函数的接收者保持不变

buffer.add === buffer.add.bind(buffer);  // false;
```

## 使用bind实现函数柯里化
函数对象的bind方法除了具有降方法绑定到接收者的用途外，它还有更多功能。

```
function simpleURL(protocol, domain, path) {
	return protocol + "://" + domain + "/" + path;
}

var urls = paths.map(function(path) {
	return simpleURL("http", siteDomain, path);
});


```
传给simpleURL的前两个参数是固定的， 只有第三个参数在变化，我们可以通过调用simpleURL函数的bind方法来自动构造该匿名函数
```
var urls = path.map(simpleURL.bind(null, "http", siteDomain));
```
对simpleURL.bind的调用产生了一个委托到simpleURL的新函数，bind的第一个参数提供了接收者的值， 由于simpleURL.bind不需要引用this，所以可以使用任何值。使用null和undefined是习惯用法。 simpleURL.bind的其余参数和提供给你新函数的所有参数共同组成了传递给simpleURL的参数。

> 将函数与其参数的一个子集绑定的技术称为函数柯里化。


## 不要信赖函数对象的toString方法

JavaScript有一个非凡的特性， 即将其源代码重现为字符串的能力
```
(function(x) { 
	return x + 1 
}).toString();

// "function (x) {\n return x + 1; \n}"
```

ECMAScript标准对于函数对象的toString方法的返回结果并没有任何要求。这意味着不同的JavaScript引擎将产生不同的结果，甚至产生的字符串跟函数并不相关。

```
(function(x) { 
	return x + 1 
}).bind(16).toString();

// "function (x) {\n [native code] \n}"
```
由于bind函数通常是由其他语言实现的通常c++，宿主提供一个编译后的函数，在此环境下通常没有源代码可展示。

还有一点就是 toString方法生成的源代码并不展示闭包中保存的和内部变量引用相关的值
```
(function(x) {
	return function(y) {
		return x + y;
	}	
})(42).toString();

// "function(y) {\n return x + y; \n }"
```

> 总而言之，应该避免使用函数对象的toString方法

## 避免使用非标准的栈检查属性

* arguments.callee 指向使用该arguments对象被调用的函数
* arguments.caller 指向调用该arugments对象的函数（该arguments对象调用函数的函数）

出于安全考虑大多环境移除了arguments.caller,因此它是不可靠的

许多JavaScript环境提供了一个相似的函数对象属性---非标准但是普遍适用的caller属性。 它指向函数最近的调用者
```
function revealCaller() {
	return revealCaller.caller;
}

function start() {
	return revealCaller();
}

start() === start;  // true
```
> ES5的严格模式禁止使用arguments.caller 和arguments.callee ，因为它们不具备良好的可移植性， 非标准的函数对象caller属性应该避免使用，因为在包含全部栈信息方面，它是不可靠的。