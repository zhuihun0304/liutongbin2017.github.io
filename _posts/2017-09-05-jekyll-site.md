---
layout:     post
title:      "搭建jekyll 博客流程记录"
subtitle:   "如何搭建个人博客以及注意点"
date:       2017-09-05
author:     "toshiba"
header-img: "images/bg/batman/bat3.jpg"
tags:
    - 博客搭建
    - JavaScript

comments: true

categories:
    - 技术文章
---

## 第一次搭建博客

不知为何最近突然想写个博客网站了，以前的话都是在一些博客园，新浪微博啥的浪一波时间长了也不想写了就慢慢荒废了，之所以想自己搞个一方面是把一些技术点记录一下，同时对自己也是一个督促，再就是我有个写小说的梦想想搞个栏目写写随笔等杂七杂八的东东。经过一番努力该博客终于可以勉强拿出手了。在此要感谢两位大神:
> * [黄玄](http://huangxuan.me/)
> * [漠然](https://mritd.me/)

我的博客是基于黄玄的博客主题来更改的虽然遇到一些问题但是经过一番查找还是完美的解决了。
而漠然这位仁兄是我好兄弟对于我博客的搭建提供了各种技术支持和疑难解答对此再次表示感谢。


## 搭建博客的基本流程

### 安装Ruby, Rails
建议在Linux的发行版本(Ubuntu,CentOs, Redhat, ArchLinux...) 或者 Mac Os X安装。

* [Mac OS X上安装ruby](https://github.com/ruby-china/homeland/wiki/Mac-OS-X-%E4%B8%8A%E5%AE%89%E8%A3%85-Ruby) 来安装
* 如果需要不同版本的ruby可以[安装 RVM](https://ruby-china.org/wiki/install_ruby_guide)来进行ruby版本管理

### 安装jekyll
该博客使用了 [Jekyll](https://jekyllrb.com/), 当然好多同学可能会用 [Hexo](https://hexo.io/themes/) 这个就是萝卜青菜了。
如果你选择使用Jekyll请安装下面步骤安装生成:

```shell
~ $ gem install jekyll bundler
~ $ jekyll new my-awesome-site
~ $ cd my-awesome-site
~/my-awesome-site $ bundle exec jekyll serve
# => Now browse to http://localhost:4000

```
生产的项目结构类似
```
.
├── _config.yml    //项目相关配置文件
├── _data
|   └── members.yml   //一些需要的数据
├── _drafts           //草稿
|   ├── begin-with-the-crazy-ideas.md
|   └── on-simplicity-in-technology.md
├── _includes         //公共的部分
|   ├── footer.html
|   └── header.html
├── _layouts           //布局文件
|   ├── default.html
|   └── post.html
├── _posts             //发布的文章
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
|   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _sass              //sass文件路径编译后生产css
|   ├── _base.scss
|   └── _layout.scss
├── _site              //所有文件编译生产静态文件都存放到这里
├── .jekyll-metadata
└── index.html # can also be an 'index.md' with valid YAML Frontmatter
```
具体还有其他目录请参考[jekyll目录结构](https://jekyllrb.com/docs/structure/)


### 安装主题
到这里你应该可以访问一个页面了,但是离我们心中的博客相差甚远。我们需要给项目增加一个 [Jekyll 主题](http://jekyllthemes.org/) ,当然如果在套用别人主题的时候有问题可以看一下
[Liquid语法](http://www.jianshu.com/p/4224b8ea0ec0),和markdown语法,因为我在套用黄玄的博客时就遇到了语法问题,可能是ruby版本更新导致。这些语法问题都可以在文档中找到答案,所以还是要仔细读文档

到此博客已经能够访问并且有了主题,如果添加新的文章只需要按照固定格式套用即可。



参考文章

> * [48 个你需要知道的 Jekyll 使用技巧
](https://crispgm.com/page/48-tips-for-jekyll-you-should-know.html)
> * [掌心](http://www.zhanxin.info/journal/)
> * [likebeta's Blog
](https://blog.ixxoo.me/)
> * [jekyll翻译文章](http://blog.csdn.net/maoxunxing/article/details/40479753)
> * [jekyll语法简单笔记](http://ibloodline.com/articles/2014/12/15/jekyll-syntax.html)
> * [GitHub Pages 静态博客 - 个人建站实录
](http://alfred-sun.github.io/blog/2014/12/05/github-pages/)
> * [部署自己的博客](http://harttle.com/2013/10/18/github-homepage-tutorial.html)
> * [杨缘的博客参考](https://mritd.me/2017/02/25/jekyll-blog-+-travis-ci-auto-deploy/)
> * [poison](http://yerl.cn/blog/use-jekyll-build-your-blog)
> * [jekyll官网中文](http://jekyllcn.com/docs/plugins/)
> * [适合程序员的Blog -- 基于github pages + jekyll + markdown打造自己的blog](http://www.thomaszhao.cn/2015/01/08/how-do-i-build-this-jekyll-blog/)
> * [使用travis-ci自动部署hexo博客](http://www.w3cboy.com/post/2016/03/travisci-hexo-deploy/)
> * [为Jekyll博客添加目录与ScrollSpy效果](http://t.hengwei.me/post/%E4%B8%BAjekyll%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0%E7%9B%AE%E5%BD%95%E4%B8%8Escrollspy%E6%95%88%E6%9E%9C.html)


