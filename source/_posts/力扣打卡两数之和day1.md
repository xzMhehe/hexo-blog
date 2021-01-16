---
title: 力扣打卡两数之和day1
date: 2021-01-15 09:32:25
tags:
- 力扣
categories: 
- 力扣
---
>每日一句
So much in life depends on our attitude.
态度决定绝大多数的结果.

## 题目描述
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

你可以按任意顺序返回答案。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/two-sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

>示例 1：
>输入：nums = [2,7,11,15], target = 9
>输出：[0,1]
>解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
>示例 2：
>输入：nums = [3,2,4], target = 6
>输出：[1,2]
>示例 3：
>输入：nums = [3,3], target = 6
>输出：[0,1]

**提示**：
- 2 <= nums.length <= 103
- -109 <= nums[i] <= 109
- -109 <= target <= 109
- 只会存在一个有效答案


## Java


### 暴力枚举
```java
    public static int[] twoNumOne(int[] nums, int tearget) {
        int n = nums.length;
        for (int i = 0; i < n; i ++) {
            for (int j = i + 1; j < n; j ++) {
                if (nums[i] + nums[j] == tearget) {
                    return new int[]{i, j};
                }
            }
        }
        throw new IllegalArgumentException("No two num solution");
    }
```

### 查找表法
```java
package cn.com.codingce.mytest;

import java.util.HashMap;
import java.util.Map;

/**
 * @author xzMa
 */
public class TwoSumTest {
    public static void main(String[] args) {
        int[] nums = {11, 15, 2, 7};
        nums = twoSum(nums, 9);
        for (int i : nums) {
            System.out.println(i);
        }
    }

    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            // map是一个key和value的键值对的集合。有key和value键值对，就会有判断是否有key。这方法就是containsKey方法。
            int complement = target - nums[i];
            // map中的containsKey（key）方法是判断该key在map中是否有key存在。如果存在则返回true。如果不存在则返回false。
            if (map.containsKey(complement)) {
                //Java 集合类中的 Map.get() 方法返回指定键所映射的值。如果此映射不包含该键的映射关系，则返回 null。
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}
```

## C语言
### 暴力枚举
```c
int* twoNum(int* nums, int numsSize, int target, int returnSize) {
    for(int i = 0; i < numsSize; i++) {
        for(int j = i + 1; j < numsSize; j++) {
            if(nums[i] + nums[j] == tearget) {
                int* ret = malloc(sizeof(int) * 2);
                ret[0] = i, ret[1] = j;
                *returnSize = 2;
                return ret;
            }
        }
    }
    *returnSize = 0;
    return NULL;
}
```
### 查找表法
```c
struct hashTable {
    int key;
    int val;
    UT_hash_handle hh;
};

struct hashTable* hashtable;

struct hashTable* find(int ikey) {
    struct hashTable* tmp;
    HASH_FIND_INT(hashtable, &ikey, tmp);
    return tmp;
}

void insert(int ikey, int ival) {
    struct hashTable* it = find(ikey);
    if (it == NULL) {
        struct hashTable* tmp = malloc(sizeof(struct hashTable));
        tmp->key = ikey, tmp->val = ival;
        HASH_ADD_INT(hashtable, key, tmp);
    } else {
        it->val = ival;
    }
}

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    hashtable = NULL;
    for (int i = 0; i < numsSize; i++) {
        struct hashTable* it = find(target - nums[i]);
        if (it != NULL) {
            int* ret = malloc(sizeof(int) * 2);
            ret[0] = it->val, ret[1] = i;
            *returnSize = 2;
            return ret;
        }
        insert(nums[i], i);
    }
    *returnSize = 0;
    return NULL;
}

作者：LeetCode-Solution
链接：https://leetcode-cn.com/problems/two-sum/solution/liang-shu-zhi-he-by-leetcode-solution/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```



>文章已上传gitee https://gitee.com/codingce/hexo-blog   
>项目地址: https://github.com/xzMhehe/codingce-java