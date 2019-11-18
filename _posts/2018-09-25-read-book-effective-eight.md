---
layout:     post
title:      Effective JavaScript (八)
subtitle:   数组和字典
date:       2018-09-25
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---


## 使用Object的直接实例构造轻量级的字典

```
var dict = { alice: 34, bob: 24, chris: 62 };

var people = [];

for(var name in dict) {
	people.push(name + ": " + dict[name]);
}

people; // ["alice: 34", "bob: 24", "chris: 62"];

```

我们创建一个自定义的字典类会怎样呢
```

function NaiveDict() {}

NaiveDict.prototype.count = function() {
	var i = 0;
	for(var name in this) {
		i++;
	}

	return i;
};

NaiveDict.prototype.toString = function() {
	return "[object NaiveDict]";
};

var dict = new NaiveDict();

dict.alice = 34;
dict.bob = 24;
dict.chris = 62;

dict.count(); // 5

```

这样有一个问题，count会枚举出所有的属性包括了toString 和count,而不仅仅是我们需要的值。


```
var dict = new Array();

dict.alice = 34;
dict.bob = 24;
dict.chris = 62;

```
这样也会有问题，代码对原型污染很脆弱，应用程序的其他库有可能会打猴子补丁，比如
> 原型污染是指当枚举字典的条目时，原型对象中的一些属性可能会导致出现一些不期望的属性。

```
Array.prototype.first = function() {
	return this[0];
}

Array.prototype.last = function() {
	return this[1];
}

var names = [];
for(var name in dict) {
	names.push(name);
}

names; ["alice", "bob", "chris", "first", "last"]

```
使用使用 <code>new Object() </code>可能会面临同样的问题，但是使用 <code>{}</code>的方式会更好, 虽然不能保证对于原型污染时安全的，任何人仍然能增加属性到Object.prototype，但是风险可以降低到仅仅局限于Object.prototype

* 坚持使用Object的直接实例原则可以使for...in循环摆脱原型污染的影响
* 使用对象字面量构建轻量级字典

## 使用null原型以防止原型污染

防止原型污染的最简单的方式之一就是一开始就不使用原型。但是ES5发布之前并没有一个标准的方式创建一个空原型的新对象。你可能会这样做
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


* 在ES5中要使用Object.create(null)创建自由原型的空对象是不太容易被污染的。
* 在一些老环境中考虑使用{ __proto__: null }， 但是它既不是标准的也不是可移植的还有可能在未来被删除
* 绝对不要使用__proto__作为字典中的key


## 使用hasOwnProperty方法避免原型污染
JavaScript的对象操作总是以继承的方式工作，即使一个空的对象字面量也继承了Object.prototype的大量属性
```
var dict = {}
"alice" in dict; //false;
"bob" in dict; //false;
"chris" in dict; //false;

// toString 和valueOf方法继承自Object.prototype
"toString" in dict; //false;  
"valueOf" in dict; //false;
```
幸运的是Object.hasOwnProperty方法可以用来判断属性是否继承自原型对象。
```
dict.hasOwnProperty("alice");     // false
dict.hasOwnProperty("toString");  // false
dict.hasOwnProperty("valueOf");   // false
```
不幸的是我们没有完全解决问题，当调用dict.hasOwnProperty时，我们请求调查对象的hasOwnProperty方法，通常情况下，该方法会简单的继承自Object.property对象，然而如果字典中存储一个同名的条目时，那么原型中的hasOwnProperty方法不能再被捕获到。

```
dict.hasOwnProperty = 10;

dict.hasOwnProperty("alice");
// error dict.hasOwnProperty is not a function
```
这是有可能的,最安全的方式就是

```
var hasOwn = Object.prototype.hasOwnProperty;
或者
var hasOwn = {}.hasOwnProperty;

hasOwn.call(dict, "alice");
```
不管起接收者的hasOwnProperty方法是否被覆盖，该方法都能工作。


