---
layout:     post
title:      理解rem布局
subtitle:   关于rem布局的研究和技术选型
date:       2018-09-11
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - 页面布局
    - css
categories:
    - 页面布局
---


## 理解变量提升

JavaScript的一个便利是能够离开 语句结束分号 工作。 删除分号后，结果变得轻量而优雅，比如下面这个例子去掉所有分号，JavaScript会自动插入分号。
```javascript
  function Point(x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  Point.prototype.isOrigin = function() {
    return this.x === 0 && this.y === 0
  }

```
