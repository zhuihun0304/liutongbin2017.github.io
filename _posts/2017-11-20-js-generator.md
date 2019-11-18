---
layout:     post
title:      Generator函数的含义和用法
subtitle:   ES6重点记录
date:       2017-11-20
author:     "toshiba"
header-img: "images/bg/batman/bat6.jpg"
comments: true

tags :
    - ES6学习笔记
    - javascript
categories:
    - js基础知识
---

## 同步和异步
要了解generator首先需要说一下异步和同步，大家都知道，Javascript的语言执行环境是单线程（Single thread）.所谓<code>单线程</code>，就是只一次只能完成一个任务如果有多个任务就需要排队，前面一个任务完成，再执行后面一个任务，一次类推。
这种做法
> * 好处是实现起来比较简单，执行环境相对单纯.
> * 坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段Javascript代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

为了解决上面的问题javascript将语言执行分成了两种： 同步（Synchronous）和异步（Asynchronous）.
* 同步模式即从上往下依次执行，等待前一个任务执行完成后在执行下一个任务，执行顺序与代码顺序是一样的。
* 异步模式是每一个任务有一个或者多个回调函数，前一个任务结束后不执行下一个任务而是执行毁掉函数，后一个任务不等前一个任务结束就执行。执行顺序与代码顺序是不一致的，异步的。

## 异步模式的四种方法

### 回调函数

如果有两个函数f1和f2,后者等待前者的执行结果。但是f1是一个很耗时的任务可以将f2写成f1的回调函数
```
    function f1(callback) {
        setTimeout(function() {
            // f1的任务代码
            callback();
        },1000)
    }

    f1(f2);

```

回调函数的优点是简单、容易理解和部署，缺点是不利于代码的阅读和维护，各个部分之间高度耦合（Coupling），流程会很混乱，而且每个任务只能指定一个回调函数。


### 事件监听
采用事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生，直接上代码
```
    f1.on('done', f2); //f1监听'done'如果触发该事件执行f2,使用了jQuery的事件监听
    function f1(callback) {
        setTimeout(function() {
            // f1的任务代码

            f1.trigger('done');
        },1000)
    }

    f1(f2);
```

### 发布、订阅

我们假定，存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做
["发布/订阅模式"（publish-subscribe pattern）](http://en.wikipedia.org/wiki/Publish-subscribe_pattern)，又称["观察者模式"（observer pattern）](https://en.wikipedia.org/wiki/Observer_pattern)。
这个模式有[多种实现](https://msdn.microsoft.com/en-us/magazine/hh201955.aspx?f=255&MSPPError=-2147217396),本例子使用[Tiny Pub/Sub](https://gist.github.com/661855),这是一个jQuery插件。
```
    jQuery.subscribe("done", f2); //首先，f2向"信号中心"jQuery订阅"done"信号。

    function f1(){
　　　　setTimeout(function () {
　　　　　　// f1的任务代码
　　　　　　jQuery.publish("done");
　　　　}, 1000);
　　}
//jQuery.publish("done")的意思是，f1执行完成后，向"信号中心"jQuery发布"done"信号，从而引发f2的执行。
//此外，f2完成执行后，也可以取消订阅（unsubscribe）。
　　jQuery.unsubscribe("done", f2);

```

### Promises
Promises对象是CommonJS工作组提出的一种规范，目的是为异步编程提供统一接口。
它的思想是，每一个异步任务返回一个Promise对象，该对象有一个then方法，允许指定回调函数。比如，f1的回调函数f2,可以写成：
```
    function f1(){
　　　　var dfd = $.Deferred();
　　　　setTimeout(function () {
　　　　　　// f1的任务代码
　　　　　　dfd.resolve();
　　　　}, 500);
　　　　return dfd.promise;
　　}

　　f1().then(f2);
　　f1().then(f2).then(f3);
　　f1().then(f2).fail(f3);


```
它还有一个前面三种方法都没有的好处：如果一个任务已经完成，再添加回调函数，该回调函数会立即执行。所以，你不用担心是否错过了某个事件或信号。这种方法的缺点就是编写和理解，都相对比较难。



# 文章参考
* [Generator 函数的含义与用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)
