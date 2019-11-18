---
layout:     post
title:      你不知道的JavaScript上卷
subtitle:   你不知道的JavaScript上卷-基础篇
date:       2018-10-08
author:     "toshiba"
header-img: "images/bg/batman/bat9.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---

本书是读完 Effective JavaScript之后开的进行的阅读，整理自己需要注意的点。方便以后巩固。

## 作用域
JavaScript没有块级作用域的相关功能。但是使用<code>with</code>、<code>try...catch</code>可以创建块级作用域

## 变量提升

提升时函数优先
```
foo();

var foo;

foo = function() {
  console.log(2);
}


function foo() {
  console.log(1);
}

```
输入结果是1，函数声明优先，同名的var变量会被忽略，但是后面的重新赋值仍然有效，第二次执行foo得到的结果就是2了。


## 作用域闭包

```

function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  bar();
}

foo();

```

这个是闭包吗？ 从技术上来讲，也许是。但是确切的说不是。准确的说bar()对a的引用方法是词法作用域的查找规则，这些规则只是闭包的一部分。但确实是非常重要的一部分。


来看一个清晰的闭包例子
```
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}


var baz = foo();

baz(); // 2  这是一个闭包的效果
```
函数 bar() 的词法作用域能够访问foo() 的内部作用域。然后我们将bar()函数本身当作一个值类型进行传递， 在这个例子中，我们将bar所引用的函数对象本身当作返回值。





## 动态作用域
JavaScript只有词法作用域，并没有动态作用域

```
function foo() {
  console.log(a);
}

function bar() {
  var a = 3;
  foo();
}


var a = 2;

bar();  // 输出结果为2

```
词法作用域，让foo在查找a时，只在全局作用域找到 <code>var a = 2</code>, 所以这里显示2。 这里可能会疑惑为什么没有找到bar方法内部， 因为这里只是执行foo方法，如果像下面这样写，才会读到a = 3

```
function bar() {
  var a = 3;

  function foo() {
    console.log(a);
  }

  foo();
}


var a = 2;

bar();


```

## 块级作用域的替代方案

ES5之前块级作用域的解决方案catch或with

```
try{ throw 2 } catch(a){
  console.log(a);  // 2
}

console.log(a);

```

let作用域或着let声明还可以这样用
```
let(a = 2) {
  console.log(a); // 2
}

console.log(a); // ReferenceError

```
与隐式的劫持一个已经存在的作用域不同， let声明会显示的创建一个作用域并与其进行绑定。显示作用域不仅更突出，在代码重构时也表现更加健壮。
但是ES6语法不包含这个我们可以选择，合法的ES6语法，
```
{
  let a = 2;
  console.log(a);
}

```
还可以选择使用bable转换器 let-er这个转换器然后开启 这个设置项 。这样就可以直接使用了。


## 关于this

为什么要使用this？ this提供了一种更优雅的方式来隐式的传递对象引用，因此可以将API设计的更加简洁并且易于复用。

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

//foo: 6
//foo: 7
//foo: 8
//foo: 9

console.log(foo.count); // 0

```

这里的this并没有指向自身， foo被当作方法调用时，this代表的是函数的接收者。 这里非严格模式下指向的是全局对象，然而全局对象进行++运算结果是NaN，foo.count作为foo这个函数对象的一个属性从来没有改变过。

我们可以这样来改进x
```

function foo(num) {
  console.log("foo:" + num);
  data.count++;
}

var data = {
  count: 0;
}
var i;

for(i = 0; i < 10; i++) {
  if(i > 5) {
    foo(i);
  }
}

//foo: 6
//foo: 7
//foo: 8
//foo: 9


console.log(foo.count); // 4

```

这样貌似解决了问题，但是忽略了真正的问题，无法理解this的含义和工作原理而是返回了舒适区。

另一种结局方案是使用foo标识符来替代this引用函数对象，但是同样回避了this的问题，并且完全依赖于变量foo的词法作用域

```

function foo(num) {
  console.log("foo:" + num);
  foo.count++;
}

foo.count = 0;

var i;

for(i = 0; i < 10; i++) {
  if(i > 5) {
    foo(i);
  }
}

//foo: 6
//foo: 7
//foo: 8
//foo: 9

console.log(foo.count); // 4

```

我们可以强制使用this执行foo函数对象
```
function foo(num) {
  console.log("foo:" + num);
  data.count++;
}

var data = {
  count: 0;
}
var i;

for(i = 0; i < 10; i++) {
  if(i > 5) {
    foo.call(foo,i);
  }
}

