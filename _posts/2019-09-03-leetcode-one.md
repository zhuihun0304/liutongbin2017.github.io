---
layout:     post
title:      LeetCode刷题总结(简单版一)
subtitle:   对LeetCode刷过的题目进行整理总结，方便后期查阅复习。
date:       2019-09-03
author:     "toshiba"
header-img: "images/bg/batman/bat8.jpg"
comments: true

tags :
    - 面试
    - 基础
    - LeetCode

categories:
    - LeetCode
---

本文将LeetCode刷过的题目进行简单的总结和记录，便于自己进行复习，同时将看到的解题思路进行汇总让其他的小伙伴能够理解。

### 1.宝石与石头
[宝石与石头](https://leetcode-cn.com/problems/jewels-and-stones/)：
给定字符串J 代表石头中宝石的类型，和字符串 S代表你拥有的石头。 S 中每个字符代表了一种你拥有的石头的类型，你想知道你拥有的石头中有多少是宝石。
J 中的字母不重复，J 和 S中的所有字符都是字母。字母区分大小写，因此"a"和"A"是不同类型的石头。
```
示例1:
输入: J = "aA", S = "aAAbbbb"
输出: 3

示例1:
输入: J = "z", S = "ZZ"
输出: 0
```
注意:
S 和 J 最多含有50个字母。
J 中的字符不重复。

#### 答案一：
分析：最笨的方法肯定是双层遍历。
```javascript
/**
 * @param {string} J
 * @param {string} S
 * @return {number}
 */
var numJewelsInStones = function(J, S) {
    var jLen = J.length;
    var sLen = S.length;
    var sum = 0;
    for(var i = 0; i < jLen; i++) {
        var j = J.charAt(i);
        for(var k = 0; k < sLen; k++) {
            if(j === S.charAt(k)) {
                sum++;
            }
        }   
    }
    
    return sum;
    
};
```

#### 答案二：
通过题解得到了另一种思路就是将J进行循环遍历然后将S中的匹配值全部替换为空，这样长度的差值就是宝石的数量
```
/**
 * @param {string} J
 * @param {string} S
 * @return {number}
 */
var numJewelsInStones = function(J, S) {
    var jLen = J.length,
        sLen = S.length;
        var news= S;
    for(var i = 0; i < jLen; i++) {
        news = news.replace(new RegExp(J.charAt(i), 'g'), "");
    }
    
    return sLen - news.length;
    
};

```

### 2.IP地址无效化
[IP地址无效化](https://leetcode-cn.com/problems/defanging-an-ip-address/)：
给你一个有效的 IPv4 地址 address，返回这个 IP 地址的无效化版本。
所谓无效化 IP 地址，其实就是用 "[.]" 代替了每个 "."。
```
示例1:
输入：address = "1.1.1.1"
输出："1[.]1[.]1[.]1"

示例2:
输入：address = "255.100.50.0"
输出："255[.]100[.]50[.]0"
```
#### 答案一
分析：最简单直接的方案就是正则表达式替换
```
/**
 * @param {string} address
 * @return {string}
 */
var defangIPaddr = function(address) {
    return address.replace(/\./g, '[.]');
};
```


### 3.删除链表中的节点
[删除链表中的节点](https://leetcode-cn.com/problems/delete-node-in-a-linked-list/):
请编写一个函数，使其可以删除某个链表中给定的（非末尾）节点，你将只被给定要求被删除的节点。
现有一个链表 -- head = [4,5,1,9]，它可以表示为:
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/237_example.png)
```
示例1
输入: head = [4,5,1,9], node = 5
输出: [4,1,9]
解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.

示例2
输入: head = [4,5,1,9], node = 1
输出: [4,5,9]
解释: 给定你链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9.

```
说明:
* 链表至少包含两个节点。
* 链表中所有节点的值都是唯一的。
* 给定的节点为非末尾节点并且一定是链表中的一个有效节点。
* 不要从你的函数中返回任何结果。

#### 答案一
分析：说实话这道题目对于前端的同学来说其实很难理解。但是对于后台同学这个就太简单了，首先要理解[单向链表的概念](https://blog.csdn.net/jianyuerensheng/article/details/51200274)。对于本题只需要将删除后的节点指向新节点
```java
public void deleteNode(ListNode node) {
    node.val = node.next.val;
    node.next = node.next.next;
}
```

#### 答案二
对于使用javascript的版本需要首先定义一个单向链表
```
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function(node) {
  node.val = node.next.val;
  node.next = node.next.next;
};

var deleteNode = function(node) {
  node = Object.assign(node, node.next)
};

```

### 4.查找重复的电子邮箱
[查找重复的电子邮箱](https://leetcode-cn.com/problems/duplicate-emails/): 编写一个 SQL 查询，查找 <code>Person</code> 表中所有重复的电子邮箱。
```
示例：
+----+---------+
| Id | Email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+

返回结果：
+---------+
| Email   |
+---------+
| a@b.com |
+---------+
```

#### 答案一
```
select Email
from Person
group by Email
having count(Email) > 1
```

#### 答案二
```
select Email from
(
    select Email, count(Email) as num
    from Person
    group by Email
) as statistic
where num > 1;
```

### 5.大的国家
[大的国家](https://leetcode-cn.com/problems/big-countries/):这里有张 World 表
```
+-----------------+------------+------------+--------------+---------------+
| name            | continent  | area       | population   | gdp           |
+-----------------+------------+------------+--------------+---------------+
| Afghanistan     | Asia       | 652230     | 25500100     | 20343000      |
| Albania         | Europe     | 28748      | 2831741      | 12960000      |
| Algeria         | Africa     | 2381741    | 37100000     | 188681000     |
| Andorra         | Europe     | 468        | 78115        | 3712000       |
| Angola          | Africa     | 1246700    | 20609294     | 100990000     |
+-----------------+------------+------------+--------------+---------------+
```
如果一个国家的面积超过300万平方公里，或者人口超过2500万，那么这个国家就是大国家。

编写一个SQL查询，输出表中所有大国家的名称、人口和面积。

例如，根据上表，我们应该输出:
```
+--------------+-------------+--------------+
| name         | population  | area         |
+--------------+-------------+--------------+
| Afghanistan  | 25500100    | 652230       |
| Algeria      | 37100000    | 2381741      |
+--------------+-------------+--------------+

```

#### 答案一
```mysql
SELECT name, population, area 
FROM world 
WHERE area > 3000000
UNION
SELECT name, population, area 
FROM world 
WHERE population > 25000000


SELECT name, population, area 
FROM world 
WHERE area > 3000000 OR population > 25000000
```

### 6.二叉搜索树的范围和
[二叉搜索树的范围和](https://leetcode-cn.com/problems/range-sum-of-bst/): 给定二叉搜索树的根结点 root，返回 L 和 R（含）之间的所有结点的值的和。
二叉搜索树保证具有唯一的值。

```
示例1:
输入：root = [10,5,15,3,7,null,18], L = 7, R = 15
输出：32

示例2:
输入：root = [10,5,15,3,7,13,18,1,null,6], L = 6, R = 10
输出：23
``` 
提示
* 树中的结点数量最多为 10000 个。
* 最终的答案保证小于 2^31。

#### 答案一
<code>Java官方解法</code>
要理解这道题首先要知道一个概念[二叉查找树](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%85%83%E6%90%9C%E5%B0%8B%E6%A8%B9), 也称为二叉搜索树、有序二叉树、排序二叉树，指一棵空树或具有以下性质的二叉树：
* 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
* 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
* 任意节点的左、右子树也分别为二叉查找树；
* 没有键值相等的节点。

深度优先搜索我们对树进行深度优先搜索，对于当前节点 node，如果 node.val 小于等于 L，那么只需要继续搜索它的右子树；如果 node.val 大于等于 R，那么只需要继续搜索它的左子树；如果 node.val 在区间 (L, R) 中，则需要搜索它的所有子树。

```java
//深度优先搜索
class Solution {
    int ans;
    public int rangeSumBST(TreeNode root, int L, int R) {
        ans = 0;
        dfs(root, L, R);
        return ans;
    }

    public void dfs(TreeNode node, int L, int R) {
        if (node != null) {
            if (L <= node.val && node.val <= R)
                ans += node.val;
            if (L < node.val)
                dfs(node.left, L, R);
            if (node.val < R)
                dfs(node.right, L, R);
        }
    }
}

```
```java
//迭代实现深度优先搜索
class Solution {
    public int rangeSumBST(TreeNode root, int L, int R) {
        int ans = 0;
        Stack<TreeNode> stack = new Stack();
        stack.push(root);
        while(!stack.isEmpty()) {
            TreeNode node = stack.pop();
            if(node != null) {
                if(L <= node.val && node.val <= R)
                    ans += node.val;

                if(L < node.val)
                    stack.push(node.left);
                
                if(node.val < R)
                    stack.push(node.right);
            }
        }

        return ans;
    }
}

```

#### 答案二
<code>JavaScript</code>画图解题
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/tree.jpeg)
假设L= 7，R=15 
* 如果node.val >= 7 && node.val <= 15 则直接求和
* 如果node.val > 7,则node.right的值都大于7，右侧没有搜索必要，去查找left的值
* 如果node.val < 15,则node.left的值都小于15，左侧没有搜索必要，去查找right的值

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} L
 * @param {number} R
 * @return {number}
 */
var rangeSumBST = function(root, L, R) {
    var sum = 0;
        
    const dealBinTree = node => {
        if(node !== null) {
            if(L < node.val) {
                    dealBinTree(node.left);
            }
            if(node.val >= L && node.val <= R) {
                sum += node.val;
            }
            if(R > node.val) {
                    dealBinTree(node.right);
            }
            
        }
    
    }
    
    dealBinTree(root);
    
    return sum;
};
```

### 7.转换成小写字母
[转换成小写字母](https://leetcode-cn.com/problems/to-lower-case/):实现函数 ToLowerCase()，该函数接收一个字符串参数 str，并将该字符串中的大写字母转换成小写字母，之后返回新的字符串。

```
示例 1：

输入: "Hello"
输出: "hello"
示例 2：

输入: "here"
输出: "here"
示例 3：

输入: "LOVELY"
输出: "lovely"

```
#### 答案一
分析通过字符串的 <code>charCodeAt</code>和<code>String.fromCharCode</code>这两个方法来得到答案
```
/**
 * @param {string} str
 * @return {string}
 */
var toLowerCase = function(str) {
    var s = '';
    for(var i = 0, len = str.length; i < len; i++) {
        var c = str.charCodeAt(i);
        if(c >= 65 && c <= 90) {
           s += String.fromCharCode(c+32); 
        }  else {
           s += str.charAt(i);    
        }
        
    }
    return s;
};
```

### 8.唯一摩尔斯密码词
[唯一摩尔斯密码词](https://leetcode-cn.com/problems/unique-morse-code-words/)
国际摩尔斯密码定义一种标准编码方式，将每个字母对应于一个由一系列点和短线组成的字符串， 比如: "a" 对应 ".-", "b" 对应 "-...", "c" 对应 "-.-.", 等等。
为了方便，所有26个英文字母对应摩尔斯密码表如下：

[".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]


给定一个单词列表，每个单词可以写成每个字母对应摩尔斯密码的组合。例如，"cab" 可以写成 "-.-..--..."，(即 "-.-." + "-..." + ".-"字符串的结合)。我们将这样一个连接过程称作单词翻译。

返回我们可以获得所有词不同单词翻译的数量。
```
例如:
输入: words = ["gin", "zen", "gig", "msg"]
输出: 2
解释: 
各单词翻译如下:
"gin" -> "--...-."
"zen" -> "--...-."
"gig" -> "--...--."
"msg" -> "--...--."

共有 2 种不同翻译, "--...-." 和 "--...--.".
```

注意:
* 单词列表words 的长度不会超过 100。
* 每个单词 words[i]的长度范围为 [1, 12]。
* 每个单词 words[i]只包含小写字母。

#### 答案一
```javascript
/**
 * @param {string[]} words
 * @return {number}
 */
var uniqueMorseRepresentations = function(words) {
    var map = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."];
    
    var obj = {};

    for(var i = 0, len = words.length; i < len; i++) {
        
        let m = '';
        for(var j = 0, jen = words[i].length; j < jen; j++) {
             m += map[words[i].charCodeAt(j) - 97];
        }
        
        if(obj.hasOwnProperty(m)) {
            obj[m] = obj[m] + 1;
        } else {
            obj[m] = 1;
        }
        
    }
    

    return Object.keys(obj).length;
};
```
#### 答案二
<code>Java</code>利用Set自动去重
```java
class Solution {
    public int uniqueMorseRepresentations(String[] words) {
        String[] s={".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."};

        Set<String> set = new HashSet<>();
        int index;
        for(int i = 0; i < words.length; i++) {
            String temp = "";
            for(int j = 0; j < words[i].length(); j++) {
                index = (int)words[i].charAt(j) - 65 - 32;
                temp = temp.concat(s[index]);
            }
            set.add(temp);
        }
        return set.size();
    }
}

```


### 9.合并二叉树
[合并二叉树](https://leetcode-cn.com/problems/merge-two-binary-trees/):给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。
你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。
```
示例 1:

输入: 
	Tree 1                     Tree 2                  
          1                         2                             
         / \                       / \                            
        3   2                     1   3                        
       /                           \   \                      
      5                             4   7                  
输出: 
合并后的树:
	     3
	    / \
	   4   5
	  / \   \ 
	 5   4   7
注意: 合并必须从两个树的根节点开始。
```
#### 答案一
<code>Java</code>解法
```java
class Solution {
    public TreeNode meregeTrees(TreeNode t1, TreeNode t2) {
        if(t1 == null) {
            return t2;
        }
        if(t2 == null) {
            return t1;
        }

        TreeNode result = new TreeNode(t1.val + t2.val);
        result.left = mergeTrees(t1.left, t2.left);
        result.right = mergeTrees(t1.right, t2.right);
        return result;
    }
}
```

#### 答案二
<code>JavaScript</code>解法
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} t1
 * @param {TreeNode} t2
 * @return {TreeNode}
 */
var mergeTrees = function(t1, t2) {
    if(t1 === null) {
        return t2;
    }
    if(t2 === null) {
        return t1;
    }
    
    t1.val = t1.val + t2.val;
    t1.left = mergeTrees(t1.left, t2.left);
    t1.right = mergeTrees(t1.right, t2.right);
    
    return t1;
};
```

### 10.翻转图像
[翻转图像](https://leetcode-cn.com/problems/flipping-an-image/)给定一个二进制矩阵 A，我们想先水平翻转图像，然后反转图像并返回结果。
水平翻转图片就是将图片的每一行都进行翻转，即逆序。例如，水平翻转 [1, 1, 0] 的结果是 [0, 1, 1]。
反转图片的意思是图片中的 0 全部被 1 替换， 1 全部被 0 替换。例如，反转 [0, 1, 1] 的结果是 [1, 0, 0]。
```
示例 1:

输入: [[1,1,0],[1,0,1],[0,0,0]]
输出: [[1,0,0],[0,1,0],[1,1,1]]
解释: 首先翻转每一行: [[0,1,1],[1,0,1],[0,0,0]]；
     然后反转图片: [[1,0,0],[0,1,0],[1,1,1]]
示例 2:

输入: [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]
输出: [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]
解释: 首先翻转每一行: [[0,0,1,1],[1,0,0,1],[1,1,1,0],[0,1,0,1]]；
     然后反转图片: [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]
说明:

1 <= A.length = A[0].length <= 20
0 <= A[i][j] <= 1

```
#### 答案一
分析：最简单的方法就是按部就班来实现，先进行水平再进行图片反转。
对于1和0的翻转有两种方式
* 1 - 当前值 得到的是1和0的翻转
* 1 ^ 当前值 得到的也是0和1的反转。这个符号是异或，相同为0，相异为1

```javascript
/**
 * @param {number[][]} A
 * @return {number[][]}
 */
var flipAndInvertImage = function(A) {
    for(let i = 0, len = A.length; i < len; i++) {
        let re = A[i].join('');
        let im = '';
        for(let j = 0; j < re.length; j++) {
               im += Number(re[j]) === 0 ? '1' : '0';
        }
        A[i] = im.split('').reverse();
        
    }
    return A;
};
```

#### 答案二
数组api一行解法
```javascript
/**
 * @param {number[][]} A
 * @return {number[][]}
 */
var flipAndInvertImage = function(A) {
    return A.map(val => val.reverse().map(v => (1 - v)))
};

```
#### 答案三
双向指针
```javascript
/**
 * @param {number[][]} A
 * @return {number[][]}
 */
var flipAndInvertImage = function(A) {
    let Alen = A.length;
    let len = A[0].length;
    for(let i = 0; i < Alen; i++) {
        let left = 0;
        let right = len - 1;
        while(left <= right) {
            let temp = A[i][left];
            A[i][left] = A[i][right] ^ 1;
            A[i][right] = temp ^ 1;
            
            left++;
            right--;
        }
    }
    return A;
};
```