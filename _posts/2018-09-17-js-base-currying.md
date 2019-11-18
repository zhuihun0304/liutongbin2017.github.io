---
layout:     post
title:      函数柯里化
subtitle:   浅析函数柯里化
date:       2018-09-17
author:     "toshiba"
header-img: "images/bg/batman/bat3.jpg"
comments: true

tags :
    - 计算机基础
    - javascript
categories:
    - js基础知识
---

## JS 函数柯里化
什么是函数柯里化？ 柯里化通常也称部分求值，其含义是给函数分步传递参数。 
> curry 的概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

一个简单的函数柯里化例子
```
var add = function(x, y) {
	return x + y;
}

add(1, 2);

var addCurry = function(x) {
	return function(y) {
		return x + y;
	}
}

addCurry(1)(2);

```

上面的例子是一个最简单的柯里化例子， 现在又有新的需要我需要能传多个参数

```javascript

var add = function(items) {
	return items.reduce(function(a, b) {
		return a + b;
	});
}

add([1, 2, 3, 4]);

但如果要求把每个数乘以10之后再相加，那么：

var add = function(items, multi) {

	return items.map(function(item) {
		return item * multi
	}).reduce(function(a, b) {
		return a + b;
	})

}

console.log(add([1, 2, 3, 4], 10));

```

下面是柯里化实现：
```
var adder = function() {
	var _args = [];
	return function() {
		if(arguments.length === 0) {
			return _args.reduce(function(a, b) {
				return a + b;
			});
		}

		[].push.apply(args, [].slice.call(arguments))

		return arguments.callee;
	}
}


var sum = adder();

console.log(sum);

sum(100, 200)(300);   // 调用形式灵活， 一次调用可输入一个或多个参数， 并且支持链式调用

sum(400);

console.log(sum());  // 没有参数进行加总计算

```
adder是柯里化了的函数，它返回一个新的函数，新的函数接收可分批次接受新的参数，延迟到最后一次计算。


通用的柯里化函数
```
var currying = function(fn) {
	var _args = [];
	return function() {
		if(arguments.length === 0) {
			return fn.apply(this, _args);
		}

		Array.prototype.push.apply(_args, [].slice.call(arguments));
		return arguments.callee;
	}
}

var multi = function() {
	var total = 0;
	for(var i = 0, c = arguments.length; i < c; i++) {
		total += c;
	}

	// for一个特别骚的写法
	for(var i = 0, c; c = arguments[i++];) {
		total += c;
	}

	return total;
}

var sum = currying(multi);

sum(100, 200)(300);
sum(400);

console.log(sum());

```

上面的代码其实是一个高阶函数。
> 高阶函数是指操作函数的函数，它接受一个或者多个函数作为参数，并返回一个新函数。

 此外还依赖闭包的特性，来保存中间过程中输入的参数

* 函数可以作为参数传递
* 函数能够作为函数的返回值
* 闭包


柯里化的作用
* 延迟计算
* 参数复用， 当在多次调用同一个函数，并且传递的参数绝大多数相同，那么该函数可能是一个很好的柯里化候选
* 动态创建函数， 这可以是在部分计算出结果后，在此基础上动态生成新的函数处理后面的业务，这样省略了计算

比如一个绑定事件的辅助方法
```
var addEvent = function(el, type, fn, capture) {
	if(window.addEventListener) {
		el.addEventListener(type, function(e) {
			fn.call(el, e);
		}, capture);
	} else if(window.attachEvent) {
		el.attachEvent("on"+type, function(e) {
			fn.call(el, e);
		})
	}
}

每次添加事件处理都要执行一遍 if...else...，其实在一个浏览器中只要一次判定就可以了，把根据一次判定之后的结果动态生成新的函数，以后就不必重新计算。

var addEvent = (function(){
    if (window.addEventListener) {
        return function(el, sType, fn, capture) {
            el.addEventListener(sType, function(e) {
                fn.call(el, e);
            }, (capture));
        };
    } else if (window.attachEvent) {
        return function(el, sType, fn, capture) {
            el.attachEvent("on" + sType, function(e) {
                fn.call(el, e);
            });
        };
    }
})();

```

Function.prototype.bind 方法也是柯里化应用

与 call/apply 方法直接执行不同，bind 方法 将第一个参数设置为函数执行的上下文，其他参数依次传递给调用方法（函数的主体本身不执行，可以看成是延迟执行），并动态创建返回一个新的函数， 这符合柯里化特点。


```
var foo = {x: 888};
var bar = function () {
    console.log(this.x);
}.bind(foo);               // 绑定
bar();                     // 888

// 猜测bind的实现

Function.prototype.testBind = function (scope) {
    var fn = this;                    //// this 指向的是调用 testBind 方法的一个函数， 
    return function () {
        return fn.apply(scope);
    }
};
var testBindBar = bar.testBind(foo);  // 绑定 foo，延迟执行
console.log(testBindBar);             // Function (可见，bind之后返回的是一个延迟执行的新函数)
testBindBar();                        // 888

```


再来看这道面试题
编程题目的要求如下，完成plus函数，通过全部的测试用例。
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

答案

```javascript

'use strict';
function plus(num){
	var adder = function() {
		var _args = [];

		var _adder = function () {
			[].push.apply(_args, [].slice.call(arguments));
			return _adder;
		}

		_adder.toString = function() {
			return _args.reduce(function(a, b) {
				return a + b;
			});
		}	

		return _adder;
	}

	
	return adder()(num);
  
}


module.exports = plus;

```


# 文章参考
* [函数 currying 柯里化](https://www.cnblogs.com/zztt/p/4142891.html#3078374)