我们开始创建一个字典类 版本一
```
function Dict(elements) {
	this.elements = elements || {};
}

Dict.prototype.has = function(key) {
	return {}.hasOwnProperty.call(this.elements, key);
}

Dict.prototype.get = function(key) {
	return this.has(key) ? this.elements[key] : undefined;
}

Dict.prototype.set = function(key, val) {
	this.elements[key] = val;
}

Dict.prototype.remove = function(key) {
	delete this.elements[key];
}

var dict = new Dict({
	alice: 34,
	bob: 24,
	chris: 62
});

dict.has("alice");    // true
dict.get("bob");      // 24
dict.has("valueOf")   //false

```
在一些JavaScript的环境中，特殊的属性名__proto__可能导致自身的污染问题__proto__属性只是简单的继承Object.prototype,所以我们的例子会有一个问题
```
var dict = new Dict();
dict.has("__proto__"); // ?

```
这段代码在不同的环境下可能会有不同的结果，所以为了达到最大的可移植性和安全性，便有了下面更复杂但是更安全的实现
这里检测到__proto__的可以 重新设置一个新属性作为实例对象的一个属性，随对象而在但是不会去设置对象的__proto__
```
function Dict(elements) {
	this.elements = elements || {};
	this.hasSpecialProto = false;
	this.specialProto = undefined;
}

Dict.prototype.has = function(key) {
	if(key === "__proto__") { 
		return this.hasSpecialProto;
	}
	return {}.hasOwnProperty.call(this.elements, key);
}

Dict.prototype.get = function(key) {
	if(key === "__proto__") { 
		return this.specialProto;
	}
	return this.has(key) ? this.elements[key] : undefined;
}

Dict.prototype.set = function(key, val) {
	if(key === "__proto__") {
		this.hasSpecialProto = true;

		this.specialProto = val;
	} else {
		this.elements[key] = val;	
	}
	
}

Dict.prototype.remove = function(key) {
	if(key === "__proto__") {
		this.hasSpecialProto = false;
		this.sepcialProto = undefined;
	} else {
		delete this.elements[key];	
	}
	
}

var dict = new Dict({
	alice: 34,
	bob: 24,
	chris: 62
});

dict.has("alice");    // true
dict.get("bob");      // 24
dict.has("valueOf")   //false

```

## 使用数组而不要使用字典来存储有序集合
JavaScript对象是一个无序集合,ECMAScript标准并未规定属性存储的任何特定顺序，甚至对于枚举对象也未涉及。这将会导致一个问题，<code>for...in</code>循环会挑选一个特定顺序来枚举对象属性.比如
```
function report(highScores) {
	var result = "";
	var i = 1;
	for(var name in highScores) {
		result += i + " . " + name + " : " + highScores[name] + '\n';

		i++;
	}

	return result;
}

report([{
		name: "Hank",
		points: 1110100
	},{
		name: "Steve",
		points: 1064500
	},{
		name: "Billy",
		points: 1052000
	}]);

由于不同的环境选择不同的顺序来存储和枚举对象属性，所以这个函数得到顺序混乱的“最高分”报表
```
请记住你的程序是否以来对象枚举的顺序并不总是显而易见的，如果没有在多个JavaScript环境中测试过你的程序，你甚至可能不回注意到程序的行为因为一个for...in循环的确切顺序而被改变，对于上面的例子需要使用数组,那么它完全可以工作在任何JavaScript环境中

```
function report(highScores) {
	var result = "";
	var i = 1;
	for(var i = 0, n = highScores.length; i < n; i++) {
		var score = hightScores[i];
		result += (i + 1) + " . " + score.name + " : " + score.points + '\n';

		i++;
	}

	return result;
}

report([{
		name: "Hank",
		points: 1110100
	},{
		name: "Steve",
		points: 1064500
	},{
		name: "Billy",
		points: 1052000
	}]);

```

一个微妙的顺序以来的典型例子是浮点运算， 假设一个对象使用<code>for...in</code> 如下
```
var ratings = {
	"Good will Hunting": 0.8,
	"Mystic River": 0.7,
	"21": 0.6,
	"Doubt": 0.9
};

var total = 0, count = 0;
for(var key in. ratings) {
	total += ratings[key];
	count++;
}

total /= count;

total; //?

```
事实证明，流行的JavaScrtip环境实际上使用不同的顺序执行这个循环。
```
一些环境这样计算

(0.8 + 0.7 + 0.6 + 0.9) / 4  // 0.75

还有一些环境先枚举潜在的数组索引，21恰好是一个可行的数组索引，它首先被枚举，导致如下结果

(0.6 + 0.8 + 0.7 + 0.9) / 4  // 0.7499999999999999


更好的表示方法是使用整数值

(8 + 7 + 6 + 9) / 4/ 10.  //0.75

(6 + 8 + 7  + 9) / 4/ 10.  //0.75

```
通常当执行<code>for...in</code> 循环时应当时刻小心，确保操作行为与顺序无关。


