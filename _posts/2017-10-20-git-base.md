---
layout:     post
title:      "git的使用教程(一)"
subtitle:   "git的初级教程(简明指南)"
date:       2017-10-12
author:     "toshiba"
header-img: "images/bg/batman/bat3.jpg"
tags:
    - 工具
    - git

categories:
    - 版本控制

comments: true
---

## git的初级使用教程

记录常用的git命令,方便自己查询

## 创建新仓库
```
$  git init
```

Create a new repository

```
$  git clone git@github.com:sundongzhi/chouti-react.git
$  cd chouti-react
$  touch README.md
$  git add README.md
$  git commit -m "add README"
$  git push -u origin master
```


Existing folder

```
$  cd existing_folder
$  git init
$  git remote add origin git@github.com:sundongzhi/chouti-react.git
$  git add .
$  git commit -m "Initial commit"
$  git push -u origin master
```


Existing Git repository

```
$  cd existing_repo
$  git remote rename origin old-origin
$  git remote add origin git@github.com:sundongzhi/chouti-react.git
$  git push -u origin --all
$  git push -u origin --tags
```

### clone本地仓库
```
$  git clone /path/to/repository
```
### 从远程仓库clone
```
$  git clone username@host:/path/to/repository
```

### 工作流
> 你的本地仓库由 git 维护的三棵“树”组成。第一个是你的 工作目录，它持有实际文件；第二个是 暂存区（Index），它像个缓存区域，临时保存你的改动；最后是 HEAD，它指向你最后一次提交的结果。

![](https://cdn.darknights.cn/assets/images/in-post/git-base/trees.png)


### 添加和提交
```
$  git add <filename>
$  git add *
$  git add .     //添加到缓存区

$  git commit -m "代码提交信息"   //提交到本地仓库

$ git commit -a  相当于 git add + git commit
```


### 推送改动
你的改动现在已经在本地仓库的 HEAD 中了。执行如下命令以将这些改动提交到远端仓库：

```
$  git push origin master
```
可以把 master 换成你想要推送的任何分支。

如果你还没有克隆现有仓库，并欲将你的仓库连接到某个远程服务器，你可以使用如下命令添加：

```
$  git remote add origin <server>
```

### 远程仓库
```
$ git remote -v //显示远程仓库信息

$ git remote rm origin  //删除远程链接

$ git remote set-url origin git@github.com:michaelliao/learngit.git  //更改远程仓库地址,通常用来切换ssh和https

```


如此你就能够将你的改动推送到所添加的服务器上去了。

### 分支
分支是用来将特性开发绝缘开来的。在你创建仓库的时候，master 是“默认的”分支。在其他分支上进行开发，完成后再将它们合并到主分支上。
![](https://cdn.darknights.cn/assets/images/in-post/git-base/branches.png)

创建一个叫做“feature_x”的分支，并切换过去：

```
$ git branch 查看本地分支

$ git branch -a 查看本地和本地fetch到的远程分支都显示出来

$ git branch -r 查看本地fetch到的远程分支(只显示本地存储的远程分支)

$ git checkout -b feature_x


```



切换回主分支：

```
$  git checkout master
```
再把新建的分支删掉：

```
$  git branch -d feature_x //删除已经合并的分支
$  git branch -D feature_x  //强行删除未合并的分支
```

重命名分支
```
$ git branch -m devel develop
```



除非你将分支推送到远端仓库，不然该分支就是 不为他人所见的：

```
$  git push origin <branch>
```

### 更新与合并

```
$  git pull   //相当于 git fetch and git merge两个操作
$  git diff <source_branch> <target_branch>  //如果有冲突解决完冲突可以这样查看两个分支差别
```

### 标签
以执行如下命令创建一个叫做 1.0.0 的标签：

```
$  git	 tag v1.0.0 1b2e1d63ff //b2e1d63ff 是你想要标记的提交 ID 的前 10 位字符

$  git tag  //显示所有tag标签

$  git show v1.0 //查看标签信息

//打一个完整的标签 -a 制定标签的名字  -m 注释   最后的数字代表HEAD制定从哪次提交打标签
$ git tag -a v0.1 -m "version 0.1 released" 3628164


$ git tag -d v1.0 //删除本地标签

$ git push origin :refs/tags/v0.9   //删除远程标签 需要先将本地标签删除

$ git push origin v1.0   //将标签推送到远程仓库



$ git push origin --tags //一次性推送全部尚未推送到远程的本地标签：

//使用 gpg(GnuPG)签名来打标签但是不常用
$ git tag -s v0.2 -m "signed version 0.2 released" fec145a


```

### log

更多高级用法[参考这里](https://github.com/geeeeeeeeek/git-recipes/wiki/5.3-Git-log-%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95)
```
$  git log //查看所有日志

$  git log --author=toshiba  //查看某人的日志

$  git log --pretty=oneline  //压缩后的日志每个提交只占一行

$  git log --graph --oneline --decorate --all  //ASCII 艺术的树形结构来展示所有的分支, 每个分支都标示了他的名字和标签

$  git log --graph --pretty=oneline --abbrev-commit

$  git log --name-status  //查看都有哪些文件修改过了

$  git log --help  //更多的帮助信息
```

### git fetch

```
#拉取仓库中所有的分支。同时会从另一个仓库中下载所有需要的提交和文件。

$ git fetch <remote>


#和上一个命令相同，但只拉取指定的分支。

$git fetch <remote> <branch>
```

### 替换本地改动
假如你操作失误（当然，这最好永远不要发生），你可以使用如下命令替换掉本地改动：

```
$  git checkout -- <filename> //此命令会使用 HEAD 中的最新内容替换掉你的工作目录中的文件。
    //已添加到暂存区的改动以及新文件都不会受到影响。
```
如你想丢弃你在本地的所有改动与提交，可以到服务器上获取最新的版本历史，并将你本地主分支指向它

```
$  git fetch origin
$  git reset --hard origin/master
```

### reset参数
除了在当前分支上操作，你还可以通过传入这些标记来修改你的缓存区或工作目录：

* --soft – 缓存区和工作目录都不会被改变
* --mixed – 默认选项。缓存区和你指定的提交同步，但工作目录不受影响
* --hard – 缓存区和工作目录都同步到你指定的提交










### 实用小贴士

```
$  gitk           					//内建的图形化 git

$  git config color.ui true          //彩色的 git 输出

$  git config --global color.ui true

$  git config format.pretty oneline  //显示历史记录时，每个提交的信息只显示一行

$  git add -i 							//交互式添加文件到暂存区：

```

### 参考文章

> * [git - 简明指南](http://rogerdudler.github.io/git-guide/index.zh.html)
> * [Git 工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)
> * [Git 使用规范流程](http://www.ruanyifeng.com/blog/2015/08/git-use-process.html)

