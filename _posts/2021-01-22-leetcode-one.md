---
layout:     post
title:      LeetCode刷题(-)
subtitle:   对LeetCode刷过的题目进行整理总结，方便后期查阅复习。
date:       2020-01-22
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
本文将LeetCode刷过的题目进行简单的总结和记录，便于自己进行复习，补充js基础
### 1.两数之和
[两数之和](https://leetcode-cn.com/problems/two-sum/)：
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
你可以按任意顺序返回答案。
```
示例1:
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

示例2:
输入：nums = [3,2,4], target = 6
输出：[1,2]

示例3:
输入：nums = [3,3], target = 6
输出：[0,1]
```

#### 答案一：
我的方法:for循环获取减法并且判断数组是否存在
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let arrayIndex = []
    for(i = 0;i<= nums.length;i++) {
        let newData = target -  nums[i];
        if(nums.indexOf(target -  nums[i]) > -1 && nums.lastIndexOf(newData) !== i) {
            console.log(nums.lastIndexOf(newData))
            arrayIndex = [i,nums.lastIndexOf(newData)]
            return arrayIndex
        }
    }
    
};
```

### 2.整数反转
[整数反转](https://leetcode-cn.com/problems/reverse-integer/)：
给你一个 32 位的有符号整数 x ，返回 x 中每位上的数字反转后的结果。
如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

```
示例1:
输入：x = 123
输出：321

示例2:
输入：x = -123
输出：-321

示例3:
输入：x = 120
输出：21

示例4:
输入：x = 0
输出：0

```
#### 答案一
我的方法：转换成字符串然后声生成数组，reverse，然后正则去掉','；比较繁琐与麻烦
Math.pow():用来写次方的方法 2的31次方===Math.pow(2,31)
```
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let newX;
    let flag = 1
    if(Number(x) >= 0) {
        newX = x.toString().split("").reverse();
    } else {
        flag = -1
        newX = Math.abs(x).toString().split("").reverse()  
    }
    let newNumber = Number(newX.toString().replace(/,/g,''));
    if(Number(Math.pow(-2,31)) <= newNumber &&  newNumber <=Number(Math.pow(2,31))) {
        return flag*newNumber
    } else {
        return 0
    }
    
};
```
### 答案二
这个答案相当简洁，运用了Math的用法，以及字符串简单转换
```
Math.sign():获取传入的值判断是正负，正值是1，负值是-1；
Math.abs():将数字取绝对值
var reverse = function(x) {
    let sign = Math.sign(x)
    let res = (Math.abs(x) + '').split('').reverse().join('') * sign
    if (res > Math.pow(2, 31) - 1 || res < Math.pow(2, 31) * -1) res = 0
    return res
}
```
