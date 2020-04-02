---
layout:     post
title:      LeetCode刷题总结(简单版五)
subtitle:   对LeetCode刷过的题目进行整理总结，方便后期查阅复习。
date:       2019-09-08
author:     "binn"
header-img: "https://i.loli.net/2020/04/01/OGmz4tWRHn2ql7D.jpg"
comments: true

tags :
    - 面试
    - 基础
    - LeetCode

categories:
    - LeetCode
---

本文将LeetCode刷过的题目进行简单的总结和记录，便于自己进行复习，同时将看到的解题思路进行汇总让其他的小伙伴能够理解。

### 1.两个数组的交集
[两个数组的交集](https://leetcode-cn.com/problems/intersection-of-two-arrays/)：
给定两个数组，编写一个函数来计算它们的交集。

```
示例 1:

输入: nums1 = [1,2,2,1], nums2 = [2,2]
输出: [2]
示例 2:

输入: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出: [9,4]

```

说明:

* 输出结果中的每个元素一定是唯一的。
* 我们可以不考虑输出结果的顺序。



#### 答案一
自己的解法常规思路不推荐

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
    
    let resultDup = [];
    nums1.forEach(val => {
        nums2.forEach(v => {
            if(val == v) {
                resultDup.push(val);
            }
        })
    });
    
    let result = [];
    while(resultDup.length > 0) {
        let val = resultDup.shift();
        if(resultDup.indexOf(val) < 0) {
            result.push(val);    
        }
    }

    return result;
    
};

```

同样js解法利用Set去重复
```javascript
var intersection = function(nums1, nums2) {
    let hash1 = new Set(nums1)
    let hash2 = new Set()

    for(let i = 0; i < nums.length; i++) {
        if(has1.has(nums2[i])) {
            hash2.add(nums2[i])
        }
    }
    return [...hash2]
}

```

利用数组api解法,更简洁
```javascript
var intersection = function(nums1, nums2) {
    return [...new Set(nums1.filter(v => nums2.includes(v)))];
}
```

#### 答案二
 ```java
 class Solution {
     public int[] intersection(int[] nums1, int[] nums2) {
         HashSet<Integer> set1 = new HashSet<Integer>();
         for(Integer n : nums1) set1.add(n);

         HashSet<Integer> set2 = new HashSet<Integer>();
         for(Integer n : nums2) set2.add(n);

         set1.retainAll(set2);

         int[] output = new int[set1.size()];
         int idx = 0;
         for(int s : set) output[idx++] = s;
         return output;

     }
 }
 ```


### 2.独一无二的出现次数
 [独一无二的出现次数](https://leetcode-cn.com/problems/unique-number-of-occurrences/): 
 给你一个整数数组 arr，请你帮忙统计数组中每个数的出现次数。

如果每个数的出现次数都是独一无二的，就返回 true；否则返回 false。


提示：

* 1 <= arr.length <= 1000
* -1000 <= arr[i] <= 1000

```
示例 1：

输入：arr = [1,2,2,1,1,3]
输出：true
解释：在该数组中，1 出现了 3 次，2 出现了 2 次，3 只出现了 1 次。没有两个数的出现次数相同。
示例 2：

输入：arr = [1,2]
输出：false
示例 3：

输入：arr = [-3,0,1,-3,1,1,1,-3,10,0]
输出：true

```

#### 答案一
```javascript

/**
 * @param {number[]} arr
 * @return {boolean}
 */
var uniqueOccurrences = function(arr) {
    let objMap = {}
    
    arr.forEach(val => {
        if(objMap.hasOwnProperty(val)) {
            objMap[val]++;
        } else {
            objMap[val] = 1;
        }
    })
    
    let arr1 = Object.values(objMap);
    let arr2 = [...new Set(arr1)];
    
    return arr1.length === arr2.length;
};
```

#### 答案二
```java
class Solution {
    public boolean uniqueOccurrences(int[] arr) {
        Map<Integer, Integer> map = new HashMap<Integer, Integer>();
        Set<Inetger> set = new HashSet<Integer>();

        for(int data: arr) {
            if(map.get(data) == null) map.put(data,1);
            else map.put(data, map.get(data) + 1);
        }

        for(Integer i : map.values()) {
            if(!set.add(i)) return false;
        }

        return true;
    }
}
```

### 3.转置矩阵
[转置矩阵](https://leetcode-cn.com/problems/transpose-matrix/submissions/): 
给定一个矩阵 A， 返回 A 的转置矩阵。

矩阵的转置是指将矩阵的主对角线翻转，交换矩阵的行索引与列索引。

提示：

* 1 <= A.length <= 1000
* 1 <= A[0].length <= 1000

```
示例 1：

输入：[[1,2,3],[4,5,6],[7,8,9]]
输出：[[1,4,7],[2,5,8],[3,6,9]]
示例 2：

