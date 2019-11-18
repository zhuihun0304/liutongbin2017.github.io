---
layout:     post
title:      LeetCode刷题总结(简单版二)
subtitle:   对LeetCode刷过的题目进行整理总结，方便后期查阅复习。
date:       2019-09-04
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

### 1.有趣的电影
[有趣的电影](https://leetcode-cn.com/problems/not-boring-movies/)：
某城市开了一家新的电影院，吸引了很多人过来看电影。该电影院特别注意用户体验，专门有个 LED显示板做电影推荐，上面公布着影评和相关电影描述。
作为该电影院的信息部主管，您需要编写一个 SQL查询，找出所有影片描述为非 boring (不无聊) 的并且 id 为奇数 的影片，结果请按等级 rating 排列。

```
例如，下表 cinema:

+---------+-----------+--------------+-----------+
|   id    | movie     |  description |  rating   |
+---------+-----------+--------------+-----------+
|   1     | War       |   great 3D   |   8.9     |
|   2     | Science   |   fiction    |   8.5     |
|   3     | irish     |   boring     |   6.2     |
|   4     | Ice song  |   Fantacy    |   8.6     |
|   5     | House card|   Interesting|   9.1     |
+---------+-----------+--------------+-----------+
对于上面的例子，则正确的输出是为：

+---------+-----------+--------------+-----------+
|   id    | movie     |  description |  rating   |
+---------+-----------+--------------+-----------+
|   5     | House card|   Interesting|   9.1     |
|   1     | War       |   great 3D   |   8.9     |
+---------+-----------+--------------+-----------+

```

#### 答案一：
我们可以使用 mod(id,2)=1 来确定奇数 id，然后添加 description != 'boring' 来解决问题。
官方题解：

```MySQL
select * 
from cinema
where mod(id,2) != 0 and description != 'boring'
order by rating desc
;
```

#### 答案二：
如何确定奇数除了使用mod函数还有一个比较巧妙的方法， id&1按位与,该操作会将数字转为32位的二进制进行比较
```javascript
//id=1
0001
0001

0001 结果为1

//id=2
0010
0001 

0000 结果为0

//id=3
0011
0001

0001 结果为1

//id=4
0010
0001

0000 结果为0

```
因为1的前31位都是0，跟0进行与操作肯定是0，主要在于最后一位如果是奇数肯定能得到1，如果是0肯定是0
所以答案也可以写成这样
```
select * 
from cinema 
where description<>'boring' and id&1 
order by rating desc
;
```


### 2.汉明距离
[汉明距离](https://leetcode-cn.com/problems/hamming-distance/):
两个整数之间的汉明距离指的是这两个数字对应二进制位不同的位置的数目。
给出两个整数 x 和 y，计算它们之间的汉明距离。
注意：
0 ≤ x, y < 231.

```
示例:

输入: x = 1, y = 4

输出: 2

解释:
1   (0 0 0 1)
4   (0 1 0 0)
       ↑   ↑

上面的箭头指出了对应二进制位不同的位置。
```
#### 答案一：
分析其实本题的意图就是将x，y转为二进制后，记录对应位置值不相同的位置数量， 所以我们就想到了按位异或。x^y后得到一个数值，需要将这个值转为二进制再去统计数量。
```
/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
var hammingDistance = function(x, y) {
  let z = x^y;
  let num = 0;
  let bin = z.toString(2);
  for(let i = 0; i < bin.length; i++) {
      if(bin.charAt(i) === '1') {
          num++;
      }
  }
    
    return num;
};

```

### 3.翻转二叉树
[翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/):
翻转一棵二叉树。

```
示例：

输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1

```

#### 答案一
```java

/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if(root == null) {
            return null;
        }
        
        TreeNode right = invertTree(root.right);
        TreeNode left = invertTree(root.left);
        
        root.left = right;
        root.right = left;
        return root;
    }
}
```

#### 答案二

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
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(root !== null) {
        [root.left, root.right] = [invertTree(root.right), invertTree(root.left)]
    }
    return root;
};

```

### 4.机器人能否返回原点
[机器人能否返回原点](https://leetcode-cn.com/problems/robot-return-to-origin/)：
在二维平面上，有一个机器人从原点 (0, 0) 开始。给出它的移动顺序，判断这个机器人在完成移动后是否在 (0, 0) 处结束。
移动顺序由字符串表示。字符 move[i] 表示其第 i 次移动。机器人的有效动作有 R（右），L（左），U（上）和 D（下）。如果机器人在完成所有动作后返回原点，则返回 true。否则，返回 false。
注意：机器人“面朝”的方向无关紧要。 “R” 将始终使机器人向右移动一次，“L” 将始终向左移动等。此外，假设每次移动机器人的移动幅度相同。

```
示例 1:

输入: "UD"
输出: true
解释：机器人向上移动一次，然后向下移动一次。所有动作都具有相同的幅度，因此它最终回到它开始的原点。因此，我们返回 true。
示例 2:

输入: "LL"
输出: false
解释：机器人向左移动两次。它最终位于原点的左侧，距原点有两次 “移动” 的距离。我们返回 false，因为它在移动结束时没有返回原点。
```

#### 答案一
分析：是否回到原点，取决于上下移动的步数相等，左右移动的步数相等。
所以最简单的方法就是去计数
```javascript
/**
 * @param {string} moves
 * @return {boolean}
 */
var judgeCircle = function(moves) {
     let u = 0;
        let d = 0;
        let r = 0;
        let l = 0;
        let movesArr = moves.split("");
        
        movesArr.forEach(function(val) {
            if(val === 'U') {
                u++;
            }
            if(val === 'D') {
                d++;
            }
            if(val === 'L') {
                l++;
            }
            if(val === 'R') {
                r++;
            }
            
        });
        return u === d && r === l;
};
```

#### 答案二
比第一个方法要巧妙一些，不去计数了但是还是要判断步数相等，通过切割关键点来得到数组，如果关键点数量一样数组的长度相同。
```javascript

/**
 * @param {string} moves
 * @return {boolean}
 */
var judgeCircle = function(moves) {
  return moves.split('L').length === moves.split('R').length && moves.split('U').length === moves.split('D').length
};
```


### 5.高度检查器
[高度检查器](https://leetcode-cn.com/problems/height-checker/):
学校在拍年度纪念照时，一般要求学生按照 非递减 的高度顺序排列。
请你返回至少有多少个学生没有站在正确位置数量。该人数指的是：能让所有学生以 非递减 高度排列的必要移动人数。

提示：
* 1 <= heights.length <= 100
* 1 <= heights[i] <= 100

```
示例：

输入：[1,1,4,2,1,3]
输出：3
解释：
高度为 4、3 和最后一个 1 的学生，没有站在正确的位置。
```

#### 答案一
分析：将数组重新排序后得到新的数组去判断同一个位置的值是否相等，不想等计数+1.
```javascript
/**
 * @param {number[]} heights
 * @return {number}
 */
var heightChecker = function(heights) {    
    var temp = heights.concat().sort((a, b) => (a - b) );
    var count = 0;

    for(var i = 0; i < heights.length; i++) {
        if(heights[i] != temp[i]) {
            count++;   
        }
    }
    
    return count;
};
```


### 6.二叉树的最大深度
[二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/):
给定一个二叉树，找出其最大深度。
二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
说明: 叶子节点是指没有子节点的节点。

```
示例：
给定二叉树 [3,9,20,null,null,15,7]，

    3
   / \
  9  20
    /  \
   15   7

返回它的最大深度 3 。

```

#### 答案一
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
 * @return {number}
 */
var maxDepth = function(root) {
    if(root == null) {
        return 0;
    } else {
        let left = maxDepth(root.left);
        let right = maxDepth(root.right);
        return Math.max(left, right) + 1;
    }
    
};
```

### 7.交换工资
[交换工资](https://leetcode-cn.com/problems/swap-salary/)
给定一个 salary 表，如下所示，有 m = 男性 和 f = 女性 的值。交换所有的 f 和 m 值（例如，将所有 f 值更改为 m，反之亦然）。要求只使用一个更新（Update）语句，并且没有中间的临时表。
注意，您必只能写一个 Update 语句，请不要编写任何 Select 语句。
```


例如：

| id | name | sex | salary |
|----|------|-----|--------|
| 1  | A    | m   | 2500   |
| 2  | B    | f   | 1500   |
| 3  | C    | m   | 5500   |
| 4  | D    | f   | 500    |
运行你所编写的更新语句之后，将会得到以下表:

| id | name | sex | salary |
|----|------|-----|--------|
| 1  | A    | f   | 2500   |
| 2  | B    | m   | 1500   |
| 3  | C    | f   | 5500   |
| 4  | D    | m   | 500    |

```
#### 答案一
```mysql
UPDATE salary 
SET sex = CASE sex
        WHEN 'm' THEN 'f'
        ELSE 'm'
    END;

```


### 8.有序数组的平方
[有序数组的平方](https://leetcode-cn.com/problems/squares-of-a-sorted-array/):
给定一个按非递减顺序排序的整数数组 A，返回每个数字的平方组成的新数组，要求也按非递减顺序排序。

提示：

* 1 <= A.length <= 10000
* -10000 <= A[i] <= 10000
* A 已按非递减顺序排序。


```
示例 1：

输入：[-4,-1,0,3,10]
输出：[0,1,9,16,100]
示例 2：

输入：[-7,-3,2,3,11]
输出：[4,9,9,49,121]

```

#### 答案一
分析：因为是从小打大，其中可以包含负数，所以取平方后两头应该最大。之所以使用<code>unshift</code>是因为双向指针来获取，拿到的一开始的值肯定是最大的后面越来越小


```javascript

/**
 * @param {number[]} A
 * @return {number[]}
 */
var sortedSquares = function(A) {
    let count = A.length;
    let result = [];
    let i = 0;
    let j = count -1;
    
    while(i <= j) {
        let left = Math.pow(A[i], 2);
        let right = Math.pow(A[j], 2);
        
        if(left > right) {
            result.unshift(left);
            i++;
        } else {
            result.unshift(right);
            j--;
        }
        
    }

    return result;
    
};

```

### 9.增减字符串匹配
[增减字符串匹配](https://leetcode-cn.com/problems/di-string-match/):
给定只含 "I"（增大）或 "D"（减小）的字符串 S ，令 N = S.length。
返回 [0, 1, ..., N] 的任意排列 A 使得对于所有 i = 0, ..., N-1，都有：
如果 S[i] == "I"，那么 A[i] < A[i+1]
如果 S[i] == "D"，那么 A[i] > A[i+1]

```javascript
示例 1：

输出："IDID"
输出：[0,4,1,3,2]
示例 2：

输出："III"
输出：[0,1,2,3]
示例 3：

输出："DDI"
输出：[3,2,0,1]

```

#### 答案一
分析：根据结果的分析是所有的I从0开始依次递增，所有D从N开始依次递减
```javascript

/**
 * @param {string} S
 * @return {number[]}
 */
var diStringMatch = function(S) {
    let len = S.length;
    let imin = 0, dmax = len;
    let result = new Array(len + 1);
    for(let i = 0; i <= len; i++) {
        if(S.charAt(i) === 'I') {
            result[i] = imin;
            imin++;
        } else {
            result[i] = dmax;
            dmax--;
        }
    }
    
    return result;
    
};
```

#### 答案二
```javascript
分析：乍一看这个一行的解法不是特别明白，但是分析示例答案可以看出无论给出的字符串是什么样的最后都可以补充一位，可以补I也可以补D,对于结果是没有影响的
所以先不补位置。然后逢I加一 逢D减一。
var diStringMatch = function(S) {
    let a = 0,b = S.length;
    return (S+S[S.length - 1]).split('').map((x) => x=='I'?a++:b--)
}
```

### 10.组合两个表
[组合两个表](https://leetcode-cn.com/problems/combine-two-tables/)
```
表1: Person

+-------------+---------+
| 列名         | 类型     |
+-------------+---------+
| PersonId    | int     |
| FirstName   | varchar |
| LastName    | varchar |
+-------------+---------+
PersonId 是上表主键


表2: Address

+-------------+---------+
| 列名         | 类型    |
+-------------+---------+
| AddressId   | int     |
| PersonId    | int     |
| City        | varchar |
| State       | varchar |
+-------------+---------+
AddressId 是上表主键


编写一个 SQL 查询，满足条件：无论 person 是否有地址信息，都需要基于上述两表提供 person 的以下信息：
FirstName, LastName, City, State
```

#### 答案一
因为表 Address 中的 personId 是表 Person 的外关键字，所以我们可以连接这两个表来获取一个人的地址信息。
考虑到可能不是每个人都有地址信息，我们应该使用 outer join 而不是默认的 inner join。

```
select FirstName, LastName, City, State
from Person left join Address
on Person.PersonId = Address.PersonId
;
```