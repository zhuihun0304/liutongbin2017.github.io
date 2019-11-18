---
layout:     post
title:      Effective JavaScript (七)
subtitle:   对象和原型
date:       2018-09-19
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---


## 理解prototype,getPrototypeOf 和__proto__之间的不同

```
function User(name, passwordHash) {
	this.name = name;
	this.passwordHash = passwordHash;
}

User.prototype.toString = function() {
	return "[User " + this.name + " ]";
};

User.prototype.checkPassword = function(password) {
	return hash(password) === this.passwordHash;
};

var u = new User("sfalken", "objjowewe");

// ES5 提供了Obejct.getPrototypeOf() 来获得对象的原型
Object.getPrototypeOf(u) === User.prototype // true

非标准的环境提供一个特殊的__proto__属性，在这些环境下可以这样检测
u.__proto__ === User.prototype // true


```

## 使用Object.getPrototypeOf的函数而不要使用__proto__属性
并不是所有的JavaScript环境都支持通过__proto__属性来获取对象的原型，因此该属性并不是完全兼容的。由于__proto__会污染所有的对象，因此它会导致大量的Bug。

但是无论在什么情况下 <code>Object.getPrototypeOf</code>函数都是有效的。

对于没有提供ES5 API的JavaScript环境，我们可以利用__proto__属性来实现Object.getPrototypeOf的函数
```
if(typeof Object.getPrototypeOf === 'undefined') {
	Object.getPrototypeOf = function(obj) {
		var t = typeof obj;
		if(!obj || (t !== 'object' && t !== 'function')) {
			throw new TypeError("not an object");
		}

		return obj.__proto__;
	};
}
```

## 始终不要修改__ptoto__属性
原因：
* 避免修改__proto__属性的最明显原因是可移植问题。毕竟不是所有平台都支持
* 避免修改__proto__属性的另一个原因是性能问题
* 避免修改__proto__属性的最大原因是为了保持行为的可预测性。

可以使用ES5中的Object.create函数创建一个具有自定义原型链的新对象。对于不支持的ES5环境下下面有一种不依赖于__proto__可移植的实现。


## 使用构造函数与new操作符无关
```
function User(name, passwordHash) {
	this.name = name;
	this.passwordHash = passwordHash;
}
如果使用new操作符调用构造函数会是实例化一个对象，不使用new函数的接收者将是全局对象。


var u = User("hello", "pass");

u; // undefined
this.name // "hello"
this.passwordHash // "pass"

如果User定为ES5的严格代码，那么它的接收者默认为undefined

function User(name, passwordHash) {
	'use strict';
	this.name = name;
	this.passwordHash = passwordHash;
}
var u = User("hello", "pass");

// error this is undefined

```

所以无论是否用new都可以使用构造函数，为了保证代码的健壮性最好是提供一个不管怎样都会工作的代码。
```
function User(name, pass) {
	if(!(this instanceof User)) {
		return new User(name, pass);
	}

	this.name = name;
	this.pass = pass;
}

var x = User("hello", "pas1");

var y = new User("hel", "pas2");

x instanceof User // true

y instanceof User // true



```
这种方式不管怎样调用构造函数都会返回一个继承了User.prototype的实例对象。	
这种模式的缺点是有一次额外的函数调用，ES5有一种更奇异的调用方式
```
function User(name, pass) {
	var self = this instanceof User
		? this
		: Obejct.create(User.prototype);

	self.name = name;
	self.pass = pass;
	return self;
}

```
这种方式只有在ES5中才可以使用，对于不支持的环境，我们可以制造一个兼容性的版本
```
// 这里只实现了单参数版本的Object.create
if(typeof Object.creat === 'undefined') {
	Object.create = function(prototype) {
		function C() {}
		C.prototype = prototype;
		return new C();
	}
}


```

## 在原型中存储方法
* 将方法存储到实例对象中将创建该函数的多个副本，因为每个实例对象都有一份副本
* 将方法存储于原型中优于存储在实例对象中

## 使用闭包存储私有变量
闭包将数据存储到封闭的变量中而不提供对这些变量的直接访问，获取闭包内容结构的唯一方式是该函数显示的提供获取它的途径。
> 对象和闭包剧哟相反的策略，对象的属性会被自动暴露出去，然而闭包中的变量会被自动隐藏起来。

我们可以利用这一特性在对象中存储真正的私有数据。不是将数据作为对象属性来存储而是在构造函数中以变量的方式来存储它，并将对象的方法转为引用这些变量的闭包

```
function User(name, passwordHash) {
	this.toString = function() {
		return "[User " + name +"]";
	}
	this.checkPassword = function(password) {
		return hash(password) === passwordHash;
	}
}
```

这里name和passwordHash并不是以this的属性存储的，读取不到this.name 和this.passwordHash， User不包含任何实例属性。
该模式有一个缺点为了让构造函数的变量 在使用它们的方法的作用域中，这些方法必须置于实例对象中。 因此违背了上一条<code>在原型中存储方法</code>
但是为了那些看中保障信息隐藏的情形来说，这点额外代价是值得的


## 在子类的构造函数中调用父类的构造函数
如果正确构建父子级关系的对象
```
function Actor(scene, x, y) {
	this.scene = scene;
	this.x = x;
	this.y = y;
	scene.register(this);
}

Actor.prototype.moveTo = function(x, y) {
	this.x = x;
	this.y = y;
	this.scene.draw();
}

Actor.prototype.exit = function() {
	this.scene.unregister(this);
	this.scene.draw();
}


```
如果我们要创建一个Actor的一个子类， 名字为SpaceShip怎么办
```
function SpaceShip(scene, x, y) {
	Actor.call(this, scene, x, y);  
	// 这里SpaceShip的实例对象作为方法的接收者，会将Actor的实例属性加到SpaceShip的实例上，从而继承了Actor的实例属性

	this.points = {};
}

Actor.prototype.moveTo = function(x, y) {
	this.x = x;
	this.y = y;
	this.scene.draw();
}

Actor.prototype.exit = function() {
	this.scene.unregister(this);
	this.scene.draw();
}

如何继承Actor的prototype中的方法呢，我们可以使用之前提到过的ES5下的 
Object.create(非ES5需要自己实现Object.create)

SpaceShip.prototype = Object.create(Actor.prototype);

这样就很好的实现了继承


```

## 避免使用轻率的猴子补丁

由于对象共享原型，因此每一个对象都可以增加、删除、或修改原型的属性，这个有争议的实现通常被称为猴子补丁（monkey-patching）

猴子补丁的吸引力在于它的强大。数组缺少一个有用的方法吗？

```
Array.prototype.split = function(i) {
	return [this.slice(0, i), this.slice(i)];
}

//Error Everry array instance has a split method
```
当多个库以不兼容的方式给同一个原型打猴子补丁时，问题便出现了，另外的库可能使用同一个方法给Array.prototype打猴子补丁，这样会有冲突。
一种替代的方法是增加一个<code>addArrayMethods</code>方法,用户可以选择调用或者忽略
```
function addArrayMethods() {
	Array.prototype.split = function(i) {
		return [this.slice(0,i), this.slice(i)];
	}
}

```
尽管猴子补丁很危险但是有一种特别可靠而且有价值的使用场景 polyfill. ES5定义一些新的Array方法（forEach, map和filter）,如果一些浏览器版本可能不支持这些版本我们可以通过猴子补丁来实现。由于这些行为是标准化的，所以不会造成库与库之间的不兼容风险。