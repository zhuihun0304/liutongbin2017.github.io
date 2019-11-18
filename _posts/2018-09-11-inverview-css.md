---
layout:     post
title:      CSS面试题 
subtitle:   一些常见CSS面试题总结
date:       2018-09-11
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - 面试
    - CSS

categories:
    - 面试
---


## CSS

说出下面s1,s2, s5,s6的答案

```html
<div class="p1">
    <div class="s1">1</div>
    <div class="s2">1</div>
</div>
<div class="p2">
    <div class="s5">1</div>
    <div class="s6">1</div>
</div>

.p1 {font-size: 16px; line-height: 32px;}
.s1 {font-size: 2em;}
.s2 {font-size: 2em; line-height: 2em;}

.p2 {font-size: 16px; line-height: 2;}
.s5 {font-size: 2em;}
.s6 {font-size: 2em; line-height: 2em;}

```

先来看第一组的答案
```
    p1：font-size: 16px; line-height: 32px
    s1：font-size: 32px; line-height: 32px
    s2：font-size: 32px; line-height: 64px
```
和你的答案一样吗？下面来解释下:
> p1 无需解释
s1 em作为字体单位，相对于父元素字体大小；line-height继承父元素计算值
s2 em作为行高单位时，相对于自身字体大小
再来看看第二组的答案

```
p2：font-size: 16px; line-height: 32px
s5：font-size: 32px; line-height: 64px
s6：font-size: 32px; line-height: 64px
```
意不意外？惊不惊喜？下面来解释下
> p2 line-height: 2自身字体大小的两倍
s5 数字无单位行高，继承原始值，s5的line-height继承的2，自身字体大小的两倍
s6 无需解释



### 清除浮动
```
.clearfix:after{
  clear: both;
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
  font-size: 0;
}
```


