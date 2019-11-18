---
layout:     post
title:      "git的使用教程(三)"
subtitle:   "git的高级教程以及正规开发中的工作流程"
date:       2017-10-22
author:     "toshiba"
header-img: "images/bg/batman/bat3.jpg"
tags:
    - 工具
    - git

categories:
    - 版本控制

comments: true
---

## git的高级使用教程

记录一些git的高级用法


## 修改tag代码
在项目中我们会有这样的要求，发布了一个tag v1.0现在这个tag有bug需要修复应该如何操作呢
tag其实是一个快照是不能修改代码的但是可以基于tag新建一个分支来修改，这样修改完毕基于新的分支再打tag即可得到修复后的tag
```
$ git fetch origin v1.0

$ git checkout -b branch_name tag_name //这样会从 tag 创建一个分支，然后就和普通的 git 操作一样了,该分支是基于tag的而不是基于master的

$ git push origin branch_name  //直接将修改好的分支推上去 或者重新打tag

```


## 回滚错误的修改

建议仔细阅读[git-revert](https://github.com/geeeeeeeeek/git-recipes/wiki/2.6-%E5%9B%9E%E6%BB%9A%E9%94%99%E8%AF%AF%E7%9A%84%E4%BF%AE%E6%94%B9#git-revert)
该命令只回滚了一个单独的提交，并没有移除后面的提交，并且保留了提交历史。 但是reset直接把状态回调bug之前之后所有的提交都会遗弃，这样并不安全。

```
$ git revert <commit>


# 编辑一些跟踪的文件

# 提交一份快照
$ git commit -m "Make some changes that will be undone"

# 撤销刚刚的提交
$ git revert HEAD
```
确保你只对本地的修改使用 git reset，而不是公共更改。如果你需要修复一个公共提交，git revert 命令正是被设计来做这个的


## 重写项目历史

### git commit --amend
git commit --amend 命令是修复最新提交的便捷方式，如有需要请在本地使用不要修改公共历史。
```
$ git log

commit eeeab2ca5f30d70667d6d12ab71f19dd7b958d1c (HEAD -> master)
Author: xxx <xxx@xxx.com>
Date:   Mon Nov 6 15:30:43 2017 +0800

    fix(测试): 测试提交

    测试提交

    Signed-off-by: xxx <xxx@xxx.com>


$ git commit --amend

# 该命令修改后再使用git log得到如下

commit eeeab2ca5f30d70667d6d12ab71f19dd7b958d1c (HEAD -> master)
Author: xxx <xxx@xxx.com>
Date:   Mon Nov 6 15:30:43 2017 +0800

    fix(测试): 测试提交sss

    测试提交sss

    Signed-off-by: xxx <xxx@xxx.com>


```


### git rebase
变基（rebase, 事实上这个名字十分诡异, 所以在大多数时候直接用英文术语）是将分支移到一个新的基提交的过程。事实上重写了你的项目历史,过程一般如下所示
![](https://cdn.darknights.cn/assets/images/in-post/git-senior/rebase.svg)

用法：
```
git rebase <base>

# 将当前分支 rebase 到 <base>，这里可以是任何类型的提交引用（ID、分支名、标签，或是 HEAD 的相对引用）
```

一个🌰

```
# 开始新的功能分支
$ git checkout -b feat master
# 编辑文件
$ git commit -a -m "Start developing a feature"

# 在 feature 分支开发了一半的时候，我们意识到项目中有一个安全漏洞:

# 基于master分支创建一个快速修复分支
$ git checkout -b bug master
# 编辑文件
$ git commit -a -m "Fix security hole"
# 合并回master
$ git checkout master
$ git merge bug
$ git branch -d bug

# 将 hotfix 分支并回之后 master，我们有了一个分叉的项目历史。
# 我们用 rebase 整合 feature 分支以获得线性的历史，而不是使用普通的 git merge。
$ git checkout feat
$ git rebase master

$ git checkout master
$ git merge feat

```

另一个🌰

```
# 开始新的功能分支
$ git checkout -b feat master
# 编辑文件
$ git commit -a -m "Start developing a feature"
# 编辑更多文件
$ git commit -a -m "Fix something from the previous commit"

# 直接在 master 上添加文件
$ git checkout master
# 编辑文件
$ git commit -a -m "Fix security hole"

# 开始交互式 rebase
$ git checkout feat
$ git rebase -i master

最后的那个命令会打开一个编辑器，包含 feat 的两个提交，和一些指示：

pick 32618c4 Start developing a feature
pick 62eed47 Fix something from the previous commit

# 你可以更改每个提交前的 pick 命令来决定在 rebase 时提交移动的方式。
# 在我们的例子中，我们只需要用 squash 命令把两个提交并在一起就可以了：

pick 32618c4 Start developing a feature
squash 62eed47 Fix something from the previous commit

# 保存并关闭编辑器以开始 rebase
# 最后，你可以执行一个快速向前的合并，来将完善的 feature 分支整合进主代码库：

git checkout master
git merge feat

```

通常情况下建议使用rebase而非merge来拉取上游代码。这样所有的记录会被合并为一次commit,而且没有一些不重要的合并来污染提交的时间线


### 本地清理
```
$ git rebase -i HEAD~3

$ git rebase -i HEAD~~~ //这两条一个意思合并注释

```

参考[代码合并：Merge、Rebase 的选择](https://github.com/geeeeeeeeek/git-recipes/wiki/5.1-%E4%BB%A3%E7%A0%81%E5%90%88%E5%B9%B6%EF%BC%9AMerge%E3%80%81Rebase-%E7%9A%84%E9%80%89%E6%8B%A9)


### 合并分支commit
当你在新的feat功能开发时可能会有各种commit最后功能完成我可能想将所有commit合成一个，这样历史会比较简洁。这是可能会使用这条命令
```
$ git merge-base feat master  //该命令找出feat 分支开始分叉的基 返回基提交的ID，然后可以酱紫

$ git rebase -i IDXXX //此时选择suqash 就可以重新写历史了 当然合并后最后一次的历史也可以使用 git commit --amend改写



```


### git pull

在基于 Git 的协作工作流中，将上游更改合并到你的本地仓库是一个常见的工作。我们已经知道应该使用 git fetch，然后是 git merge，但是 git pull 将这两个命令合二为一。

基于 Rebase 的 Pull

```
$ git pull --rebase <remote>  //此命令会合并远程分支和本地分支而非使用git merge;

$ git checkout master
$ git pull --rebase origin  //简单地将你本地的更改放到其他人已经提交的更改之后。

```

### 分离HEAD
```
// 可以直接使用 -f 选项让分支指向另一个提交 该命令会将 master 分支强制指向 HEAD 的第 3 级父提交。
$ git branch -f master HEAD~3


```


### Reset还是Checkout
[参考此文章](https://github.com/geeeeeeeeek/git-recipes/wiki/5.2-%E4%BB%A3%E7%A0%81%E5%9B%9E%E6%BB%9A%EF%BC%9AReset%E3%80%81Checkout%E3%80%81Revert-%E7%9A%84%E9%80%89%E6%8B%A9)


| 命令	|作用域	|   常用情景 |
|-------| :------: | :------: |
|git reset|	提交层面	|在私有分支上舍弃一些没有提交的更改|
|git reset |	文件层面	|将文件从缓存区中移除|
|git checkout|	提交层面	|切换分支或查看旧版本|
|git checkout|	文件层面	|舍弃工作目录中的更改|
|git revert	|提交层面	|在公共分支上回滚更改|
|git revert |	文件层面|	（然而并没有）|


### git cherry-pick
git cherry-pick 命令「复制」一个提交节点并在当前分支做一次完全一样的新提交。
只想将远程仓库的一个特定提交合并到自己的分支中该怎么做呢？可以使用git cherry-pick 来选择给定SHA值的提交，然后将其合并到当前分支中：




## [常见的工作流](https://github.com/geeeeeeeeek/git-recipes/wiki/3.5-%E5%B8%B8%E8%A7%81%E5%B7%A5%E4%BD%9C%E6%B5%81%E6%AF%94%E8%BE%83)
[参考此文章](https://mritd.me/2017/09/05/git-flow-note/)总结一下工具

### Git flow工具
* [Git-flow](https://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html) 是一个 git 扩展集，按 Vincent Driessen 的分支模型提供高层次的库操作；使用 git-flow 工具可以以更加简单的命令完成对 Vincent Driessen 分支模型的实践
* 另一个工具是 [Git-extras](https://github.com/tj/git-extras)，该工具没有 git-flow 那么简单化，不过其提供更加强大的命令支持

### Git Commit Message

我们遵循[ Angular 社区规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.greljkmo14y0)格式来提交代码

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

* type: 本次提交类型
* scope: 本次提交影响范围，一般标明影响版本号或者具体的范围如 $browser, $compile, $rootScope, ngHref, ngClick, ngView, etc...
* subject: 本次提交简短说明

关于 type 提交类型，有如下几种值:

* feat：新功能(feature)
* fix：修补 bug
* docs：文档(documentation)
* style： 格式(不影响代码运行的变动)
* refactor：重构(即不是新增功能，也不是修改 bug 的代码变动)
* test：增加测试
* chore：构建过程或辅助工具的变动


### Commit小工具
* [commitizen-cli](http://commitizen.github.io/cz-cli/)比较有名采用node.js编写执行<code>git cz</code>能生成commit模板进行选择
* [Git-toolkit](https://cimhealth.github.io/git-toolkit/) 基于shell编写执行<code>git ci</code>产生提交模板

## [Git 钩子](https://github.com/geeeeeeeeek/git-recipes/wiki/5.4-Git-%E9%92%A9%E5%AD%90%EF%BC%9A%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BD%A0%E7%9A%84%E5%B7%A5%E4%BD%9C%E6%B5%81)

## [Git引用日志](https://github.com/geeeeeeeeek/git-recipes/wiki/5.5-Git-%E6%8F%90%E4%BA%A4%E5%BC%95%E7%94%A8%E5%92%8C%E5%BC%95%E7%94%A8%E6%97%A5%E5%BF%97#%E5%93%88%E5%B8%8C%E5%AD%97%E4%B8%B2)


## 参考文章
> * [git-recipes](https://github.com/geeeeeeeeek/git-recipes/wiki)
> * [Git 工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)
> * [Git 使用规范流程](http://www.ruanyifeng.com/blog/2015/08/git-use-process.html)
> * [git - 简明指南](http://rogerdudler.github.io/git-guide/index.zh.html)
> * [git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)
> * [你需要知道的12个Git高级命令](http://www.infoq.com/cn/news/2016/01/12-git-advanced-commands)

