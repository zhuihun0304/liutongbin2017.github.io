---
layout:     post
title:      你不知道的JavaScript中卷(一)
subtitle:   你不知道的JavaScript
date:       2018-10-18
author:     "toshiba"
header-img: "images/bg/batman/bat9.jpg"
comments: true

tags :
    - javascript
    - 读书总结
categories:
    - 读书总结
---


## 字符串
```
var a = "foo";
b = ["f", "o", "o"];

var c = Array.prototype.join.call(a, "-");

var d = Array.prototype.map.call(a, function(v) {
	return v.toUpperCase() + "."
}).join("");


c; // "f-o-o"

d; // "F.O.O."

```

## 数字
```
var a = 5E10;

a; // 50000000000

a.toExponential(); // "5e+10"


// toFixed 用来显示小数部分的显示位数
var a = 42.59;

a.toFixed(0);  // "43"

a.toFixed(1);  // "42.6"

a.toFixed(2);  // "42.59"


42.toFixed(3); // SyntaxError 报错 42. 被视为一个整体 所以没有访问toFixed

以下访问方式都没有问题

(42).toFixed(3);  // "42.000"
0.42.toFixed(3);  // "0.420"
42..toFixed(3);   // "42.000"


// toPrecision 方法用来制定有效数位的显示位数

var a = 42.59;

a.toPrecision(1); // "4e+1"
a.toPrecision(2); // "43"
a.toPrecision(3); // "42.6"
a.toPrecision(4); // "42.59"
a.toPrecision(5); // "42.590"



```

## 浮点数

```
0.1 + 0.2 === 0.3; // false

由于浮点数的精读问题导致
0.1 + 0.2; // 0.3000000000000004;

```

那么如果判断0.1 + 0.2 和 0.3 是否相等呢， 最常见的做法是设置一个误差范围值， 通常称为"机器精度"， 对于JavaScript来说这个值通常是2^-52;
ES6开始，该值定义在<code>Number.EPSILON</code>
```

if(!Number.EPSILON) {
	Number.EPSILON = Math.pow(2, -52);
}


function numbersCloseEnoughToEqual(n1, n2) {
	return Math.abs(n1 - n2) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual(a, b);  // true;

numbersCloseEnoughToEqual(0.0000001, 0.0000002); // false;


```


## 整数检测
要检测一个值是否是整数，可以使用ES6种的Number.isInteger方法
```
Number.isInteger(42);     // true

Number.isInteger(42.00);  // true

Number.isInteger(45.3);   // false

// ES6 之前的polyfill Number.isInteger

if(!Number.isInteger) {
	Number.isInteger = function(num) {
		return typeof num == 'number' && num % 1 == 0;
	}
}


// 最大安全数

Numbe.isSafeInteger(Number.MAX_SAFE_INTEGER); // true
Numbe.isSafeInteger(Math.pow(2, 53)); // false
Numbe.isSafeInteger(Math.pow(2, 53) - 1); // true

// ES6 之前的polyfill Number.isSafeInteger

if(!Number.isSafeInteger) {
	Number.isSafeInteger = function(num) {
		return Number.isInteger(num) && Math.abs(num) <= Number.MAX_SAFE_INTEGER;
	}
}



```
## 零值
JavaScript有一个常规的0(+0), 和一个-0
-0， 除了可以作为常量以外，也可以是某些数学运算的返回值

```

var a = 0 / -3; // -0

var b = 0 * -3; // -0

加法和减法运算不会得到负零


根据规范对于负零进行字符串化操作会返回"0"
var a = -0;

a.toString();
a + "";
String(a);
JSON.stringify(a)

以上都会返回 "0", 但是返回来将其从字符串转换为数字，得到的结果是准确的

+"-0";            // -0
Number("-0");     // -0
JSON.parse("-0"); // -0


0 === -0; // true

0 == -0;  // true

0 > -0;    // false

判断是否是 -0

function isNegZero(n) {
	n = Number(n);

	return (n === 0) && (1 / n === -Infinity);
}


isNegZero(-0);      // true
isNegZero(0 / -3);  // true
isNegZero(0);       // false

```

我们为什么需要-0呢，有些应用程序中的数据需要以级数形式来表示(比如动画帧的移动速度), 数字的符号为sign用来代表其他信息(比如移动方向),此时如果一个值为0的变量失去了它的符号位，它的方向信息就回丢失。所以保留0值的符号为可以防止这类情况发生。


## 特殊等式
如前所述，NaN和0在相等比较时表现有些特别，由于NaN和自身不相等，所以必须使用ES6中的Number.isNaN或者polyfill, 而 +0 和 -0 的比较我们也需要借助于 isNegZero这样的工具函数。

ES6引入了一个工具方法Object.is(...)来判断两个值是否绝对相等用来处理上面特殊情况
```

var a = 2 / "foo"; 
var b = -3 * 0;

Object.is(a, NaN); // true

Object.is(b, -0);  // true

Object.is(b, 0);   // false


ES6之前的polyfill

if(!Object.is) {
	Object.is = function(v1, v2) {
		//判断是否是-0
		if(v1 === 0 && v2 === 0) {
			return 1 / v1 === 1 / v2;
		}

		// 判断是否是NaN
		if(v1 !== v1) {
			return v2 !== v2;
		}

		return v1 === v2;
	}
}

```


