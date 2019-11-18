---
layout:     post
title:      LeetCode刷题总结(简单版四)
subtitle:   对LeetCode刷过的题目进行整理总结，方便后期查阅复习。
date:       2019-09-07
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

### 1.反转字符串中的单词 III
[反转字符串中的单词 III](https://leetcode-cn.com/problems/reverse-words-in-a-string-iii/submissions/)：
给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。

注意：在字符串中，每个单词由单个空格分隔，并且字符串中不会有任何额外的空格。

```
示例 1:

输入: "Let's take LeetCode contest"
输出: "s'teL ekat edoCteeL tsetnoc" 
```


#### 答案一

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
    return (s.split(' ').map(val => val.split('').reverse().join(''))).join(' ');
};

```
#### 答案二

稍微有点取巧的做法，reverse函数也可以用双指针实现。

```java
class Solution 
{
    public String reverseWords(String s) 
    {
        String[] sp=s.split(" ");
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<=sp.length-1;i++)
        {
            StringBuilder t=new StringBuilder();
            t.append(sp[i]);
            sb.append(t.reverse().toString()).append(" ");
        }
        return sb.substring(0,sb.length()-1);
    }
}
```

### 2.反转字符串
[反转字符串](https://leetcode-cn.com/problems/reverse-string/):
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 char[] 的形式给出。

不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。

你可以假设数组中的所有字符都是 ASCII 码表中的可打印字符。

```
示例 1：

输入：["h","e","l","l","o"]
输出：["o","l","l","e","h"]
示例 2：

输入：["H","a","n","n","a","h"]
输出：["h","a","n","n","a","H"]

```

#### 答案一
reverse

```javascript
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    return s.reverse();
};
```

#### 答案二
其实本题并不是想考reverse, 感觉应该是想考reverse的实现
```javascript
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    var len = s.length;
    for(var i = 0, center = Math.floor(len / 2); i < center; i++) {
        let edx = len - i - 1;
        let temp = s[edx];
        s[edx] = s[i];
        s[i] = temp;
    }
    return s;
};
```

### 3.数组拆分 I
[数组拆分 I](https://leetcode-cn.com/problems/array-partition-i/):
给定长度为 2n 的数组, 你的任务是将这些数分成 n 对, 例如 (a1, b1), (a2, b2), ..., (an, bn) ，使得从1 到 n 的 min(ai, bi) 总和最大。

提示:
* n 是正整数,范围在 [1, 10000].
* 数组中的元素范围在 [-10000, 10000].

```

示例 1:

输入: [1,4,3,2]

输出: 4
解释: n 等于 2, 最大总和为 4 = min(1, 2) + min(3, 4).
```

#### 答案一
首先排序 ,然后将index为奇数的进行求和.
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var arrayPairSum = function(nums) {
    let sortNums = nums.sort((a, b) => a - b);
    let sum = 0;
    sortNums.forEach(function(val, key) {
      if(key % 2 === 0)  {
          sum += val;
      }
    });
    
    return sum;
    
};
```

### 4.键盘行
[键盘行](https://leetcode-cn.com/problems/keyboard-row/):

给定一个单词列表，只返回可以使用在键盘同一行的字母打印出来的单词。键盘如下图所示。
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/keyboard.png)
注意：

* 你可以重复使用键盘上同一字符。
* 你可以假设输入的字符串将只包含字母。


```
示例：

输入: ["Hello", "Alaska", "Dad", "Peace"]
输出: ["Alaska", "Dad"]
```

#### 答案一
分析: 定好map对应关系 两层遍历就可以,可以先取到首字母的指然后判断是否跟首字母相等