//foo: 6
//foo: 7
//foo: 8
//foo: 9


console.log(foo.count); // 4

```

## this的绑定规则

### 默认绑定
这是最常用的函数调用类型，独立函数调用。 这种情况this默认指向了全局对象
```
function foo() {
  console.log(this.a);
}

var a = 2;

foo(); // 2

```

### 隐式绑定

```
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

obj.foo(); // 2

```
这种方式加上了对于obj对象的引用，拥有了上下文，当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上细纹对象。

对象属性的引用链只有上一层或者说最后一层在调用位置中起作用。举例来说：
```
function foo() {
  console.log(this.a);
}

var obj2 = {
  a: 42,
  foo: foo
}

var obj1 = {
  a: 2,
  obj2: obj2
}


obj1.obj2.foo(); // 42  最后一个obj2起作用


```

一个最常见的this对象绑定问题就是隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而吧this绑定到全局对象或着<code>undefined</code>这取决于是否是严格模式
```
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}


var bar = obj.foo;

var a = "oops, global";

bar(); // oops, global
```
还有一种，参数传递也是一种隐式赋值，因此我们穿日函数时也会被隐式赋值

```
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  fn();
}

var obj = {
  a: 2,
  foo: foo
}


var bar = obj.foo;

var a = "oops, global";

doFoo(obj.foo); // oops, global

```
同理如果向setTimeout中传递函数对象，同样会丢失this。



### 显示绑定
显示绑定通常使用 <code>call</code>、<code>apply</code>、<code>bind</code>，这些方式来实现。

```

function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
}

foo.call(obj);

```
foo.call(...)， 我们可以调用foo时强制把它的this绑定到obj上。

可惜的是显示绑定仍然无法解决我们之前提出的丢失绑定的问题。但是显示绑定的一个变种可以帮我们解决。


```

function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
}

var bar = function() {
  foo.call(obj);
}

bar(); // 2

setTimeout(bar, 100); // 2

bar.call(window); // 2

```

硬绑定的典型应用场景就是创建一个包裹函数，负责接收参数并返回值
```

function foo(something) {
  console.log(this.a, something);
}

var obj = {
  a: 2
}

var bar = function() {
  return foo.apply(obj, arguments);
}


var b = bar(3); // 2, 3

console.log(b);  // 5

```

另一种使用方法是创建一个可以重复使用的辅助函数

```

function foo(something) {
  console.log(this.a);
  return this.a + something;
}

function bind(fn, obj) {
  return function() {
    fn.apply(obj, arguments);
  }
}


var obj = {
  a: 2
}

var bar = bind(foo, obj);

var b = bar(3); // 2 3

console.log(b); // 5


```

由于硬绑定是一种非常常用的模式，所以ES5提供了内置的方法<code>Function.ptototype.bind</code>，它的用法如下
```
function foo(something) {
  console.log(this.a);
  return this.a + something;
}


var obj = {
  a: 2
}

var bar = foo.bind(obj);

var b = bar(3); // 2 3

console.log(b); // 5


```


### new绑定
虽然JavaScript中也有new操作符，使用方法看起来跟那些面向类的语言意义，绝大多数开发者都认为JavaScript中的new的机制也跟那些语言一样，然而JavaScript中的new机制实际上跟面向类的语言完全不同。
* 构造函数 首先JavaScript中的构造函数只是使用new操作符调用的函数，它们并不会属于某个类，也不会实例化一个类，实际上它们甚至不能说是一种特殊的函数类型，它们只是被new操作符调用的普通函数而已。 函数被使用new操作符调用成为构造函数调用，实际上不存在所谓的构造函数，只有对于函数的构造调用。

```
function foo() {
  this.a = a;
}

var bar = new foo(2);

console.log(bar.a); // 2

```
我们创造了一个新的对象，并把它绑定到foo调用中的this上。


## 优先级

显示绑定比隐式绑定优先级要高， new绑定比隐式绑定优先级要高， 但是new绑定会得到一个新的对象。

## 判断this

* 函数是否在new中调用， 如果是的话this绑定的是新创建的对象。

* 函数是否通过<code>call</code>，<code>apply</code>,或者硬绑定调用，如果是的话this是指定的对象

* 函数是否在某个上下文对象中（隐式绑定）如果是的话，this绑定的是上下文对象。

* 如果都不是的话，使用默认绑定。如果在严格模式下绑定到undefined， 否则绑定到全局对象。

## 被忽略的this

如果你把null或undefined作为this绑定对象传入call，apply或者bind，这些值会在调用时被忽略，实际应用的是默认绑定规则
```