输入：[[1,2,3],[4,5,6]]
输出：[[1,4],[2,5],[3,6]]

```
#### 答案一
```javascript

/**
 * @param {number[][]} A
 * @return {number[][]}
 */
var transpose = function(A) {
    let len = A[0].length;
    let alen = A.length;
    let result = [];
    
    for(let i = 0; i < len; i++) {
        let tmpl = [];
        A.forEach((val, idex) => {
            tmpl.push(val[i]);
        });
        result.push(tmpl);
    }
    
   return result;
    
};

```



### 4.重复 N 次的元素
[重复 N 次的元素](https://leetcode-cn.com/problems/n-repeated-element-in-size-2n-array/submissions/):
在大小为 2N 的数组 A 中有 N+1 个不同的元素，其中有一个元素重复了 N 次。

返回重复了 N 次的那个元素。

```
示例 1：

输入：[1,2,3,3]
输出：3
示例 2：

输入：[2,1,2,5,3,2]
输出：2
示例 3：

输入：[5,1,5,2,5,3,5,4]
输出：5

```

提示：

* 4 <= A.length <= 10000
* 0 <= A[i] < 10000
* A.length 为偶数

#### 答案一
```javascript
/**
 * @param {number[]} A
 * @return {number}
 */
var repeatedNTimes = function(A) {
    A.sort((a, b) => a-b);
    let len = A.length;
    let result = 0;
    for(let i = 0; i < len; i++) {
        if(i > 0) {
            let cur = A[i]
            let prev = A[i - 1];
            if(cur - prev === 0) {
                result = cur;
                break;
            }
        }
    }
    return result;
};
```


### 5.按奇偶排序数组 II
[按奇偶排序数组 II](https://leetcode-cn.com/problems/sort-array-by-parity-ii/):
给定一个非负整数数组 A， A 中一半整数是奇数，一半整数是偶数。

对数组进行排序，以便当 A[i] 为奇数时，i 也是奇数；当 A[i] 为偶数时， i 也是偶数。

你可以返回任何满足上述条件的数组作为答案。

提示：

* 2 <= A.length <= 20000
* A.length % 2 == 0
* 0 <= A[i] <= 1000

```
示例：

输入：[4,2,5,7]
输出：[4,5,2,7]
解释：[4,7,2,5]，[2,5,4,7]，[2,7,4,5] 也会被接受。
```

#### 答案一
```javascript

/**
 * @param {number[]} A
 * @return {number[]}
 */
var sortArrayByParityII = function(A) {
    let len = A.length;
    let oArr = A.filter(val => (val % 2 !== 0));
    let eArr = A.filter(val => (val % 2 === 0));
    
    let result = [];
    for(let i = 0; i < len; i++) {
        if(i % 2 === 0) {
            result.push(eArr.shift());
        } else {
            result.push(oArr.shift());
        }
    }
    
    return result;
    
    
};
```

#### 答案二
java容易理解的解法
```java
class Solution {
    public static int[] sortArrayByParityII(int[] arr) {
        int len = arr.length;
        if(arr.length < 2) {
            return arr;
        }
        int odd = 1;
        int even = 0;

        while(odd < len && even < len) {
            while(odd < len && arr[odd] % 2 != 0){
                odd += 2;
            }

            while(even < len && arr[even] % 2 == 0){
                even += 2;
            }

            if(odd < len && even < len) {
                swap(arr, odd, even);
            }
        }
    }

    private static void swap(int[] arr, int odd, int even) {
        int tmp = arr[odd];
        arr[odd] = arr[even];
        arr[even] = tmp;
    }
}
```

#### 答案三
js双指针
```javascript

var sortArrayByParityII = function(A) { 
    let len = A.length,
        i = 0,
        j = 1;

    for(; i < len; i += 2) {
        if(A[i] % 2 === 0) continue;
        while(A[j] % 2 === 1);j += 2;

        [A[i], A[j]] = [A[j], A[i]];
    }
    return A;
}

```

### 6.单值二叉树
[单值二叉树](https://leetcode-cn.com/problems/univalued-binary-tree/):
如果二叉树每个节点都具有相同的值，那么该二叉树就是单值二叉树。

只有给定的树是单值二叉树时，才返回 true；否则返回 false。


提示：

* 给定树的节点数范围是 [1, 100]。
* 每个节点的值都是整数，范围为 [0, 99] 。


```
示例 1：

输入：[1,1,1,1,1,null,1]
输出：true
示例 2：

输入：[2,2,2,5,2]
输出：false

```
#### 答案一

更优雅
```java

class Solution {
    public boolean isUnivalTree(TreeNode root) {
        if(root == null) return true;
        return helper(root, root.val);
    }

    private boolean helper(TreeNode root, int val) {
        if(root == null) return true;
        if(val != root.val) return false;
        return helper(root.left, val) && helper(root.right, val);
    }
}

