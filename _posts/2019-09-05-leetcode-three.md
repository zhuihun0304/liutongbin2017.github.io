---
layout:     post
title:      LeetCode刷题总结(简单版三)
subtitle:   对LeetCode刷过的题目进行整理总结，方便后期查阅复习。
date:       2019-09-05
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

### 1.自除数
[自除数](https://leetcode-cn.com/problems/self-dividing-numbers/)：
自除数 是指可以被它包含的每一位数除尽的数。
例如，128 是一个自除数，因为 128 % 1 == 0，128 % 2 == 0，128 % 8 == 0。
还有，自除数不允许包含 0 。
给定上边界和下边界数字，输出一个列表，列表的元素是边界（含边界）内所有的自除数。

注意：
* 每个输入参数的边界满足 1 <= left <= right <= 10000。


```
示例 1：

输入： 
上边界left = 1, 下边界right = 22
输出： [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 22]
```

#### 答案一：
分析： 关键点就是对数字进行拆分取整数和取余数,我自己的解法代码有点复杂冗余，下面是根据题解的优化方法：

```javascript
/**
 * @param {number} left
 * @param {number} right
 * @return {number[]}
 */
var selfDividingNumbers = function (left, right) {
    let arr = [];
    for(let i = left; i <= right; i++) {
        let n = i;
        let flag = true;
        while(n) {
            if (i % (n % 10) === 0) {
                n = Math.floor(n / 10);
            } else {
                flag = false;
                break;
            }
        }
        if(flag) {
            arr.push(i);
        }
    }
    return arr;
};

```

### 2.二叉搜索树中的搜索
[二叉搜索树中的搜索](https://leetcode-cn.com/problems/search-in-a-binary-search-tree/):
给定二叉搜索树（BST）的根节点和一个值。 你需要在BST中找到节点值等于给定值的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 NULL。
例如，
```
给定二叉搜索树:

        4
       / \
      2   7
     / \
    1   3

和值: 2
你应该返回如下子树:

      2     
     / \   
    1   3
在上述示例中，如果要找的值是 5，但因为没有节点值为 5，我们应该返回 NULL。
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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function(root, val) {
    if(root === null) {
        return null;
    }
    
    if(root.val > val) {
        return searchBST(root.left, val);
    } else if(root.val === val) {
        return root;
    } else {
        return searchBST(root.right, val);
    }
};
```

#### 答案二
```java
// 迭代
class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        while(root != null) {
            if(root.val == val) {
                return root;
            } else if(root.val > val) {
                root = root.left;
            } else {
                root = root.right;
            }
        }
        return null;
    }
}
```

#### 答案三

```java
//按照逻辑递归
class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        if(root == null) 
            return null;
        
        if(root.val == val) {
            return root;
        } else if(val < root.val) {
            return searchBST(root.left, val);
        } else {
            return searchBST(root.right, val);
        }
    }
}
```

### 3.N叉树的后序遍历
[N叉树的后序遍历](https://leetcode-cn.com/problems/n-ary-tree-postorder-traversal/):给定一个 N 叉树，返回其节点值的后序遍历。

例如，给定一个 3叉树 :
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/narytree.png)
返回其后序遍历: [5,6,3,2,4,1].

说明: 递归法很简单，你可以使用迭代法完成此题吗?


#### 答案一
```javascript

/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */
/**
 * 第一种方式：递归
 * @param {Node} root
 * @return {number[]}
 */
var postorder = function(root) {
    if(!root) return [];

    var res = [];
    recusion(root);
    return res;

    function recusion(root) {
        if(!root) return;

        for(var i = 0; i < root.children.length; i++) {
            recusion(root.children[i]);
        }
        res.push(root.val);
    }
};

```

#### 答案二
```javascript
/**
 * 第二种方式：迭代
 * @param {Node} root
 * @return {number[]}
 */
var postorder2 = function(root) {
    if(!root) return [];
    var res = [], arr = [root];
    while(arr.length) {
        var current = arr.pop();
        for(var i = 0; i < current.children.length; i++) {
            arr.push(current.children[i]);
        }
        res.unshift(current.val);
    }
    return res;
}

```

### 答案三
```java
class Solution {
    public List<Integer> postorder(Node root) {
        List<Integer> res = new ArrayList<Integer>();
        if(root == null) return res;
        for(Node cur: root.children) {
            res.addAll(postorder(cur));
        }
        res.add(root.val);
        return res;
    }
}
```


### 4.N叉树的前序遍历
例如，给定一个 3叉树 :
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/narytree.png)
返回其前序遍历: [1,3,5,6,2,4]。
说明: 递归法很简单，你可以使用迭代法完成此题吗?

#### 答案一
```javascript
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */
/**
 * @param {Node} root
 * @return {number[]}
 */
var preorder = function(root) {
    if(!root) return [];
    var res = [];
    recusion(root);
    return res;
    
    function recusion(root) {
        if(!root) return;
        res.push(root.val);
        for(var i = 0; i < root.children.length; i++) {
            recusion(root.children[i]);
        }
    }
};
```

#### 答案二
```java
class Solution {
    public List<Integer> preorder(Node root) {
        List<Integer> res = new ArrayList<Integer>();
        if(root == null) return res;
        res.add(root.val);
        for(Node cur: root.children) {
            res.addAll(preorder(cur));
        }
        return res;
    }
}
```

#### 答案三
迭代
```java
class Solution {
    public List<Integer> preorder(Node root) {
        List<Integer> res = new ArrayList<Integer>();
        if(root == null) return res;
    
        Stack<Node> stack = new Stack<>();
        stack.push(root);
        while(!stack.isEmpty()) {
            Node cur = stack.pop();
            res.add(cur.val);

            List<Node> nodeList = cur.children;
            for(int i = nodeList.size() - 1; i >= 0; i--) {
                stack.push(nodeList.get(i));
            }
        }

        return res;
    }
}
```



### 5.Nim 游戏
[Nim 游戏](https://leetcode-cn.com/problems/nim-game/submissions/):
你和你的朋友，两个人一起玩 Nim 游戏：桌子上有一堆石头，每次你们轮流拿掉 1 - 3 块石头。 拿掉最后一块石头的人就是获胜者。你作为先手。
你们是聪明人，每一步都是最优解。 编写一个函数，来判断你是否可以在给定石头数量的情况下赢得游戏。
```
示例:

输入: 4
输出: false 
解释: 如果堆中有 4 块石头，那么你永远不会赢得比赛；
     因为无论你拿走 1 块、2 块 还是 3 块石头，最后一块石头总是会被你的朋友拿走。

```

#### 答案一
分析:随机拿1-3块石头，这里的4是一个临界点，依次以，5，6，7，8举例计算，发现每次能被4整除时一定会返回false,其他返回true
```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var canWinNim = function(n) {
    return n % 4 ? true: false;  
};
```

### 6.山脉数组的峰顶索引
[山脉数组的峰顶索引](https://leetcode-cn.com/problems/peak-index-in-a-mountain-array/):
我们把符合下列属性的数组 A 称作山脉：
* A.length >= 3
* 存在 0 < i < A.length - 1 使得A[0] < A[1] < ... A[i-1] < A[i] > A[i+1] > ... > A[A.length - 1]

给定一个确定为山脉的数组，返回任何满足 A[0] < A[1] < ... A[i-1] < A[i] > A[i+1] > ... > A[A.length - 1] 的 i 的值。

提示：
* 3 <= A.length <= 10000
* 0 <= A[i] <= 10^6
* A 是如上定义的山脉

```
示例 1：

输入：[0,1,0]
输出：1
示例 2：

输入：[0,2,1,0]
输出：1
 


```

#### 答案一
分析：通过读题其实是返回数组中最大值的索引
```javascript
/**
 * @param {number[]} A
 * @return {number}
 */
var peakIndexInMountainArray = function(A) {
    return A.findIndex(val => val == Math.max(...A));
};
```

#### 答案二
后台的解题方法更多可以参考一下
```java
// 打桩法，也叫单向扫描，代码如下：时间复杂度为O(n)，效率略低，但是此方法具有普适性，也就是说这个方法可适用于在一般数组中找最大值。
class Solution {
    public int peakIndexInMountainArray(int[] a) {
        if(A == null || A,length < 3) {
            return 0;
        }

        int max = Integer.MIN_VALUE;
        int ans = 0;
        for(int i = 0; i < A.length; i++) {
            if(A[i] > max) {
                max = A[i];
                ans = i;
            }
        }
        return ans;
    }
}

// 双指针，也叫双向扫描，左右两边同时向中间扫描，以找出最大值，这个算法其实是在打桩法之上的一个效率优化，
// 时间复杂度为O(n/2)--->O(n)，效率较低，但比打桩法效率高，同时也具有普适性。
class Solution {
    public int peakIndexInMountainArray(int[] A) {
        if(A == null || A,length < 3) {
            return 0;
        }
        int max = Integer.MIN_VALUE;
        int ans = 0;

        int left = 0;
        int right = A.length - 1;

        while(left < right) {
            if(left <= right && A[left] > max) {
                max = A[left];
                ans = left;
            }
            if(left <= right && A[right] > max) {
                max = A[right];
                ans = right;
            }
            left++;
            right--;
        }

        return ans;
    }
}

// 分治法，二分查找，是适用于此题的最佳解法，时间复杂度为O(logn)，优点是效率高，缺点是不具有普适性。因为此题数组特殊，所以可用这种方法提高查找效率。
class Solution {
    public int peakIndexInMountainArray(int[] A) {
         if (A == null || A.length < 3)  {
            return 0;
        }
        
        int ans = 0;
    
        int left = 0;
        int right = A.length;

        while(left < right) {
            int center = (left + right) / 2;
            if(A[center] > A[center - 1] && A[center] > A[center + 1]) {
                ans = center;
                break;
            } else if(A[center] < A[center - 1]) {
                right = center;
            } else {
                left = center;
            }
        }
        return ans;

    }
}

```

### 7.除数博弈
[除数博弈](https://leetcode-cn.com/problems/divisor-game/):
爱丽丝和鲍勃一起玩游戏，他们轮流行动。爱丽丝先手开局。
最初，黑板上有一个数字 N 。在每个玩家的回合，玩家需要执行以下操作：
* 选出任一 x，满足 0 < x < N 且 N % x == 0 。
* 用 N - x 替换黑板上的数字 N 。

如果玩家无法执行这些操作，就会输掉游戏。
只有在爱丽丝在游戏中取得胜利时才返回 True，否则返回 false。假设两个玩家都以最佳状态参与游戏。

提示： 1 <= N <= 1000

```
示例 1：

输入：2
输出：true
解释：爱丽丝选择 1，鲍勃无法进行操作。


示例 2：

输入：3
输出：false
解释：爱丽丝选择 1，鲍勃也选择 1，然后爱丽丝无法进行操作。

```

#### 答案一
分析：自己按照题解给出的答案。但是有更简单的解法
```javascript
/**
 * @param {number} N
 * @return {boolean}
 */
var divisorGame = function(N) {    
    let x = finx(N);
    let oN = N;
    let count = 0;
    while(x) {
        oN = oN - x;
        x = finx(oN);
        count++;
    }
    if(count&1) {
        return true;
    }
    return false;
    
    function finx(num){
        let x = false;
        for(let i = 1; i < num; i++) {
            if(num % i === 0) {
                x = i;
                break;
            }
        }
        return x;
    }
        
};
```

#### 答案二
对于这种博弈类的题目，如果没有思路的话我们不妨多举几个例子，尝试着从中找寻规律。

* 假设 N = 1，爱丽丝没得选择，直接失败，即 鲍勃获胜；
* 假设 N = 2，爱丽丝有选择，她可以选择 x = 1，鲍勃面对的就是 N = 2 - 1 = 1，无法操作，爱丽丝获胜；
* 假设 N = 3，爱丽丝只能选择 x = 1，因为选 x = 2 不满足 3 % 2 = 0，鲍勃面对的就是 N = 3 - 1 = 2，参考上面 N = 2 的情形，此时鲍勃为 N = 2 的先手，鲍勃获胜；
* 假设 N = 4，爱丽丝可以选择 x = 1 来使鲍勃遇到 N = 3 的情况，爱丽丝获胜；
貌似有个规律：N 为奇数时， 鲍勃获胜；N 为偶数时， 爱丽丝获胜。

是这样吗？是的。

事实上，无论 N 为多大，最终都是在 N = 2 这个临界点结束的。谁最后面对的是 N = 2 的情形，谁就能获胜（这句话不太理解的话，仔细看看 N = 2、N = 3 这两种情形）。
接下来，我们得知道一个数学小知识：奇数的因子（约数）只能是奇数，偶数的因子（约数）可以是奇数或偶数。
千万不要忽略 1 也是因子！

爱丽丝是游戏开始时的先手。

当她面对的 N 为偶数时，她 一定可以 选到一个 N 的奇数因子 x（比如 1 ），将 N - x 这个奇数传给鲍勃；用 N - x 替换黑板上的数字 N ，鲍勃面对的就是奇数 N，只能选择 N 的奇数因子 x，奇数 - 奇数 = 偶数，此时传给爱丽丝的又是偶数。这样轮换下去爱丽丝会遇到 N = 2 的情形，然后获胜；
当爱丽丝遇到的 N 是奇数时，只能传给鲍勃偶数或无法操作 (N = 1) ，无法获胜。

```java
class Solution {
    public boolean divisorGame(int N) {
        return N % 2 == 0;
    }
}
```


### 8.最近的请求次数(代码比题目易懂)
[最近的请求次数](https://leetcode-cn.com/problems/number-of-recent-calls/):
写一个 <code>RecentCounter</code> 类来计算最近的请求。
它只有一个方法：<code>ping(int t)</code>，其中 t 代表以毫秒为单位的某个时间。
返回从 <code>3000</code> 毫秒前到现在的 <code>ping</code> 数。
任何处于 <code>[t - 3000, t]</code> 时间范围之内的 <code>ping</code> 都将会被计算在内，包括当前（指 t 时刻）的 <code>ping</code>。
保证每次对 <code>ping</code> 的调用都使用比之前更大的 t 值。

提示：
* 每个测试用例最多调用 10000 次 ping。
* 每个测试用例会使用严格递增的 t 值来调用 ping。
* 每次调用 ping 都有 1 <= t <= 10^9。

```
示例：

输入：inputs = ["RecentCounter","ping","ping","ping","ping"], inputs = [[],[1],[100],[3001],[3002]]
输出：[null,1,2,3,3]

```
 
#### 答案一
分析：说实话这道题目不容易理解，配上示例也完全不知道在说啥，先看一下题解进行一下分析，题目其实是这样的
示例解读：分别在1,100,3001,3002ms发出了请求（ping）

1ms时计算1ms以及1ms之前3000ms的请求数为‘1’(1ms时的ping)

100ms时计算100ms以及100ms之前3000s的请求数为‘2’（1ms时的ping和100ms时的ping）

3001ms时计算3001ms以及3001ms之前3000s的请求数为‘3’(1ms时的ping、100ms时的ping和3001ms时的ping)

3002ms时计算3002ms以及3002ms之前3000s的请求数为‘3’(100ms时的ping、3001ms时的ping和3002ms时的ping)

```javascript
var RecentCounter = function() {
    this.result = [];
};

/** 
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function(t) {
    this.result.push(t);
    while(this.result[0] < (t - 3000)) {
        this.result.shift();
    }
    return this.result.length;
};

/** 
 * Your RecentCounter object will be instantiated and called as such:
 * var obj = new RecentCounter()
 * var param_1 = obj.ping(t)
 */
```

#### 答案二
官方题解：我们只会考虑最近 3000 毫秒到现在的 ping 数，因此我们可以使用队列存储这些 ping 的记录。当收到一个时间 t 的 ping 时，我们将它加入队列，并且将所有在时间 t - 3000 之前的 ping 移出队列。
```java
class RecentCounter {
    Queue<Integer> q;

    public RecentCounter() {
        q = new LinkedList();
    }

    public int ping(int t) {
        q.add(t);
        while(q.peek() < t - 3000) {
            q.poll();
        }
        return q.size();
    }
}
```


### 9.数字的补数
[数字的补数](https://leetcode-cn.com/problems/number-complement/):
给定一个正整数，输出它的补数。补数是对该数的二进制表示取反。

注意:
* 给定的整数保证在32位带符号整数的范围内。
* 你可以假定二进制数不包含前导零位。

```
示例 1:

输入: 5
输出: 2
解释: 5的二进制表示为101（没有前导零位），其补数为010。所以你需要输出2。
示例 2:

输入: 1
输出: 0
解释: 1的二进制表示为1（没有前导零位），其补数为0。所以你需要输出0。

```

#### 答案一
```javascript
/**
 * @param {number} num
 * @return {number}
 */
var findComplement = function(num) {
  let b = num.toString(2);
  let res = '';
  for(let i = 0; i < b.length; i++) {
      res += (Number(b.charAt(i))^1 + '');
  }

  return parseInt(res, 2);
};
```


### 10.按奇偶排序数组
[按奇偶排序数组](https://leetcode-cn.com/problems/sort-array-by-parity/submissions/):
给定一个非负整数数组 A，返回一个数组，在该数组中， A 的所有偶数元素之后跟着所有奇数元素。
你可以返回满足此条件的任何数组作为答案。

提示：

* <code>1 <= A.length <= 5000</code>
* <code>0 <= A[i] <= 5000</code>

```
示例：

输入：[3,1,2,4]
输出：[2,4,3,1]
输出 [4,2,3,1]，[2,4,1,3] 和 [4,2,1,3] 也会被接受。
```

#### 答案一
```javascript
/**
 * @param {number[]} A
 * @return {number[]}
 */
var sortArrayByParity = function(A) {
  
  return A.filter(val => val % 2 == 0).concat(A.filter(val => val % 2 !== 0))
    
};
```

#### 答案二
```java
class Solution {
    public int[] sortArrayByParity(int[] A) {
        int[] res = new int[A.length];
        int min = 0, max = A.length - 1;

        for(int i : A) {
            if(i % 2 == 0) {
                res[min++] = i;
            } else {
                res[max--] = i;
            }
        }

        return res;
    }
}

```