```javascript

/**
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function(words) {
    let alObj = {
        q: 0,w: 0,e: 0,r: 0, t: 0,y: 0,u: 0,i: 0,q: 0,o: 0,p: 0,
        a: 1,s: 1,d: 1,f: 1,g: 1,h: 1,j: 1,k: 1,l: 1,
        z: 2,x: 2,c: 2,v: 2,b: 2,n: 2,m: 2
    };
    
    let lWords = words.map(val => val.toLowerCase());
    let leng = lWords.length;
    
    let result = [];
    
    lWords.forEach((str, key) => {
        let flag = true;    
        let first =  alObj[str.charAt(0)];
        for(let i = 0; i < str.length; i++) {
            let current = alObj[str.charAt(i)];
            if(first !== current) {
                flag = false;
                break;
            }
        }
        if(flag) {
            result.push(words[key]);
        }
    });
    
    return result;
    
};
```

#### 答案二
正则表达式匹配
```javascript
var findWords = function(words) {
    let reg1 = new RegExp("[qwertyuiop]", "i");
    let reg2 = new RegExp("[asdfghjkl]", "i");
    let reg3 = new RegExp("[zxcvbnm]", "i");
    let result = [];
    words.forEach(word => {
        let flag1 = reg1.test(word);
        let flag2 = reg2.test(word);
        let flag3 = reg3.test(word);
        
        if((flag1 && !flag2 && !flag3)||(!flag1 && !flag2 && flag3)||(!flag1 && flag2 && !flag3)){
            result.push(word);
        }
    })

    return result;
    
}

```

#### 答案三
```java
class Solution {
    public String[] findWords(String[] workds) {
        if(words == null) {
            return null;
        }

        List<String> ans = new ArrayList<>();

        String[] lines = new String[] {
            "qwertyuiop",
            "asdfghjkl",
            "zxcvbnm"
        }

        for(String word: words) {
            if(judge(word.toLowerCase(), lines)) {
                ans.add(word);
            }
        }

        return ans.toArray(new String[ans.size()]);
    }


    private boolean judge(String word, String[] lines) {
        boolean ok = true;
        String find = null;

        for(String line: lines) {
            if(line.indexOf(word.charAt(0)) > -1) {
                find = line;
                break;
            }
        }

        if(find == null) {
            ok = false;
            return ok;
        }

        for(ini i = 1; i < word.length; i++) {
            if(find.indexOf(word.charAt(i)) < 0) {
                ok = false;
                break;
            }
        }
        return ok;
    }
}

```

### 5.猜数字
[猜数字](https://leetcode-cn.com/problems/guess-numbers/):
小A 和 小B 在玩猜数字。小B 每次从 1, 2, 3 中随机选择一个，小A 每次也从 1, 2, 3 中选择一个猜。他们一共进行三次这个游戏，请返回 小A 猜对了几次？
输入的guess数组为 小A 每次的猜测，answer数组为 小B 每次的选择。guess和answer的长度都等于3。


限制：

* guess的长度 = 3
* answer的长度 = 3
* guess的元素取值为 {1, 2, 3} 之一。
* answer的元素取值为 {1, 2, 3} 之一。

```
示例 1：

输入：guess = [1,2,3], answer = [1,2,3]
输出：3
解释：小A 每次都猜对了。
 

示例 2：

输入：guess = [2,2,3], answer = [3,2,1]
输出：1
解释：小A 只猜对了第二次。

```

#### 答案一

```javascript
/**
 * @param {number[]} guess
 * @param {number[]} answer
 * @return {number}
 */
var game = function(guess, answer) {
    return guess.filter((val, key) => {
        return val === answer[key];
    }).length;
};

```

#### 答案二
```java
class Solution {
    public int game(int[] guess, int[] answer) {
        int count = 0;
        for(int i = 0; i < 3; i++) {
            if(guess[i] == answer[i]) {
                counter++;
            }
        }
        return count;
    }
}

```


### 6.删列造序
[删列造序](https://leetcode-cn.com/problems/delete-columns-to-make-sorted/):
给定由 N 个小写字母字符串组成的数组 A，其中每个字符串长度相等。

删除 操作的定义是：选出一组要删掉的列，删去 A 中对应列中的所有字符，形式上，第 n 列为 [A[0][n], A[1][n], ..., A[A.length-1][n]]）。

比如，有 A = ["abcdef", "uvwxyz"]，
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/944_1.png)
要删掉的列为 {0, 2, 3}，删除后 A 为["bef", "vyz"]， A 的列分别为["b","v"], ["e","y"], ["f","z"]。
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/944_2.png)
你需要选出一组要删掉的列 D，对 A 执行删除操作，使 A 中剩余的每一列都是 非降序 排列的，然后请你返回 D.length 的最小可能值。