function foo() {
  console.log(this.a);
}

var a = 2;

foo.call(null); // 2

```
使用null忽略this可能产生一些副作用，如果某个函数确实使用了this（比如第三方库的一个函数）， 那默认绑定规则会把this绑定到全局对象。这将导致不可预计的后果。
所以我们使用一个更安全的空对象
在JavaScript中创建一个空对象最简单的方法是Obejct.create(null), 它和{}很像，但是不会创建Object.ptototype，所以它比{}更空
```
option + o
var ø = Object.create(null);


```

## 间接引用

还有一个需要注意的情况你可能创建一个函数的间接引用，调用这个函数会应用默认绑定规则

间接引用最容易在赋值时发生
```

function foo() {
  console.log(this.a);
}

var a = 2;

var o = {
  a: 3,
  foo: foo
}

var p = {
  a: 4
}

o.foo(); // 3

(p.foo = o.foo)(); // 2


```
赋值表达式p.foo = o.foo的返回值是目标函数的引用，因此调用位置是foo() 而不是p.foo()或者o.foo();


## this词法

<code>self = this</code>和箭头函数看起来都可以取代bind但本质上想取代的是this机制。如果你经常编写this风格的代码，但是绝大部份都会是用self = this,或者箭头函数，那么你或许应该
* 只使用此法作用域并且完全抛弃错误this风格代码;
* 完全采用this风格，在必要时使用bind，避免使用self = this 和 箭头函数。



## 对象

在对象中，属性名永远都是字符串。使用非String作为属性名它首先会被转成一个字符串。

```
var myObject = {};

myObject[true] = "foo";
myObject[3] = "bar";
myObject[myObject] = "baz";


myObject["true"] = "foo";
myObject["3"] = "bar";
myObject["[object OBject]"] = "baz";



```

### 对象复制

```
浅复制
var newObj = Object.assign({}, myObject);

深复制
对于JSON安全的对象来说有一种巧妙的复制方法

var newObj = JSON.parse(JSON.stringify(someObj));

```

### 属性描述符
```
var myObject = {
  a: 2
}

Object.getOwnPropertyDescriptor(myObject, "a");

// {value: 2, writable: true, enumerable: true, configurable: true}

如果configurable: false, 则不可以再配置，也不可以被删除

```

### 对象常量
结合writable: false 和configurable: false就可以创建一个真正的常量属性(不可以重新定义，修改，删除)
```
var myObject = {};

Object.defineProterty(myObject, "FAVORITE_NUMBER", {
  value: 42,
  writable: false,
  configurable: false 
});

```

### 禁止扩展

如果你想禁止一个对象添加新属性并且保留已有属性，可以使用Object.preventExtensions(...)
```
var myObject = {
  a: 2
}

Object.preventExtensions(myObject);

myObject.b = 3;

myObject.b; // undefined

```
在非严格模式下，创建属性b会静默失败，在严格模式下，将会抛出TyperError错误。


### 密封
Object.seal(...)会创建一个"密封"对象，这个方法实际会在一个现有对象上调用Object.preventExtensions并把所有现有属性标记为configurable: false.
所有密封后不能添加新属性，也不能重新配置和删除任何现有属性(虽然可以修改属性的值)

### 冻结
<code>Object.freeze(...)</code>，会创建一个冻结对象，这个方法是在现有对象调用了<code>Object.seal</code>并把所有数据访问属性标记为 writable: false, 这样就无法修改它们的值


### Getter和Setter

```
var myObject = {
  get a() {
    return 2;
  }
}

Object.defineProperty(myObject, "b", {
  get: function() {
    return this.a * 2;
  },
  enumerable: true  

});

```

通常get和set是成对出现的，只定义一个的话通常会产生意料之外的行为。

```

var myObject = {
  get a() {
    return this._a_;
  }

  set a(val) {
    return this._a_ = val * 2;
  }
}


myObject.a = 2;

myObject.a; // 4


```

### 存在性

前面说过 如果本身对象中有值为undefiend的属性obj.a, 去获取该值得到的结果跟去获取一个不存在的属性结果是一样的，比如obj.b， 那么如果判断一个属性在对象中是否存在呢

```

var myObject = {
  a: 2
}

(a in myObject); // true
(b in myObject); // false

myObject.hasOwnProperty("a"); // true
myObject.hasOwnProperty("b"); // false


```

in操作符会检查属性是否存在对象及其[[prototype]]原型中，相比之下hasOwnProperty只会检查属性是否存在myObject对象中。

要注意的是in操作符检查的是容器内是否有某个值，实际上检查的是某个属性名是否存在。

```
4 in [2, 4, 6]; // false
这个数组包含的属性名其实是0 ，1，2

