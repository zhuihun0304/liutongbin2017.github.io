---
layout:     post
title:      IDEA快捷键
subtitle:   熟悉IDEA快捷键工欲善其事必先利其器快捷键总结Mac版
date:       2017-11-15
author:     "toshiba"
header-img: "images/bg/batman/bat1.jpg"

comments: true

tags :
    - 生产工具
    - IDE
categories:
    - 生产工具
---

### 常用快捷键
*  `Command + Alt + L`： 格式化代码
*  `Command + Alt + I`： 将选中的代码进行自动缩进编排，这个功能在编辑JSP文件时也可以工作
*  `Command + Alt + o`： 优化导入的类和包(去掉无用的import语句)
*  `Command + /`： 注释 //
*  `Command + shift + /`： 注释 /**/
*  `Ctrl + shift + J`： 将两行合并成一行


### 定位跳转
*  `Command + B`： 快速打开光标处的类或方法
*  `Command + Alt + B`： 跳转到方法实现处
*  `Command + Alt + Left/Right`： 返回至上次浏览的位置
*  `Command + Shift + Backspace`： 跳转到上次编辑的地方
*  `F2/Shift+F2`： 高亮错误或警告快速定位(跳转至报错的位置)
*  `Command + G`： 定位行(跳到输入的指定行数)
*  `Command + [ or ]`： 可以跑到大括号的开头与结尾(方便if或者方法范围查看)
*  `Alt + F3`： 逐个往下查找相同文本，并高亮显示

### 查找定位
*  `Command + N`： 可以快速打开类
*  `Command + Shift + N`： 可以快速打开文件  查找类中的方法或变量
*  `Command + Alt + Shift + N`： 查找类中的方法或变量
*  `Command + F`： 本文件中查找
*  `Ctrl + Shift + F`： 全局查找(在路径中查找)
*  `Shift + Shift`： 全局查找

### 代码操作
*  `Command + W`： 选中单词逐步扩大范围
*  `Command + R`： 在本文件替换文本
*  `Ctrl + Shift + R`： 在本文件替换文本
*  `Command + X`： 删除行
*  `Command + D`： 复制行
*  `Command + Y`： 删除当前行
*  `Alt + Shift + Up/Down`： 当前行上下移动
*  `Command + Shift + U`： 大小写转化
*  `Command + Shift + Z`： 重做，即反撤销(与搜狗输入法查看字符冲突)
*  `Command + Shift + V`： 查看最近复制的多条内容，并选择需要的内容粘贴


### 代码(方法)生成
*  `psvm/sout`： main函数/System.out.println();
*  `Command + J`： 查看更多快捷方法
*  `Command + Shift + 回车`： 自动补全、换行
*  `Ctrl + Space`： 代码提示（与系统输入法快捷键冲突） 
*  `Command + Alt + T`： 可以把代码包在一个块内，例如：try/catch


### 其他操作
*  `Command + E`： 显示最近操作过的文件
*  `Alt + F7`： 查找整个工程中使用地某一个类、方法或者变量的位置
*  `Command + F7`： 可以查询当前元素在当前文件中的引用，然后按 F3 可以选择
*  `Command + Shift + F7`： 高亮显示所有该文本，按 Esc 高亮消失
*  `Command + P`： 可以显示参数信息
*  `Command + F12`： 可以显示当前文件的结构
*  `Ctrl + H`： 显示类结构图（类的继承层次）
*  `Command + 6`： 查看所有TODO
*  `Command + 7`： 查看本类结构
*  `Command + +/-`： 当前方法展开、折叠
*  `Command + Shift + +/-`： 全部展开、折叠





Alt+Insert：可以生成构造器/Getter/Setter等(建议使用lombok插件及@Data注解) 未验证
Alt+ Up/Down(上下箭头)：在方法间快速移动定位



#### 参考文章
* [IntelliJ IDEA For Mac 快捷键](http://wiki.jikexueyuan.com/project/intellij-idea-tutorial/keymap-mac-introduce.html)
#### IntelliJ IDEA For Mac 快捷键
*   根据官方pdf翻译：[https://www.jetbrains.com/idea/docs/IntelliJIDEA_ReferenceCard_Mac.pdf](https://www.jetbrains.com/idea/docs/IntelliJIDEA_ReferenceCard_Mac.pdf)
*   在 IntelliJ IDEA 中有两个 Mac 版本的快捷键，一个叫做：Mac OS X，一个叫做：Mac OS X 10.5+
*   目前都是用：Mac OS X 10.5+
*   有两套的原因：[https://intellij-support.jetbrains.com/hc/en-us/community/posts/206159109-Updated-Mac-OS-X-keymap-Feedback-needed](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206159109-Updated-Mac-OS-X-keymap-Feedback-needed)
> 建议将 Mac 系统中与 IntelliJ IDEA 冲突的快捷键取消或更改，不建议改 IntelliJ IDEA 的默认快捷键。