提示：

* 1 <= A.length <= 100
* 1 <= A[i].length <= 1000

```
示例 1：

输入：["cba", "daf", "ghi"]
输出：1
解释：
当选择 D = {1}，删除后 A 的列为：["c","d","g"] 和 ["a","f","i"]，均为非降序排列。
若选择 D = {}，那么 A 的列 ["b","a","h"] 就不是非降序排列了。
示例 2：

输入：["a", "b"]
输出：0
解释：D = {}
示例 3：

输入：["zyx", "wvu", "tsr"]
输出：3
解释：D = {0, 1, 2}

```


#### 答案一
分析: 按照题意来说只要满足每一列的字母 b > a 就需要将结果加一.这里使用<code>charCodeAt()</code>比较
```javascript
/**
 * @param {string[]} A
 * @return {number}
 */
var minDeletionSize = function(A) {
    let len = A.length;
    let leng = A[0].length;
    let result = 0;
    
    for(let j = 0; j < leng; j++) {
        for(let i = 0; i < len - 1; i++) { 
            let prev = A[i].charCodeAt(j);
            let next = A[i+1].charCodeAt(j);
            if(prev > next) {
                result++;
                break;
            }
        }
    }
    return result;
};
```

#### 答案二
跟js解法是一样的
```java
class Solution {
    public int minDeletionSize(String[] A) {
        int ans = 0;
        for (int c = 0; c < A[0].length(); ++c)
            for (int r = 0; r < A.length - 1; ++r)
                if (A[r].charAt(c) > A[r+1].charAt(c)) {
                    ans++;
                    break;
                }

        return ans;
    }
}


```

### 7.N叉树的最大深度
[ N叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/):
最大深度是指从根节点到最远叶子节点的最长路径上的节点总数。

例如,给定一个<code>3叉树</code> :
![](https://cdn.darknights.cn/assets/images/in-post/leetcode/narytree.png)

我们应返回最大深度,3.

说明:

* 树的深度不会超过 1000。
* 树的节点总不会超过 5000。

#### 答案一
因为java和JavaScript的解法一样这里我就算做一种.
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
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) {
        return 0;
    }
    if(root.children && root.children.length > 0) {
        let max = 0;
        for(let i = 0, len = root.children.length; i< len; i++) {
            max = Math.max(maxDepth(root.children[i]), max)
        }
        return max + 1;
    } else {
        return 1;
    }
};

```

```java
class Solution {
    public int maxDeepth(Node node) {
        if(root == null) return 0;
        int max = 0;
        for(int i = 0; i < root.children.size(); i++) {
            max = Math.max(maxDeepth(root.children.get(i)), max);
        }
        return max + 1;
    }
}
```

### 8. 超过经理收入的员工
[超过经理收入的员工](https://leetcode-cn.com/problems/employees-earning-more-than-their-managers/): 
Employee 表包含所有员工，他们的经理也属于员工。每个员工都有一个 Id，此外还有一列对应员工的经理的 Id。

给定 Employee 表，编写一个 SQL 查询，该查询可以获取收入超过他们经理的员工的姓名。在上面的表格中，Joe 是唯一一个收入超过他的经理的员工。
```
+----+-------+--------+-----------+
| Id | Name  | Salary | ManagerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |
+----+-------+--------+-----------+


+----------+
| Employee |
+----------+
| Joe      |
+----------+
```

#### 答案一
```mysql

SELECT 
    a.Name AS Employee
FROM Employee AS a,
     Employee AS b
WHERE 
    a.ManagerId = b.Id
    AND a.Salary > b.Salary

```

```mysql
SELECT 
    a.Name AS Employee