```

是否可通过for...in操作符来枚举可以通过定义属性是设定
```
var myObject = {};

Object.defineProperty(myObject, "a", {
  enumerable: true, value: 2  
});

Object.defineProperty(myObject, "b", {
  enumerable: false, value: 3
});


myObject.b; //3
{"b" in myObject}; //true
myObject.hasOwnProperty("b"); //true


for(var k in myObject) {
  console.log(k, myObject[k]);
}

// "a" 2

还可以通过另一种方式来区分属性是否可枚举

propertyIsEnumerable 会检查属性是否存在于对象中(而不是在原型链中)并且满足enumerable: true
Object.keys会返回一个数组，包含所有可枚举属性
Object.getOwnPropertyNames 返回一个数组包含所有属性无论是否可枚举

myObject.propertyIsEnumerable("a"); // true

myObject.propertyIsEnumerable("b"); // false

Object.keys(myObject); // ["a"]

Object.getOwnPropertyNames(myObject); // ["a", "b"]


```

Object.keys 和Object.getOwnPropertyNames 都不回查找原型链，只会查找对象直接包含的属性




### 遍历
我们通常会通过<code>for...in</code>来遍历一个对象，但是这样便利对象属性时的顺序是不确定的，在不同的JavaScript引擎中可能不一样，因此在不同的环境中需要保持一致性时，一定不要相信任何观察到顺序，它们是不可靠的
那么如何直接遍历值而不是数组下标呢
```

var myArray = [1, 3, 5];

for(var v of myArray) {
  console.log(v);
}

```
因为数组有内置的@iterator, 因此for...of可以直接应用到数组上。


我们可以使用内置的@@iterator来手动遍历数组， ES6中我们使用Symbol.iterator来获取对象的@@iterator内部属性

```
var myArray = [1, 3, 5];

var it = myArray[Symbol.iterator]();

it.next();  // {value: 1, done: false}

it.next();  // {value: 3, done: false}

it.next();  // {value: 5, done: false}

it.next();  // {value: undefined, done: undefined}

```
和数组不同普通的对象没有内置的@@iterator,所以无法自动完成for...of遍历，之所以这样做有许多非常复杂的原因， 简单来说，这样做是为了避免影响未来的对象类型.

当然我们可以给任何想遍历的对象定义@@iterator
```

var myObject = {
  a: 2,
  b: 3
};

Object.defineProperty(myObject, Symbol.iterator, {
  enumerable: false,
  writable: false,
  configurable: true,
  value: function() {
    var o = this;
    var idx = 0;
    var ks = Object.keys(o);

    return {
      next: function() {
        return {
          value: o[ks[idx++]];
          done: (idx > ks.length)
        }
      }
    }
  }  
});

这样手动遍历

var it = myObject[Symbol.iterator]();
it.next(); // {value:2, done: false}
it.next(); // {value:3, done: false}
it.next(); // {value: undefined, done: true}


for(var v of myObject) {
  console.log(v);
}

```


## 原型风格继承

```

function Foo(name) {
  this.name = name;
}

Foo.prototype.myName = function() {
  return this.name;
}

function Bar(name, label) {
  Foo.call(this, name);

  this.label = label;
}

Bar.prototype = Object.create(Foo.prototype);
// 这里还可以用这种写法，ES6 的 Object.setPrototypeOf  下面的写法更好一点， 当时上面的写法更容易理解
Object.setPrototypeOf(Bar.prototype, Foo.prototype);


Bar.prototype.myLabel = function() {
  return this.label;
}

var a = new Bar("a", "obj a");

a.myName(); // "a"

a.myLabel(); // "obj a"


该方法比较有用，Foo.prototype是否出现在a的[[prototype]]链中
Foo.prototype.isPrototypeOf(a);

```

## 委托
基于委托实现与上面相同功能的代码
```

Foo = {
  init: function(who) {
    this.me = who;
  },
  identify: function() {
    return "I am " + this.name;
  }
}

Bar = Object.create(Foo);

Bar.speak = function() {
  alert("Hello, " + this.identify() + " . ");
}


var b1 = Object.create(Bar);
b1.init("b1");

var b2 = Object.create(Bar);
b2.init("b2");

b1.speak();
b2.speak();
```

通过比较发现， 对象关联风格的代码更加简洁，因为这种风格的代码只关注一件事， 对象之间的关联关系。

## 更简洁的设计
一个关于登陆验证器的设计
```

function Controller() {
  this.errors= [];
}