```

```java
class Solution {
    boolean flag = true;
    public boolean isUnivalTree(TreeNode root) {
        if(root == null) {
            return false;
        }
        IsUnivalTree(root, root.val);
        return flag;
    }

    public void IsUnivalTree(TreeNode root, int val) {
        if(root == null) return;
        if(root.val == val) {
            IsunivalTree(root.left, val);
            IsunivalTree(root.right, val);
        } else {
            flag = false;
        }
    }
}

```


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
 * @return {boolean}
 */
var isUnivalTree = function(root) {
    if(root == null) return true;
    return helper(root, root.val);
};

var helper = function(root, val) {
    if(root == null) return true;
    if(root.val !== val) return false;
    return helper(root.left, val) && helper(root.right, val);
}
```


### 7.找出给定方程的正整数解~~~
[找出给定方程的正整数解](https://leetcode-cn.com/problems/find-positive-integer-solution-for-a-given-equation/):
给出一个函数  f(x, y) 和一个目标结果 z，请你计算方程 f(x,y) == z 所有可能的正整数 数对 x 和 y。

给定函数是严格单调的，也就是说：

f(x, y) < f(x + 1, y)


f(x, y) < f(x, y + 1)
函数接口定义如下：

```
interface CustomFunction {
public:
  // Returns positive integer f(x, y) for any given positive integer x and y.
  int f(int x, int y);
};
```
如果你想自定义测试，你可以输入整数 function_id 和一个目标结果 z 作为输入，其中 function_id 表示一个隐藏函数列表中的一个函数编号，题目只会告诉你列表中的 2 个函数。  

你可以将满足条件的 结果数对 按任意顺序返回。


提示：

* 1 <= function_id <= 9
* 1 <= z <= 100
* 题目保证 f(x, y) == z 的解处于 1 <= x, y <= 1000 的范围内。
* 在 1 <= x, y <= 1000 的前提下，题目保证 f(x, y) 是一个 32 位有符号整数。


```

示例 1：

输入：function_id = 1, z = 5
输出：[[1,4],[2,3],[3,2],[4,1]]
解释：function_id = 1 表示 f(x, y) = x + y
示例 2：

输入：function_id = 2, z = 5
输出：[[1,5],[5,1]]
解释：function_id = 2 表示 f(x, y) = x * y

```

#### 答案一
分析:题目没有看懂,但是可以读懂代码

双层循环
```javascript
/**
 * // This is the CustomFunction's API interface.
 * // You should not implement it, or speculate about its implementation
 * function CustomFunction() {
 *
 *     @param {integer, integer} x, y
 *     @return {integer}
 *     this.f = function(x, y) {
 *         ...
 *     };
 *
 * };
 */
/**
 * @param {CustomFunction} customfunction
 * @param {integer} z
 * @return {integer[][]}
 */

var findSolution = function(customfunction, z) {
    let res = [];
    for(let x = 1; x <= 1000; x++) {
        for(let y = 1; y <= 1000; y++) {
            if(customfunction.f(x, y) > z) {
                break;
            }
            else if(customfunction.f(x, y) === z) {
                let ans = [x, y];
                res.push(ans);
            }
        }   
    }
    return res;
}

```

双指针
```javascript
/**
 * // This is the CustomFunction's API interface.
 * // You should not implement it, or speculate about its implementation
 * function CustomFunction() {
 *
 *     @param {integer, integer} x, y
 *     @return {integer}
 *     this.f = function(x, y) {
 *         ...
 *     };
 *
 * };
 */
/**
 * @param {CustomFunction} customfunction
 * @param {integer} z
 * @return {integer[][]}
 */

var findSolution = function(customfunction, z) {
    let res = [];
    let x = 1;
    let y = 1000;
    while(x > 0 && x <= 1000 && y > 0 && y <= 1000) {
        if(customfunction.f(x, y) === z) {
            let ans = [x ,y];
            res.push(ans);
            x++;
        } else if(customfunction.f(x, y) > z) {
            y--;
        } else {
            x++;
        }
    }
    return res;
}

```

### 8.Excel表列序号
[Excel表列序号](https://leetcode-cn.com/problems/excel-sheet-column-number/submissions/):

给定一个Excel表格中的列名称，返回其相应的列序号。
```
例如，

    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28 
    ...
示例 1:

输入: "A"
输出: 1
示例 2:

输入: "AB"
输出: 28
示例 3:

输入: "ZY"
输出: 701
```

#### 答案一
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var titleToNumber = function(s) {
    let arr = s.split("");
    let len = arr.length;
    let i = 1;
    let sum = 0;
    while(i <= len) {
        let num = arr.pop();
        let cur = num.charCodeAt() - 64;
        sum += cur * Math.pow(26, i - 1);
        i++;
    }
    return sum;

};
```