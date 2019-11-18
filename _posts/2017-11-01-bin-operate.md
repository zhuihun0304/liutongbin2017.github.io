---
layout:     post
title:      javascript的位操作
subtitle:   在javascript中的位操作涉及二进制的处理
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

# 关于javascript中的~操作

参考文章中有一道面试题,尽管文章已经有了一部分解释但是还有一些点不够明确在此在进行一次分析

>!~location.href.search('abc')

首先再次回顾一下js中的位运算

* & 与
* \| 或
* ~ 非
* ^ 异或
* \<\< 左移
* \>\> 算数右移(有符号右移)
* \>\>\> 逻辑右移(无符号右移)

Number.prototype.toString

Number.prototype.toString方法可以讲数字转化为字符串，有一个可选的参数，用来决定将数字显示为指定的进制，下面可以查看3的二进制表示

````
 3..toString(2)

 (3).toString(2)

 Number(3).toString(2)   //这里如果直接 3.toString(2)是会报错的

  >> 11
```

## & 与

> &按位与会将操作数和被操作数的相同为进行与运算，如果都为1则为1，如果有一个为0则为0

```
101
011
---
001
```

## \| 或

> 按位或是相同的位置上只要有一个为1就是1，两个都为0则为0

```
101
001
---
101
```

## ~ 非

> ~操作符会将操作数的每一位取反，如果是1则变为0，如果是0则边为1

```
101
---
010
```

## ^ 异或

> 再来说说异或，这个比较有意思，异或顾名思义看看两个位是否为异——不同，两个位不同则为1，两个位相同则为0



```
101
001
---
100
```

再次分析开头的问题

首先关于indexOf获得的值可能有几种请求 -1,0,1 从这三种进行分析

## ~-1

为了简便计算我这只取8位

```
10000001  //这是-1的原码 (真值的绝对值加上符号位)
--------  //进行按位非操作后 这里会改变符号
01111110  //得到此值为正值要获得该值得真值需要然后取反再减一 注意取反的操作不会改变符号
--------
00000000  //最后得到的值是0

//浏览器控制台输出

~-1
0

```

## ~0

```
00000000  //这是0的原码 (真值的绝对值加上符号位)
--------  //进行按位非操作后 这里会改变符号
11111111  //得到此值该值为负值的补码 要获得该值得真值需要对补码求补即取反+1 (注意取反的操作不会改变符号)
--------
10000001  //最后得到的值是1

//浏览器控制台输出

~0
-1

```



## ~1

```
00000001  //这是1的原码 (真值的绝对值加上符号位)
--------  //进行按位非操作后 这里会改变符号
11111110  //得到此值该值为负值的补码 要获得该值得真值需要对补码求补即取反+1 (注意取反的操作不会改变符号)
--------
10000010  //最后得到的值是2

//浏览器控制台输出

~1
-2

```


因此在上面问题出现的时候

```
~location.href.search('abc')  //未匹配到返回 -1 这里为 ~-1  == 0 ==> !0 == true;
~location.href.search('abc')  //未匹配到返回 0 这里为 ~0  == -1 ==> !-1 == false;
~location.href.search('abc')  //未匹配到返回 1 这里为 ~1  == -2 ==> !-2== false;

```

因此只有返回 -1时

如果为 -1 说明未匹配到

> !~location.href.search('abc') ===> true

得证。


# 文章参考
* [聊聊JavaScript中的二进制数](http://yanhaijing.com/javascript/2016/07/20/binary-in-js/)
* [原码, 反码, 补码 详解](https://www.cnblogs.com/zhangziqiu/archive/2011/03/30/ComputerCode.html)

# 延伸阅读
* [每一个JavaScript开发者应该了解的浮点知识](http://yanhaijing.com/javascript/2014/03/14/what-every-javascript-developer-should-know-about-floating-points/)
* [Numbers in JavaScript](http://jser.it/blog/2014/07/07/numbers-in-javascript/)