Controller.prototype.showDialog = function(title, msg) {
  // 显示给用户的消息
}

Controller.prototype.success = function(msg) {
  this.showDialog("success", msg);
}

Controller.prototype.failure = function(err) {
  this.errors.push(err);

  this.showDialog("Error", err);
}


function LoginController() {
  Controller.call(this);
}

LoginController.prototype = Object.create(Controller.prototype);

LoginController.prototype.getUser = function() {
  return document.getElementById("login_username").value;
}

LoginController.prototype.getPassword = function() {
  return document.getElementById("login_password").value;
}


LoginController.prototype.validateEntry = function(user, pw) {
  user = user || this.getUser();
  pw = pw || this.getPassword();

  if(!(user && pw)) {
    return this.failure("Please enter a username & password");
  }
  else if(pw.length < 5) {
    return this.failure("Password must be 5+ character!");
  }

  return true;
}

LonginController.prototype.failure = function() {
  Controller.prototype.failure.call(this, "Login invalid: " + err);
}




function AuthController(login) {
  Controller.call(this);

  this.login = login;
}

AuthController.prototype = Object.create(Controller.prototype);

AuthController.prototype.server = function(url, data) {
  return $.ajax({
    url: url,
    data: data
  });
}

AuthController.prototype.checkAuth = function() {
  var user = this.login.getUser();
  var pw = this.login.getPassword();

  if(this.login.validateEntry(user, pw)) {
    this.server("/check-auth", {
      user: user,
      pw: pw
    })
    .then(this.success.bind(this));
    .fail(this.failure.bind(this));
  }
}


AuthController.prototype.success = function() {
  Controller.prototype.success.call(this, "Authenticated;");
}

AuthController.prototype.failure = function(err) {
  Controller.prototype.failure.call(this, "Auth failed: " + err);
}


var auth = new AuthController(new LoginController());

auth.checkAuth();

```
反类，我们可以使用对象关联风格的行为委托来实现更简单的设计
```

var LoginController = {
  errors: [],
  getUser: function() {
    return document.getElementById("login_username").value;
  },

  getPassword: function() {
    return document.getElementById("login_password").value;
  },
  validateEntry: function(user, pw) {
    user = user || this.getUser();
    pw = pw || this.getPassword();

    if(!(user && pw)) {
      return this.failure("Please enter a username & password");
    }
    else if(pw.length < 5) {
      return this.failure("Password must be 5+ character!");
    }

    return true;
  },
  showDialog: function() {
    // 给用户显示的消息
  },
  failure: function() {
    this.errors.push(err);
    this.showDialog("Error", "Login invalid " + err);
  },
  success: function(msg) {
    this.showDialog("success", msg);
  }

}



var AuthController = Object.create(LoginController);

AuthController.errors = [];

AuthController.checkAuth = function() {
  var user = this.getUser();
  var pw = this.getPassword();

  if(this.validateEntry(user, pw)) {
    this.server("/check-auth", {
      user: user,
      pw: pw  
    })
    .then(this.accepted.bind(this))
    .fail(this.rejected.bind(this));
  }
}

AuthController.server = function(url, data) {
  return $.ajax({
    url: url,
    data: data  
  })
}

AuthController.accepted = function() {
  this.showDialog("Success", "Authenticated!");
}

AuthController.rejected = function(err) {
  this.failure("Auth Failed: " + err);
}


AuthController.checkAuth();
```
这种模式我们只需要两个实体LoginController 和 AuthController
总结： 我们用一种极其简单的设计实现了同样的功能， 这既是对象关联风格代码和行为委托设计模式的力量

## 反词法
ES6简洁与法有一个非常小但重要的缺点
```

var Foo = {
  bar() {/**/},
  baz: function baz() {/**/}  
}

去掉语法糖

var Foo = {
  bar: function() {/**/}
  baz: function baz() {/**/}
}

```
由于函数对象本身没有标识符， 所以bar()的缩写形式实际上会变成一个匿名函数表达式并赋值给bar属性。相比之下 具名函数表达式会额外的给.baz属性附加一个词法名称标识符baz。

匿名函数没有name标识符会导致
* 调用栈更难追踪
* 自我引用（递归， 事件绑定和解除绑定）更难
* 代码稍微难理解

这里只有第二个缺点无法避免，因此使用简洁语法一定要小心这一点。 如果你需要自我引用的话，那最好使用传统的具名函数表达式来定义对应的函数，不要使用简洁语法。

> 再说一次，我们认为JavaScript种的对象关联比类风格代码更为简洁(而且功能相同)