## 绝不要在Object.prototype中增加可枚举属性
<code>for...in</code>非常便利，然而它很容易受到原型污染的影响。目前为止<code>for...in</code>最常见的用法是枚举字典中的元素。这暗示着如果想允许对字典对象使用<code>for...in</code>循环，那么不要在共享的Object.prototype中增加可枚举的属性。
```
Object.prototype.allKeys = function() {
	var result = [];
	for(var key in this) {
		result.push(key);
	}

	return result;
}

({a: 1, b: 2, c: 3}).allKeys(); // ["allkeys", "a", "b", "c"]  该方法污染了自身

更友好的做法是将allkeys定义为一个函数而不是方法，虽然着稍微有点不方便

function allKeys(obj) {
	var result = [];
	for(var key in obj) {
		result.push(key);
	}

	return result;
}



```
如果你确实想在Object.prototype中增加属性， ES5提供了一个更加友好的机制Object.defineProperty
> <code>Object.defineProperty</code>方法可以定义一个对象的属性并制定该属性的元数据。例如，我们可以用与之前完全一样的方法定义上面的属性而通过设置其可枚举属性为false使其在<code>for...in</code>循环中不可见。


```
Object.defineProperty(Object.prototype, "allKeys", {
	value: function() {
		var result = [];
		for(var key in this) {
			result.push(key);
		}
		return result;
	},
	writable: true,
	enumerable: false,
	configurable: true
});
```

它不会污染其他所有<code>Object</code>实例的所有<code>for...in</code>循环。每当你需要增加一个不应该出现在<code>for...in</code>循环中出现的属性时，Object.defineProperty便是你的选择



## 避免在枚举期间修改对象
```
function Member(name) {
	this.name = name;
	this.friends = [];
}

var a = new Member("Alice"),
	b = new Member("Bob"),
	c = new Member("Carol"),
	d = new Member("Dieter"),
	e = new Member("Eli"),
	f = new Member("Fatima");

a.friends.push(b);
b.friends.push(c);
c.friends.push(e);
d.friends.push(b);
e.friends.push(d,f);

如果我们写了一个方法 在for...in的时候操作对象比如，删除或添加， 在许多JavaScript环境中这段代码根本不能工作。

```
> ECMAScript规定了，如果被枚举的对象在枚举期间添加了新的属性，那么在枚举期间并不能保证新添加的属性能够被访问。

这个隐式的规范的实际后果是： 如果我们修改了被枚举的对象则不能保证<code>for...in</code>循环行为的可预见性。



我们可以新建一个WorkSet类来追踪当前集合中元素的数量
```
function WorkSet() {
	this.entries = new Dict();
	this.count = 0;
}

WorkSet.prototype.isEmpty = function() {
	return this.count === 0;
}

WorkSet.prototype.add = function(key, val) {
	if(this.entries.has(key)) {
		return;
	}

	this.entries.set(key, val);
	this.count++;
}

WorkSet.prototype.get = function(key) {
	return this.entries.get(key);
}

WorkSet.prototype.remove = function(key) {
	if(!this.entries.had(key)) {
		return;
	}

	this.entries.remove(key);
	this.count--;
}

WorkSet.prototype.pick = function() {
	return this.entries.pick();
}

//这里同时需要给Dict类增加一个pick方法

Dick.prototype.pick = function() {
	for(var key in this.elements) {
		if(this.has(key)) {
			return key;
		}
	}

	throw new Error("empty dictionary");
}

// 现在我们可以实现一个inNetwork的方法
到最后发现这段代码没什么卵用
Member.prototype.inNetwork = function(other) {
	var visited = {};
	var workset = new WorkSet();
	workset.add(this.name, this);

	while(!workset.isEmpty()) {
		var name = = workset.pick();
		var member = workset.get(name);
		workset.remove(name);
		if(name in visited) {
			continue;
		}

		visited[name] = member;

		if(member === other) {
			return true;
		}

		member.friends.forEach(function(friend) {
			workset.add(friend.name, friend);
		})
	}

	return false;
}

```