## JSON字符串化
对于大多数简单值来说JSON字符串化和toString效果基本相同，只不过序列化的结构总是字符串
所有安全的JSON值都呈现为有效的JSON格式的值
```
JSON.stringify(42);  // "42"
JSON.stringify("42") // ""42""
JSON.stringify(null) // "null"
JSON.stringify(true) // "true"


```
相对而言不安全的JSON值包括 undefined, function , symbol和包含循环引用的对象都不符合JSON的标准结构，其他支持JSON的语言无法处理它们。

JSON.toStringify(...)在处理对象中遇到undefined,function,Symbol是会自动将其忽略，在数组中则返回null，以保证单于位置不变
```
JSON.stringify(undefined)     			// undefined
JSON.stringify(function() {}) 		    // undefined
JSON.stringify(
	[1, undefined, function() {}, 4] 	// "[1, null, null, 4]"
)
JSON.stringify(
	{a: 2, b: function() {}}         	// "{"a": 2}"
) 
JSON.stringify(undefined) // undefined

```

如果对象定义了toJSON方法，JSON字符串化会首先调用该方法然后用它的返回值来进行序列化。

```
var o = {};
var a = {
	b: 42,
	c: o,
	d: function() {}
}

o.e = a;

//循环引用会报错
// JSON.stringify(a);

//自定义的JSON序列化
a.toJSON = function() {
	return {b: this.b};
}

JSON.stringify(a); // "{b: 42}"

```

## JSON.stringify
几个不为人知的知识点,该方法可以传入一个replacer，它可以是数组或者函数，用来制定对象序列化过程中那些应该被处理，哪些应该被排除，如果replacer是一个数组，那么它必须是一个字符串数组，其中高喊序列化要处理的对象的属性名称。除此之外的其他属性被忽略。如果replacer是一个函数，它会对对象本身调用一次然后对对象中的每个属性各调用一次，每次传递两个参数key和value，如果要忽略某个key就返回undefined，否则返回指定值
```
var a = {
	b: 42,
	c: "42",
	d: [1,2,3]
}

JSON.stringify(a, ["b", "c"]); // "{"b": 42, "c": "42"}"

JSON.stringify(a, function(k, v) {
	if(k !== "c") return v;	
});

// "{"b": 42, "d": [1,2,3]}"


```
JSON.stringify还有一个可选参数space用来指定输出的缩进格式。


```
var a = {
	b: 42,
	c: "42",
	d: [1,2,3]
}

JSON.stringify(a, null, 3);

JSON.stringify(a, null, '---------');


```
## toNumber
true转换为1，false转换为0，undefined转换为NaN，null转为0

```
Number("");  // 0
Number([]);  // 0
Number(["abc"]);  // NaN

```

## 奇特的～运算符
字位运算只适用于32位整数，运算符将会强制操作数使用32位格式。 ToInt32首先执行ToNumber 然后执行ToInt32，虽然严格来说并非强制类型转换，但是字位运算符和一些特殊数字一起使用时会产生类似强制类型转换的效果，返回另外一个数字
例如<code>|</code>的空操作,会将后面转为数字
```
0 | -0;        // 0
0 | NaN;       // 0
0 | Infinity;  //0
0 | -Infinity; //0

```


简单来说～ 可以理解为<code>-(x+1)</code>， 
```
～42; // -43

~-1; // 0

var a = "Hello world";

~a.indexOf("lo");  // -4

~a.indexOf("ol"); // 0

if(!~a.indexOf("ol")) {
	// 无匹配
}

```

## ~~字位截取
有些开发人员使用<code>~~</code>来借去数字值的消暑部分，以为这和Math.floor的效果一样，实际上并非如此
~~它首先只适用于32位数字，更重要的是它对负数的处理和Math.floor不同。
```
Math.floor(-49.6); // -50  
~~-49.6;      // -49 该方法会舍弃

```

## 显示解析数字字符串

parseInt是解析，允许字符串中出现非数字字符，解析从左到右遇到非数字字符就停止。而转换Number不允许出现非数字字符，否则会失败并返回NaN
```
var a = "42";
var b = "42px";

Number(a); // 42
parseInt(a); // 42

Number(b); // NaN
parseInt(b) // 42

```
parseInt和parseFloat是针对字符串值，所以传递其他类型的值是没有用的，他们会被强制类型转换成字符串。

ES5之前的一个坑就是如果没有指定第二个参数来给定转换基数，则会以第一个参数的第一个字符来自行决定。如果第一个字符是 x 或者 X 则转换为十六进制， 如果是0则转换为八进制。

如下代码如果值为08:09 ,转换后的值为0:0 因为 8 和 9 都不是有效的八进制数。

```

var hour = parseInt(selectHour.value);
var minute = parseInt(selectMinute.value);

```
将第二个参数设置为10即可避免这个问题
```
var hour = parseInt(selectHour.value, 10);
var minute = parseInt(selectMinute.value, 10);

```

