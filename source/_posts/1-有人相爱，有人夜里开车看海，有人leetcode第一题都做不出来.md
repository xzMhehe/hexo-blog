---
title: 有人相爱，有人夜里开车看海，有人leetcode第一题都做不出来
date: 2021-04-21 21:37:22
pin: false
toc: false
icons: []
tags: [力扣, 数组]
categories: [力扣, 数组]
keywords: [力扣, 数组]
headimg: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210715163600.png
thumbnail: https://cdn.jsdelivr.net/gh/xzMhehe/StaticFile_CDN/static/img/20210715163600.png
description: 旋转数组
---
# 题目描述
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。



来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/two-sum

# 示例输出
输入：nums = [2,7,11,15], target = 9    
输出：[0,1]      
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。     





```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}
```

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] result = new int[2];
        HashMap<Integer, Integer> map = new HashMap<>();
        for(int i = 0; i < nums.length; i++) {
            if(map.get(target - nums[i]) != null) {
                result[0] = map.get(target - nums[i]);
                result[1] = i;
                return result;
            }
            map.put(nums[i], i);
        }

        return result;
    }
}
```

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] indexs = new int[2];
        
        // 建立k-v ，一一对应的哈希表
        HashMap<Integer,Integer> hash = new HashMap<Integer,Integer>();
        for(int i = 0; i < nums.length; i++){
            if(hash.containsKey(nums[i])){
                indexs[1] = i;
                indexs[0] = hash.get(nums[i]);
                return indexs;
            }
            // 将数据存入 key为补数 ，value为下标
            hash.put(target-nums[i],i);
        }
        // // 双重循环 循环极限为(n^2-n)/2 
        // for(int i = 0; i < nums.length; i++){
        //     for(int j = nums.length - 1; j > i; j --){
        //         if(nums[i]+nums[j] == target){
        //            indexs[0] = i;
        //            indexs[1] = j; 
        //            return indexs;
        //         }
        //     }
        // }
        return indexs;
    }
}
```