以上pick方法是一个不确定性的例子， 不确定性指的是一个操作不能保证使用语言的语意产生一个单一的可预见的结果。这个不确定性来源于这样一个事实，for...in循环可能在不同的JavaScript环境中选择不同的枚举顺序。
基于这些原因，考虑使用一个确定的工作集算法替代方案是值得的。集工作列表算法Work-list.

* 使用for...in循环枚举一个对象属性时，确保不要修改该对象
* 当迭代一个对象时，如果该对象的内容可能会在循环期间被改变，应该使用while循环或经典的for循环代替for...in循环
* 为了在不断变化的数据结构中能够预测枚举，考虑使用一个有序的数据结构，例如数组，而不要使用字典对象


## 数组迭代优先使用<code>for</code>循环而不是<code>for...in</code>

看下面代码mean的输出值时多少？
```
var scores = [98, 74, 85, 77, 93, 100, 89];

var total = 0;

for(score in scores) {
	total += score;
}

var mean = total / socres.length;

 mean; // ?  17636.571428571428


 请记住即使是数组的索引属性，对象属性的key始终是字符串

 total = 0 + "0" + "1" + "2" + "3" + "4" + "5" + "6";

 total = "00123456";


```
迭代数组内容的正确方式是使用传统的for循环, 建议存储数组长度到一个局部变量中
```
var scores = [98, 74, 85, 77, 93, 100, 89];
var total = 0;

for(var i = 0, n = scores.length; i < n; i++) {
	total += socres[i];
}

var mean = toal / scores.length;

mean; // 88

```

## 迭代方法由于循环
一些常见的for循环错误
```
for(var i = 0; i <= n; i++) {...}. // 获取最后一项错误

for(var i = 1; i < n; i++) {...}. // 丢失第一项

for(var i = n; i >= 0 ; i--) {...}. // 获取起始值错误

for(var i = n - 1; i > 0 ; i--) {...}. // 丢失最后一项

```
我们面对这样一个事实，搞清楚终止条件是一个累赘。
幸运的是ES5提供了一些便利的方法。Array.prototype.forEach是其中最简单的一个。例如：
```
for(var i = 0, n = players.length; i < n; i++) {
	players[i].score++;
}
可以用下面代码替换
players.forEach(function(p) {
	p.socre++;
})	

```
这段代码不仅更简单可读而且消除了终止条件和任何数组索引。

另一个例子是对数组进行操作后建立一个新的数组我们可以这样实现
```
var trimmed = [];
for(var i = 0, n = input.lenght; i < n; i++) {
	trimmed.push(input[i].trim());
}

我们同样可以使用forEach来实现

var trimmed = [];
input.forEach(function(s) {
	trimmed.push(s.trim());
});


因为这是一个十分普遍的操作，所以ES5提供了一个更简单优雅的实现Array.prototype.map

var trimmed = input.map(function(s) {
	return s.trim();	
})


```

另外一种常见的模式是计算一个新的数组，该数组只包含现有数组的一部分元素.<code>Array.prototype.filter</code>使其变得简单

```

listings.filter(function(listing) {
	return listing.price >= min && listing.price <= max;
});

```
这些都是ES5的默认方法，我们当然可以实现自己的方法，比如我们需要这样一个模式，提取满足谓词的数组的前几个元素
```
function takeWhile(a, pred) {
	var result = [];
	for(var i = 0, n = a.length; i < n; i++) {
		if(!pred(a[i], i)) {
			break;
		}
		result[i] = a[i];
	}

	return result;
}

var prefix = taleWhile([1, 2, 4, 8, 16, 32], function(n) {
	return n < 10;
});

// [1, 2, 4, 8]


```
请注意我们将索引i赋值给了pred, 我们可以选择使用或忽略该索引。事实上标准库中的所有迭代方法包括(forEach, map, filter)都将数组索引传递给了用户自定义函数。

我们也可以将takeWhile加入到Array.prototype中参考猴子补丁的影响
```
Array.prototype.takeWhile = function(pred) {
	var result = [];
	for(var i = 0, n = this.length; i < n; i++) {
		if(!pred(this[i], i)) {
			break;
		}

		result[i] = this[i];
	}

	return result;
}

var prefix = [1, 2, 4, 8, 16, 32].takeWhile(function(n) {
	return n < 10;
})

```

> 循环只有一点优于迭代函数，那就是前者有控制流操作，如break 和continue。 