FROM 
    Employee AS a 
JOIN 
    Employee AS b
ON a.ManagerId = b.Id
    AND a.Salary > b.Salary
```


### 9.最小差值 I
[最小差值 I](https://leetcode-cn.com/problems/smallest-range-i/)
给定一个整数数组 A，对于每个整数 A[i]，我们可以选择任意 x 满足 -K <= x <= K，并将 x 加到 A[i] 中。

在此过程之后，我们得到一些数组 B。

返回 B 的最大值和 B 的最小值之间可能存在的最小差值。

提示：

* 1 <= A.length <= 10000
* 0 <= A[i] <= 10000
* 0 <= K <= 10000

```
示例 1：

输入：A = [1], K = 0
输出：0
解释：B = [1]

示例 2：

输入：A = [0,10], K = 2
输出：6
解释：B = [2,8]

示例 3：

输入：A = [1,3,6], K = 3
输出：0
解释：B = [3,3,3] 或 B = [4,4,4]

```

#### 答案一
分析: 这道题目乍一看不容易理解, 其实是这样的我随机从-K到K之间取值保证数组A的最大和最小值的差值最小,也就是说取得最大的最小值和最小的最大值.
那么首先要进行排序从小到大进行排序,然后取出数组A的最小值和最大值,便利K进行求和,再找出其中差值的最小值.
```javascript

/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var smallestRangeI = function(A, K) {    
    // 从小到大排序
    A = A.sort((a, b) => (a - b));
    let len = A.length;
    
    let Af = A[0];
    let Al = A[len - 1];
    
    let M = [];
    for(let i = -K; i <= K; i++) {
        M.push([
            Af + i,
            Al + i
        ]);
        
    }
    let klen = K - (-K) + 1;
    let delNum = M[0][1] - M[klen-1][0];
    return delNum <= 0 ? 0 : delNum;

};
```
后来看了题解发现本题解的还是不够清晰,这里copy一下题解分析来得到答案二

#### 答案二

假设 A 是原始数组，B 是修改后的数组，我们需要最小化 max(B) - min(B)，也就是分别最小化 max(B) 和最大化 min(B)。

max(B) 最小可能为 max(A) - K，因为 max(A) 不可能再变得更小。同样，min(B) 最大可能为 min(A) + K。所以结果 max(B) - min(B) 至少为 ans = (max(A) - K) - (min(A) + K)。

我们可以用一下修改方式获得结果（如果 ans >= 0）：

* 如果 A[i]≤min(A)+K，那么 B[i]=min(A)+K
* 如果 A[i]≥max(A)−K，那么 B[i]=max(A)−K
* 否则 B[i]=A[i]。
如果 ans < 0，最终结果会有 ans = 0，同样利用上面的修改方式。

```java
class Solution {
    public int smallestRangeI(int[] A, int K) {
        let min = A[0], max = A[0];
        for(int x : A) {
            min = Math.min(min, x);
            max = Math.max(max, x);
        }
        return Math.max(0, max - min - 2*K);
    }
}
```




### 10.将有序数组转换为二叉搜索树<code>未完成</code>
[将有序数组转换为二叉搜索树](https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/):
将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。

本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。

```
示例:

给定有序数组: [-10,-3,0,5,9],

一个可能的答案是：[0,-3,9,-10,null,5]，它可以表示下面这个高度平衡二叉搜索树：

      0
     / \
   -3   9
   /   /
 -10  5

 ```

 
#### 答案一
```java
 class Solution {
     public TreeNode sortedArrayToBST(int[] nums) {
         return sortedArrayToBST(nums, 0, nums.length);
     }

     private TreeNode sortedArrayToBST(int[] nums, int start, int end) {
         if(start == end) {
             return null;
         }

         int mid = (start + end) >>> 1;
         TreeNode root = new TreeNode(nums[mid]);
         root.left = sortedArrayToBST(nums, start, mid);
         root.right = sortedArrayToBST(nums, mid + 1, end);

        return root;
     }
 }
```

 
 