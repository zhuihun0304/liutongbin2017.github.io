---
layout:     post
title:      javascript的的最大安全数
subtitle:   javascript基础知识
date:       2017-11-01
author:     "toshiba"
header-img: "images/bg/batman/bat3.jpg"
comments: true

tags :
    - 计算机基础
    - javascript
categories:
    - js基础知识
---

## JS 中的最大安全整数
JS中所有的数字类型存储都是[双精度浮点数](https://zh.wikipedia.org/wiki/%E9%9B%99%E7%B2%BE%E5%BA%A6%E6%B5%AE%E9%BB%9E%E6%95%B8)浮点数并不是能够精确表示范围内的所有数的， 虽然 double 浮点型的范围看上去很大: 2.23x10^(-308) ~ 1.79x10^308。 可以表示的最大整数可以很大，但能够精确表示，使用算数运算的并没有这么大。

例如下面会报错
```
console.log(0.1 + 0.2)
//output: 0.30000000000000004

//在js中的最大安全整数
Math.pow(2, 53) - 1     // 9007199254740991

//在其他语言的64位环境中有符号的 安全（注意这里是指能够安全使用，进行算数运算的范围） 最大整数。
2^63 - 1;//9223372036854775807


//JS 的最大和最小安全值可以这样获得:
console.log(Number.MAX_SAFE_INTEGER); //9007199254740991
console.log(Number.MIN_SAFE_INTEGER); //-9007199254740991


//通过下面的例子，你会明白为什么大于这个值的运算是不安全的,这些运算都是错误的结果， 因为它们进行的都是浮点数运算会丢失精度。

var x = 9223372036854775807;
console.log(x === x + 1);// output: true
console.log(9223372036854775807 + 1000); //output: 9223372036854776000

```

## 为什么是这个值?
![](https://cdn.darknights.cn/assets/images/in-post/js-base/number.png)

* 1 位符号位
* 11 位指数位
* 52 位尾数位


使用 52 位表示一个数的整数部分，那么最大可以精确表示的数应该是 2^52 - 1 才对， 就像 64 位表示整数时那样: 2^63 - 1 （去掉 1 位符号位）。 但其实浮点数在保存数字的时候做了规格化处理，以 10 进制为例:

```
20*10^2 => 2*10^3 //小数点前只需要保留 1 位数
```

对于二进制来说， 小数点前保留一位， 规格化后始终是 1.***, 节省了 1 bit，这个 1 并不需要保存。


## 大整数与数据库
Nodejs 越来越多的应用到后端的开发中， 不可避免的需要处理这样的溢出问题， 好在已经有很多优秀的第三方库来解决该问题：[bignum](https://github.com/justmoon/node-bignum)、bigint。


```
//每种类型的第二行为无符号范围
TYPE         BYTE   MIN            MAX
TINYINT      1     -128            127
                                   255
SMALLINT     2    -32768          32767
                                  65535
MEDIUMINT    3    -8388608       8388607
                                 16777215
INT          4   -2147483648    2147483647
                                4294967295
BIGINT       8  -9223372036854775808    9223372036854775807
                                       18446744073709551615
```
BIGINT 就是 64 位整数， 一旦要处理的数据量超过了 BIGINT 能存储的范围，便要考虑使用字符串保存， 坏处是数字的算数运算需要通过应用程序使用大整数库来处理，不能依赖于数据库。

注: 常常看到 BIGINT(5) 或者 INT(10)， 括号里的 5 或 10 只是表示展示宽度，并不影响数的精度范围和存储字节数，需要与 VARCHAR(100)或 DECIMAL(10,2)区分开




## JS右移0位
在Javascript代码有时候会看到this.length >> 0这样的类似代码，那么this.length >> 0这样的代码有什么用呢？
* \>\> 代表有符号右移运算符 === 算术右移
* \>\>\> 在Javascript中代表无符号右移运算符 === 逻辑右移
移位运算分为左移和右移，其中左移运算都是丢弃最高位，在右端补零。而右移预算则分为逻辑右移<code>>>></code>和算术右移动<code>>></code>，逻辑右移在左端补零，算术右移则在左端扑最高有效位的值。

<code>this.length >> 0</code>的作用更简易的总结：

* 所有非数值转换成0
* 所有大于等于 0 数取整数部分（快速去掉小数）
例：
```
'hello' >> 0  // 0
32.5 >> 0  // 32
```

# 文章参考
* [JavaScript: The less known parts](http://michalbe.blogspot.sg/2013/03/javascript-less-known-parts-bitwise.html)
* [JS 的整型你懂了吗？](https://segmentfault.com/a/1190000002608050)

# 延伸阅读
* [每一个JavaScript开发者应该了解的浮点知识](http://yanhaijing.com/javascript/2014/03/14/what-every-javascript-developer-should-know-about-floating-points/)
* [Numbers in JavaScript](http://jser.it/blog/2014/07/07/numbers-in-javascript/)