举例来说
```
function takeWhile(a, pred) {
	var result = [];
	a.forEach(function(x, i) {
		if(!pred(x)) {
			// ?
		}
		result[i] = x;
	});

	return result;
}

我们可以使用一个内部异常来提前终止该循环，但是这既尴尬又效率低下

function takeWhile(a, pred) {
	var result = [];
	var earlyExit = [];
	try {
		a.forEach(function(x, i) {
			if(!pred(x)) {
				throw earlyExit;
			}

			result[i] = x;
		});
	} catch(e) {
		if(e !== earlyExit) {
			throw e;
		}
	}

	return result;
}

```	

ES5的数组方法some和every可以用于提前终止循环。

```
[1, 10, 100].some(function(x) {.return x > 5; });  // true
[1, 10, 100].some(function(x) {.return x < 0; });  // false

[1, 10, 100].every(function(x) {.return x > 0; });  // true
[1, 10, 100].every(function(x) {.return x < 3; });  // true

```

利用这一点我们可以重新实现takeWhile方法

```

function takeWhile(a, pred) {
	var result = [];

	a.every(function(x, i) {
		if(!pred(x)) {
			return false; // break
		}

		result[i] = x;
		return true;  // continue
	});

	return result;
}

```

* 使用迭代方法 forEach 和map替换for循环使得代码更可读，并且避免了重复循环控制逻辑
* 使用自定义的迭代函数来抽象未被标准库支持的常见循环模式
* 在需要提前终止循环的情况下， 仍然推荐使用传统的循环。另外，some和every方法也可用于提前退出


## 在类数组对象上复用通用的数组方法
<code>Array.prototype</code>中的标准方法被设计成其他对象可复用的方法，即使这些对象并没有继承Array,一个很好的例子 函数的arguments对象，它并没有继承Array.prototype，因此我们不能简单的调用arguments.forEach方法来遍历每一个参数。取而代之我们提取forEach方法对象的引用并使用其call方法
```
// 同样也可先转化为一个数组 var args = [].slice.call(arguments);

function highlight() {
	[].forEach.call(arguments, function(widget) {
		widget.setBackground("yellow");
	})
}

```

如何使一个对象“看起来像数组”，数组对象的基本契约总共有两个简单规则
* 具有一个范围在0-2^32-1的整型length属性。
* length属性大于该对象的最大索引。索引的范围是0-2^32-2的整数，它的字符串表示就是该对象的一个key

例子

```
var arrayLike = {0: "a", 1: "b", 2: "c", length: 3}
var result = Array.prototype.map.call(arrayLike, function(s) {
	return s.toUpperCase();
});

// ["A", "B", "C"]
```

字符串也表现为不可变的数组，因为它们是可索引的， 并且其长度也可以通过length属性获取。因此，Array.prototype中的方法操作字符串不回修改原始数组。

```
var result = Array.prototype.map.call("abc", function(s) {
	return s.toUpperCase();	
});

```

对于使用Array.prototype中的方法，在增加或删除索引属性的时候它们都会强制的更新length属性。所有的Array.prototype方法在类数组中可以通用。

只有一个Array方法不是通用的那就是数组连接方法concat。该方法可以由任意的类数组调用但是它会检查其参数的[[Class]]属性，如果是一个真实的数组才会连接，如果不是例子如下
```
function nameColum() {
	return ["Names"].concat(arguments);
}

namesColumn("Alice","Bob", "Chris");


// ["Names", {.0: "Alice", 1: "Bob", 2: "Chris" }]

这种时候我们可以使用数组转换的方法
function nameColum() {
	return ["Names"].concat([].slice.call(arguments));
}

namesColumn("Alice","Bob", "Chris");

// ["Names", "Alice","Bob", "Chris"]

```

## 数组字面量优于数组构造函数

```
var a = [1, 2, 3, 4, 5];

也可以使用数组构造函数来替代

var a = new Array(1, 2, 3, 4, 5);


有这样几个问题
首先要保证没有人重新包装过Array变量
function f(Array) {
	return new Array(1, 2, 3, 4, 5);
}

f(String);  //  new String(1)

其次要确保没人修改过全局Array变量

Array = String;
new Array(1, 2, 3, 4, 5); // new String(1)



还有一个问题 

["hello"] 和 new Array("hello") 行为虽然一致

但是

[17] 和 new Array(17) 行为完全不同了

```

* 使用数组字面量替代数组构造函数