幸运的是从ES5开始<code>parseInt(...)</code>默认转换为十进制， 除非另外指定。如果你的代码在ES5之前的环境运行，请记得将第二个值设置为10.

有这样一个坑
```
parseInt(1/0, 19); // 18

```
这里parseInt接收字符串参数, 所以 Infinity 被转换为 "Infinity"; 19也不是一个正规的基数，所以这里其实是在转换 parseInt("Infinity", 19);

按照十六进制表示规则 a => 10, b => 11, c => 12, ... i => 18 ... z => 35; 基数是19所有小于19的字母都是有效数字。

此外还有一些看起来奇怪但是解释的通的例子
```
// 这个例子 小数点后六位之前转为 0
parseInt(0.000008); // 0    
//但是小数点后七位就转为 8e-7 再转字符串"8e-7" 8是有效数字
parseInt(0.0000008); // 8


// "fa"都是有效数字 f = 15 a = 10;  15 * 16 + 10 = 250
parseInt(false, 16); // 250

//parseInt.toString()
//"function parseInt() { [native code] }"
//"f"解析位16进制的15
parseInt(parseInt, 16); // 15

//16进制的10 就是16
parseInt("0x10"); // 16
// 3不是有效的二进制， 只解析 10, 2进制的10  就是十进制的2
parseInt("103", 2) // 2


```


## 隐式转换
<code>null</code>和<code>undefined</code> 之间<code>==</code>比较

* 如果x为null， y是undefined 结果为true
* 如果x为undefined， y是null 结果为true

```
var a = null;
var b;

a == b;    // true
a == null; // true
b == null; // true

a == false; // false
b == false; // false
a == "";    // false
b == "";    // false
a == 0;     // false
b == 0;     // false


var a = doSomething();

if(a == null) {
	//...
}
条件判断 a == null 仅在 doSomething() 返回 null 和 undefined时才成立，除此之外其他值不成立包括0, false 和""这样的假植

```

对象和非对象之间的比较

* 如果Type(x)是字符串或者数字， Type(y)是对象， 则返回 x == ToPrimitive(y)的结果
* 如果Type(x)是对象， Type(y)是字符串或者数字， 则返回 ToPrimitive(x) == y的结果

```
var a = 42;
var b = [42];

a == b; // true



var a = "abc";
var b = Object(a);  // 和 new String(a) 一样

a == b;  // true

```
但是有一些值不这样， 原因是==算法中其他优先级更高的规则
```

var a = null;
var b = Object(a); // 和Object()一样

a == b;  // false


var c = undefined;
var d = Object(c); // 和Object一样
c == d; // false


var e = NaN;
var f = Object(e); // 和new Number(e)一样

e == f; // false

```
因为没有对应的封装对象所以null和undefined不能够被封装， <code>Object(null)</code>, <code>Object(undefined)</code>，都返回一个常规对象。NaN能被封装为数字封装对象，但是拆封之后NaN == NaN返回false， 因为NaN不等于NaN。


比较少见的情况
2 == 3 不会有这种情况， new Number会调用valueOf
```
Number.prototype.valueOf = function(){
	return 3;
}

new Numebr(2) == 3; // true

```

假值相等比较

```

"0" == null;      // false
"0" == undefined; // false
"0" == false;     // true
"0" == NaN;       // false
"0" == 0;        // true
"0" == "";       // false



false == null;      // false
false == undefined; // false
false == NaN;       // false
false == 0;        // true
false == "";       // true
false == [];       // true
false == {};       // false



"" == null;      // false
"" == undefined; // false
"" == NaN;       // false
"" == 0;        // true
"" == [];       // true
"" == {};       // false


0 == null;      // false
0 == undefined; // false
0 == NaN;       // false
0 == [];       // true
0 == {};       // false


这个最好

[] == ![]  // true

2 == [2] // true
"" == [null] // true

0 == "\n"   // true

```

抽象关系的比较

双方先调用toPrimitive，如果结果出现非字符串，就根据toNumber规则将双方强制转换为数字进行比较
```
var a = [42];
var b = "43";

a < b; // true
b < a; // false

如果双方都是字符串，则按照字母顺序比较

var a = ["42"];
var b = ["043"];

a < b;  // false
a和b不转为数字，因为你toPrimitive返回的字符串这里比较的是"42" 和 "043"两个字符串，比较的是"4" 和"0" 


var a = [4, 2];
var b = [0, 4, 3];

a < b; // false  比较 "4, 2" 和 "0, 4, 3"的首字母

var a = { b: 42 };
var b = { b: 43 };

a < b;  // false 转为"[object Object]" 和"[object Object]"所以按照字母顺序比较并不成立


```
下面的例子比较奇怪
```
var a = { b: 42 };
var b = { b: 43 };

a < b; // false

a == b; // false

a > b; // false

a <= b; // true
a >= b; // true


```
根据规范 a <=b 被处理成 !(a > b)


## JavaScript表达式
表达式的副作用
```
var a = 42;
var b = a++;

a; // 43

b; // 42


```

标签表达式 break; continue;

* [运算符优先级](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)